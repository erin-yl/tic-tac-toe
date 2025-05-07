/* 
Pseudocode:
Game board object with board array manages the game state (IIFE)
Player function creates player objects with name and marker properties
Game controller object manages the game flow (IIFE)

Steps:
Initiate the game with empty cells
Switch players to mark the cell
Check the game state (ongoing/win/tie)
End the game and reset the board
*/

// Game board module manages the state of the game board
const gameBoard = (() => {
  let board = ['', '', '', '', '', '', '', '', ''];

  const getBoard = () => [...board]; // Use board as a private array

  const markCell = (index, playerMarker) => {
    if (index >= 0 && index < board.length && board[index] === '') {
      board[index] = playerMarker;
      console.log(`Cell ${index} marked with ${playerMarker}.`);
      return true;
    }
    console.log(`Failed to mark cell ${index}. It's either taken or invalid.`);
    return false;
  };

  const resetBoard = () => {
    board = ['', '', '', '', '', '', '', '', ''];
    console.log('Board has been reset.');
  };

  const checkWin = (playerMarker) => {
    const winPatterns = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
      [0, 4, 8], [2, 4, 6]             // Diagonals
    ];

    for (const pattern of winPatterns) {
      const [c1, c2, c3] = pattern;
      if (board[c1] === playerMarker && board[c2] === playerMarker && board[c3] === playerMarker) {
        return true;
      }
    }
    return false;
  };

  const checkTie = () => {
    if (board.includes('')) {
      return false;
    }
    // It's a tie if there's no winner
    return !checkWin('X') && !checkWin('O');
  };

  return {
    getBoard,
    markCell,
    resetBoard,
    checkWin,
    checkTie
  };
})();

// Player factory function creates player objects
const Player = (name, marker) => {
  const getName = () => name;
  const getMarker = () => marker;
  console.log(`${name} is using marker ${marker}.`);
  return { getName, getMarker };
};

// Game controller module manages the game flow
const GameController = (() => {
  let player1;
  let player2;
  let currentPlayer;
  let gameActive = false;

  const displayBoardConsole = () => {
    const board = gameBoard.getBoard();
    let prettyBoard = '\n';
    for (let i = 0; i < 9; i++) {
      prettyBoard += ` ${board[i] || i} `;
      if ((i + 1) % 3 === 0) {
        prettyBoard += '\n';
        if (i < 8) prettyBoard += '-----------\n';
      } else {
        prettyBoard += '|';
      }
    }
    console.log(prettyBoard);
  };

  const startGame = (player1Name = 'Player 1', player2Name = 'Player 2') => {
    player1 = Player(player1Name, 'X');
    player2 = Player(player2Name, 'O');
    currentPlayer = player1; // Marker X always starts
    gameActive = true;
    gameBoard.resetBoard();
    console.log(`Game started. ${player1.getName()} (X) vs. ${player2.getName()} (O)`);
    console.log(`It's ${currentPlayer.getName()}'s turn.`);
    displayBoardConsole();
  };

  const switchPlayer = () => {
    currentPlayer = (currentPlayer === player1) ? player2 : player1;
    console.log(`Switched player. It's now ${currentPlayer.getName()}'s turn.`);
  };

  const getCurrentPlayer = () => currentPlayer;

  const getGameStatus = () => {
    if (!gameActive) {
      if (gameBoard.checkWin(player1.getMarker())) {
        return `${player1.getName()} (${player1.getMarker()}) wins!`;
      } else if (gameBoard.checkWin(player2.getMarker())) {
        return `${player2.getName()} (${player2.getMarker()}) wins!`;
      } else if (gameBoard.checkTie()) {
        return `It's a tie!`;
      }
      return 'Game is over or not started.';
    }
    return `${currentPlayer.getName()} (${currentPlayer.getMarker()})'s turn.`;
  };

  const playTurn = (cellIndex) => {
    if (!gameActive) {
      console.log('Game is not active. Please start a new game.');
      return false;
    }

    console.log(`${currentPlayer.getName()} attempts to play at cell ${cellIndex}.`);
    if (gameBoard.markCell(cellIndex, currentPlayer.getMarker())) {
      displayBoardConsole();

      if (gameBoard.checkWin(currentPlayer.getMarker())) {
        console.log(`${currentPlayer.getName()} (${currentPlayer.getMarker()}) wins!`);
        gameActive = false;
      } else if (gameBoard.checkTie()) {
        console.log('The game is a tie!');
        gameActive = false;
      } else {
        switchPlayer();
      }
      return true;
    } else {
      console.log(`Invalid move by ${currentPlayer.getName()} at cell ${cellIndex}.`);
      displayBoardConsole();
      return false;
    }
  };

  const resetGame = () => {
    console.log('Resetting game...');
    gameBoard.resetBoard();

    if (player1 && player2) { // Ensure players were created
      currentPlayer = player1;
      gameActive = true;
      console.log(`Game reset. It's ${currentPlayer.getName()}'s turn.`);
      displayBoardConsole();
    } else {
      console.log('Cannot reset, game was not started with players.');
      startGame();
    }
  };

  return {
    startGame,
    playTurn,
    getCurrentPlayer,
    getGameStatus,
    resetGame,
  };
})();