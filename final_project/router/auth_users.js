const express = require("express");
const jwt = require("jsonwebtoken");
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
  let validUser = users.filter((user) => user.username === username);
  return validUser.length > 0;
};

const authenticatedUser = (username, password) => {
  let validUser = users.filter(
    (user) => user.username === username && user.password === password
  );
  return validUser.length > 0;
};

//only registered users can login
regd_users.post("/login", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password)
    return res.status(404).json({ message: "Error logging in" });
  if (authenticatedUser(username, password)) {
    let accessToken = jwt.sign(
      {
        data: password,
      },
      "access",
      { expiresIn: 60 }
    );

    req.session.authorization = { accessToken, username };
    return res.status(200).json({ message: "user Successfully Logged in" });
  } else {
    return res.status(300).json({ message: "Yet to be implemented" });
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const { isbn } = req.params;
  const { review } = req.query;
  const { username } = req.session.authorization;
  if (!review) {
    return res.status(400).json({ error: "Review cannot be empty." });
  }
  if (!books.hasOwnProperty(isbn)) {
    return res.status(404).json({ error: "Book with given ISBN not found." });
  }
  books[isbn].reviews[username] = review;

  return res.status(200).json({
    message: "Review posted successfully.",
    reviews: books[isbn].reviews,
  });
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  const { isbn } = req.params;
  const { username } = req.session.authorization;
  if (!books.hasOwnProperty(isbn)) {
    return res.status(404).json({ error: "Book with given ISBN not found." });
  }

  if (!books[isbn].reviews.hasOwnProperty(username))
    return res.status(400).json({ error: "No review for this book" });

  delete books[isbn].reviews[username];

  return res.status(200).json({
    message: "Review posted successfully.",
    reviews: books[isbn].reviews,
  });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
