// Global Variables
const rollBtn = document.getElementById('rollBtn');
const endBtn = document.getElementById('endBtn');
const individualBtn = document.getElementById('individualBtn');
const sumBtn = document.getElementById('sumBtn');
const player1Input = document.getElementById('player1');
const player2Input = document.getElementById('player2');
const startGameBtn = document.getElementById('startGame');
const currentTurnText = document.getElementById('currentTurn');
const roundText = document.getElementById('round');
const diceSumText = document.getElementById('diceSum');
const boxes = Array(10).fill(0);
let player1Points = 0;
let player2Points = 0;
let roundNumber = 1;
let currentPlayer = 1;
let playerNames = [];
let die1, die2, diceSum;

// Start Game Button
startGameBtn.addEventListener('click', () => {
    if (player1Input.value.trim() === '' || player2Input.value.trim() === '') {
        alert('Please enter player names!');
        player1Input.focus();
        return;
    }

    playerNames = [player1Input.value.trim(), player2Input.value.trim()];
    document.getElementById('p1name').textContent = playerNames[0];
    document.getElementById('p2name').textContent = playerNames[1];

    currentTurnText.textContent = `${playerNames[0]}'s Turn`;
    roundText.textContent = `Round: 1`;

    document.querySelector('.players').style.display = 'none';
    document.querySelector('.winner').style.display = 'none';
    document.querySelector('.board').style.display = 'block';
    document.querySelector('.dice').style.display = 'block';
    rollBtn.disabled = false;
    startGameBtn.disabled = true;
});

// Roll Button Logic
rollBtn.addEventListener('click', () => {
    die1 = Math.floor(Math.random() * 6) + 1;
    die2 = Math.floor(Math.random() * 6) + 1;
    diceSum = die1 + die2;

    document.getElementById('first-dice').className = `bi bi-dice-${die1}`;
    document.getElementById('second-dice').className = `bi bi-dice-${die2}`;
    diceSumText.textContent = diceSum;

    boxes[0] = diceSum;

    checkDiceButtons(die1, die2);

    rollBtn.disabled = true;
});

// Function to check and enable/disable the Individual and Sum buttons
function checkDiceButtons(die1, die2) {

    if (boxes[die1] === 'X' || boxes[die2] === 'X' || die1 === die2) {
        individualBtn.disabled = true;
    } else {
        individualBtn.disabled = false;
    }

    if (boxes[diceSum] === 'X' || diceSum > 9) {
        sumBtn.disabled = true;
    } else {
        sumBtn.disabled = false;
    }

    if (individualBtn.disabled && sumBtn.disabled) {
        endBtn.disabled = false;
    }
}

// Sum Button Logic
sumBtn.addEventListener('click', () => {
    if (diceSum >= 1 && diceSum <= 9) {
        shut(diceSum);
    }


    individualBtn.disabled = true;
    sumBtn.disabled = true;
    rollBtn.disabled = false;
});

// Individual Button Logic
individualBtn.addEventListener('click', () => {

    shut(die1);
    shut(die2);


    individualBtn.disabled = true;
    sumBtn.disabled = true;
    rollBtn.disabled = false;
});

// Function to shut a box and update UI
function shut(boxNumber) {
    const box = document.getElementById(`box${boxNumber}`);
    if (box && boxes[boxNumber] !== 'X') {
        box.classList.add('shut');
        box.textContent = 'X';
        boxes[boxNumber] = 'X';
    }
}

// Function to calculate and update player points and build scoreboard row
function updateScoreboard() {
    const shutSum = calculateShutSum();

    let pointsForTurn = 45 - shutSum;

    if (currentPlayer === 1) {
        player1Points += pointsForTurn;
        buildRow(roundNumber, pointsForTurn, null);
        currentPlayer = 2;
        currentTurnText.textContent = `${playerNames[1]}'s Turn`;
    } else {
        player2Points += pointsForTurn;
        let p2Td = document.querySelector(`#round${roundNumber} .p2Pts`);
        p2Td.textContent = pointsForTurn;
        currentPlayer = 1;
        currentTurnText.textContent = `${playerNames[0]}'s Turn`;
        roundNumber++;
        roundText.textContent = `Round: ${roundNumber}`;
    }

    if (roundNumber > 5) {
        gameOver();
    } else {
        resetBoard();
    }
}

// Function to calculate the sum of shut boxes
function calculateShutSum() {
    let shutSum = 0;
    for (let i = 1; i <= 9; i++) {
        if (boxes[i] === 'X') {
            shutSum += i;
        }
    }
    return shutSum;
}

// Function to build a row for the scoreboard
function buildRow(round, p1PointsTurn, p2PointsTurn) {
    const row = document.createElement('tr');
    row.id = `round${round}`;

    const th = document.createElement('th');
    th.textContent = `Round ${round}`;
    row.appendChild(th);

    const td1 = document.createElement('td');
    td1.classList.add('p1Pts');
    td1.textContent = p1PointsTurn;
    row.appendChild(td1);

    const td2 = document.createElement('td');
    td2.classList.add('p2Pts');
    td2.textContent = p2PointsTurn || '';
    row.appendChild(td2);


    document.querySelector('tbody').insertAdjacentElement('beforeend', row);
}

// End Turn Button Logic
endBtn.addEventListener('click', () => {
    updateScoreboard();

    endBtn.disabled = true;
    rollBtn.disabled = false;
});

// Reset Board Function
function resetBoard() {
    boxes.fill(0);
    document.querySelectorAll('.box').forEach(box => {
        box.classList.remove('shut');
        box.textContent = box.id.replace('box', '');
    });

    currentTurnText.textContent = `${playerNames[currentPlayer - 1]}'s Turn`;
    roundText.textContent = `Round: ${roundNumber}`;

    endBtn.disabled = true;
    rollBtn.disabled = false;
}

// Game Over Logic
function gameOver() {
    document.querySelector('.board').style.display = 'none';
    document.querySelector('.dice').style.display = 'none';
    document.querySelector('.players').style.display = 'none';
    document.querySelector('.winner').style.display = 'block';

    let winnerMessage = '';
    if (player1Points < player2Points) {
        winnerMessage = `${playerNames[0]} wins with ${player1Points} points!`;
    } else if (player2Points < player1Points) {
        winnerMessage = `${playerNames[1]} wins with ${player2Points} points!`;
    } else {
        winnerMessage = `It's a tie! Both players have ${player1Points} points!`;
    }

    document.querySelector('.winner h3').textContent = winnerMessage;

    const playAgainBtn = document.createElement('button');
    playAgainBtn.id = 'playAgainBtn';
    playAgainBtn.textContent = 'Play Again';
    playAgainBtn.addEventListener('click', startNewGame);
    document.querySelector('.winner').appendChild(playAgainBtn);
}

// Function to start a new game
function startNewGame() {
    player1Points = 0;
    player2Points = 0;
    roundNumber = 1;
    currentPlayer = 1;
    playerNames = [];

    document.querySelector('tbody').innerHTML = '';
    resetBoard();
    document.getElementById('round').textContent = `Round: ${roundNumber}`;
    document.getElementById('currentTurn').textContent = `${playerNames[0]}'s Turn`;

    document.querySelector('.board').style.display = 'block';
    document.querySelector('.dice').style.display = 'block';
    document.querySelector('.players').style.display = 'block';
    document.querySelector('.winner').style.display = 'none';

    document.getElementById('startGame').disabled = false;
    document.getElementById('player1').disabled = false;
    document.getElementById('player2').disabled = false;
}
