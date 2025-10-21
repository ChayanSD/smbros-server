import { prisma } from "../../lib/db";
import { BidCreateData } from "../../schemas/bid/bid.shema";
import { NotFoundError, ConflictError } from "../../utils/appError";

export const bidService = {
  async createBid(data: BidCreateData, userId: string) {
    const { auctionItemId, amount } = data;

    // Check if auction item exists
    const auctionItem = await prisma.auctionItem.findUnique({
      where: { id: auctionItemId },
      include: { auction: true },
    });

    if (!auctionItem) {
      throw new NotFoundError("Auction item not found");
    }

    // Check if auction is active
    if (auctionItem.auction.status !== "Active") {
      throw new ConflictError("Auction is not active");
    }

    // Check if bid amount is higher than current bid or base bid
    const currentBid = auctionItem.currentBid || auctionItem.baseBidPrice;
    if (amount <= currentBid) {
      throw new ConflictError(`Bid amount must be higher than current bid of ${currentBid}`);
    }

    // Create the bid
    const bid = await prisma.bid.create({
      data: {
        auctionItemId,
        userId,
        amount,
      },
    });

    // Update the current bid on the auction item
    await prisma.auctionItem.update({
      where: { id: auctionItemId },
      data: { currentBid: amount },
    });

    return bid;
  },

  async getBidsByAuctionItem(auctionItemId: string) {
    const bids = await prisma.bid.findMany({
      where: { auctionItemId },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return bids;
  },

  async getUserBids(userId: string) {
    const bids = await prisma.bid.findMany({
      where: { userId },
      include: {
        auctionItem: {
          include: {
            auction: {
              select: {
                id: true,
                name: true,
                slug: true,
                status: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return bids;
  },
};