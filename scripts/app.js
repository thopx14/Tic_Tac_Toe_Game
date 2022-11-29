let currentPlayerID = 0;
let firstPlayerIdx = 0;
let currentRound = 0;
let gameCurrentlyRunning = false;
let playersChangedClickCount = 0;

const player = [
    {
        id: 1,
        starting: true,
        name: "",
        symbol: "X",
        positionsOnGameboard: [],
        won: false,
        wonCnt: 0
    },
    {
        id: 2,
        starting: false,
        name: "",
        symbol: "O",
        positionsOnGameboard: [],
        won: false,
        wonCnt: 0
    },
];

const btnEditPlayer1Name = document.getElementById("edit-player-1-btn");
const btnEditPlayer2Name = document.getElementById("edit-player-2-btn");
const cancelPlayerNameBtn = document.getElementById("cancel-config-btn");
const overlayPlayerName = document.getElementById("config-overlay");
const backdrop = document.getElementById("backdrop");
const formElement = document.querySelector("form");
const inputElement = document.querySelector("input");
const errorEnteringPlayerNameElement = document.getElementById("config-errors");
const gameConfigurationElement = document.getElementById("game-configuration");
const player1NameElement = document.getElementById("player-1-name");
const player2NameElement = document.getElementById("player-2-name");
const startNewGameBtnElement = document.getElementById("start-new-game-btn");
const playerNameNotEnteredElement = document.getElementById("game-player-name-not-choosen");
const gameSectionElement = document.getElementById("active-game");
const activePlayerNameElement = document.getElementById("active-player-name");
const gameBoardElement = document.querySelectorAll("#game-board li");
const gameOverElement = document.getElementById("game-over");
const gameDrawElement = document.getElementById("game-draw");
const winnerNameElement = document.getElementById("winner-name");
const switchPlayerButton = document.getElementById("switch-player-arrows");
const player1TileElement = document.getElementById("player1-tile");
const player2TileElement = document.getElementById("player2-tile");

btnEditPlayer1Name.addEventListener("click", openChoosePlayernameForm);
btnEditPlayer2Name.addEventListener("click", openChoosePlayernameForm);
cancelPlayerNameBtn.addEventListener("click", cancelPlayerNameSelection);
backdrop.addEventListener("click", cancelPlayerNameSelection);
formElement.addEventListener("submit", submitPlayerNameForm);
startNewGameBtnElement.addEventListener("click", startNewGameBtnClicked);
switchPlayerButton.addEventListener("click", switchPlayerButtonClicked);