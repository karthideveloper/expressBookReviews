const express = require("express");
const axios = require("axios");
const booksdb = require("../data/booksdb.json");
const books = require("../booksdb");
const { users, isValidUser, authenticatedUser } = require("../users");
const jwt = require("jsonwebtoken");
const router = express.Router();

/* TASK 2 – Get all books */
router.get("/", async (req, res) => {
  try {
    res.json(booksdb);
  } catch (err) {
    res.status(500).json({ message: "Error fetching books" });
  }
});

/* TASK 3 – Get book by ISBN */
router.get("/isbn/:isbn", async (req, res) => {
  const isbn = req.params.isbn;
  res.json(booksdb[isbn]);
});

/* TASK 4 – Get books by author */
router.get("/author/:author", async (req, res) => {
  const author = req.params.author.toLowerCase();
  const result = {};

  Object.keys(booksdb).forEach((key) => {
    if (booksdb[key].author.toLowerCase() === author) {
      result[key] = booksdb[key];
    }
  });

  res.json(result);
});

/* TASK 5 – Get books by title */
router.get("/title/:title", async (req, res) => {
  const title = req.params.title.toLowerCase();
  const result = {};

  Object.keys(booksdb).forEach((key) => {
    if (booksdb[key].title.toLowerCase() === title) {
      result[key] = booksdb[key];
    }
  });

  res.json(result);
});

/* TASK 6 – Get book reviews */
router.get("/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  res.json(booksdb[isbn].reviews);
});






/* Task 1 – Get all books */
router.get("/books", (req, res) => {
  res.json(books);
});

/* Task 2 – Get book by ISBN */
router.get("/books/isbn/:isbn", (req, res) => {
  const book = books[req.params.isbn];
  book ? res.json(book) : res.status(404).json({ message: "Book not found" });
});

/* Task 3 – Get books by Author */
router.get("/books/author/:author", (req, res) => {
  const author = req.params.author.toLowerCase();
  const result = Object.values(books).filter(
    book => book.author.toLowerCase().includes(author)
  );
  res.json(result);
});

/* Task 4 – Get books by Title */
router.get("/books/title/:title", (req, res) => {
  const title = req.params.title.toLowerCase();
  const result = Object.values(books).filter(
    book => book.title.toLowerCase().includes(title)
  );
  res.json(result);
});

/* Task 5 – Get book reviews */
router.get("/books/review/:isbn", (req, res) => {
  const book = books[req.params.isbn];
  book ? res.json(book.reviews) : res.status(404).json({ message: "Book not found" });
});

function authenticate(req, res, next) {
  console.log("Auth Header:", req.headers.authorization);

  const authHeader = req.headers.authorization;
  if (!authHeader) return res.sendStatus(401);

  const token = authHeader.split(" ")[1];
  console.log("Token:", token);

  jwt.verify(token, "secretkey", (err, user) => {
    if (err) {
      console.log("JWT Error:", err.message);
      return res.sendStatus(403);
    }
    req.user = user;
    next();
  });
}
/* TASK 9 – Add / Modify Review */
router.put("/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const review = req.body.review;
  console.log(req)
  books[isbn].reviews['karthi'] = review;

  res.json({
    message: "Review added/updated successfully",
    reviews: books[isbn].reviews
  });
});

/* TASK 10 – Delete Review */
router.delete("/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;

  delete books[isbn].reviews['karthi'];

  res.json({ message: "Review deleted successfully" });
});
/* Task 6 – Register user */
router.post("/register", (req, res) => {
  const { username, password } = req.body;

  if (!isValidUser(username)) {
    users.push({ username, password });
    res.json({ message: "User registered successfully" });
  } else {
    res.status(400).json({ message: "User already exists" });
  }
});

/* Task 7 – Login user */
router.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (authenticatedUser(username, password)) {
    const token = jwt.sign({ username }, "access", { expiresIn: "1h" });
    res.json({ message: "Login successful", token });
  } else {
    res.status(401).json({ message: "Invalid credentials" });
  }
});

module.exports = router;
