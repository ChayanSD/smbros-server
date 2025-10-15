import {z } from 'zod';


export const attachCardSchema = z.object({
    body: z.object({
        userId : z.string().min(1, 'User ID is required'), //this is prisma user id
        customerId: z.string().min(1, 'Customer ID is required'), //this is stripe customer id
        paymentMethodId: z.string().min(1, 'Payment Method ID is required'),
    }),
});

export const setupIntentSchema = z.object({
    body: z.object({
        customerId: z.string().min(1, 'Customer ID is required'),
    }),
});

export type AttachCardData = z.infer<typeof attachCardSchema>;
export type SetupIntentData = z.infer<typeof setupIntentSchema>;
