const express = require("express");
const axios = require("axios");
const books = require("../data/booksdb.json");

const router = express.Router();

/* TASK 2 – Get all books */
router.get("/", async (req, res) => {
  try {
    res.json(books);
  } catch (err) {
    res.status(500).json({ message: "Error fetching books" });
  }
});

/* TASK 3 – Get book by ISBN */
router.get("/isbn/:isbn", async (req, res) => {
  const isbn = req.params.isbn;
  res.json(books[isbn]);
});

/* TASK 4 – Get books by author */
router.get("/author/:author", async (req, res) => {
  const author = req.params.author.toLowerCase();
  const result = {};

  Object.keys(books).forEach((key) => {
    if (books[key].author.toLowerCase() === author) {
      result[key] = books[key];
    }
  });

  res.json(result);
});

/* TASK 5 – Get books by title */
router.get("/title/:title", async (req, res) => {
  const title = req.params.title.toLowerCase();
  const result = {};

  Object.keys(books).forEach((key) => {
    if (books[key].title.toLowerCase() === title) {
      result[key] = books[key];
    }
  });

  res.json(result);
});

/* TASK 6 – Get book reviews */
router.get("/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  res.json(books[isbn].reviews);
});

module.exports = router;
