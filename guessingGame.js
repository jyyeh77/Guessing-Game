// JS file for guessing game

/* **** Global Variables **** */
// try to elminate these global variables in your project, these are here just to start.

//$(document).ready(function(){
  var winningNumber = generateWinningNumber();
  console.log(winningNumber);
  var guesses = [];
  var maxGuesses = 5;
  var playersGuess;



  /* **** Guessing Game Functions **** */

  // Generate the Winning Number

  function generateWinningNumber(){
  	// generate random number between 1 and 100
    return Math.floor(Math.random() * 100) + 1;
  }

  // Fetch the Players Guess

  function playersGuessSubmission(){

    playersGuess = parseInt($('#guess').val());
    // need to reset value of guess?

    checkGuess();

  }

  // Determine if the next guess should be a lower or higher number

  function lowerOrHigher(){
  	// add code here
  }

  // Check if the Player's Guess is the winning number

  function checkGuess(){
    var guessCounter = 0;
    var guessesLeft;
    var isDuplicate = checkDuplicate(guesses, playersGuess);

  	var guessDev = Math.abs(winningNumber - playersGuess);
    console.log(guessDev)
    if (guessDev == 0){
      $(document).ready(function(){
        $('#hintbutton').hide();
        $('#status').text("You win!");
      });
    }
    else if (guessDev > 0 && isDuplicate == false) {
      guesses.push(playersGuess);

      guessesLeft = guessCount();
      console.log(guesses);
      $('#status').text("You have " + guessesLeft + " guesses left!");
    }
    else {
      $('#status').text("You have already guessed this!");
    }

  }

  function guessCount(){
    return maxGuesses - guesses.length;
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
  // Create a provide hint button that provides additional clues to the "Player"

  function provideHint(){
  	// add code here
  }


  // Allow the "Player" to Play Again

  function playAgain(){
  	window.location.reload();
  }


  /* **** Event Listeners/Handlers ****  */

//});
