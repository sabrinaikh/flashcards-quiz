let cards = []; // The array to hold flashcards data
let currentIndex = 0; // Index to keep track of the current question
let score = 0; // User's score

// References to HTML elements
const questionBox = document.getElementById("question-box");
const choicesBox = document.getElementById("choices-box");
const feedback = document.getElementById("feedback");
const nextBtn = document.getElementById("next-btn");
const scoreDisplay = document.getElementById("score");
const restartBtn = document.getElementById("restart-btn"); // The restart button

// Shuffle function to randomize an array
function shuffle(array) {
  return array.sort(() => Math.random() - 0.5);
}

// Function to load the next question
function loadQuestion() {
  // Get the current card data
  const currentCard = cards[currentIndex];
  const correctAnswer = currentCard.english; // Correct answer is the "english" value

  // Display the question (the "chinese" term)
  questionBox.textContent = `What is: ${currentCard.chinese}?`;
  feedback.textContent = "";
  nextBtn.style.display = "none"; // Hide the next button initially
  choicesBox.innerHTML = ""; // Clear any previous choices

  // Create an array of wrong answers by selecting other definitions
  const wrongChoices = shuffle(
    cards
      .filter(card => card.english !== correctAnswer) // Exclude correct answer
      .map(card => card.english) // Get only the "english" definitions
  ).slice(0, 3); // Pick only 3 wrong answers

  // Combine the correct answer with the wrong choices
  const allChoices = [correctAnswer, ...wrongChoices];

  // Shuffle the combined choices to randomize their order
  const shuffledChoices = shuffle(allChoices);

  // Add buttons for each choice
  shuffledChoices.forEach(choice => {
    const btn = document.createElement("button");
    btn.textContent = choice;
    btn.onclick = () => {
      if (choice === correctAnswer) {
        feedback.textContent = "✅ Correct!";
        score++;
      } else {
        feedback.textContent = `❌ Wrong. Correct Answer: ${correctAnswer}`;
      }

      // Disable all buttons after an answer is selected
      Array.from(choicesBox.children).forEach(b => b.disabled = true);

      // Show the next button
      nextBtn.style.display = "inline";
      scoreDisplay.textContent = `Score: ${score}/${cards.length}`;
    };
    choicesBox.appendChild(btn);
  });
}

// When "Next" button is clicked, load the next question
nextBtn.onclick = () => {
  currentIndex++;
  if (currentIndex < cards.length) {
    loadQuestion(); // Load the next question
  } else {
    // If no more questions, show the final score
    questionBox.textContent = "🎉 Quiz Finished!";
    choicesBox.innerHTML = "";
    feedback.textContent = `Final Score: ${score}/${cards.length}`;
    nextBtn.style.display = "none"; // Hide the next button when quiz ends
  }
};

// Restart the quiz
function restartQuiz() {
  currentIndex = 0; // Reset to the first question
  score = 0; // Reset score
  scoreDisplay.textContent = `Score: ${score}/${cards.length}`; // Update score display
  feedback.textContent = ""; // Clear feedback
  loadQuestion(); // Load the first question again
}

// Add restart functionality to the button
restartBtn.onclick = restartQuiz;

// Load flashcards from the JSON file and initialize the quiz
document.addEventListener("DOMContentLoaded", () => {
  fetch("flashcards.json")
    .then(res => res.json())
    .then(data => {
      console.log("Loaded flashcards data:", data); // Check the data in the console
      if (!Array.isArray(data) || data.length === 0) {
        console.error("Flashcards data is empty or malformed");
        questionBox.textContent = "⚠️ No flashcards found!";
        return;
      }
      cards = shuffle(data); // Shuffle the flashcards
      currentIndex = 0;
      score = 0;
      loadQuestion(); // Start the quiz
    })
    .catch(err => {
      questionBox.textContent = "⚠️ Failed to load flashcards.";
      console.error("Error loading flashcards.json:", err);
    });
});
