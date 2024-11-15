// Initialize the audio element with the sample snippet
const audio = new Audio("audio/sample.mp3");

// Set the correct answer for the game (change to your chosen song or artist)
const correctAnswer = "sample song";  // Example answer, change as needed

// Game variables
let attempts = 5;

// Play the audio snippet when the "Play Snippet" button is clicked
document.getElementById("playButton").addEventListener("click", () => {
  audio.currentTime = 0;  // Reset to start if replayed
  audio.play();
});

// Handle the guess submission
document.getElementById("submitGuess").addEventListener("click", () => {
  const userGuess = document.getElementById("guessInput").value.toLowerCase();
  
  if (userGuess === correctAnswer.toLowerCase()) {
    document.getElementById("feedback").innerText = "Correct! 🎉";
    document.getElementById("attemptsLeft").innerText = "0";
  } else {
    attempts--;
    document.getElementById("feedback").innerText = "Incorrect, try again!";
    document.getElementById("attemptsLeft").innerText = attempts;
    
    if (attempts <= 0) {
      document.getElementById("feedback").innerText = `Out of attempts! The answer was: ${correctAnswer}`;
      document.getElementById("submitGuess").disabled = true;
      document.getElementById("playButton").disabled = true;
    }
  }

  // Clear the input for the next guess
  document.getElementById("guessInput").value = "";
});
