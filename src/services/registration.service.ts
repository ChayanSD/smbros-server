import { prisma } from '../lib/db';
import bcrypt from 'bcryptjs';
import stripe from '../lib/stripe';
import { RegistrationData } from '../schemas/registration.schema';

export const registerUser = async (data: RegistrationData) => {
  // 1. Hash password
  const hashedPassword = await bcrypt.hash(data.password, 10);

  // 2. Create user
  const user = await prisma.user.create({
    data: {
      accountType: data.accountType || 'Bidding',
      firstName: data.firstName,
      middleName: data.middleName,
      lastName: data.lastName,
      email: data.email,
      phone: data.phone,
      password: hashedPassword,
      termsAccepted: data.termsAccepted,
      newsletter: data.newsletter ?? false,
      isVerified: false,
    },
  });

  const userId = user.id;

  // 3. Billing address
  await prisma.billingAddress.create({
    data: { userId, ...data.billing },
  });

  // 4. Shipping address
  let shippingData = data.shipping.sameAsBilling
    ? { ...data.billing }
    : {
        country: data.shipping.country!,
        address1: data.shipping.address1!,
        address2: data.shipping.address2,
        city: data.shipping.city!,
        postcode: data.shipping.postcode!,
      };
  await prisma.shippingAddress.create({
    data: { userId, ...shippingData },
  });

  // 5. Stripe: create customer
  const customer = await stripe.customers.create({
    email: data.email,
    name: `${data.firstName} ${data.lastName}`,
    address : {
      country : data.billing.country,
      line1 : data.billing.address1,
      city : data.billing.city,
      postal_code : data.billing.postcode,
    }
  });

  // 6. Stripe: create SetupIntent
  const setupIntent = await stripe.setupIntents.create({
    customer: customer.id,
    payment_method_types: ['card'],
  });

  // 7. Stripe: create PaymentMethod
  const paymentMethod = await stripe.paymentMethods.create({
    type: 'card',
    card: {
      number: data.payment.cardNumber,
      exp_month: data.payment.expMonth,
      exp_year: data.payment.expYear,
      cvc: data.payment.cvc,
    },
    billing_details: {
      name: data.payment.cardHolder,
    },
  });

  await stripe.paymentMethods.attach(paymentMethod.id, { customer: customer.id });

  await stripe.customers.update(customer.id, {
    invoice_settings: { default_payment_method: paymentMethod.id },
  });

  // 8. Save minimal payment info
  const last4 = data.payment.cardNumber.slice(-4);
  await prisma.payment.create({
    data: {
      userId,
      cardHolder: data.payment.cardHolder,
      last4,
      expiryMonth: data.payment.expMonth,
      expiryYear: data.payment.expYear,
      stripeId: paymentMethod.id,
    },
  });

  // 9. Mark verified
  return prisma.user.update({
    where: { id: userId },
    data: { isVerified: true },
  });
};
