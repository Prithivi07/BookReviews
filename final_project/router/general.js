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
  new Promise((resolve,reject)=>{
    const length = Object.keys(books).length;
    if(length){
      resolve(books);
    }
    else{
      reject("No books found");
    }
  })
  .then((booklist)=>{
    return res.status(200).json({booklist});
  })
  .catch((error)=>{
    return res.status(404).json({message: error});
  })
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  const bookISBN = req.params.isbn;
  new Promise((resolve,reject)=>{
    if(books[bookISBN]){
      resolve(books[bookISBN]);
    }
    else{
      reject("No books found");
    }
  })
  .then((book)=>{
    return res.status(200).json({book});
  })
  .catch((error)=>{
    return res.status(404).json({message: error});
  })
 });
  
// Get book details based on author
public_users.get('/author/:author',async function (req, res) {
  const reqAuthor = req.params.author;
  const getauthorbooks = (author) => {
    return new Promise((resolve, reject) => {
      const bookKeys = Object.keys(books);
      const authorbooks = []

      bookKeys.forEach((key)=>{
        if(books[key].author === reqAuthor){
          authorbooks.push(books[key])
        }
      })

      if(authorbooks.length > 0){
        resolve(authorbooks);
      }
      else
        reject("Not found")
    });
  }
  try {
    const requestedbooks = await getauthorbooks(reqAuthor);
    return res.status(200).json({ requestedbooks });
  } 
  catch (error) {
    return res.status(404).json({ message: error });
  }
});

// Get all books based on title
public_users.get('/title/:title',async function (req, res) {
  //Write your code here
  const reqTitle = req.params.title;
  const getbookwithtitle = (title) => {
    return new Promise((resolve, reject) => {
      const bookKeys = Object.keys(books);
      const bookWithTitle = []

      bookKeys.forEach((key)=>{
        if(books[key].title === reqTitle){
          bookWithTitle.push(books[key])
        }
      })

      if(bookWithTitle.length > 0){
        resolve(bookWithTitle);
      }
      else
        reject("Not found")
    });
  }
  
  try {
    const requestedbooks = await getbookwithtitle(reqTitle);
    return res.status(200).json({ requestedbooks });
  } 
  catch (error) {
    return res.status(404).json({ message: error });
  }
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
