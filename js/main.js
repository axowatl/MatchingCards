const images = ['🍎', '🍌', '🍇', '🍓', '🍍', '🥝', '🍉', '🍑'];
let cards = [];
let firstCard = null;
let secondCard = null;
let lockBoard = false;
let matchesFound = 0;

const board = document.getElementById('game-board');
const statusDiv = document.getElementById('status');

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function initializeGame() {
    // Create pairs of cards
    cards = [];
    images.forEach((img) => {
        cards.push({ id: img + Math.random(), value: img, matched: false });
        cards.push({ id: img + Math.random(), value: img, matched: false });
    });
    shuffle(cards);
    renderBoard();
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
    if (card.matched || e.currentTarget.classList.contains('flipped')) return;

    flipCard(e.currentTarget, card);

    if (!firstCard) {
        firstCard = { card, element: e.currentTarget };
    } else if (!secondCard && e.currentTarget !== firstCard.element) {
        secondCard = { card, element: e.currentTarget };
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
        // Match found
        firstCard.card.matched = true;
        secondCard.card.matched = true;
        firstCard.element.classList.add('matched');
        secondCard.element.classList.add('matched');
        resetSelection();
        matchesFound++;
        if (matchesFound === images.length) {
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
window.onload = initializeGame;