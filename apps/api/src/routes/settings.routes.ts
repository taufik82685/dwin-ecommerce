import { Router, Request, Response } from 'express';
import { prisma } from '../index';

const router = Router();

// Get settings
router.get('/', async (req: Request, res: Response) => {
  try {
    const settings = await prisma.settings.findUnique({
      where: { id: 'global' }
    });
    res.json(settings);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch settings' });
  }
});

// Update settings (Admin)
router.put('/', async (req: Request, res: Response) => {
  try {
    const updatedSettings = await prisma.settings.update({
      where: { id: 'global' },
      data: req.body
    });
    res.json(updatedSettings);
  } catch (error) {
    res.status(400).json({ error: 'Failed to update settings' });
  }
});

// Get Checkout Fields (For Frontend rendering)
router.get('/checkout-fields', async (req: Request, res: Response) => {
  try {
    const settings = await prisma.settings.findUnique({
      where: { id: 'global' },
      select: { checkout_fields: true }
    });
    res.json(settings?.checkout_fields || []);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch checkout fields' });
  }
});

export default router;
