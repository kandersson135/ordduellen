$(document).ready(function() {
  var categories = ["Djur", "Mat", "Städer", "Färger", "Sporter", "Fordon", "Länder", "Yrken", "Musikinstrument", "Trädgård", "Kroppen", "Hemma", "Pokémon", "Klädesplagg", "Möbler" , "Verktyg", "Spel"];
  var timer;
  var countdownSeconds = 300;
  var success = new Audio('audio/success.mp3');
  var spinAudio = new Audio('audio/spin.mp3');
  success.volume = 0.3;
  spinAudio.volume = 0.3;
  spinAudio.loop = false;

  var previousWord = '';
  var currentPlayer = 1;
  var playerNames = {
    1: '',
    2: ''
  };
  var playerScores = {
    1: 0,
    2: 0
  };
  var playerWords = {
        1: [],
        2: []
    };
  var winningScore = 50;

  // Function to start the game
  function startGame() {
    playerNames[1] = $('#player1-name').val().trim() || 'Spelare 1';
    playerNames[2] = $('#player2-name').val().trim() || 'Spelare 2';

    $('#setup-container').hide();
    $('#game-container').show();

    $('#message').hide();
    $('#message').text(playerNames[currentPlayer] + "'s tur");
    $('#message').fadeIn(400).delay(2000).fadeOut(400);
    $('#turn-arrow').html('&#11104;');
    updateScoreboard();
    updateProgressBars();

    // Set focus to the input field
    $('#word-input').focus();

    /* spin for a random category */
    spin();

    /* start timer */
    startTimer();

    // Check for winner every second
    //setInterval(checkForWinner, 1000);
  }

  function startTimer() {
    var startTime = new Date().getTime();
    var endTime = startTime + countdownSeconds * 1000;

    timer = setInterval(function() {
      var now = new Date().getTime();
      var remainingTime = Math.max(0, endTime - now);

      if (remainingTime <= 0) {
        clearInterval(timer);
        endGame();
      }

      updateTimer(remainingTime);
    }, 1000);
  }

  function updateTimer(remainingTime) {
    var minutes = Math.floor(remainingTime / (1000 * 60));
    var seconds = Math.floor((remainingTime % (1000 * 60)) / 1000);
    seconds = seconds < 10 ? "0" + seconds : seconds;
    var timerDisplay = minutes + ":" + seconds;
    $('#countdown').text(timerDisplay);
  }

  // Function to check if the word is valid and associated with the previous word
  /*
  function checkWord(word) {
    if (!/^[a-zA-ZåäöÅÄÖ]+$/.test(word)) {
      return false; // Return false if input contains non-letter characters
    }

    if (previousWord === '') {
      console.log("Previous word: " + previousWord);
      previousWord = word;
      return true;
    } else {
      var lastLetter = previousWord.slice(-1).toLowerCase();
      var firstLetter = word.charAt(0).toLowerCase();
      if (lastLetter === firstLetter) {
        previousWord = word;
        return true;
      } else {
        console.log("Previous word: " + previousWord);
        return false;
      }
    }
  }
  */

  /*
  function checkWord(word) {
    if (!/^[a-zA-ZåäöÅÄÖ]+$/.test(word)) {
      $('#message').text('Ange ett giltigt ord'); // Display error message for non-letter characters
      return false; // Return false if input contains non-letter characters
    }

    if (previousWord === '') {
      previousWord = word;
      return true;
    } else {
      var lastLetter = previousWord.slice(-1).toLowerCase();
      var firstLetter = word.charAt(0).toLowerCase();
      if (lastLetter === firstLetter) {
        if (playerWords[currentPlayer].includes(word)) {
          $('#message').text('Du har redan använt det ordet'); // Display error message for previously used words
          return false; // Return false if the word has already been used
        } else {
          previousWord = word;
          return true;
        }
      } else {
        $('#message').text('Ordet måste börja med samma bokstav som föregående ord'); // Display error message for invalid word sequence
        return false;
      }
    }
  }
  */

  //
  function checkWord(word) {
    //if (!/^[a-zA-ZåäöÅÄÖ\s]+$/.test(word)) {
    if (!/^[a-zA-ZåäöÅÄÖ]+$/.test(word)) {
      $('#message').text('Ange ett giltigt ord'); // Display error message for non-letter characters
      $('#message').fadeIn(400).delay(2000).fadeOut(400);
      $('#word-input').addClass('shake');
        setTimeout(function(){
          $('#word-input').removeClass('shake');
        },300);
      return false; // Return false if input contains non-letter characters
    }

    if (previousWord === '') {
      previousWord = word;
      return true;
    } else {
      if (playerWords[1].includes(word) || playerWords[2].includes(word)) {
        $('#message').text('Ordet har redan använts'); // Display error message for previously used words
        $('#message').fadeIn(400).delay(2000).fadeOut(400);
        $('#word-input').addClass('shake');
        setTimeout(function(){
          $('#word-input').removeClass('shake');
        },300);
        return false; // Return false if the word has already been used
      } else {
        previousWord = word;
        return true;
      }
    }
  }

  // Function to switch players
  function switchPlayers() {
    currentPlayer = currentPlayer === 1 ? 2 : 1;
    $('#turn-arrow').html(currentPlayer === 1 ? '&#11104;' : '&#11106;');
    //$('#message').text(playerNames[currentPlayer] + "'s tur");
    //$('#message').fadeIn(1000).delay(2000).fadeOut(1000);
  }

  // Function to update the scoreboard
  function updateScoreboard() {
    //$('#player1-score').text(playerNames[1] + ': ' + playerScores[1] + '/' + winningScore);
    //$('#player2-score').text(playerNames[2] + ': ' + playerScores[2] + '/' + winningScore);

    $('#player1-score').text(playerNames[1] + ': ' + playerScores[1].toString().padStart(6, '0'));
    $('#player2-score').text(playerNames[2] + ': ' + playerScores[2].toString().padStart(6, '0'));
  }

  // Function to update progress bars
  function updateProgressBars() {
    var progressPercentage1 = (playerScores[1] / winningScore) * 100;
    var progressPercentage2 = (playerScores[2] / winningScore) * 100;

    //$('#progress-label-player1').text(' (' + playerScores[1] + '/' + winningScore + ')');
    //$('#progress-label-player2').text(' (' + playerScores[2] + '/' + winningScore + ')');

    $('#progress-player1').find('span').css('width', progressPercentage1 + '%');
    $('#progress-player2').find('span').css('width', progressPercentage2 + '%');
  }

  // Function to check if a player has reached the winning score
  function checkForWinner() {
    if (playerScores[1] >= winningScore || playerScores[2] >= winningScore) {
      var winner = playerScores[1] >= winningScore ? playerNames[1] : playerNames[2];
      //$('#message').text('Vinnaren är ' + winner + '!');
      //swal("Spelet är slut", "Vinnaren är " + winner + "!");
  	  swal("Spelet är slut", "Vinnaren är " + winner + "!")
  		.then((value) => {
  			location.reload(); // Reload the page
  		});
      $('#submit-word-btn').prop('disabled', true);
    }
  }

  function endGame() {
    if (playerScores[1] > playerScores[2]) {
      swal("Spelet är slut", "Vinnaren är " + playerNames[1] + "!")
  		.then((value) => {
  			location.reload(); // Reload the page
  		});
    } else if (playerScores[2] > playerScores[1]) {
      swal("Spelet är slut", "Vinnaren är " + playerNames[2] + "!")
  		.then((value) => {
  			location.reload(); // Reload the page
  		});
    } else {
      swal("Spelet är slut", "Det är oavgjort!")
  		.then((value) => {
  			location.reload(); // Reload the page
  		});
    }
  }

  // Event listener for start game button
  $('#start-game-btn').click(startGame);

  // Event listener for word submission by clicking the submit button
  $('#submit-word-btn').click(submitWord);

  // Event listener for word submission by pressing the Enter key
  $('#word-input').keyup(function(event) {
    if (event.keyCode === 13) {
      submitWord();
    }
  });

  // Function to handle word submission
  /*
  function submitWord() {
    var word = $('#word-input').val().trim();
    if (word !== '') {
      if (checkWord(word)) {
        /*
        success.play();

        var wordLength = word.length;
        playerScores[currentPlayer] += wordLength;
        switchPlayers();
        $('#word-display').text(word);
        $('#word-input').val('');
        $('#word-input').focus();
        updateScoreboard();
        updateProgressBars();


        // Check if the word has already been submitted by the current player
        if (playerWords[currentPlayer].includes(word)) {
            $('#message').text('Du har redan använt det ordet');
        } else {
            success.play();
            var wordLength = word.length;
            playerScores[currentPlayer] += wordLength;
            playerWords[currentPlayer].push(word);
            switchPlayers();
            $('#word-display').text(word);
            $('#word-input').val('');
            $('#word-input').focus();
            updateScoreboard();
            updateProgressBars();
            displayPlayerWords();

            console.log("Word submit: " + word);
        }

      } else {
        $('#message').text('Ange ett giltigt ord');
      }
    }
  }
  */

  function submitWord() {
    var word = $('#word-input').val().trim();
    if (word !== '') {
      if (checkWord(word)) {
        success.play();
        var wordLength = word.length;
        playerScores[currentPlayer] += wordLength;
        playerWords[currentPlayer].push(word);
        switchPlayers();
        //$('#word-display').text(word);
        $('#word-input').val('');
        $('#word-input').focus();
        updateScoreboard();
        updateProgressBars();
        displayPlayerWords();
      }
    }
  }

  // Function to display player words
  function displayPlayerWords() {
    $('#player1-words').empty();
    $('#player2-words').empty();

    playerWords[1].forEach(function(word) {
        $('#player1-words').prepend('<li>' + word + '</li>');
    });

    playerWords[2].forEach(function(word) {
        $('#player2-words').prepend('<li>' + word + '</li>');
    });
  }

  function spin() {
    var wordElement = $('#category span');

    spinAudio.play();

    var currentIndex = 0;
    var spinInterval = setInterval(function() {
        wordElement.text(categories[currentIndex]);
        currentIndex = (currentIndex + 1) % categories.length;
    }, 100);

    // Stop spinning after 2 seconds
    setTimeout(function() {
        clearInterval(spinInterval);
        // Display random category
        var randomIndex = Math.floor(Math.random() * categories.length);
        var word = categories[randomIndex];
        wordElement.text(word);
    }, 2200);
  }

  // How to play button click
  $('#how-to-btn').click(function() {
    //swal("Hur du spelar", "Utmana dina vänner i detta roliga ordspel. Samla poäng genom att skriva in ord som passar i den aktuella kategorin. Den som har mest poäng när tiden är slut vinner spelet!");
    swal("Hur du spelar", "Ordduellen är den ultimata ordspelsutmaningen där du kan testa dina språkkunskaper mot dina vänner. Samla poäng genom att snabbt och smart komma på ord som passar in i den givna kategorin. Med tiden mot dig är det en kamp mot klockan för att samla så många poäng som möjligt. \n\n Spännande och underhållande, Ordduellen är det perfekta spelet för alla ordentusiaster där ute. Är du redo att ta på dig utmaningen och bli mästaren av ord?");
  });

  // Credits button click
  $('#credits-btn').click(function() {
    swal("Om spelet", "Spelet är skapat av Kim Andersson.");
  });
});
