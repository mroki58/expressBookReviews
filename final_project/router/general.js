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

function getBooks()
{
    return new Promise((resolve,reject) => {
        resolve(books)
    })
}

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  getBooks()
    .then(response => {
        res.status(200).send(JSON.stringify(response))
    }).catch(error => {
        res.status(500).send('Error retrieving books' )
      });
 
});

function getBooksbyISBN(isbn){
    return new Promise((resolve, reject) => {
        if(isbn in books)
        {
            resolve(books[isbn])
        }else{
            reject("No such book")
        }
    })
}


// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  let isbn = req.params.isbn
  getBooksbyISBN(isbn)
  .then(response => {
      res.status(200).send(JSON.stringify(response))
  }).catch(error => {
      res.status(500).send(error)
    });
  
 });

 function getBooksbyAuthor(author){
    return new Promise((resolve, reject) => {
        ToReturn = {}
        for(let key in books)
        {
            if(author === books[key].author)
            {
                ToReturn[key] = books[key]
            }
        }
        if(Object.keys(ToReturn).length > 0)
            resolve(ToReturn)
        reject('No objects')
    })
 }
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  let author = req.params.author
  getBooksbyAuthor(author)
  .then(response => {
      res.status(200).send(JSON.stringify(response))
  }).catch(error => {
      res.status(500).send(error)
    });
});

function getBooksbyTitle(title)
{
    return new Promise((resolve, reject) => {
        
        for(let key in books)
        {
            if(title === books[key].title)
            {
                resolve(books[key])
            }
        }
        reject('No objects')
    })
}

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    let title = req.params.title
    getBooksbyTitle(title)
    .then(response => {
        res.status(200).send(JSON.stringify(response))
    }).catch(error => {
        res.status(500).send(error)
      });
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
