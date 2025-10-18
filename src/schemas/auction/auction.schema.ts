import { z } from "zod";

// Enum mirror for AuctionStatus
export const AuctionStatusEnum = z.enum([
  "Draft",
  "Upcoming",
  "Active",
  "Ended",
  "Cancelled",
]);

// Schema for connecting tags
export const TagSchema = z.object({
  id: z.cuid().optional(),
  name: z.string().min(1, "Tag name is required"),
});

// Core auction creation schema
export const AuctionCreateSchema = z
  .object({
    name: z.string().min(1, "Auction name is required"),
    description: z
      .string()
      .min(10, "Description must be at least 10 characters"),
    startDate: z.coerce.date(),
    endDate: z.coerce.date(),
    location: z.string().min(1, "Location is required"),
    slug: z.string().regex(/^[a-z0-9-]+$/, "Slug must be URL-friendly").optional(),
    status: AuctionStatusEnum.optional().default("Draft"),
    categoryId: z.cuid("Valid category ID required"),
    tags: z.array(TagSchema).optional(),
  })
  
export const AuctionUpdateSchema = AuctionCreateSchema.partial().extend({
  id: z.cuid("Auction ID required for updates"),
});

export const AuctionResponseSchema = AuctionCreateSchema.extend({
  id: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

// Type inference for TS
export type AuctionCreateData = z.infer<typeof AuctionCreateSchema>;
export type AuctionUpdateData = z.infer<typeof AuctionUpdateSchema>;
export type AuctionResponseData = z.infer<typeof AuctionResponseSchema>;
