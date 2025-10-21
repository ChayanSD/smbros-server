import { z } from 'zod';

// Schema for creating a bid
export const BidCreateSchema = z.object({
  auctionItemId: z.string().cuid('Valid auction item ID required'),
  amount: z.number().positive('Bid amount must be positive'),
});

// Schema for bid response
export const BidResponseSchema = BidCreateSchema.extend({
  id: z.string(),
  userId: z.string(),
  createdAt: z.date(),
});

// Type inference for TS
export type BidCreateData = z.infer<typeof BidCreateSchema>;
export type BidResponseData = z.infer<typeof BidResponseSchema>;