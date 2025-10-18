import { z } from "zod";

export const ProductImageSchema = z.object({
  url: z.url("Invalid image URL"),
  altText: z.string().optional(),
});

export const BidSchema = z.object({
  userId: z.cuid("Invalid user ID"),
  amount: z.number().min(0, "Bid amount must be positive"),
});

export const AuctionItemCreateSchema = z.object({
  name: z.string().min(1, "Item name is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),

  auctionId: z.cuid("Valid auction ID required"),

  shipping: z
    .object({
      address: z.string(),
      cost: z.number().min(0),
      deliveryTime: z.string().optional(),
    })
    .optional(),

  terms: z.string().optional(),

  baseBidPrice: z.number().min(0, "Base bid price must be positive"),
  additionalFee: z.number().min(0).optional(),
  currentBid: z.number().min(0).optional().default(0),
  estimatedPrice: z.number().min(0).optional(),

  productImages: z.array(ProductImageSchema).optional(),
  bids: z.array(BidSchema).optional(),
});


export type AuctionItemCreateData = z.infer<typeof AuctionItemCreateSchema>;
