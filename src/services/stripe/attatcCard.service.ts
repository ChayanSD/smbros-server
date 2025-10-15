// import { prisma } from "../../lib/db";
// import stripe from "../../lib/stripe";
// import { SetupIntentData ,AttachCardData} from "../../schemas/stripe/attatchCard.schema";

// export const customerCardAttach = {
//   async setupIntent(data: SetupIntentData) {
//     const setupIntent = await stripe.setupIntents.create({
//       customer: data.body.customerId,
//       payment_method_types: ["card"],
//     });
//     if (!setupIntent.client_secret) {
//       throw new Error("Failed to generate setup intent client secret");
//     }
//     return setupIntent.client_secret;
//   },

//   async attatchCard(data : AttachCardData){
//     await stripe.paymentMethods.attach(
//       data.body.paymentMethodId,
//       { customer: data.body.customerId }
//     );

//     // Set the payment method as the default for the customer
//  await stripe.customers.update(data.body.customerId, {
//       invoice_settings: {
//         default_payment_method: data.body.paymentMethodId,
//       },
//     });  
//   }

// };

import { prisma } from "../../lib/db";
import stripe from "../../lib/stripe";
import { SetupIntentData, AttachCardData } from "../../schemas/stripe/attatchCard.schema";

export const customerCardAttach = {
  async setupIntent(data: SetupIntentData) {
    try {
      const setupIntent = await stripe.setupIntents.create({
        customer: data.body.customerId,
        payment_method_types: ["card"],
      });

      if (!setupIntent.client_secret) {
        throw new Error("Failed to generate setup intent client secret");
      }

      return setupIntent.client_secret;
    } catch (err:any) {
      console.error("[Stripe SetupIntent Error]:", err.message);
      throw new Error("Unable to create SetupIntent");
    }
  },

  async attachCard(data: AttachCardData) {
    const { userId, customerId, paymentMethodId } = data.body;

    try {
      await stripe.paymentMethods.attach(paymentMethodId, { customer: customerId });

      await stripe.customers.update(customerId, {
        invoice_settings: { default_payment_method: paymentMethodId },
      });

      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: { isVerified: true },
      });

      console.log(`[Stripe Verification] User ${userId} verified successfully.`);
      return {
        success: true,
        message: "Card attached successfully, user verified.",
        user: updatedUser,
      };
    } catch (err: any) {
      console.error(`[Stripe Verification] Failed for user ${userId}:`, err.message);

      try {
        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (user) {
          await prisma.user.delete({ where: { id: user.id } });
          console.warn(`[Cleanup] Deleted user ${userId} from DB.`);

          if (user.stripeCustomerId) {
            await stripe.customers.del(user.stripeCustomerId);
            console.warn(`[Cleanup] Deleted Stripe customer ${user.stripeCustomerId}.`);
          }
        }
      } catch (cleanupErr: any) {
        console.error("[Cleanup Error]:", cleanupErr.message);
      }

      throw new Error("Card verification failed — user removed.");
    }
  },
};
