'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');

const { // Hangman Handlers
  getWordById, getRandomWord, guessLetter,
} = require("./handlers/hangmanHandlers")

express()
  .use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header(
      'Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content-Type, Accept'
    );
    next();
  })
  .use(morgan('tiny'))
  .use(express.static('public'))
  .use(bodyParser.json())
  .use(express.urlencoded({ extended: false }))

  // endpoints // Descriptions of handlers in "hangmanHandlers.js"
  // .get("/hangman/word/:id", getWordById) // Testing Purposes Only
  .get("/hangman/word", getRandomWord)
  .get("/hangman/guess/:id/:letter", guessLetter)

  // Error Catch GET Endpoint
  .get("*", (req, res) => res.status(404).json({
    status: 404,
    message: "This endpoint does not exist."
  }))

  .listen(8000, () => console.log(`Listening on port 8000`));
