function startNewGameBtnClicked(event) {
  if (player[0].name && player[1].name) {
    gameCurrentlyRunning = true;
    gameOverElement.style.display = "none";
    gameDrawElement.style.display = "none";
    playerNameNotEnteredElement.style.display = "none";
    gameSectionElement.style.display = "block";
    currentPlayerID = whichPlayerShouldStart();
    currentRound = 0;
    // The first player starts. If it's swapped then it will be the second player.
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

function whichPlayerShouldStart() {
  return player[0].starting === true ? 0 : 1;
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
    switchPlayerTilesVisually();
  } else {
    playerNameNotEnteredElement.style.display = "block";
    return;
  }
}

function swapPlayers() {
  // Switch the starting state!
  if (player[0].starting === false) {
    player[0].starting = true;
    player[1].starting = false;
  } else {
    player[0].starting = false;
    player[1].starting = true;
  }
}

function switchPlayerTilesVisually() {
  // First clear all previously assigned classes:
  player1TileElement.className = "";
  player2TileElement.className = "";

  // A little hack to be able have the default duration for the animation even if you click more than one time on the button.
  // Found here: https://css-tricks.com/restart-css-animation/
  void player1TileElement.offsetWidth;
  void player2TileElement.offsetWidth;

  // Then assign them the new values.
  if (playersChangedClickCount++ % 2 === 0) {
    player1TileElement.classList.add("p1-move-position-forward");
    player2TileElement.classList.add("p2-move-position-forward");
  } else {
    player1TileElement.classList.add("p1-move-position-backwards");
    player2TileElement.classList.add("p2-move-position-backwards");
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
  currentLi.classList.add("disabled");
  currentLi.removeEventListener("click", clickOnGameBoardItem);
  currentRound++; // switch to next round!
  if (!evaluateWinOrDraw()) {
    switchPlayer();
  }
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
      console.log(
        "Player (" + currentPlayer.id + "): " + currentPlayer.name + " won !!!"
      );
      currentPlayer.won = true;
      currentPlayer.wonCnt++;
      const wonCntLabelElement = document.getElementById(
        "won-cnt-player-" + currentPlayer.id
      );
      wonCntLabelElement.textContent = currentPlayer.wonCnt;
      wonCntLabelElement.classList.add("green-font-color");
      winnerNameElement.textContent = currentPlayer.name;
      gameOverElement.style.display = "block";
      gameCurrentlyRunning = false;
      lockGameBoard();

      return true;

    } else if (currentRound === gameBoardElement.length) {
      // It's a draw!
      gameCurrentlyRunning = false;
      console.log("It's a draw!");
      gameDrawElement.style.display = "block";

      return true;
    }
  }

  return false;
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
