import { Router } from 'express';
import { registerController } from '../../controller/auth/registration.controller'; 
import stripe from '../../lib/stripe';
import { prisma } from '../../lib/db';

const router = Router();

router.post('/register', registerController);

// Create SetupIntent for secure card setup
router.post('/create-setup-intent', async (req, res) => {
  try {
    const setupIntent = await stripe.setupIntents.create({
      payment_method_types: ['card'],
      customer : req.body.customerId,
    });

    res.json({
      clientSecret: setupIntent.client_secret,
    });
  } catch (error) {
    console.error('Error creating setup intent:', error);
    res.status(500).json({ error: 'Failed to create setup intent' });
  }
});

//fetch all user from database
router.get('/get-all', async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      include : {
        billingAddress : true,
        shippingAddress : true,
      }
    });
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// router.get('/:id', async (req, res) => {
//   const { id } = req.params;
//   try {
//     const user = await prisma.user.findUnique({
//       where: { id },
//       include : {
//         billingAddress : true,
//         shippingAddress : true,
//       }
//     });
//     if (!user) {
//       return res.status(404).json({ error: 'User not found' });
//     }
//     res.json(user);
//   } catch (error) {
//     console.error('Error fetching user:', error);
//     res.status(500).json({ error: 'Failed to fetch user' });
//   }
// });

export default router;
