const express = require("express");
const router = express.Router();
const Book = require("../models/Book");

// GET All Books, Search, Pagination
router.get("/", async (req, res) => {
  try {

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;

    let query = {};

    if (req.query.author) {
      query.author = {
        $regex: req.query.author,
        $options: "i"
      };
    }

    if (req.query.genre) {
      query.genre = {
        $regex: req.query.genre,
        $options: "i"
      };
    }

    const books = await Book.find(query)
      .skip((page - 1) * limit)
      .limit(limit);

    const totalBooks = await Book.countDocuments(query);

    res.status(200).json({
      totalBooks,
      currentPage: page,
      totalPages: Math.ceil(totalBooks / limit),
      books
    });

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }
});

// GET Single Book
router.get("/:id", async (req, res) => {

  try {

    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({
        message: "Book not found"
      });
    }

    res.status(200).json(book);
 } catch (error) {

    res.status(400).json({
      message: error.message
    });

  }

});

// Add Book
router.post("/", async (req, res) => {

  try {

    const {
      title,
      author,
      genre,
      price,
      publishedDate,
      inStock
    } = req.body;

    if (!title || !author || !price) {
      return res.status(400).json({
        message: "Title, Author and Price are required"
      });
    }

    const book = new Book({
      title,
      author,
      genre,
      price,
      publishedDate,
      inStock
    });

    const savedBook = await book.save();

    res.status(201).json(savedBook);

  } catch (error) {

    res.status(400).json({
      message: error.message
    });

  }

});

// UPDATE Book
router.put("/:id", async (req, res) => {

  try {

    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({
        message: "Book not found"
      });
    }

    const updatedBook = await Book.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    res.status(200).json(updatedBook);

  } catch (error) {

    res.status(400).json({
      message: error.message
    });

  }

});

// DELETE Book
router.delete("/:id", async (req, res) => {

  try {

    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({
        message: "Book not found"
      });
    }

    await Book.findByIdAndDelete(req.params.id);

    res.status(200).json({
      message: "Book deleted successfully"
    });

  } catch (error) {

    res.status(400).json({
      message: error.message
    });

  }

});

module.exports = router;