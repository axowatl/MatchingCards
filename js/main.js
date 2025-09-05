// Setup canvas
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const board = new Board();

// Add some cards
const texts = ['A', 'B', 'C', 'A', 'B', 'C'];
// Shuffle array for randomness
texts.sort(() => Math.random() - 0.5);
texts.forEach((text, index) => {
    const x = 100 + (index % 3) * 100;
    const y = 100 + Math.floor(index / 3) * 150;
    board.addCard(new Card(x, y, text));
});

// Handle clicks
canvas.addEventListener('click', (e) => {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    board.handleClick(x, y);
});

// Game loop
function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    board.update(0.016); // assuming 60 FPS, so ~16ms per frame
    board.render(ctx);
    requestAnimationFrame(gameLoop);
}

gameLoop();