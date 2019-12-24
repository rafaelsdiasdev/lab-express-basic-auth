const express = require("express");
const router = express.Router();

// User model
const User = require("../models/user");

// BCrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;

const zxcvbn = require('zxcvbn');

router.get("/signup", (req, res, next) => {
  res.render("auth/signup");
});

//rota para criar novo usuario
router.post("/signup", (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  const salt = bcrypt.genSaltSync(bcryptSalt);
  const hashPass = bcrypt.hashSync(password, salt);
  
  // checar se os campos então em branco
  if (username === "" || password === "") {
    res.render("auth/signup", {
      errorMessage: "Indicate a username and a password to sign up"
    });
    return;
  }

  // vericiar a força da senha
  if (zxcvbn(password).score < 2) {
    res.render("auth/signup", {
      errorMessage: `Easy password. ${zxcvbn(password).feedback.suggestions}`
    })
    return
  }

  // User.create({
  //     username,
  //     password: hashPass
  //   })
  //   .then(() => {
  //     res.redirect("/");
  //   })
  //   .catch(error => {
  //     console.log(error);
  //   })

  //verificar se o usuario ja existe
  User.findOne({
      "username": username,
    })
    .then(user => {
      if (user !== null) {
        res.render("auth/signup", {
          errorMessage: "The username already exists!"
        });
        return;
      }

      const salt = bcrypt.genSaltSync(bcryptSalt);
      const hashPass = bcrypt.hashSync(password, salt);

      User.create({
          username,
          password: hashPass
        })
        .then(() => {
          res.redirect("/");
        })
        .catch(error => {
          console.log(error);
        })
    })
    .catch(error => {
      next(error);
    })
});



// console.log('===>', zxcvbn('1asds%%asud&((dkasdnnasd"4%%').score)

module.exports = router;