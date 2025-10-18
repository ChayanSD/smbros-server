import { NextFunction, Request, Response } from "express";
import { ResponseHandler } from "../../utils/responseHandler";
import { categoryService } from "../../services/category/category.service";
import { AppError } from "../../utils/appError";

export const createCategoryController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const category = await categoryService.createCategory(req.body);
    ResponseHandler.created(res, category, "Category created successfully");
  } catch (error) {
    if (error instanceof AppError)
        return ResponseHandler.error(res, error.message, error.status);
      return ResponseHandler.error(res, "Internal server error", 500);
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

export const getCategoryByIdController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const categoryId = req.params.id;
    const category = await categoryService.getCategoryById(categoryId);
    ResponseHandler.success(res, category, "Category fetched successfully");
  } catch (error) {
    next(error);
  }
};