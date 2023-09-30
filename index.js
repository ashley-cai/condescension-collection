"use strict";
let phrases = [
    "BEAT AROUND THE BUSH",
    "A DIME A DOZEN",
    "BREAK A LEG",
    "CUT ME SOME SLACK",
    "HANG IN THERE",
    "HIT THE ROAD",
    "NO PAIN NO GAIN",
    "PULL YOUR LEG",
    "UNDER THE WEATHER",
    "BREAK THE ICE",
    "WILD GOOSE CHASE",
    "PIECE OF CAKE",
    "SPILL THE BEANS",
    "TAKE A RAIN CHECK",
    "WHOLE NINE YARDS",
    "FIT AS A FIDDLE",
    "ON CLOUD NINE",
    "SPEAK OF THE DEVIL"
];
let usedPhrases = [0];
let wordCheckerInt = [];
let wordCheckerWord = [];
let wordCheckerLetter = [];
let userTypedLetter = [];
let countTracker = 0;
let timeTracker = 0;
let mistakeTracker = 0;
let letterCounter = 0;
//TODO: 
//start game
//typing progress on the reference sentence
//wpm calculator
//mobile compatibility
function startGame() {
    let intro = document.getElementById("intro-page");
    intro.style.display = "none";
    let game = document.getElementById("game-page");
    game.style.display = "block";
    initializePhrase();
}
//function to pick a phrase and set up the text-boxes
function initializePhrase() {
    //changes the count tracker
    countTracker++;
    let countTrackerElement = document.getElementById("count-tracker");
    countTrackerElement.innerHTML = countTracker + "/15";
    //randomly pick a sentence
    let num = 0;
    // to ensure no repeated phrases
    while (usedPhrases.includes(num)) {
        num = Math.floor(Math.random() * (phrases.length));
    }
    usedPhrases.push(num);
    let phrase = phrases[num];
    let phraseLength = phrase.length;
    //initialize mistake arrays
    //words
    wordCheckerWord = phrase.match(/\w+|\s+|[^\s\w]+/g);
    //letters
    wordCheckerLetter = phrase.split('');
    //numbers
    wordCheckerInt = [];
    let x = 0;
    for (let i = 0; i < wordCheckerWord.length; i++) {
        let tempWordArray = wordCheckerWord[i].split('').map(function (char) {
            if (char != " ") {
                return x;
            }
            else {
                x++;
            }
        });
        wordCheckerInt = wordCheckerInt.concat(tempWordArray);
    }
    //removing spaces from wordcheckerword
    wordCheckerWord = wordCheckerWord.filter(function (x) {
        if (x != " ") {
            return x;
        }
    });
    //reset user input
    userTypedLetter = [];
    //sets reference sentence
    constructSentence(0);
    //creates text boxes
    let typeSentence = document.getElementById("type-sentence");
    typeSentence.innerHTML = "";
    for (let i = 1; i <= phraseLength; i++) {
        let x = i + 1;
        typeSentence.innerHTML += "<input type='text' id='" + i + "' class='letter' maxlength='1' oninput=typeCheck(this,'" + x + "')>";
    }
    //mix keybindings based on how far they are in the game
    mixKeyBindings(countTracker);
    //auto focus on the first text box
    var input = document.getElementById('1');
    input.focus();
}
function constructSentence(count) {
    let sentence = "";
    for (let i = 0; i < wordCheckerLetter.length; i++) {
        if (i < count) {
            sentence += "<span class='typed'>" + wordCheckerLetter[i] + "</span>";
        }
        else {
            sentence += wordCheckerLetter[i];
        }
    }
    let referenceSentence = document.getElementById("reference-sentence");
    referenceSentence.innerHTML = sentence;
}
function typeCheck(current, next) {
    letterCounter++;
    constructSentence(Number(current.id));
    userTypedLetter = userTypedLetter.concat(current.value);
    mistakeCheck(current);
    autotab(current, next);
}
function mistakeCheck(current) {
    let i = Number(current.id) - 1;
    if (userTypedLetter[i].toUpperCase() != wordCheckerLetter[i]) {
        mistakeTracker++;
        letterCounter--;
        if (wordCheckerLetter[i] != " ") {
            berate(wordCheckerWord[wordCheckerInt[i]]);
        }
    }
    let mistakes = document.getElementById("mistakes");
    mistakes.innerHTML = mistakeTracker.toString();
}
function autotab(current, next) {
    if (current.getAttribute && current.value.length == current.getAttribute("maxlength")) {
        current.disabled = true;
        if (document.getElementById(next) != null) {
            document.getElementById(next).focus();
        }
        else {
            if (countTracker < 15) {
                initializePhrase();
            }
            else {
                endGame();
            }
        }
    }
}
//MESSING WITH KEYBINDINGS
function mixKeyBindings(count) {
    const inputElements = document.getElementsByClassName('letter'); //gets the text boxes for the current sentence
    let mixedLetters = [" "];
    let countMixedLetters = Math.floor((count * count) / 30);
    let countUniqueLetters = [...new Set(wordCheckerLetter)].length;
    if (countMixedLetters > countUniqueLetters - 1) {
        countMixedLetters = countUniqueLetters - 1;
    }
    for (let i = 0; i < countMixedLetters; i++) {
        let letter = getRandomLetterInSentence();
        while (mixedLetters.includes(letter)) {
            letter = getRandomLetterInSentence();
        }
        mixedLetters = mixedLetters.concat(letter);
        //prevents typing of the letters
        for (let inputElement of inputElements) {
            inputElement.addEventListener('keydown', function (event) {
                if (event.key === letter.toLowerCase() || event.key === letter.toUpperCase()) {
                    event.preventDefault(); // Prevent the default 'a' character from being entered 
                    inputElement.value += getRandomLetter(letter); // Append custom text 
                    inputElement.dispatchEvent(new Event('input')); //simulates input to go to next textbox
                }
            });
        }
    }
}
//gets random letter from current sentence
function getRandomLetterInSentence() {
    return wordCheckerLetter[Math.floor(Math.random() * wordCheckerLetter.length)];
}
//gets random letter from alphabet
function getRandomLetter(not) {
    const alphabet = 'abcdefghijklmnopqrstuvwxyz'; //generates random letter
    let randomLetter = not;
    while (randomLetter == not) { //makes sure generated letter is not the provided letter
        randomLetter = alphabet[Math.floor(Math.random() * alphabet.length)];
    }
    return randomLetter;
}
//VERBALLY BERATING
function berate(wordMistake) {
    let berateContainer = document.getElementById("berate-container");
    let coords = getRandomCoordinatesOutsideDiv("game-container");
    berateContainer === null || berateContainer === void 0 ? void 0 : berateContainer.innerHTML += ("<div class='disappearingText berate' onmouseover='vanish(this)' style='transform: translate(" + coords.x + "px," + coords.y + "px)'>" + wordMistake + "</div>");
    setTimeout(function () {
        coords = getRandomCoordinatesOutsideDiv("game-container");
        berateContainer === null || berateContainer === void 0 ? void 0 : berateContainer.innerHTML += ("<div class='disappearingText berate' onmouseover='vanish(this)' style='transform: translate(" + coords.x + "px," + coords.y + "px)'>" + wordMistake + "???</div>");
    }, 1000);
}
function getRandomCoordinatesOutsideDiv(divId) {
    // Get the dimensions of the div
    const div = document.getElementById(divId);
    const divRect = div.getBoundingClientRect();
    const divWidth = divRect.width;
    const divHeight = divRect.height;
    // Generate random coordinates
    let x = Math.random() * window.innerWidth;
    let y = Math.random() * window.innerHeight;
    // Check if the coordinates are outside the div
    while (x > divRect.left &&
        x < divRect.left + divWidth &&
        y > divRect.top &&
        y < divRect.top + divHeight) {
        x = Math.random() * window.innerWidth;
        y = Math.random() * window.innerHeight;
    }
    return { x, y };
}
function vanish(current) {
    current.classList.remove('visible');
    current.classList.add('hidden');
}
//WPM calculator
let wpmElement = document.getElementById("wpm");
let wpm = 0;
const wpmInterval = setInterval(function () {
    wpm = Math.floor((letterCounter / 5) * 20);
    wpmElement === null || wpmElement === void 0 ? void 0 : wpmElement.innerHTML = wpm;
    letterCounter = 0;
}, 3000);
//END GAME
function endGame() {
    let referenceSentence = document.getElementById("reference-sentence");
    referenceSentence.style.color = "black";
    referenceSentence.innerHTML = `Your final WPM was: <i>` + wpm + ` WPM</i>. <br> The average adult typing speed is <i>50 WPM.</i><br>`;
    if (wpm < 50) {
        referenceSentence.innerHTML += `<br> If you didn't realize, that means you are <i>` + (50 - wpm) + ` WPM</i> slower than average.`;
    }
    let typeSentence = document.getElementById("type-sentence");
    typeSentence.style.display = "none";
    let restartButton = document.getElementById("restart-button");
    restartButton.style.display = "flex";
    clearInterval(wpmInterval);
}
function homePage() {
    let intro = document.getElementById("intro-page");
    intro.style.display = "block";
    let game = document.getElementById("game-page");
    game.style.display = "none";
    let berateContainer = document.getElementById("berate-container");
    berateContainer === null || berateContainer === void 0 ? void 0 : berateContainer.innerHTML = "";
    let referenceSentence = document.getElementById("reference-sentence");
    referenceSentence.style.color = "#CACACA";
    let typeSentence = document.getElementById("type-sentence");
    typeSentence.style.display = "block";
    countTracker = 0;
    timeTracker = 0;
    mistakeTracker = 0;
    letterCounter = 0;
    let mistakes = document.getElementById("mistakes");
    mistakes.innerHTML = mistakeTracker.toString();
    wpmElement === null || wpmElement === void 0 ? void 0 : wpmElement.innerHTML = 0;
}
window.onload = function () {
    initializePhrase();
};
