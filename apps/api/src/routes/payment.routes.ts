import { Router } from 'express';
import { prisma } from '../index';

const router = Router();

const NAGORIKPAY_CREATE_URL = 'https://secure-pay.nagorikpay.com/api/payment/create';
const NAGORIKPAY_VERIFY_URL = 'https://secure-pay.nagorikpay.com/api/payment/verify';
const NAGORIKPAY_API_KEY = process.env.NAGORIKPAY_API_KEY || '';

// Create payment — calls NagorikPay API to generate a payment URL
router.post('/create', async (req, res) => {
  try {
    const { order_id } = req.body;

    // Fetch the order
    const order = await prisma.order.findUnique({ where: { id: order_id } });
    if (!order) return res.status(404).json({ error: 'Order not found' });

    const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';
    const API_URL = process.env.API_URL || 'http://localhost:5000';

    // Build NagorikPay payload
    const payload = {
      success_url: `${FRONTEND_URL}/checkout/success?order_id=${order.id}`,
      cancel_url: `${FRONTEND_URL}/checkout/cancel?order_id=${order.id}`,
      webhook_url: `${API_URL}/api/payments/webhook`,
      metadata: {
        order_id: order.id,
        phone: order.phone,
      },
      amount: String(order.advance_payment),
    };

    // Call NagorikPay Create Payment API
    const response = await fetch(NAGORIKPAY_CREATE_URL, {
      method: 'POST',
      headers: {
        'API-KEY': NAGORIKPAY_API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('NagorikPay create payment error:', data);
      return res.status(500).json({ error: 'Failed to create payment', details: data });
    }

    // NagorikPay returns a payment_url to redirect the customer to
    res.json(data);
  } catch (error) {
    console.error('Payment create error:', error);
    res.status(500).json({ error: 'Payment request failed' });
  }
});

// Webhook endpoint — NagorikPay calls this after payment
router.post('/webhook', async (req, res) => {
  try {
    const { transaction_id } = req.body;

    if (!transaction_id) {
      return res.status(400).send('Missing transaction_id');
    }

    // Verify the payment with NagorikPay
    const verifyResponse = await fetch(NAGORIKPAY_VERIFY_URL, {
      method: 'POST',
      headers: {
        'API-KEY': NAGORIKPAY_API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ transaction_id }),
    });

    const verifyData = await verifyResponse.json();

    if (!verifyResponse.ok) {
      console.error('NagorikPay verify error:', verifyData);
      return res.status(400).send('Payment verification failed');
    }

    // Extract order_id from metadata
    const order_id = verifyData.metadata?.order_id;
    if (!order_id) {
      console.error('No order_id in metadata:', verifyData);
      return res.status(400).send('Missing order_id in payment metadata');
    }

    if (verifyData.status === 'COMPLETED') {
      // Update order status
      await prisma.order.update({
        where: { id: order_id },
        data: {
          payment_status: 'ADVANCE_PAID',
          order_status: 'ADVANCE_PAID',
        },
      });

      // Record the payment
      await prisma.payment.create({
        data: {
          order_id,
          payment_gateway: 'NagorikPay',
          transaction_id: verifyData.transaction_id,
          payment_amount: parseFloat(verifyData.amount) || 0,
          payment_status: 'PAID',
        },
      });
    }

    res.status(200).send('Webhook Received');
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(400).send('Webhook Processing Failed');
  }
});

// Verify payment status — called from the success page to confirm payment
router.post('/verify', async (req, res) => {
  try {
    const { order_id } = req.body;

    if (!order_id) {
      return res.status(400).json({ error: 'Missing order_id' });
    }

    const order = await prisma.order.findUnique({
      where: { id: order_id },
      include: { Payment: true, OrderItem: true },
    });

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json({
      order_id: order.id,
      payment_status: order.payment_status,
      order_status: order.order_status,
      total_amount: order.total_amount,
      advance_payment: order.advance_payment,
      payments: order.Payment,
    });
  } catch (error) {
    console.error('Verify error:', error);
    res.status(500).json({ error: 'Verification failed' });
  }
});

export default router;
