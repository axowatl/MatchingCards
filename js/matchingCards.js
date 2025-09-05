export class Board {
    constructor() {
        this.cards = [];
        this.selectedCards = [];
    }

    addCard(card) {
        this.cards.push(card);
    }

    /**
     * Handle click event to select cards
     * @param {number} x
     * @param {number} y
     */
    handleClick(x, y) {
        for (let card of this.cards) {
            if (
                x >= card.x - card.width / 2 &&
                x <= card.x + card.width / 2 &&
                y >= card.y - card.height / 2 &&
                y <= card.y + card.height / 2
            ) {
                if (!card.isFaceUp && !card.isMatched && this.selectedCards.length < 2) {
                    card.flipProgress = 0; // start flip animation
                    card.isFaceUp = false; // will be set after flip animation
                    this.selectedCards.push(card);
                }
                break;
            }
        }
    }

    /**
     * Update all cards
     * @param {number} dt
     */
    update(dt) {
        for (let card of this.cards) {
            if (!card.isFaceUp && !card.isMatched && card.flipProgress < 1) {
                card.flip(dt);
            }
        }

        // Check for matches
        if (this.selectedCards.length === 2) {
            const [cardA, cardB] = this.selectedCards;
            if (cardA.text === cardB.text) {
                cardA.isMatched = true;
                cardB.isMatched = true;
            } else {
                // Flip back after a delay
                setTimeout(() => {
                    cardA.flipProgress = 0;
                    cardA.isFaceUp = false;
                    cardB.flipProgress = 0;
                    cardB.isFaceUp = false;
                }, 1000);
            }
            this.selectedCards = [];
        }
    }

    /**
     * Render all cards
     * @param {CanvasRenderingContext2D} ctx
     */
    render(ctx) {
        for (let card of this.cards) {
            card.render(ctx);
        }
    }
}
