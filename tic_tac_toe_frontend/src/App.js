import React, { useMemo, useState } from 'react';
import './App.css';

/**
 * PUBLIC_INTERFACE
 * App renders a simple 3x3 Tic Tac Toe game with:
 * - Two-player local play (X and O)
 * - Status display (current turn, winner, or draw)
 * - Winner/draw detection and disabled moves when the game ends
 * - Restart button to reset the game
 * - Responsive, centered layout with a light theme
 */
function App() {
  // Game state
  const [board, setBoard] = useState(Array(9).fill(null)); // 9 squares
  const [xIsNext, setXIsNext] = useState(true);
  const [isGameOver, setIsGameOver] = useState(false);

  // Derived state
  const winner = useMemo(() => calculateWinner(board), [board]);
  const isDraw = useMemo(() => !winner && board.every((s) => s !== null), [winner, board]);

  // Update game over flag
  React.useEffect(() => {
    setIsGameOver(Boolean(winner) || isDraw);
  }, [winner, isDraw]);

  // PUBLIC_INTERFACE
  const handleSquareClick = (index) => {
    /**
     * Handle a user clicking a square.
     * - Ignore if game is over or square is already filled.
     * - Place current player's mark, then update turn.
     */
    if (isGameOver || board[index]) return;

    const nextBoard = board.slice();
    nextBoard[index] = xIsNext ? 'X' : 'O';
    setBoard(nextBoard);
    setXIsNext((prev) => !prev);
  };

  // PUBLIC_INTERFACE
  const restart = () => {
    /** Reset the game to its initial state. */
    setBoard(Array(9).fill(null));
    setXIsNext(true);
    setIsGameOver(false);
  };

  const statusText = useMemo(() => {
    if (winner) return `Winner: ${winner}`;
    if (isDraw) return 'Draw! No more moves.';
    return `Turn: ${xIsNext ? 'X' : 'O'}`;
  }, [winner, isDraw, xIsNext]);

  const statusClassName = useMemo(() => {
    if (winner) return 'status status-win';
    if (isDraw) return 'status status-draw';
    return 'status';
  }, [winner, isDraw]);

  return (
    <div className="App">
      <main className="ttt-container">
        <h1 className="title">Tic Tac Toe</h1>
        <div className={statusClassName} aria-live="polite" role="status">
          {statusText}
        </div>

        <Board
          board={board}
          onSquareClick={handleSquareClick}
          disabled={isGameOver}
        />

        <div className="actions">
          <button className="btn btn-restart" onClick={restart} aria-label="Restart game">
            Restart
          </button>
        </div>

        <footer className="footer-note">
          Two players on one device • X goes first
        </footer>
      </main>
    </div>
  );
}

/**
 * PUBLIC_INTERFACE
 * Board renders the 3x3 grid. It accepts:
 * - board: array of 9 elements (X, O, or null)
 * - onSquareClick: callback(index)
 * - disabled: boolean to disable all squares
 */
function Board({ board, onSquareClick, disabled }) {
  return (
    <div className="board" role="grid" aria-label="Tic Tac Toe board">
      {board.map((value, idx) => (
        <Square
          key={idx}
          value={value}
          onClick={() => onSquareClick(idx)}
          disabled={disabled || Boolean(value)}
          index={idx}
        />
      ))}
    </div>
  );
}

/**
 * PUBLIC_INTERFACE
 * Square renders a single board cell as a button.
 * - value: 'X' | 'O' | null
 * - onClick: handler when user clicks
 * - disabled: disables the button when true
 */
function Square({ value, onClick, disabled, index }) {
  return (
    <button
      className={`square ${value ? `square-${value}` : ''}`}
      onClick={onClick}
      disabled={disabled}
      aria-label={`Square ${index + 1} ${value ? `with ${value}` : 'empty'}`}
      role="gridcell"
    >
      {value}
    </button>
  );
}

/**
 * PUBLIC_INTERFACE
 * calculateWinner determines if a player has won.
 * Returns 'X', 'O', or null.
 */
function calculateWinner(squares) {
  /** Standard 8 winning lines */
  const lines = [
    [0, 1, 2], // rows
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6], // columns
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8], // diagonals
    [2, 4, 6],
  ];

  for (let i = 0; i < lines.length; i += 1) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

export default App;
