
/*---------------------------------------- Variables Defined---------------------------------------- */
// List of icon classes for cards that are displayed in the game
const iconClassArray = [
    "fa fa-diamond",
    "fa fa-diamond",
    "fa fa-paper-plane-o",
    "fa fa-paper-plane-o",
    "fa fa-anchor",
    "fa fa-anchor",
    "fa fa-cube",
    "fa fa-cube",
    "fa fa-leaf",
    "fa fa-leaf",
    "fa fa-bolt",
    "fa fa-bolt",
    "fa fa-bomb",
    "fa fa-bomb",
    "fa fa-bicycle",
    "fa fa-bicycle"
];

// list for holding open/show/match classes of the cards
let liClassArray = [
    'card',
    'card',
    'card',
    'card',
    'card',
    'card',
    'card',
    'card',
    'card',
    'card',
    'card',
    'card',
    'card',
    'card',
    'card',
    'card',
];

// Variables used for generating the deck, calculating the star rating, number of matches made and total time taken to complete the game
let liElement = '';
let starElement = '';
let matchesMade = 0;
let moveCounter = 0;
let totalTime = '';
let starRating = '';
let myTimer = '';

// arrays for matching two cards at a time and updating the game state after every selection
let cardsSelected = [];
let indexArray = [];

/*--------------------------- BUTTONS TO START AND RESTART THE GAME--------------------------- */

// Start Button - used to start the game at the beginning i.e. when the screen refreshes
const startButton = document.querySelector("#start");
startButton.addEventListener('click',startGame,true);

// Reset Button - used to end the game midway and reset to original state
const resetButton = document.querySelector("#reset");
resetButton.addEventListener('click', function() {
    if (matchesMade!==8) {
        endGameMidway();
    }
});

/* ---------------------------------FUNCTIONS USED--------------------------------------------- */

// Removes the click handler on the Start Button during gameplay
function disableStartButton() {
    startButton.removeEventListener('click',startGame,true);
    startButton.setAttribute("disabled","");
}

// Function to generate the game board
function generateDeck() {
    const shuffledIconArray = shuffle(iconClassArray);
    // generate the array holding the deck of cards
    for(let i=0; i<liClassArray.length; i++) {
        liElement += `<li class="${liClassArray[i]}">
                        <i class="${shuffledIconArray[i]}"></i>
                      </li>`;
    }
    let deckElement = document.querySelector(".deck");
    deckElement.innerHTML =  liElement;
    // generate the array for star rating
    for(let j=1; j<=5; j++) {
        starElement += `<li><i class="fa fa-star"></i></li>`;
    }
    let ratingElement = document.querySelector(".stars");
    ratingElement.innerHTML =  starElement;
}

// Function to shuffle the cards ---- as provided by Udacity (from Stack Exchange)
function shuffle(array) {
    let currentIndex = array.length, temporaryValue, randomIndex;
    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
    return array;
}

// Adding selected cards to an array containing two cards that need to be compared, as well as the index of elements in the cards state array that need to be updated
function addCard(cardEl, index) {
    cardsSelected.push(cardEl);
    indexArray.push(index);
}

// Displaying the card that is clicked
function displayCard(cardEl,index) {
    // Logs the card's current visibility status to the cards state array
    updateCardArrayOnShow(index);
    // Adds classes to the card's class list which makes them appear visible
    cardEl.classList.add("open", "show");
    // trial-- add animation
}

// Logic used after comparing selected cards symbols: if the two cards match, update the classes on both cards such that their css reflect match
function matchCard() {
    for (let k = 0; k < 2; k++) {
        // Logs the card's current match status to the cards state array
        updateCardArrayOnMatch(indexArray[k]);
        // Adds classes to the card's class list which makes them appear matched
        cardsSelected[k].classList.remove("open", "show");
        cardsSelected[k].classList.add("match");
    }
    matchesMade++;
}

// Hiding the card(s) that are clicked
function hideCard() {
    for (let l=0; l<2;l++) {
        // Logs the card's current hidden status to the cards state array
        updateCardArrayOnHide(indexArray[l]);
        // Adds classes to the card's class list which makes them appear hidden i.e. return them to their original state
        cardsSelected[l].classList.remove("open", "show");
    }
}

// Removes card and index from the comparison array and index holder array respectively
function removeCards() {
    cardsSelected = [];
    indexArray = [];
}

// Three action functions that are used to update game state in the cards state array
function updateCardArrayOnShow(index) {
    liClassArray[index] = "card open show";
}
function updateCardArrayOnHide(index) {
    liClassArray[index] = "card"
}
function updateCardArrayOnMatch(index) {
    liClassArray[index] = "card match"
}

// Function used to count the number of moves made
function countMoves() {
    // Incrementing the move counter after each move i.e after selecting two cards that may or may not match
    moveCounter++;
    let moveCountHTML = document.querySelector(".moves");
    // Update the number of moves in the HTML
    moveCountHTML.textContent = moveCounter;
    // Calling a function to update the star rating of the player for the current game
    updateStars(moveCounter)
}

// Function to determine star rating
function updateStars(moveCounter) {
    let starsArray = document.querySelector('.stars');
    // In order to decrement the star rating after a particular number of moves have been played i.e. after 11 moves, the rating drops from 5 to 4 stars etc.
    if (moveCounter===11 || moveCounter===21 || moveCounter===31 || moveCounter===41) {
        starsArray.removeChild(starsArray.firstElementChild);
        starRating = starsArray.childNodes.length;
    } else {
        starRating = starsArray.childNodes.length;
    }
}

// Timer to measure the amount of time taken to finish the game in MM:SS
function startTimer() {
    let seconds = 0;
    let secondsCalc = '';
    let minutesCalc = '';
    myTimer = setInterval(function() {
        seconds++;
        secondsCalc = (seconds%60).toString();
        if (secondsCalc<10) {
            secondsCalc = "0" + secondsCalc;
        }
        minutesCalc = (Math.floor(seconds/60)).toString();
        if (minutesCalc<10) {
            minutesCalc = "0" + minutesCalc;
        }
        totalTime = minutesCalc + " : " + secondsCalc;
        document.querySelector(".timer").textContent = totalTime;
    },1000);
}

// Function to stop and clear the timer when the game ends and upon reset
function stopTimer() {
    clearInterval(myTimer);
}

// The logic of the game
function gameLogic() {
    let cardClickArray = document.querySelectorAll(".card");
    cardClickArray.forEach(function(cardEl, index) {
        cardEl.addEventListener('click', function() {
            // Ensuring that only closed cards are selected to be opened AND only two cards are chosen at a time i.e.
            // to prevent the accidental third click
            if (cardEl.classList.value === "card" && cardsSelected.length < 2) {
                addCard(cardEl,index);
                displayCard(cardEl,index);
            }
            // Ensuring that the second card selected is visible for before they both close in case of non-match
            setTimeout(function() {
                if (cardsSelected.length===2) {
                    let typeFirstCard = cardsSelected[0].firstElementChild.classList.value;
                    let typeSecondCard = cardsSelected[1].firstElementChild.classList.value;
                    // If the icon on the cards selected are the same, then they match and need to reflect that, or
                    // else, they don't match and need to be closed
                    if (typeFirstCard === typeSecondCard) {
                        matchCard(typeFirstCard,typeSecondCard)
                    } else {
                        hideCard();
                    }
                    // Update the move counter
                    countMoves();
                    removeCards();
                    // Adding another time out, to ensure that the match status of the last pair is reflected before
                    // the "Congratulations" modal is displayed
                    setTimeout(function() {
                        if (matchesMade===8) {
                            endGame();
                        }
                    },500);
                }
            },500)
        });
    });
}

// Function to start the game
function startGame () {
    // Function here to disable the start button while game is being played
    disableStartButton();
    // Generate the deck
    generateDeck();
    // Start the timer
    startTimer();
    // Start the game logic-- i.e. user can interact with the board
    gameLogic();
}

// Function that ends the game
function endGame() {
    stopTimer();
    let starRatingDisplay = '';
    if (starRating===1) {
        starRatingDisplay = starRating.toString() + " star";
    } else {
        starRatingDisplay = starRating.toString() + " stars";
    }
    // Using modal from Bootstrap
    let replyHeader = "CONGRATULATIONS!!! YOU WIN!!!";
    let modalHeaderHTML = document.querySelector(".modal-title");
    modalHeaderHTML.innerHTML = replyHeader;
    let reply = `Time taken to complete game: ${totalTime} <br>
                 Star Rating: ${starRatingDisplay} <br>
                 Moves made: ${moveCounter} <br><br>
                 Would you like to play again?`;
    let modalMessageHTML = document.querySelector(".modal-message");
    modalMessageHTML.innerHTML = reply;
    $('#myModal').modal();
    // Modal provides the option for user to play again using the "OK" button in the modal dialogue
    let playAgain = document.querySelector("#play-again");
    playAgain.addEventListener('click',function(){
        reset();
        $('#myModal').modal('hide');
    });
    // Modal provides the option of not playing again, in which case, the final board, time, moves and star-rating are
    // displayed as is on screen
    let playCancel = document.querySelector("#stop-playing");
    playCancel.addEventListener('click', function() {
        $('#myModal').modal('hide');
    });
}

// Function to end midway
function endGameMidway() {
    stopTimer();
    reset();
}

// Reset function
function reset() {
    // Reseting all variables to their inital states
    liClassArray = [
        'card',
        'card',
        'card',
        'card',
        'card',
        'card',
        'card',
        'card',
        'card',
        'card',
        'card',
        'card',
        'card',
        'card',
        'card',
        'card',
    ];
    liElement = '';
    starElement = '';
    matchesMade = 0;
    moveCounter = 0;
    totalTime = '';
    starRating = '';
    myTimer = '';
    cardsSelected = [];
    indexArray = [];
    // To reset all the displayed blocks from the HTML to their original values
    document.querySelector(".timer").textContent = "00:00";
    document.querySelector(".moves").textContent = "0";
    // Make sure that 5 stars are displayed at every rest
    let starDestroy = document.querySelector(".stars");
    while (starDestroy.firstChild) {
        starDestroy.removeChild(starDestroy.firstChild)
    }
    // Make sure old cards are destroyed before showing a new set
    let deckDestroy = document.querySelector(".deck");
    while (deckDestroy.firstChild) {
        deckDestroy.removeChild(deckDestroy.firstChild)
    }
    // Shuffle the cards
    shuffle(iconClassArray);
    // Start the game again
    startGame();
}
