import { prisma } from "../../lib/db";
import { CategoryData } from "../../schemas/category/category.schema";


export const categoryService = {
    async createCategory(data : CategoryData) {
        try {
            const category = await prisma.category.create({
            data : {
                name : data.name
            }
        });
        return category;
        } catch (error) {
            console.error("[Category Creation Error]:", (error as Error).message);
            throw new Error("Unable to create category");
        }
    },
    
    async getCategories() {
        try {
            const categories = await prisma.category.findMany();
            return categories;
        } catch (error) {
            console.error("[Get Categories Error]:", (error as Error).message);
            throw new Error("Unable to fetch categories");
        }
    },

    async deleteCategory(categoryId: string) {
        try {
            await prisma.category.delete({
                where: { id: categoryId }
            });
        } catch (error) {
            console.error("[Delete Category Error]:", (error as Error).message);
            throw new Error("Unable to delete category");
        }
    },

    async updateCategory(categoryId: string, data: CategoryData) {
        try {
            const updatedCategory = await prisma.category.update({
                where: { id: categoryId },
                data: {
                    name: data.name
                }
            });
            return updatedCategory;
        } catch (error) {
            console.error("[Update Category Error]:", (error as Error).message);
            throw new Error("Unable to update category");
        }
    }
}