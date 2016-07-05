// JS file for guessing game

/* **** Global Variables **** */

var playersGuess;

// Alternative to using global variables
var globalNamespace = function(guesses, storage, hints){
    this.winningNumber = generateWinningNumber();
    this.guesses = guesses;
    this.storage = storage;
    this.hints = hints;
  };

// stores max guesses and previous guesses in array parameter
var generator = new globalNamespace(5, [], 0);


/* **** Guessing Game Functions **** */

// Generate the Winning Number

function generateWinningNumber(){
	// generate random number between 1 and 100
  return Math.floor(Math.random() * 100) + 1;
}

// Fetch the Players Guess

function playersGuessSubmission(){

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

   // object to hold closest marker of guess
   var storage = {};

   // finds closest range of guess by iterating through each property of distanceRanges
   for (var key in distanceRanges){
       for (var keyCopy in distanceRanges){

            // updates storage object with the closest distanceRanges property
            if (range(distance, distanceRanges[key], distanceRanges[keyCopy])){
                  storage[distance] = [keyCopy, distanceRanges[keyCopy]];
            }
        }
    }

    // returns storage object in format {guess distance: [temperature, closest numerical marker]}
    return storage;
}

// Tests if number is in between a certain range

function range(num, start, end){
  return (num >= start && num <= end);
}

// Check if the Player's Guess is the winning number

function checkGuess(){
  var guessesLeft;

  // checks for duplicate guesses
  var isDuplicate = checkDuplicate(generator.storage, playersGuess);

  // player wins if guess matches random winning number
  if (absDistance() == 0){
    winnerDOM();
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
      loserDOM();
    }
  }
  else {
    $('#status').text("You have already guessed this!");
  }
}

// updates DOM to show victory

function winnerDOM(){
  $(document).ready(function(){
    $('h2').hide();
    $('#hintbutton').hide();
    $('#hintBox').hide();
    $('form').hide();
    $('#status').text("You win!");
    $('h1').append('<img id="victory" src="http://media.philly.com/images/The-Dark-Knight-Rises-Trailer-fan-made.jpg"/>');
    $('#main').append('<p id="victorytext">Victory is yours, Batman.</p>');
  });
}

// updates DOM to show defeat

function loserDOM(){
  $(document).ready(function(){
    $('#status').text("YOU LOSE! Gotham is doomed")
    $('#guessTracker').text("Guesses left: " + "0");
    $('hintButton').hide();
    $('hintBox').hide();
    $('form').hide();
    $('h2').hide();
    $('h1').append('<img id="defeat" src="http://img.cinemablend.com/cb/9/7/c/5/1/4/97c5142f33b4a0319907dd2033e13701f69e7e6094d22bbc57c150b3be0a1273.jpg"/>');
    $('#main').append('<p id="defeattext">Riddle me this, Batman. Who lost? YOU DID!</p>');

  });
}
// counts number of guesses

function guessCount(){
  return generator.guesses - generator.storage.length - generator.hints;
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

  // increments number of hints used
  generator.hints++;

  var hintsArray = [];

  // creates Array with the winning number included between random numbers from 1 to 100
  for (var i = 0; i < num; i++){

    // puts winning number in middle of array
    if (i === Math.floor(num / 2)){
      hintsArray.push(generator.winningNumber);
    }
    else {
      hintsArray.push(Math.floor(Math.random() * 100) + 1);
    }
  }

  // shuffles array with winning number
  hintsArray = shuffle(hintsArray);

  // updates DOM to show array with hint numbers if there are guesses left
  if (guessCount() > 0){

    $('#hintBox').text("One of these is the winning number, Dark Knight: choose carefully! " + hintsArray.join(', '));
    $('#guessTracker').text("Guesses Left: " + guessCount());
  }

  // hides hint button if there are no guesses left and uploads defeat message
  else {
    $('#guessTracker').text("Guesses Left: " + guessCount());
    $('#hintbutton').hide();
    $('#hintBox').hide();
    loserDOM();
  }

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


  // allows player to use enter key instead of clicking to submit guess
  $('#guess').on("keypress", function(e) {
     var code = (e.keyCode ? e.keyCode : e.which);
     if (code == 13) {

        // prevents implicit submission when pressing Enter key in HTML form
        e.preventDefault();
        e.stopPropagation();
        $('#submitButton').submit(playersGuessSubmission());
     }
  });

  // runs game engine on inputted number
  $('#submitButton').on('click', playersGuessSubmission);

  // provides hint if hint button clicked
  $('#hintbutton').on('click', function(){
    provideHint(guessCount()+1);

  });

  //restarts Game
  $('#restart').on('click', playAgain);
})
