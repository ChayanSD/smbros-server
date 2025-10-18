import { prisma } from "../../lib/db";
import { AuctionCreateData } from "../../schemas/auction/auction.schema";
import { ConflictError, NotFoundError } from "../../utils/appError";
import { generateSlug } from "../../utils/slug";

export const auctionService = {
  async createAuction(data: AuctionCreateData) {
    const {
      name,
      description,
      startDate,
      endDate,
      location,
      status,
      categoryId,
      tags,
    } = data;

    const slug = generateSlug(name);
    const existingAuction = await prisma.auction.findUnique({
      where: { slug },
    });
    if (existingAuction) {
      throw new ConflictError("Auction with this slug already exists");
    }

    const auction = await prisma.auction.create({
      data: {
        name,
        description,
        startDate,
        endDate,
        location,
        slug,
        status,
        categoryId,
        tags: tags ? {
          create: tags.map((tag) => ({
            tag: {
              connectOrCreate: {
                where: { name: tag.name },
                create: { name: tag.name }
              }
            }
          }))
        } : undefined,
      },
    });

    return auction;
  },

  async getAuctionBySlug(slug: string) {
    const existingAuction = await prisma.auction.findUnique({
      where: { slug },
    });
    if (!existingAuction) {
      throw new NotFoundError("Auction with this slug does not exist");
    }
    const auction = await prisma.auction.findUnique({
      where: { slug },
      include: {
        category: true,
        tags: {
          include: {
            tag: true,
          },
        },
      },
    });
    return auction;
  },

  async getAllAuctions() {
    const auctions = await prisma.auction.findMany({
      include: {
        category: true,
        tags: {
          include: {
            tag: true,
          },
        },
      },
    });
    return auctions;
  },

  async deleteAuctionBySlug(slug: string) {
    const auctionExists = await prisma.auction.findUnique({
      where: { slug },
    });
    if (!auctionExists) {
      throw new NotFoundError("Auction with this slug does not exist");
    }
    const auction = await prisma.auction.delete({
      where: { slug },
    });
    return auction;
  }
};
