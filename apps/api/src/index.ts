import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;
export const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

import productRoutes from './routes/product.routes';
import orderRoutes from './routes/order.routes';
import paymentRoutes from './routes/payment.routes';
import settingsRoutes from './routes/settings.routes';

// Routes
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/settings', settingsRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Gaming Ecommerce API is running.' });
});

app.get('/', (req, res) => {
  res.send('Dwin eCommerce API is live and running globally 🚀');
});

// Start Server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
