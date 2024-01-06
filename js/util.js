
function renderBoard(mat, selector) {
    var strHTML = '<table><tbody>';
    for (var i = 0; i < mat.length; i++) {
        strHTML += '<tr>';
        for (var j = 0; j < mat[0].length; j++) {
            const cell = mat[i][j];
            const className = `cell cell-${i}-${j}`;
            strHTML += `<td class="${className}"
              onclick="onCellClicked(this, ${i}, ${j}, event)";
             oncontextmenu="onCellMarked(this, ${i}, ${j}, event); return false;"></td>`;
            cell.element = document.querySelector(`.${className}`);
        }
        strHTML += '</tr>';
    }
    strHTML += '</tbody></table>';

    const elContainer = document.querySelector(selector);
    elContainer.innerHTML = strHTML;
}


function getRandomIntInclusive(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min
}


function getEmptyCell(board) {
    const emptyCells = [];

    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[i].length; j++) {
            const currCell = board[i][j];
            if (currCell !== MINE && currCell !== FLAG)
                emptyCells.push({ i, j })
        }
    }

    if (!emptyCells.length) return null

    const randomIdx = getRandomIntInclusive(0, emptyCells.length - 1)
    return emptyCells[randomIdx];
}

function addMine() {
    for (var i = 0; i < gLevel.MINES; i++) {
        const cell = getEmptyCell(gBoard);
        if (cell) {
            gBoard[cell.i][cell.j].isMine = true;

        }
    }
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[i].length; j++) {
            countMinesAroundCell(gBoard, i, j);
        }
    }
    renderBoard(gBoard, '.board-container')
}
function onClickEasyBtn() {
    gLevel.SIZE = 4
    gLevel.MINES =2
    onInit()
}

function onClickMediumBtn() {
    gLevel.SIZE = 6
    gLevel.MINES = 20
    onInit()
}

function onClickHardBtn() {
    gLevel.SIZE = 8
    gLevel.MINES = 10
    onInit()
}
// function showRestartButton() {
//     const restartBtn = document.querySelector('.restart');
//     restartBtn.style.display = 'inline-block';
// }

// function hideRestartButton() {
//     const restartBtn = document.querySelector('.restart');
//     restartBtn.style.display = 'none';
// }
var timerInterval;

function startTimer() {
    if (!gGame.isOn) {
        gGame.startTime = Date.now();
        timerInterval = setInterval(function () {
            gGame.secsPassed = (Date.now() - gGame.startTime) / 1000;
            updateTimerDisplay();
        }, 997);
    }
}

function stopTimer() {
    clearInterval(timerInterval);
}

function updateTimerDisplay() {
    const timerDisplayElement = document.querySelector('.timer');
    const secsPassedRounded = gGame.secsPassed.toFixed(3);
    timerDisplayElement.innerText = secsPassedRounded;
}

function resetTimer() {
    gGame.startTime = Date.now();
    gGame.secsPassed = 0;
    updateTimerDisplay();
}


function toggleDarkMode() {
    const body = document.body;
    const currentBackgroundColor = body.style.backgroundColor;

    if (currentBackgroundColor === 'white') {
        body.style.backgroundColor = 'black';
    } else  {
        body.style.backgroundColor = 'white';
    }
}

