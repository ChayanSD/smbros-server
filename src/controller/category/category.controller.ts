import { NextFunction, Request, Response } from "express";
import { ResponseHandler } from "../../utils/responseHandler";
import { categoryService } from "../../services/category/category.service";

export const createCategoryController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const category = await categoryService.createCategory(req.body);
    ResponseHandler.success(res, category, "Category created successfully");
  } catch (error) {
    next(error);
  }
};

export const getCategoriesController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const categories = await categoryService.getCategories();
    ResponseHandler.success(res, categories, "Categories fetched successfully");
  } catch (error) {
    next(error);
  }
};

export const deleteCategoryController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const categoryId = req.params.id;
    await categoryService.deleteCategory(categoryId);
    ResponseHandler.success(res, null, "Category deleted successfully");
  } catch (error) {
    next(error);
  }
};

export const updateCategoryController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const categoryId = req.params.id;
    const updatedCategory = await categoryService.updateCategory(categoryId, req.body);
    ResponseHandler.success(res, updatedCategory, "Category updated successfully");
  } catch (error) {
    next(error);
  }
};