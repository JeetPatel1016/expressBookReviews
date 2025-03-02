const express = require("express");
const jwt = require("jsonwebtoken");
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [{ username: "test", password: "123456789" }];

const isValid = (username) => {
  //returns boolean
  //write code to check is the username is valid
  let user = users.find((user) => user.username === username);
  return user ? false : true;
};

const authenticatedUser = (username, password) => {
  //returns boolean
  //write code to check if username and password match the one we have in records.
  let user = users.find(
    (user) => user.username === username && user.password === password
  );
  return user ? true : false;
};

//only registered users can login
regd_users.post("/login", (req, res) => {
  //Write your code here
  const { username, password } = req.body;
  if (!username || !password)
    return res
      .status(400)
      .json({ message: "Both username and password must be included." });
  if (!authenticatedUser(username, password)) {
    return res
      .status(401)
      .json({ message: "Either username or paswword is incorrect." });
  }
  const accessToken = jwt.sign({ username, password }, "access", {
    expiresIn: 3600,
  });
  res.cookie("x-access-token", accessToken, {
    httpOnly: true,
    sameSite: true,
    maxAge: 3600,
  });
  return res.status(200).json({ message: "User logged in successfully." });
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const { username } = req.user;
  const { isbn } = req.params;
  const book = books[isbn];
  const { review } = req.body;
  if (!review)
    return res.status(400).json({ message: "Review cannot be empty." });
  if (!book)
    return res
      .status(404)
      .json({ message: `Book with ISBN ${isbn} cannot be found.` });
  book.reviews[username] = review;
  return res
    .status(200)
    .json({ message: "Review added successfully to book." });
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  const { username } = req.user;
  const { isbn } = req.params;
  if (!books[isbn])
    return res
      .status(404)
      .json({ message: `Book with ISBN ${isbn} cannot be found.` });
  delete books[isbn].reviews[username];
  return res.status(200).json({ message: "Review deleted successfully." });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
