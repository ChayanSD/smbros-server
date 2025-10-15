import { Router } from 'express';
import { registerController } from '../controller/registration.controller';
import stripe from '../lib/stripe';

const router = Router();

router.post('/register', registerController);

// Create SetupIntent for secure card setup
router.post('/create-setup-intent', async (req, res) => {
  try {
    const setupIntent = await stripe.setupIntents.create({
      payment_method_types: ['card'],
    });

    res.json({
      clientSecret: setupIntent.client_secret,
    });
  } catch (error) {
    console.error('Error creating setup intent:', error);
    res.status(500).json({ error: 'Failed to create setup intent' });
  }
});


//test route for checking server is running
router.get('/test', (req, res) => {
  res.send('Server is running');
});

export default router;
