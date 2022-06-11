const selectors = {
    boardContainer: document.querySelector('.board-container'),
    board: document.querySelector('.board'),
    moves: document.querySelector('.moves'),
    timer: document.querySelector('.timer'),
    start: document.querySelector('button'),
    win: document.querySelector('.win')
};

const again = document.getElementById('again');
const controls = document.getElementById('controls');
const readyButton = document.getElementById('ready');

let state = {
    gameStarted: false,
    flippedCards: 0,
    totalFlips: 0,
    totalTime: 0,
    loop: null
};

// shuffles the array of emojis

const shuffle = array => {
    const clonedArray = [...array];

    for (let index = clonedArray.length - 1; index > 0; index--) {
        const randomIndex = Math.floor(Math.random() * (index + 1));
        const original = clonedArray[index];
        clonedArray[index] = clonedArray[randomIndex];
        clonedArray[randomIndex] = original;
    }
    return clonedArray;
};

// picks some random emojis from the bank

const pickRandom = (array, items) => {
    const clonedArray = [...array];
    const randomPicks = [];

    for (let index = 0; index < items; index++) {
        const randomIndex = Math.floor(Math.random() * clonedArray.length);
        randomPicks.push(clonedArray[randomIndex]);
        clonedArray.splice(randomIndex, 1);
    }
    return randomPicks;
};

// generates the board elements and calls the functions to shuffle and randomize the emojis to fill the board


const generateGame = () => {
    const dimensions = selectors.board.getAttribute('data-dimension');

    if (dimensions % 2 !== 0) {
        throw new Error("The dimension of the board must be an even number.");
    }

    const emojis = ['🦍', '🦜', '🐅', '🦁', '🐍', '🦒', '🦚', '🐼', '🐨', '🐸'];
    const picks = pickRandom(emojis, (dimensions * dimensions) / 2);
    const items = shuffle([...picks, ...picks]);
    const cards = `
        <div class="board" style="grid-template-columns: repeat(${dimensions}, auto)">
            ${items.map(item => `
                <div class="card">
                    <div class="card-front"></div>
                    <div class="card-back">${item}</div>
                </div>
            `).join('')}
       </div>
    `;
    const parser = new DOMParser().parseFromString(cards, 'text/html');
    selectors.board.replaceWith(parser.querySelector('.board'));
};

// gets the clock ticking and displays the moves made
const startGame = () => {
    state.gameStarted = true;
    selectors.start.classList.add('disabled');
    state.loop = setInterval(() => {
        state.totalTime++;
        selectors.moves.innerText = `Moves: ${state.totalFlips}`;
        selectors.timer.innerText = `Time: ${state.totalTime} sec`;
    }, 1000);
};

// turns the cards back over if they are not matched

const flipBackCards = () => {
    document.querySelectorAll('.card:not(.matched)').forEach(card => {
        card.classList.remove('flipped');
    });
    state.flippedCards = 0;
};

// adds matched class to cards if they are the same emoji and flips them back over after 1 second if they are not

const flipCard = card => {
    state.flippedCards++;
    state.totalFlips++;

    if (state.flippedCards <= 2) {
        card.classList.add('flipped');
    }

    if (state.flippedCards === 2) {
        const flippedCards = document.querySelectorAll('.flipped:not(.matched)');

        if (flippedCards[0].innerText === flippedCards[1].innerText) {
            flippedCards[0].classList.add('matched');
            flippedCards[1].classList.add('matched');
        }

        setTimeout(() => {
            flipBackCards();
        }, 1000);
    }

    // If there are no more cards that we can flip, we won the game
    if (!document.querySelectorAll('.card:not(.flipped)').length) {
        setTimeout(() => {
            selectors.boardContainer.classList.add('flipped');
            selectors.win.innerHTML = `
                <span class="win-text">
                    You won!<br />
                    with <span class="highlight">${state.totalFlips}</span> moves<br />
                    under <span class="highlight">${state.totalTime}</span> seconds
                </span>
            `;

            clearInterval(state.loop);
        }, 1000);
        again.classList.remove('hidden');
        controls.classList.add('hidden');
    }
};

// displays the game over screen by flipping the game board over and shows the play again button 

const gameOver = () => {
    setTimeout(() => {
        selectors.boardContainer.classList.add('flipped');
        selectors.win.innerHTML = `
            <span class="win-text">
                You won!<br />
                with <span class="highlight">${state.totalFlips}</span> moves<br />
                in <span class="highlight">${state.totalTime}</span> seconds.
            </span>
        `;

        clearInterval(state.loop);
    }, 1000);
    again.classList.remove('hidden');
    controls.classList.add('hidden');
    clearInterval(state.loop);
};

const attachEventListeners = () => {
    document.addEventListener('click', event => {
        const eventTarget = event.target;
        const eventParent = eventTarget.parentElement;

        if (eventTarget.className.includes('card') && !eventParent.className.includes('flipped')) {
            flipCard(eventParent);
        } else if (eventTarget.nodeName === 'BUTTON' && !eventTarget.className.includes('disabled')) {
            startGame();
        }
    });
};

// hides the pre-game screen and shows the game screen. starts the game timer

const ready = () => {
    const game = document.getElementById('game');
    const preGame = document.getElementById('pre-game');
    game.classList.remove('hidden');
    preGame.classList.add('hidden');
    startGame();
};

// reloads the page
const reset = () => {
    location.reload();
};

generateGame();
attachEventListeners();
again.addEventListener('click', reset);
readyButton.addEventListener('click', ready);