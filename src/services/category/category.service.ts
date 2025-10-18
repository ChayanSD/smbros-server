import { prisma } from "../../lib/db";
import { CategoryData } from "../../schemas/category/category.schema";
import { ConflictError, NotFoundError } from "../../utils/appError";

export const categoryService = {
  async createCategory(data: CategoryData) {
    const existing = await prisma.category.findUnique({
      where: { name: data.name },
    });
    if (existing)
      throw new ConflictError("Category with this name already exists");
    return prisma.category.create({ data: { name: data.name } });
  },

  async getCategories() {
    const categories = await prisma.category.findMany();
    return categories;
  },

  async deleteCategory(categoryId: string) {
    const existing = await prisma.category.findUnique({
      where: { id: categoryId },
    });
    if (!existing) {
      throw new Error("Category not found");
    } else {
      await prisma.category.delete({
        where: { id: categoryId },
      });
    }
  },

  async updateCategory(categoryId: string, data: CategoryData) {
    try {
      const updatedCategory = await prisma.category.update({
        where: { id: categoryId },
        data: {
          name: data.name,
        },
      });
      return updatedCategory;
    } catch (error) {
      console.error("[Update Category Error]:", (error as Error).message);
      throw new Error("Unable to update category");
    }
  },

  async getCategoryById(categoryId: string) {
   
      const category = await prisma.category.findUnique({
        where: { id: categoryId },
      });

        if (!category) {
            throw new NotFoundError("Category not found");
        }

      return category;
  }
};
