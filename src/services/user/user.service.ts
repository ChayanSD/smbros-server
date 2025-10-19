import { prisma } from "../../lib/db";


export const userService = {
  async getUserById(id: string) {
    const user = await prisma.user.findUnique({
      where: { id },
    });

    return user;
  },

  async getAllUsers() {
    const users = await prisma.user.findMany();
    return users;
  },
};