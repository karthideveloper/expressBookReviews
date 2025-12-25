const express = require("express");
const books = require("../booksdb");
const authenticateJWT = require("../auth");

const router = express.Router();

/* Task 8 – Add or Modify Review */
router.post("/auth/review/:isbn", authenticateJWT, (req, res) => {
  const { review } = req.body;
  const username = req.user.username;
  const book = books[req.params.isbn];

  if (book) {
    book.reviews[username] = review;
    res.json({ message: "Review added/updated successfully" });
  } else {
    res.status(404).json({ message: "Book not found" });
  }
});

/* Task 9 – Delete Review */
router.delete("/auth/review/:isbn", authenticateJWT, (req, res) => {
  const username = req.user.username;
  const book = books[req.params.isbn];

  if (book && book.reviews[username]) {
    delete book.reviews[username];
    res.json({ message: "Review deleted successfully" });
  } else {
    res.status(404).json({ message: "Review not found" });
  }
});

module.exports = router;
