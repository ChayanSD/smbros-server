import {z} from 'zod';

const stripeCustomerSchema = z.object({
  body: z.object({
    email: z.email(),
    name: z.string().min(2),
    address : z.object({
        country : z.string().min(2),
        line1 : z.string().min(2),
        city : z.string().min(2),
        postal_code : z.string().min(2),
    })
  }),
});

export type StripeCustomerData = z.infer<typeof stripeCustomerSchema>['body'];

export {stripeCustomerSchema};