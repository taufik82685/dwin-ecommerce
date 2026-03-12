import { Router } from 'express';
import { prisma } from '../index';

const router = Router();

// Create a new order (Checkout Flow)
router.post('/checkout', async (req, res) => {
  try {
    const { customer_name, phone, address, email, cart_items } = req.body;
    
    // Fetch global settings for delivery and advance payment
    const settings = await prisma.settings.findUnique({
      where: { id: 'global' }
    });
    
    if (!settings) throw new Error("Settings not found");
    
    // Calculate subtotal
    let subtotal = 0;
    const orderItemsData = [];
    
    for (const item of cart_items) {
      const product = await prisma.product.findUnique({ where: { id: item.product_id } });
      if (!product) continue;
      
      const priceToCharge = product.discount_price || product.price;
      subtotal += priceToCharge * item.quantity;
      
      orderItemsData.push({
        product_id: product.id,
        product_name: product.product_name,
        quantity: item.quantity,
        price: priceToCharge
      });
    }
    
    const delivery_charge = settings.delivery_charge;
    const advance_payment = settings.advance_payment_amount;
    const total_amount = subtotal + delivery_charge;
    
    // Create the Order
    const newOrder = await prisma.order.create({
      data: {
        customer_name,
        phone,
        address,
        email,
        subtotal,
        delivery_charge,
        advance_payment,
        total_amount,
        payment_status: 'PENDING',
        order_status: 'PENDING',
        OrderItem: {
          create: orderItemsData
        }
      }
    });

    // Normally here we would create the NagorikPay payment request
    // We will do this in the payment route.

    res.status(201).json({ order: newOrder, advance_payment });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to process checkout' });
  }
});

// Get order by ID
router.get('/:id', async (req, res) => {
  try {
    const order = await prisma.order.findUnique({
      where: { id: req.params.id },
      include: { OrderItem: true, Payment: true },
    });
    if (!order) return res.status(404).json({ error: 'Order not found' });
    res.json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch order' });
  }
});

export default router;
