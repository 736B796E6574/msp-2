const selectors = {
    boardContainer: document.getElementById('board-container'),
    board: document.getElementById('board'),
    moves: document.getElementById('.moves'),
    timer: document.getElementById('.timer'),
    start: document.getElementById('start-button'),
    win: document.getElementById('message')
}

const state = {
    gameStarted: false,
    flippedCards: 0,
    totalFlips: 0,
    totalTime: 0,
    loop: null
}