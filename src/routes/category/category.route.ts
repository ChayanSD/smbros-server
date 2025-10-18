import { Router } from "express";

import { createCategoryController,getCategoriesController,getCategoryByIdController, deleteCategoryController, updateCategoryController } from "../../controller/category/category.controller";


const router = Router();

router.get("/", getCategoriesController);

router.get("/:id", getCategoryByIdController);

router.post("/", createCategoryController);

router.put("/:id", updateCategoryController);

router.delete("/:id", deleteCategoryController);

export default router;