'use strict'

const MINE = '💣'
const FLAG = '🚩'
const EMPTY = ' '

var gBoard
const gLevel = {
    SIZE: 4,
    MINES: 2
}


const gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0
}
function onInit() {
    gBoard = buildBoard(gLevel.SIZE);
    setMinesNegsCount(gBoard)
    gGame.isOn = false
    // console.log('hi');
    renderBoard(gBoard, '.board-container')
     addMine()
    hideElementsByClass('game-outcome')
    resetTimer()
    restartGame()

   
}



function buildBoard(size) {
    const board = [];
    for (var i = 0; i < size; i++) {
        board[i] = [];
        for (var j = 0; j < size; j++) {
            board[i][j] = {
                minesAroundCount: 0,
                isShown: false,
                isMine: false,
                isMarked: false
            }
            // if (i === 1 && j === 0 || i === 3 && j === 3) {
            //     board[i][j].isMine = true
            // }

        }
    }
    return board;
}
function setMinesNegsCount(board) {
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[i].length; j++) {
            if (board[i][j].isMine) continue;
            board[i][j].minesAroundCount = countMinesAroundCell(board, i, j);
        }
    }
}

function countMinesAroundCell(board, row, col) {
    var count = 0;

    for (var i = row - 1; i <= row + 1; i++) {
        if (i < 0 || i >= board.length) continue;
        for (var j = col - 1; j <= col + 1; j++) {
            if (j < 0 || j >= board[i].length) continue;
            if (i === row && j === col) continue; 
            if (board[i][j].isMine) count++;
        }
    }

    board[row][col].minesAroundCount = count

    return count;
}
function onCellClicked(elCell, i, j, event) {
    if (gGame.isOn) {
        console.log('game over! \ntry again')
        return
    }
    if (!gGame.secsPassed) {
        startTimer();
    }

    const cell = gBoard[i][j]
    if (!cell.isShown && !cell.isMarked) {
        cell.isShown = true
        if (cell.isMine) {
            elCell.innerText = MINE
            elCell.style.backgroundColor = 'red'
            gGame.isOn = true
            displayGameOutcome('Game Over! You lost!', 'red')
            revealAllMines(gBoard)
        } else {
            colorNums(i, j)
            elCell.innerText = cell.minesAroundCount;

            if (cell.minesAroundCount === 0) {
                for (var row = i - 1; row <= i + 1; row++) {
                    for (var col = j - 1; col <= j + 1; col++) {
                        if (row >= 0 && row < gBoard.length && col >= 0 && col < gBoard[0].length) {
                            const neighborCell = gBoard[row][col];
                            const neighborElCell = document.querySelector(`.cell-${row}-${col}`);
                            if (!neighborCell.isMine && !neighborCell.isShown && !neighborCell.isMarked) {
                                neighborCell.isShown = true;
                                neighborElCell.innerText = neighborCell.minesAroundCount;
                                colorNums(row, col);
                            }
                        }
                    }
                }
            }
        }
    }
    checkWinning()
    checkGameOver()
    restartGame()
    event.preventDefault()
}


function onCellMarked(elCell, i, j, event) {
    const cell = gBoard[i][j]
    if (!cell.isShown) {
        if (cell.isMarked) {
            cell.isMarked = false
            elCell.innerText = ''
        } else {
            cell.isMarked = true
            elCell.innerText = FLAG
        }
    }
    console.log('Cell marked:', elCell);
    checkWinning()
    restartGame()
    event.preventDefault()
}

function checkGameOver() {
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[i].length; j++) {
            const cell = gBoard[i][j]
            if (cell.isMine && cell.isShown) {
                if (!gGame.isOn) {
                    gGame.isOn = true;
                    console.log('Mine clicked!')
                    displayGameOutcome('Game Over! You lost!', 'red');
                }
                return true;
            }
        }
    }
    return false;
}

function checkWinning() {
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[i].length; j++) {
            const cell = gBoard[i][j];

            if (cell.isMine && !cell.isMarked) {
                return false;
            }

            if (!cell.isMine && !cell.isShown) {
                return false;
            }
        }
    }

    displayGameOutcome('Congratulations! You won!', 'green');
    return true;
}

function displayGameOutcome(message, color) {
    hideElementsByClass('game-outcome');
    const gameOutcomeElements = document.querySelectorAll('.game-outcome');
    for (var i = 0; i < gameOutcomeElements.length; i++) {
        gameOutcomeElements[i].innerText = message;
        gameOutcomeElements[i].style.color = color;
        gameOutcomeElements[i].style.display = 'block';
    }
}



function checkWinning() {
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[i].length; j++) {
            const cell = gBoard[i][j];

            if (cell.isMine && !cell.isMarked) {
                return false;
            }

            if (!cell.isMine && !cell.isShown) {
                return false;
            }
        }
    }
    displayGameOutcome('Congratulations! You won!', 'green');
    return true;
}
function displayGameOutcome(message, color) {
    hideElementsByClass('game-outcome');
    const gameOutcomeElements = document.querySelectorAll('.game-outcome');
    for (var i = 0; i < gameOutcomeElements.length; i++) {
        gameOutcomeElements[i].innerText = message;
        gameOutcomeElements[i].style.color = color;
        gameOutcomeElements[i].style.display = 'block';
    }
}
function hideElementsByClass(className) {
    const elements = document.querySelectorAll('.' + className);
    for (var i = 0; i < elements.length; i++) {
        elements[i].style.display = 'none';
    }
}

function restartGame() {
    if (checkWinning() || checkGameOver()) {
        showRestartButton()
        stopTimer()
      
        
    } else {
        hideRestartButton();
    }
}





function revealAllMines(board) {
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[0].length; j++) {
            if (board[i][j].isMine) {
                board[i][j].isShown = true;
                const elCell = document.querySelector(`.cell-${i}-${j}`);
                elCell.innerText = MINE;
            }
        }
    }
}



function colorNums(row, col) {
    const elCell = document.querySelector(`.cell-${row}-${col}`);
    const cell = gBoard[row][col];
    

    if (cell.minesAroundCount === 0) {
        elCell.style.backgroundColor = 'grey'
        elCell.style.color = 'grey';
    } else if (cell.minesAroundCount === 1) {
        elCell.style.color = 'blue';
    } else if (cell.minesAroundCount === 2) {
        elCell.style.color = 'green';
    } else if (cell.minesAroundCount === 3) {
        elCell.style.color = 'red';
    } else if (cell.minesAroundCount === 4) {
        elCell.style.color = 'darkblue';
    }

    
}