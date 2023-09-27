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
let countTracker = 0;
let timeTracker = 0;
let mistakeTracker = 0;
//TODO: 
//mess with key bindings
//timer
//mistake counter
//start game
//typing progress on the reference sentence
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
    //https://jsfiddle.net/fEEa7/
    //picks reference sentence
    let referenceSentence = document.getElementById("reference-sentence");
    referenceSentence.innerHTML = phrase;
    //creates text boxes
    let typeSentence = document.getElementById("type-sentence");
    typeSentence.innerHTML = "";
    for (let i = 1; i <= phraseLength; i++) {
        let x = i + 1;
        typeSentence.innerHTML += "<input type='text' id='letter" + i + "' class='letter' maxlength='1' oninput=autotab(this,'letter" + x + "')>";
    }
    //auto focus on the first text box
    var input = document.getElementById('letter1');
    input.focus();
}
function autotab(current, next) {
    if (current.getAttribute && current.value.length == current.getAttribute("maxlength")) {
        current.disabled = true;
        if (document.getElementById(next) != null) {
            document.getElementById(next).focus();
        }
        else {
            initializePhrase();
        }
    }
}
window.onload = function () {
    initializePhrase();
};
