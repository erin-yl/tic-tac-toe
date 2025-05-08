// Game board module manages the game state
const gameBoard = (() => {
  let board = ['', '', '', '', '', '', '', '', ''];

  const getBoard = () => [...board]; // Use board as a private array

  const markCell = (index, playerMarker) => {
    if (index >= 0 && index < board.length && board[index] === '') {
      board[index] = playerMarker;
      return true;
    }
    return false;
  };

  const resetBoard = () => {
    board = ['', '', '', '', '', '', '', '', ''];
  };

  const getWinningPattern = (playerMarker) => {
    const winPatterns = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
      [0, 4, 8], [2, 4, 6]             // Diagonals
    ];

    for (const pattern of winPatterns) {
      const [c1, c2, c3] = pattern;
      if (board[c1] === playerMarker && board[c2] === playerMarker && board[c3] === playerMarker) {
        return pattern;
      }
    }
    return null;
  };

  const checkWin = (playerMarker) => {
    return getWinningPattern(playerMarker) !== null;
  };

  const checkTie = () => {
    return !board.includes('') && !checkWin('X') && !checkWin('O');
  };

  return {
    getBoard,
    markCell,
    resetBoard,
    checkWin,
    checkTie,
    getWinningPattern
  };
})();

// Player function creates player objects
const Player = (name, marker) => {
  const getName = () => name;
  const getMarker = () => marker;
  return { getName, getMarker };
};

// Display controller module handles DOM manipulations
const displayController = (() => {
  const boardCells = document.querySelectorAll('.cell');
  const player1NameInput = document.getElementById('player1-name');
  const player2NameInput = document.getElementById('player2-name');
  const startButton = document.getElementById('start-button');
  const messageDisplay = document.getElementById('message-display');

  const renderBoard = () => {
    const board = gameBoard.getBoard();
    boardCells.forEach((cell, index) => {
      cell.textContent = board[index];
      cell.classList.remove('marker', 'winning-cell');
      if (board[index] === 'X' || board[index] === 'O') {
        cell.classList.add('marker');
      }
    });
  };

  const getPlayerNames = () => {
    const p1Name = player1NameInput.value || "Player 1";
    const p2Name = player2NameInput.value || "Player 2";
    return { player1Name: p1Name, player2Name: p2Name };
  };

  const displayMessage = (message) => {
    messageDisplay.textContent = message;
  };

  const highlightWinner = (winningPattern) => {
    if (winningPattern) {
      winningPattern.forEach(index => {
        boardCells[index].classList.add('winning-cell');
      });
    }
  };

  const setBoardInteractivity = (isInteractive) => {
    boardCells.forEach(cell => {
      if (isInteractive) {
        cell.style.cursor = 'pointer';
      } else {
        cell.style.cursor = 'default';
      }
    });
  };

  const addCellClickListener = (handleCellClickCallback) => {
    boardCells.forEach(cell => {
      cell.addEventListener('click', () => {
        if (gameController.isGameActive() && cell.textContent === '') {
          handleCellClickCallback(parseInt(cell.dataset.index));
        }
      });
    });
  };

  const addStartListener = (callback) => {
    startButton.addEventListener('click', callback);
  };

  const setButtonText = (text) => {
    startButton.textContent = text;
  }

  return {
    renderBoard,
    getPlayerNames,
    displayMessage,
    highlightWinner,
    setBoardInteractivity,
    addCellClickListener,
    addStartListener,
    setButtonText
  };
})();

// Game controller module manages the game flow
const gameController = (() => {
  let player1;
  let player2;
  let currentPlayer;
  let gameActive = false;

  const handleCellClick = (cellIndex) => {
    if (!gameActive || gameBoard.getBoard()[cellIndex] !== '') {
      return;
    }

    if (gameBoard.markCell(cellIndex, currentPlayer.getMarker())) {
      displayController.renderBoard();

      const winningPattern = gameBoard.getWinningPattern(currentPlayer.getMarker());
      if (winningPattern) {
        displayController.highlightWinner(winningPattern);
        displayController.displayMessage(`${currentPlayer.getName()} (${currentPlayer.getMarker()}) wins!`);
        gameActive = false;
        displayController.setBoardInteractivity(false);
        displayController.setButtonText("Restart game");
      } else if (gameBoard.checkTie()) {
        displayController.displayMessage("It's a tie!");
        gameActive = false;
        displayController.setBoardInteractivity(false);
        displayController.setButtonText("Restart game");
      } else {
        switchPlayer();
        displayController.displayMessage(`${currentPlayer.getName()}'s (${currentPlayer.getMarker()}) turn.`);
      }
    }
  };

  const startGame = () => {
    const { player1Name, player2Name } = displayController.getPlayerNames();
    player1 = Player(player1Name, 'X');
    player2 = Player(player2Name, 'O');
    currentPlayer = player1; // X always starts
    gameActive = true;

    gameBoard.resetBoard();
    displayController.renderBoard();
    displayController.displayMessage(`${currentPlayer.getName()}'s (${currentPlayer.getMarker()}) turn.`);
    displayController.setBoardInteractivity(true);
    displayController.setButtonText("Restart game");
  };

  const switchPlayer = () => {
    currentPlayer = (currentPlayer === player1) ? player2 : player1;
  };

  const initialize = () => {
    displayController.addCellClickListener(handleCellClick);
    displayController.addStartListener(startGame);
    displayController.renderBoard();
    displayController.setBoardInteractivity(false);
  };

  const isGameActive = () => gameActive;

  return {
    initialize,
    isGameActive,
    startGame
  };
})();

// Initialize the game once the DOM is fully loaded
document.addEventListener('DOMContentLoaded', gameController.initialize);