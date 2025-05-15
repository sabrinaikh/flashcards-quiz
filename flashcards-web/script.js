let flashcards = [];
let currentIndex = 0;

fetch('flashcards.json')
  .then(response => response.json())
  .then(data => {
    flashcards = data;
    showCard();
  });

function showCard() {
  const card = flashcards[currentIndex];
  document.getElementById("chinese-word").textContent = card.chinese;
  document.getElementById("english-meaning").textContent = card.english;
  document.getElementById("english-meaning").classList.add("hidden");
}

function showMeaning() {
  document.getElementById("english-meaning").classList.remove("hidden");
}

function nextCard() {
  currentIndex = (currentIndex + 1) % flashcards.length;
  showCard();
}

function prevCard() {
    currentIndex = (currentIndex - 1 + flashcards.length) % flashcards.length;
    showCard(currentIndex);
  }