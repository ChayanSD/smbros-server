import { prisma } from "../../lib/db";
import stripe from "../../lib/stripe";
import { SetupIntentData, AttachCardData } from "../../schemas/stripe/attachCard.schema";

export const customerCardAttach = {
  async setupIntent(data: SetupIntentData) {
    try {
      const setupIntent = await stripe.setupIntents.create({
        customer: data.customerId,
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
    const { userId, customerId, paymentMethodId } = data;

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

      // Mark user as unverified instead of deleting
      try {
        await prisma.user.update({
          where: { id: userId },
          data: { isVerified: false },
        });
        console.warn(`[Verification Failed] User ${userId} marked as unverified.`);
      } catch (updateErr: any) {
        console.error("[Update Error]:", updateErr.message);
      }

      throw new Error("Card verification failed. Please try again or contact support.");
    }
  },
};
