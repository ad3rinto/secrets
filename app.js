//jshint esversion:6
require('dotenv').config();
const express = require('express')
const ejs = require('ejs');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
// const encrypt = require("mongoose-encryption");
// const md5 = require("md5");
const bcrypt = require("bcrypt");


const saltRounds = 10;


const app = express();



app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({
  extended: true
}));

mongoose.connect("mongodb://localhost:27017/userDB");
const userSchema = new mongoose.Schema({
  email: String,
  password: String
});

// const secret = process.env.SECRET;
// userSchema.plugin(encrypt, { secret: secret, encryptedFields: ["password"]});


const User = new mongoose.model("User", userSchema);



app.get("/", (req, res) => {
  res.render('home')
});


app.get("/login", (req, res) => {
  res.render('login')
});


app.get("/register", (req, res) => {
  res.render('register')
});

app.post("/register", (req, res) => {
  bcrypt.hash(req.body.password, saltRounds, (rr, hash) => {
    const newUser = new User({
      email: req.body.username,
      password: hash
    });
    newUser.save((err) => {
      if (err) {
        console.log(err);
      } else {
        res.render("secrets");
      }
    });
  });

});

app.post("/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  User.findOne({
    email: username
  }, (err, foundUser) => {
    if (err) {
      console.log(err);
    } else {
      if (foundUser) {
        bcrypt.compare(password, found.password, (err, result) => {
          if (result === true) {
            res.render("secrets");
          }
        })
        res.render("secrets");
      };
    }
  });
});







app.listen(3000, () => {
  console.log("Server started on port 3000")
});
