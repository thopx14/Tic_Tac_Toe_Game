function startNewGameBtnClicked(event) {
  if (player[0].name && player[1].name) {
    gameCurrentlyRunning = true;
    gameOverElement.style.display = "none";
    gameDrawElement.style.display = "none";
    playerNameNotEnteredElement.style.display = "none";
    gameSectionElement.style.display = "block";
    currentPlayerID = 0;
    currentRound = 0;
    activePlayerNameElement.textContent = player[currentPlayerID].name;
    // reset current positions on gameboard of players:
    player[0].positionsOnGameboard = [];
    player[0].won = false;
    player[1].won = false;
    player[1].positionsOnGameboard = [];
    initializeGameBoard();
  } else {
    playerNameNotEnteredElement.style.display = "block";
  }
}

function initializeGameBoard() {
  for (const liNode of gameBoardElement) {
    liNode.textContent = "";
    liNode.classList.remove("disabled");
    liNode.addEventListener("click", clickOnGameBoardItem);
  }
}

function lockGameBoard() {
  for (const liNode of gameBoardElement) {
    liNode.removeEventListener("click", clickOnGameBoardItem);
  }
}

function switchPlayerButtonClicked() {
  if (gameCurrentlyRunning) {
    alert("Please finish the currently running game before switching users!");
    return;
  }
  if (player[0].name && player[1].name) {
    playerNameNotEnteredElement.style.display = "none";
    swapPlayers();
  } else {
    playerNameNotEnteredElement.style.display = "block";
    return;
  }
}

function swapPlayers() {
  // Swaping player array.
  const player1Copy = structuredClone(player[0]);
  const player2Copy = structuredClone(player[1]);
  player[0].name = player2Copy.name;
  player[0].symbol = player2Copy.symbol;
  player[0].wonCnt = player2Copy.wonCnt;
  player[1].name = player1Copy.name;
  player[1].symbol = player1Copy.symbol;
  player[1].wonCnt = player1Copy.wonCnt;

  const player1DisplayElement = document.getElementById("player-1-config");
  const player2DisplayElement = document.getElementById("player-2-config");
  const player1WonCnt = document.getElementById("won-cnt-player-1");
  const player2WonCnt = document.getElementById("won-cnt-player-2");
  const player1Symbol = document.getElementById("player-1-symbol");
  const player2Symbol = document.getElementById("player-2-symbol");

  // Swaping text content on the screen.
  player1DisplayElement.children[1].textContent = player[0].name;
  player2DisplayElement.children[1].textContent = player[1].name;
  player1Symbol.textContent = player[0].symbol;
  player2Symbol.textContent = player[1].symbol;
  player1WonCnt.textContent = player[0].wonCnt;
  player2WonCnt.textContent = player[1].wonCnt;

  if (player[0].wonCnt > 0) {
    player1WonCnt.classList.add("green-font-color");
  } else {
    player1WonCnt.classList.remove("green-font-color");
  }

  if (player[1].wonCnt > 0) {
    player2WonCnt.classList.add("green-font-color");

  } else {
    player1WonCnt.classList.remove("green-font-color");
  }
}

function clickOnGameBoardItem(event) {
  const currentLi = event.target;
  currentLi.textContent = player[currentPlayerID].symbol;
  // Set the currently owned position of current player to it's array.
  // This will be evaluated later (see below: evaluateWinOrDraw())
  const playedIdx = +currentLi.dataset.idx;
  console.log(
    "player: " +
      player[currentPlayerID].name +
      " uses the following index: " +
      playedIdx
  );
  player[currentPlayerID].positionsOnGameboard.push(playedIdx);
  //   console.log(currentLi.dataset.idx);
  currentLi.classList.add("disabled");
  currentLi.removeEventListener("click", clickOnGameBoardItem);
  currentRound++; // switch to next round!
  evaluateWinOrDraw();
  switchPlayer();
}

function switchPlayer() {
  currentPlayerID = currentPlayerID === 0 ? 1 : 0;
  activePlayerNameElement.textContent = player[currentPlayerID].name;
}

function evaluateWinOrDraw() {
  const currentPlayer = player[currentPlayerID];
  const positionsOnGameBoard = currentPlayer.positionsOnGameboard;
  // Only if one player has 3 or more fields then start checking!
  if (positionsOnGameBoard.length > 2) {
    // positionsOnGameBoard.sort();
    console.log(currentPlayer.name + ": " + positionsOnGameBoard);
    if (
      checkHorizontallyWin(positionsOnGameBoard) ||
      checkVerticallyWin(positionsOnGameBoard) ||
      checkCrossyWin(positionsOnGameBoard)
    ) {
      console.log("Player: " + currentPlayer.name + " won !!!");
      currentPlayer.won = true;
      currentPlayer.wonCnt++;
      const wonCntLabelElement = document.getElementById(
        "won-cnt-player-" + (currentPlayerID + 1)
      );
      wonCntLabelElement.textContent = currentPlayer.wonCnt;
      wonCntLabelElement.classList.add("green-font-color");
      winnerNameElement.textContent = currentPlayer.name;
      gameOverElement.style.display = "block";
      gameCurrentlyRunning = false;
      lockGameBoard();
    }
  }

  // Check for draw:
  if (
    currentRound === gameBoardElement.length &&
    !player[0].won &&
    !player[1].won
  ) {
    // draw!
    gameCurrentlyRunning = false;
    console.log("It's a draw!");
    gameDrawElement.style.display = "block";
  }
}

/*
Possible options to win:
        * Three in a row (horizontally):
             1. 2. 3.
             4. 5. 6.
             7. 8. 9.
*/
function checkHorizontallyWin(array) {
  const check1 =
    array.indexOf(1) > -1 && array.indexOf(2) > -1 && array.indexOf(3) > -1;
  const check2 =
    array.indexOf(4) > -1 && array.indexOf(5) > -1 && array.indexOf(6) > -1;
  const check3 =
    array.indexOf(7) > -1 && array.indexOf(8) > -1 && array.indexOf(9) > -1;

  return check1 || check2 || check3;
}

/*
Possible options to win:
        * Three in a row (vertically):
             3. 5. 7.
             1. 4. 7.
             2. 5. 8
             3. 6. 9.
*/
function checkVerticallyWin(array) {
  const check1 =
    array.indexOf(3) > -1 && array.indexOf(5) > -1 && array.indexOf(7) > -1;
  const check2 =
    array.indexOf(1) > -1 && array.indexOf(4) > -1 && array.indexOf(7) > -1;
  const check3 =
    array.indexOf(2) > -1 && array.indexOf(5) > -1 && array.indexOf(8) > -1;
  const check4 =
    array.indexOf(3) > -1 && array.indexOf(6) > -1 && array.indexOf(9) > -1;

  return check1 || check2 || check3 || check4;
}

/*
Possible options to win:
        * Three in a row (cross):
             1. 5. 9.
             3. 5. 7.    
*/
function checkCrossyWin(array) {
  const check1 =
    array.indexOf(1) > -1 && array.indexOf(5) > -1 && array.indexOf(9) > -1;
  const check2 =
    array.indexOf(3) > -1 && array.indexOf(5) > -1 && array.indexOf(7) > -1;

  return check1 || check2;
}
