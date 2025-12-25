const express = require("express");
const jwt = require("jsonwebtoken");
const books = require("../data/booksdb.json");

const router = express.Router();
const users = [];

/* TASK 7 – Register */
router.post("/register", (req, res) => {
  const { username, password } = req.body;

  if (users.find((u) => u.username === username)) {
    return res.json({ message: "User already exists" });
  }

  users.push({ username, password });
  res.json({ message: "User successfully registered" });
});

/* TASK 8 – Login */
router.post("/login", (req, res) => {
  const { username, password } = req.body;

  const user = users.find(
    (u) => u.username === username && u.password === password
  );

  if (!user) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const token = jwt.sign({ username }, "secretkey", { expiresIn: "1h" });

  res.json({ message: "Login successful", token });
});

/* Middleware */
function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) return res.sendStatus(401);

  const token = authHeader.split(" ")[1];

  jwt.verify(token, "secretkey", (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

/* TASK 9 – Add / Modify Review */
router.put("/review/:isbn", authenticate, (req, res) => {
  const isbn = req.params.isbn;
  const review = req.body.review;

  books[isbn].reviews[req.user.username] = review;

  res.json({
    message: "Review added/updated successfully",
    reviews: books[isbn].reviews
  });
});

/* TASK 10 – Delete Review */
router.delete("/review/:isbn", authenticate, (req, res) => {
  const isbn = req.params.isbn;

  delete books[isbn].reviews[req.user.username];

  res.json({ message: "Review deleted successfully" });
});

module.exports = router;

