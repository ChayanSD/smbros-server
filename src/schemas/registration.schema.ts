import { z } from 'zod';

const registrationSchema = z.object({
  body: z.object({
    accountType: z.enum(['Bidding', 'Seller']).optional(),
    firstName: z.string().min(2),
    middleName: z.string().optional(),
    lastName: z.string().min(2),
    email: z.email(),
    phone: z.string(),
    password: z.string().min(6),
    termsAccepted: z.boolean(),
    newsletter: z.boolean().optional(),
    billing: z.object({
      country: z.string(),
      address1: z.string(),
      address2: z.string().optional(),
      city: z.string(),
      postcode: z.string(),
    }),
    shipping: z.object({
      sameAsBilling: z.boolean().optional(),
      country: z.string().optional(),
      address1: z.string().optional(),
      address2: z.string().optional(),
      city: z.string().optional(),
      postcode: z.string().optional(),
    }),
    payment: z.object({
      cardHolder: z.string(),
      cardNumber: z.string(),
      expMonth: z.number(),
      expYear: z.number(),
      cvc: z.string(),
    }),
  }),
});

export type RegistrationData = z.infer<typeof registrationSchema>['body'];

export { registrationSchema };