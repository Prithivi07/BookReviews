const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;

    if(username && password) {
        if(!isValid(username)){
            users.push({"username":username,"password":password});
            return res.status(200).json({message:"User successfully registered"});
        }
        else{
            return res.status(404).json({message : "User already exist"})
        }
    }
    return res.status(404).json({message: "Unable to register user,Enter valid input"})
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  if (books) {
    return res.status(200).json({books});
  }
  return res.status(404).json({message: "No books found"});
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  const bookISBN = req.params.isbn;
  if(books[bookISBN]){
    return res.status(200).json({book:books[bookISBN]});
  }
  return res.status(404).json({message: "Not found"});
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  const reqAuthor = req.params.author;
  const bookKeys = Object.keys(books);
  const authorbooks = []
  bookKeys.forEach((key)=>{
    if(books[key].author === reqAuthor){
      authorbooks.push(books[key])
    }
  })
  if(authorbooks.length > 0){
    return res.status(200).json({authorbooks})
  }
  return res.status(400).json({message: "Not found"});
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  const reqTitle = req.params.title;
  const bookKeys = Object.keys(books);
  const titleBooks = []
  bookKeys.forEach((key)=>{
    if(books[key].title === reqTitle){
      titleBooks.push(books[key])
    }
  })
  if(titleBooks.length > 0){
    return res.status(200).json({titleBooks})
  }
  return res.status(400).json({message: "Not found"});
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const bookISBN = req.params.isbn;
  const reqBook = books[bookISBN];
  if(reqBook){
    return res.status(200).json({book:reqBook.title,review:(reqBook.review)?reqBook.review:null})
  }
  return res.status(400).json({message: "Not found"});
});

module.exports.general = public_users;
