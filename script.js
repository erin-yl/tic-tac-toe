/* 
Pseudocode:
Initialize game board with an object
Initialize players with objects
Initialize game flow with an object
User selects a marker X or O
If user selects X, user plays first; otherwise computer plays first
User marks a spot on a 3 by 3 grid
User and computer alternately marks a spot
Game ends when one player marks 3 spots in a row or all sports are marked (tie)
*/

function Gameboard() {
  const rows = 3;
  const columns = 3;
  const board = [];

  // Create a 2D array
  for (let i = 0; i < rows; i++) {
    board[i] = [];
    for (let j = 0; j < columns; j++) {
      board[i].push(Cell());
    }
  }

  return { board };
}

const getBoard = () => board;



function Cell() {
  let value = 0;

  // Accept a player's mark to change the value of the cell
  const addMark = (player) => {
    value = player;
  };

  const getValue = () => value;

  return { addMark, getValue };
}

function GameController(
  humanPlayer = "Human player",
  computerPlayer = "Computer player"
) {
  const board = Gameboard();

  const players = [
    {
      name: humanPlayer,
      mark: 1
    },
    {
      name: computerPlayer,
      mark: 2
    }
  ];

  let currentPlayer = players[0];

  const switchPlayerTurn = () => {
    currentPlayer = currentPlayer === players[0] ? players[1] : players[0];
  };
  const getCurrentPlayer = () => currentPlayer;

  const printNewRound = () => {
    board.printBoard();
    console.log(`${getCurrentPlayer().name}'s turn.`);
  };

  const playRound = (column) => {
    // Place a mark for the current player
    board.placeMark(column, getCurrentPlayer().mark);

    switchPlayerTurn();
    printNewRound();
  };

  printNewRound();

  return { playRound, getCurrentPlayer };
}

const game = GameController();