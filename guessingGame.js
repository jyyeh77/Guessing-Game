// JS file for guessing game

/* **** Global Variables **** */

var playersGuess;

// Alternative to using global variables
var globalNamespace = function(guesses, storage){
    this.winningNumber = generateWinningNumber();
    this.guesses = guesses;
    this.storage = storage;
  };

// stores max guesses and previous guesses in array parameter
var generator = new globalNamespace(5, []);

console.log(generator.winningNumber);

/* **** Guessing Game Functions **** */

// Generate the Winning Number

function generateWinningNumber(){
	// generate random number between 1 and 100
  return Math.floor(Math.random() * 100) + 1;
}

// Fetch the Players Guess

function playersGuessSubmission(){

  $('hintBox').hide();
  // converts text box string input into integer
  playersGuess = parseInt($('#guess').val());

  // check that player's guess is between 1 and 100
  if (range(playersGuess, 1, 100) === true) {

    checkGuess();
    guessDisplay();
  }
  else {
    $('#status').text("Riddles are hard, but not THAT hard!");
  }
}

// Returns absolute distance between player's guess and winning number

function absDistance(){
  return Math.abs(generator.winningNumber - playersGuess);
}

// Determine if the next guess should be a lower or higher number

function lowerOrHigher(){
  var scope;
	var distance = generator.winningNumber - playersGuess;

  if (distance < 0){
    scope = "higher";
  }
  else if (distance > 0){
    scope = "lower";
  }
  return scope;
}

// Alerts player if their guess is hot or cold

function temperature(distance){
  var distanceRanges = {coldest:99,
                        colder: 75,
                        cold:50,
                        hot:25,
                        hotter:10,
                        hottest:5,
                        blazing:1};

   var storage = {};
   for (var key in distanceRanges){
       for (var keyCopy in distanceRanges){
            if (range(distance, distanceRanges[key], distanceRanges[keyCopy])){
                  storage[distance] = [keyCopy, distanceRanges[keyCopy]];
            }
        }
    }
    return storage;
}

// Tests if number is in between a certain range

function range(num, start, end){
  return (num >= start && num <= end);
}

// Check if the Player's Guess is the winning number

function checkGuess(){
  var guessesLeft;
  var isDuplicate = checkDuplicate(generator.storage, playersGuess);

  // player wins if guess matches random winning number
  if (absDistance() == 0){
    $(document).ready(function(){
      $('h2').hide();
      $('#hintbutton').hide();
      $('form').hide();
      $('#status').text("You win!");
      $('h1').append('<img id="victory" src="http://media.philly.com/images/The-Dark-Knight-Rises-Trailer-fan-made.jpg"/>');
      $('#main').append('<p id="victorytext">Victory is yours, Batman.</p>');
    });
  }

  // if player's guess isn't the winning number and isn't a duplicate
  else if (absDistance() > 0 && isDuplicate == false) {
    generator.storage.push(playersGuess);
    guessesLeft = guessCount();

    if (guessesLeft > 0){
      // checks for 'temperature' and range of player guess
      var runTemp = temperature(absDistance());
      var checkTemp = runTemp[absDistance()][0];
      var numRange = runTemp[absDistance()][1];

      $('#status').text("Try again! Your guess was " + lowerOrHigher() + " than the actual number and in the " + checkTemp + " range, within " + numRange + " of the winning number!");
      $('#guessTracker').text("Guesses left: " + guessesLeft);
    }

    // player loses when guessesLeft becomes 0
    else {
      $('#status').text("YOU LOSE! Gotham is doomed")
      $('#guessTracker').text("Guesses left: " + guessesLeft);
      $('form').hide();
      $('h2').hide();
      $('h1').append('<img id="defeat" src="http://img.cinemablend.com/cb/9/7/c/5/1/4/97c5142f33b4a0319907dd2033e13701f69e7e6094d22bbc57c150b3be0a1273.jpg"/>');
      $('#main').append('<p id="defeattext">Riddle me this, Batman. Who lost? YOU DID!</p>');
    }
  }
  else {
    $('#status').text("You have already guessed this!");
  }
}

// counts number of guesses

function guessCount(){
  return generator.guesses - generator.storage.length;
}

// checks for guess duplicates

function checkDuplicate(arr, guess){
  if (arr.indexOf(guess) > -1){
    return true;
  }
  else {
    return false;
  }
}

// displays previously entered guesses

function guessDisplay(){
  var strGuesses = generator.storage.join(", ");

  if (generator.storage.length > 0){
    $(document).ready(function(){
      $('#prevGuesses').text("Previous Guesses: " + strGuesses);
    })
  }
}

// Create a provide hint button that provides additional clues to the "Player"

function provideHint(num){
  $('#hintBox').show();
  var hintsArray = [];

  for (var i = 0; i < num; i++){
    if (i === Math.floor(num / 2)){
      hintsArray.push(generator.winningNumber);
    }
    else {
      hintsArray.push(Math.floor(Math.random() * 100) + 1);
    }
  }
  hintsArray = shuffle(hintsArray);
  $('#hintBox').text("One of these is the winning number, Dark Knight: choose carefully! " + hintsArray);
}


// Shuffles input array for hints

function shuffle(arr){
  var size = arr.length;
  var present;
  var temp;

  for (var i = 0; i < size; i++){

    // randomly generates a index
    present = Math.floor(Math.random() * size);

    // stores current element
    temp = arr[i];

    // assigns current element to random element in array
    arr[i] = arr[present];

    // sets random element to current element
    arr[present] = temp;

  }
  return arr;
}

// Allow the "Player" to Play Again

function playAgain(){
	window.location.reload();
}


/* **** Event Listeners/Handlers ****  */

$(document).ready(function(){

  $('#hintBox').hide();
  // allows player to use enter key instead of clicking to submit guess
  $('#guess').on("keypress", function(e) {
     var code = (e.keyCode ? e.keyCode : e.which);
     if (code == 13) {
        e.preventDefault();
        e.stopPropagation();
        $('#submitButton').submit(playersGuessSubmission());
     }
  });

  // runs game engine on inputted number
  $('#submitButton').on('click', playersGuessSubmission);

  // provides hint if hint button clicked
  $('#hintbutton').on('click', function(){
    provideHint(guessCount());
  });

  //restarts Game
  $('#restart').on('click', playAgain);
})
