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

const winConditions = [
  [0, 1, 2],
  [0, 3, 6],
  [0, 4, 8],
  [1, 4, 7],
  [2, 5, 8],
  [2, 4, 6],
  [3, 4, 5],
  [6, 7, 8]
];

function GameBoard() {
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

  const getBoard = () => board;

  const placeMark = () => {
    if (board[i] != []) return;
    console.log("");
    board.forEach((arr, i)=> {
      console.log(arr.toString().replace(/,/g, "|"))
    })
  }

  const printBoard = () => {
    const boardWithCellValues = board.map((row) => row.map((cell) => cell.getValue()))
    console.log(boardWithCellValues);
  };

    return { getBoard, placeMark, printBoard };
}

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
  const board = GameBoard();

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
    console.log(`Placing ${getCurrentPlayer().name}'s mark...`);
    board.placeMark(column, getCurrentPlayer().mark);

    switchPlayerTurn();
    printNewRound();
  };

  printNewRound();

  return { playRound, getCurrentPlayer };
}

const game = GameController();