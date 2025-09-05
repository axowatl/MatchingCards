// You can modify this array to set your own pairs of labels
// Make sure the total number of labels matches (rows * columns) / 2
let labels = ['Apple', 'Banana', 'Cherry', 'Date', 'Eggplant', 'Fig', 'Grape', 'Honeydew'];

let cards = [];
let firstCard = null;
let secondCard = null;
let lockBoard = false;
let matchesFound = 0;

const board = document.getElementById('game-board');
const statusDiv = document.getElementById('status');

function shuffle(array) {
    for (let i = array.length -1; i >0; i--) {
        const j = Math.floor(Math.random() * (i+1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function startGame() {
// Read grid dimensions
const rows = parseInt(document.getElementById('rows').value);
const columns = parseInt(document.getElementById('columns').value);
const totalCards = rows * columns;

// Check if totalCards is even
if (totalCards % 2 !== 0) {
    alert('Total number of cards must be even.');
    return;
}

// Prepare labels for pairs
const numPairs = totalCards / 2;

if (labels.length < numPairs) {
    alert(`Please add at least ${numPairs} labels in the labels array.`);
    return;
}

// Create the card pairs
cards = [];
for (let i=0; i<numPairs; i++) {
    const label = labels[i];
    // Create two cards for each label
    cards.push({ id: label + Math.random(), value: label, matched: false });
    cards.push({ id: label + Math.random(), value: label, matched: false });
}

// Shuffle cards
shuffle(cards);

// Set grid template
board.style.display = 'grid';
board.style.gridTemplateColumns = `repeat(${columns}, 100px)`;

// Render the board
renderBoard();

// Reset game state
firstCard = null;
secondCard = null;
lockBoard = false;
matchesFound = 0;
statusDiv.textContent = '';
}

function renderBoard() {
board.innerHTML = '';
cards.forEach((card, index) => {
    const cardDiv = document.createElement('div');
    cardDiv.className = 'card';
    cardDiv.dataset.index = index;
    cardDiv.textContent = '';
    cardDiv.addEventListener('click', handleCardClick);
    board.appendChild(cardDiv);
});
}

function handleCardClick(e) {
    if (lockBoard) return;

    const index = e.currentTarget.dataset.index;
    const card = cards[index];
    const cardElement = e.currentTarget;

    if (card.matched || cardElement.classList.contains('flipped')) return;

    flipCard(cardElement, card);

    if (!firstCard) {
        firstCard = { card, element: cardElement };
    } else if (!secondCard && cardElement !== firstCard.element) {
        secondCard = { card, element: cardElement };
        checkForMatch();
    }
}

function flipCard(cardElement, card) {
    cardElement.textContent = card.value;
    cardElement.classList.add('flipped');
}

function unflipCard(cardElement) {
    cardElement.textContent = '';
    cardElement.classList.remove('flipped');
}

function checkForMatch() {
    if (firstCard.card.value === secondCard.card.value) {
        // Match
        firstCard.card.matched = true;
        secondCard.card.matched = true;
        firstCard.element.classList.add('matched');
        secondCard.element.classList.add('matched');
        resetSelection();
        matchesFound++;
        const totalPairs = (parseInt(document.getElementById('rows').value) * parseInt(document.getElementById('columns').value)) /2;
        if (matchesFound === totalPairs) {
        statusDiv.textContent = 'Congratulations! You matched all pairs!';
        }
    } else {
        // Not a match
        lockBoard = true;
        setTimeout(() => {
        unflipCard(firstCard.element);
        unflipCard(secondCard.element);
        resetSelection();
        lockBoard = false;
        }, 1000);
    }
}

function resetSelection() {
    firstCard = null;
    secondCard = null;
}

// Initialize game on page load
window.onload = () => {
    startGame();
};