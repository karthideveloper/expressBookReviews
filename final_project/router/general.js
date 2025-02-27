const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password)
    return res.status(404).json({ message: "Unable to register user." });

  if (isValid(username))
    return res.status(409).json({ error: "User already exists!" }); // 409 Conflict

  users.push({ username, password });
  return res
    .status(201)
    .json({ message: "User successfully registered. Now you can log in." });
});

// Get the book list available in the shop
public_users.get("/", function (req, res) {
  return Promise.resolve(books)
    .then((data) => res.status(200).json({ books: data }))
    .catch((err) => res.status(500).json({ error: "Internal Server Error" }));
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", function (req, res) {
  const { isbn } = req.params;
  if (!Object.hasOwn(books, isbn)) {
    return res
      .status(404)
      .json({ message: "ISBN not found in the collection." });
  }
  return Promise.resolve(books[isbn])
    .then((data) => res.status(200).json({ data: data }))
    .catch((err) => res.status(500).json({ error: "Internal Server Error" }));
});

// Get book details based on author
public_users.get("/author/:author", function (req, res) {
  const { author } = req.params;

  Promise.resolve(Object.values(books).filter((book) => book.author === author))
    .then((result) => {
      if (result.length > 0) {
        return res.status(200).json({ data: result });
      }
      return res
        .status(404)
        .json({ message: "Author name not found in the collection." });
    })
    .catch((error) => res.status(500).json({ error: "Internal Server Error" }));
});

public_users.get("/title/:title", function (req, res) {
  const { title } = req.params;

  Promise.resolve(Object.values(books).filter((book) => book.title === title))
    .then((result) => {
      if (result.length > 0) return res.status(300).json({ data: result });
      return res
        .status(404)
        .json({ message: "title not found in the collection." });
    })
    .catch((error) => res.status(500).json({ error: "Internal Server Error" }));
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  const { isbn } = req.params;
  Promise.resolve(parseInt(isbn))
    .then((parsedIsbn) => {
      if (!Object.hasOwn(books, parsedIsbn)) {
        throw { status: 404, message: "ISBN not found in the collection." };
      }
      return books[parsedIsbn].reviews;
    })
    .then((reviews) => res.status(200).json({ reviews }))
    .catch((error) => {
      const status = error.status || 500;
      res
        .status(status)
        .json({ error: error.message || "Internal Server Error" });
    });
});

module.exports.general = public_users;
