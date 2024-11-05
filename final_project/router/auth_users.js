const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
    let authUsers = users.filter(user => user.username === username)
    if(authUsers.length > 0){
        return false
    }
    return true
}

const authenticatedUser = (username,password)=>{ //returns boolean
    let authUser = users.filter(user => user.username === username && user.password === password)
    if(authUser.length > 0)
    {
        return true
    } else{
        return false
    }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
    const user = req.body.username;
    const password = req.body.password
    console.log(user + " " + password)
    if (!user || !password) {
        return res.status(400).json({ message: "Body Empty" });
    }

    if(authenticatedUser(user, password))
    {
    // Generate JWT access token
    let accessToken = jwt.sign({
        data: user
    }, 'access', { expiresIn: 60 * 60 });
    // Store access token in session
    req.session.authorization = {
        accessToken
    }
    req.session.user = user
    return res.status(200).send("User successfully logged in");
}else{
    return res.status(401).send("Unauthorized access")
}
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  let isbn = req.params.isbn
  if(!(isbn in books))
  {
    return res.status(400).send("No book with that ISBN")
  }
  books[isbn].reviews[req.session.user] = req.body.review
  return res.status(200).send({message: "review added successfully"})

  
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
    let isbn = req.params.isbn
    if(!(isbn in books))
    {
        return res.status(400).send("No book with that ISBN")
    }
    if(req.session.user in books[isbn].reviews)
    {
        delete books[isbn].reviews[req.session.user]
        return res.status(200).send({message: "Review deleted"})
    }else{
        return res.status(404).send({message: "No review from user"})
    }


})

module.exports.authenticatedUser = authenticatedUser;
module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
