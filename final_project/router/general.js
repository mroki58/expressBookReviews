const express = require('express');
const axios = require('axios')
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
    console.log(req.body)
  const {username, password} = req.body
  if(!username || !password)
  {
    return res.status(400).send({message: "Where data?"})
  }else{
    if(!isValid(username))
    {
        return res.status(409).send({message: "Conflict"})
    }else{
        users.push({
            "username": username,
            "password": password
        })
    }
  }
  return res.status(300).json({message: "Successfully added user"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  return res.status(200).send(JSON.stringify(books))
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  let isbn = parseInt(req.params.isbn)
  if(isbn in books){
    return res.status(200).send(books[isbn]);
  }
    return res.status(404).send("No book with that ISBN number")
  
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  let author = req.params.author
  let findedBooks = {}
  for(let key of Object.keys(books))
  {
    if(books[key].author === author)
    {
        findedBooks[key] = books[key]
    }
  }
  if(Object.keys(findedBooks).length)
    return res.status(200).send(findedBooks)
  return res.status(404).send("No book with that author");
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  let title = req.params.title
  for(let key of Object.keys(books))
  {
    if(books[key].title === title)
    {
        return res.status(200).send(books[key])
    }
  }
  return res.status(404).send("No book with that title");
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  let isbn = req.params.isbn
  if(isbn in books)
  {
    return res.status(200).send(books[isbn].reviews)
  }else{
    return res.status(404).send("No book with that ISBN number")
  }
  
});

module.exports.general = public_users;
