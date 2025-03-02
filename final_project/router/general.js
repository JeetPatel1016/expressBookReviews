const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
  //Write your code
  const { username, password } = req.body;
  if (!username || !password)
    return res
      .status(400)
      .json({ message: "You must include both a username and password." });
  if (!isValid(username)) {
    return res.status(400).json({ message: "User already exists." });
  }
  users.push({ username, password });
  return res.status(201).json({ message: "User created successfully." });
});

// Get the book list available in the shop
public_users.get("/", function (req, res) {
  //Write your code here
  new Promise((resolve, reject) => {
    resolve(books);
  })
    .then((books) => res.status(200).json(books))
    .catch((err) =>
      res.status(500).json({ message: "Error occurred while fetching books." })
    );
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", function (req, res) {
  //Write your code here
  const { isbn } = req.params;
  const getBookByIsbn = new Promise((resolve, reject) => {
    const book = books[isbn];
    if (!book) reject(`Book with ISBN ${ISBN} cannot be found.`);
    resolve(book);
  });

  getBookByIsbn
    .then((book) => res.status(200).json(book))
    .catch((err) => res.status(404).json({ message: err }));
});

// Get book details based on author
public_users.get("/author/:author", function (req, res) {
  //Write your code here
  const { author } = req.params;
  const getBooksByAuthor = new Promise((resolve, reject) => {
    let booksResult = Object.values(books).filter(
      (book) => book.author.toLowerCase() === author.trim().toLowerCase()
    );
    if (booksResult.length === 0) reject("No books found.");
    resolve(booksResult);
  });

  getBooksByAuthor
    .then((books) => res.status(200).json(books))
    .catch((err) => res.status(404).json({ message: err }));
});

// Get all books based on title
public_users.get("/title/:title", function (req, res) {
  //Write your code here
  const { title } = req.params;
  const getBookByTitle = new Promise((resolve, reject) => {
    let result = Object.values(books).filter(
      (book) => book.title.toLowerCase() === title.toLowerCase()
    );
    if (result.length === 0) reject("No books found.");
    resolve(result);
  });

  getBookByTitle
    .then((book) => res.status(200).json(book))
    .catch((err) => res.status(404).json({ message: err }));
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  //Write your code here
  const { isbn } = req.params;
  if (!books[isbn])
    return res
      .status(404)
      .json({ message: `Book with ISBN ${isbn} cannot be found.` });
  const result = books[isbn].reviews;
  return res.status(200).json({ review: result });
});

module.exports.general = public_users;
