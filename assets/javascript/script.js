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

// builds a new board by calling the pick random and shuffle functions then using domparse to replace the board elements with however many cards are specified by the data-dimension selector in the html
const newGame = () => {
    const dimensions = selectors.board.getAttribute('data-dimension')

    const emojis = ['🥔', '🍒', '🥑', '🍇', '🍉', '🍌', '🥭', '🍍', '🌽', '🥕']
    const picks = pickRandom(emojis, (dimensions * dimensions) / 2)
    const items = shuffle([...picks, ...picks])
    const card = `
        <div class="board" style="grid-template-columns: repeat(${dimensions}, auto)">
            ${items.map(item => `
                <div class="card">
                    <div class="card-front"></div>
                    <div class="card-back">${item}</div>
                </div>
            `).join('')}
       </div>
    `

    const parser = new DOMParser().parseFromString(card, 'text/html')

    selectors.board.replaceWith(parser.querySelector('.board'))
}

// clones the array of emojis and then uses math.random to select a random index and push it to the randompicks array. then splices it from the cloned array so we don't get it pushed to the randomPicks array more than once. That would ruin the game.

const pickRandom = (emojis, cardsNeeded) => {
    const clonedArray = [...emojis]
    const randomPicks = []

    for (let i = 0; i < cardsNeeded; i++) {
        const randomIndex = Math.floor(Math.random() * clonedArray.length)

        randomPicks.push(clonedArray[randomIndex])
        clonedArray.splice(randomIndex, 1)
    }

    return randomPicks
}