const gameBoard = document.getElementById('gameBoard');
const cells = document.querySelectorAll('.cell');
const statusMessage = document.getElementById('statusMessage');
const resetButton = document.getElementById('resetButton');

const resetSound = document.getElementById('resetSound');
const clickSound = document.getElementById('clickSound');
const winSound = document.getElementById('winSound');
const aiWinSound = document.getElementById('aiWinSound');
const tieSound = document.getElementById('tieSound');

let boardState = ['', '', '', '', '', '', '', '', ''];
let currentPlayer = 'You';
let gameActive = true;

const winningConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

const backgroundMusic = document.getElementById('backgroundMusic');

function handleVisibilityChange() {
    if (document.hidden) {
        backgroundMusic.pause();
    } else {
        backgroundMusic.play();
    }
}


if (typeof document.hidden !== "undefined") {
    document.addEventListener("visibilitychange", handleVisibilityChange, false);
}

window.onload = () => {
    backgroundMusic.play();
};

function updateBoard(cell, index) {
    boardState[index] = currentPlayer;
    cell.textContent = currentPlayer === 'You' ? 'X' : 'O'; 
    cell.classList.add('clicked');
}

function highlightWinningCells(cells) {
    cells.forEach(index => {
        document.querySelector(`[data-index='${index}']`).classList.add('win');
    });
}

function checkGameResult() {
    let roundWon = false;

    for (let i = 0; i < winningConditions.length; i++) {
        const [a, b, c] = winningConditions[i];
        if (boardState[a] === '' || boardState[b] === '' || boardState[c] === '') {
            continue;
        }
        if (boardState[a] === boardState[b] && boardState[b] === boardState[c]) {
            roundWon = true;
            highlightWinningCells([a, b, c]);
            
            if (currentPlayer === 'You') {
                winSound.play();
                statusMessage.textContent = `Congratulations, You won!`;
            } else {
                aiWinSound.play(); 
                statusMessage.textContent = `You lose!`; 
            }
            break;
        }
    }

    if (roundWon) {
        gameActive = false;
        return;
    }

    if (!boardState.includes('')) {
        statusMessage.textContent = "It's a tie!";
        tieSound.play();
        gameActive = false;
        return;
    }

    currentPlayer = currentPlayer === 'You' ? 'AI' : 'You'; 
    statusMessage.textContent = `It's ${currentPlayer}'s turn`;

    if (currentPlayer === 'AI' && gameActive) {
        setTimeout(aiMove, 500);  
    }
}


function aiMove() {
    if (!gameActive) return;

    let bestMove = findBestMove('AI');
    if (bestMove === -1) {
        bestMove = findBestMove('You'); 
    }
    
    if (bestMove === -1) {
        const emptyCells = boardState
            .map((val, index) => val === '' ? index : null)
            .filter(val => val !== null);
        bestMove = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    }

    const aiCell = document.querySelector(`[data-index='${bestMove}']`);
    updateBoard(aiCell, bestMove);
    clickSound.play();
    checkGameResult();
}

function findBestMove(player) {
    const symbol = player === 'You' ? 'X' : 'O'; 
    for (let i = 0; i < winningConditions.length; i++) {
        const [a, b, c] = winningConditions[i];
        if (boardState[a] === symbol && boardState[b] === symbol && boardState[c] === '') return c;
        if (boardState[a] === symbol && boardState[c] === symbol && boardState[b] === '') return b;
        if (boardState[b] === symbol && boardState[c] === symbol && boardState[a] === '') return a;
    }
    return -1;
}

gameBoard.addEventListener('click', (event) => {
    const clickedCell = event.target;
    const clickedCellIndex = clickedCell.getAttribute('data-index');

    if (clickedCell.textContent !== '' || !gameActive || currentPlayer === 'AI') return;

    updateBoard(clickedCell, clickedCellIndex);
    clickSound.play();
    checkGameResult();
});

resetButton.addEventListener('click', () => {
    boardState = ['', '', '', '', '', '', '', '', ''];
    gameActive = true;
    currentPlayer = 'You';
    statusMessage.textContent = `It's ${currentPlayer}'s turn`;
    resetSound.play();

    cells.forEach(cell => {
        cell.textContent = '';
        cell.classList.remove('clicked', 'win');
    });

    backgroundMusic.play();
});
