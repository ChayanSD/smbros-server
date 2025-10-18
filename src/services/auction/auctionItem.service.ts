import { prisma } from "../../lib/db";
import { AuctionItemCreateData } from "../../schemas/auction/auctionItem.schema";
import { NotFoundError } from "../../utils/appError";

export const auctionItemService = {
  async createAuctionItem(data: AuctionItemCreateData) {
    const {
      name,
      description,
      auctionId,
      shipping,
      terms,
      baseBidPrice,
      additionalFee,
      currentBid,
      estimatedPrice,
      productImages
    } = data;

    const auctionItem = await prisma.auctionItem.create({
      data: {
        name,
        description,
        auctionId,
        shipping,
        terms,
        baseBidPrice,
        additionalFee,
        currentBid,
        estimatedPrice,
        productImages: productImages ? {
          create: productImages.map((image) => ({
            url: image.url,
            altText: image.altText
          }))
        } : undefined,  
      },
    });

    return auctionItem;
  },

  async getAuctionItemById(id : string) {
    const auctionItem = await prisma.auctionItem.findUnique({
      where : { id },
      include : {
        productImages : true
      }
    });
    if(!auctionItem) {
      throw new NotFoundError("Auction item not found");
    }
    return auctionItem;
  },

  async getAllAuctionItems() {
    const auctionItems = await prisma.auctionItem.findMany({
      include : {
        productImages : true
      }
    });
    return auctionItems;
  },
  async deleteAuctionItem(id : string) {
    const auctionItem = await prisma.auctionItem.delete({
      where : { id }
    });
    return auctionItem;
  }
};
