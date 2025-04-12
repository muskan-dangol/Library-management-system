import { Request, Response, NextFunction } from "express";
import Book from "../../models/books";

const getAllBooks = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const books = await Book.getAllBooks();

    res.status(200).json(books);
  } catch (error) {
    next(error);
  }
};

const getBookById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { bookId } = req.params;

    const book = await Book.getBookById(bookId);

    if (!book) {
      res.status(404).json({ error: "Book not found!" });
      return;
    }

    res.status(200).json(book);
  } catch (error) {
    next(error);
  }
};

const addNewBook = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const {
      title,
      author,
      release_date,
      available,
      short_description,
      long_description,
      image,
    } = req.body;

    if (
      !(
        title &&
        author &&
        release_date &&
        available &&
        short_description &&
        long_description
      )
    ) {
      res.status(400).json({ error: "All fields are required!" });
      return;
    }

    const bookTitleExists = await Book.getBookByTitle(title);
    if (bookTitleExists) {
      res.status(400).json({ error: "A book with this title already exists!" });
      return;
    }

    await Book.addNewBook({
      title,
      author,
      release_date,
      available,
      image,
      short_description,
      long_description,
    });
    res.status(201).json({ data: "Book added successfully!" });
  } catch (error) {
    next(error);
  }
};

const updateBookById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { bookId } = req.params;
    const payload = req.body;

    const bookExists = await Book.getBookById(bookId);

    if (!bookExists) {
      res.status(404).json({ error: "Book not found!" });
    }
    await Book.updateBook(bookId, payload);
    res.status(200).json({ data: "Book updated successfully!" });
  } catch (error) {
    next(error);
  }
};

const deleteBookById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { bookId } = req.params;

    const bookExists = await Book.getBookById(bookId);

    if (!bookExists) {
      res.status(404).json({ error: "Book not found!" });
    }
    await Book.deleteBookById(bookId);
    res.status(200).json({ date: "Book deleted successfully!" });
  } catch (error) {
    next(error);
  }
};

export { getAllBooks, getBookById, addNewBook, updateBookById, deleteBookById };
