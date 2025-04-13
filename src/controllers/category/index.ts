import { Request, Response, NextFunction } from "express";
import Category from "../../models/categories";

const getAllCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const categories = await Category.getAllCategory();

    res.status(200).json(categories);
  } catch (error) {
    next(error);
  }
};

const getCategoryById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { categoryId } = req.params;

    const category = await Category.getCategoryById(categoryId);

    if (!category) {
      res.status(404).json({ error: "category not found!" });
      return;
    }

    res.status(200).json(category);
  } catch (error) {
    next(error);
  }
};

const addNewCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { name } = req.body;

    if (!name) {
      res.status(400).json({ error: "category name is required!" });
      return;
    }

    const categoryNameExist = await Category.getCategoryByName(name);
    if (categoryNameExist) {
      res.status(400).json({ error: "category name already exists!" });
      return;
    }

    await Category.addNewCategory({ name });

    res.status(201).json({ message: "New category added successfully!" });
  } catch (error) {
    next(error);
  }
};

const updateCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { categoryId } = req.params;
    const payload = req.body;

    const categoryExist = await Category.getCategoryById(categoryId);

    if (!categoryExist) {
      res.status(404).json({ error: "category not found!" });
      return;
    }

    await Category.updateCategory(categoryId, payload);

    res.status(200).json({ message: "category updated successfully!" });
  } catch (error) {
    next(error);
  }
};

const deleteCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { categoryId } = req.params;

    const categoryExist = await Category.getCategoryById(categoryId);

    if (!categoryExist) {
      res.status(404).json({ error: "category not found!" });
      return;
    }

    await Category.deleteCategory(categoryId);

    res.status(200).json({ message: "category deleted successfully!" });
  } catch (error) {
    next(error);
  }
};

export {
  getAllCategory,
  getCategoryById,
  addNewCategory,
  updateCategory,
  deleteCategory,
};
