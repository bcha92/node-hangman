// Hangman Handler Imports
const { words } = require('../data/words');

// Hangman Word Handlers
let wordId = null;
let wordArray = [];
let wordGuess = "";
let theWord = null;
let guesses = 5;

// GET word by Id (**for testing only**)
const getWordById = (req, res) => {
    const { id } = req.params; // ID parameter
    // Filters and retrieves word based on id
    const wordFilter = words.filter(word => {
        return word.id === id
    })[0];

    // If wordFilter does not return undefined
    wordFilter !== undefined ?
    res.status(200).json({ // Success
        status: 200,
        data: wordFilter,
        message: "none",
    }) :
    res.status(400).json({ // Error
        status: 400,
        error: "This endpoint does not exist.",
    })
};

// GET random word from words
const getRandomWord = (req, res) => {
    // Random index number
    const index = Math.floor(Math.random() * words.length)

    // For each getRandomWord, the Array and Guess reset
    wordId = words[index].id; // ID
    wordArray = []; // Array
    wordGuess = ""; // Slate
    theWord = words[index].word; // The word **
    guesses = 5;

    // Then Array and Guess is setup //
    for (let i = 0; i < words[index].letterCount; i++) {
        wordArray.push(false);
        wordGuess += "_ ";
    }

    // Console log shows blank tiles for the word
    console.log(wordGuess);

    res.status(200).json({
        status: 200,
        data: {
            id: words[index].id,
            letterCount: words[index].letterCount,
        },
        message: `Please proceed to /hangman/guess/${words[index].id}/<enter a letter here> to start the game.`,
    })
};

// Guess the letter of this word using GET
const guessLetter = (req, res) => {
    const { id, letter } = req.params; // ID/Letter Parameters

    // Basic Error Handling for Game Mechanics
    if (id !== wordId) { // id does not match wordId
        return res.status(400).json({
            status: 400,
            error: wordId === null ?
            "Game not selected, please try again after selecting a word from /hangman/word."
            : `Wrong game! Try /hangman/guess/${wordId}/<enter letter here>`
        })
    }
    if (letter.length > 1) { // single letter not inputted
        return res.status(400).json({
            status: 400,
            error: "Please enter only 1 single letter."
        })
    }
    // non- or Capitalized letter is entered
    if (!new RegExp(/[a-z]/).test(letter)) {
        return res.status(400).json({
            status: 400,
            error: "Please enter a lower case letter."
        })
    }

    // Checks letter for a match in word
    if (theWord.includes(letter)) {
        wordGuess = "";
        wordArray.forEach((space, index) => {
            if (theWord[index] === letter) {
                wordArray[index] = true;
            }
        })
        wordArray.forEach((space, index) => {
            if (space) {
                wordGuess += `${theWord[index]} `;
            } else {
                wordGuess += "_ ";
            }
        })
        console.log(wordGuess);
        if (!wordArray.includes(false)) { // YOU WIN!
            console.log(wordGuess, "You Won!")
            // Reset Variables
            wordId = null; // ID
            wordArray = []; // Array
            theWord = null; // The word **
            return res.status(200).json({
                status: 200,
                message: `${wordGuess}. You Won! Go to hangman/word to start a new game!`,
            })
        } else {
            console.log(wordGuess);
            return res.status(200).json({
                status: 200,
                message: wordGuess,
            })
        }
    }
    else { // If no matches,...
        guesses -= 1;
        if (guesses === 0) { // YOU LOSE
            console.log(`You Lose! The word was ${theWord}.`);
            // Reset Variables
            wordId = null; // ID
            wordArray = []; // Array
            wordGuess = ""; // Slate
            return res.status(400).json({
                status: 400,
                error: "You Lose.",
                message: `Game Over! The word was ${theWord}. Go to hangman/word to start a new game!`,
            })
        } // Try again!
        console.log(wordGuess);
        console.log(guesses, "tries left.")
        return res.status(400).json({
            status: 400,
            error: `Wrong letter. You have ${guesses} tries left.`,
            message: wordGuess,
        })
    }
};

// Module Exports
module.exports = {
    getWordById, getRandomWord, guessLetter,
};