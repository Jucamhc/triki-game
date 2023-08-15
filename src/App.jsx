import { useState } from "react";
import "./App.css";
import confetti from "canvas-confetti";
import { Squeare } from "./components/Square";
import { TURNS } from "./constants";
import { checkWinner, checkEndGame } from "./logic/board";
import WinnerModal from "./components/WinnerModal";

function App() {
  const [board, setBoard] = useState(() => {
    const boardFromStorage = window.localStorage.getItem("board");
    if (boardFromStorage) return JSON.parse(boardFromStorage);
    return Array(9).fill(null);
  });

  const [turn, setTurn] = useState(() => {
    const turnFromStorage = window.localStorage.getItem("turn");
    return turnFromStorage ?? TURNS.X;
  });
  const [winner, setWinner] = useState(null);

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setTurn(TURNS.X);
    setWinner(null);

    window.localStorage.removeItem("board");
    window.localStorage.removeItem("turn");
  };

  const updateBoard = (index) => {
    // Si le das click a la misma posicion no realizara ninguana modificacion
    if (board[index] || winner) return;
    // Actualizar Tablero
    const newBoard = [...board];
    newBoard[index] = turn;
    setBoard(newBoard);
    // Cambiar turno
    const newTurn = turn === TURNS.X ? TURNS.O : TURNS.X;
    setTurn(newTurn);

    window.localStorage.setItem("board", JSON.stringify(newBoard));
    window.localStorage.setItem("turn", newTurn);

    //revisar si hay un Ganador
    const newWinner = checkWinner(newBoard);
    if (newWinner) {
      confetti();
      setWinner(newWinner);
    } else if (checkEndGame(newBoard)) {
      setWinner(false);
    }
  };

  return (
    <main className="board">
      <h1>Triki!!</h1>
      <button onClick={resetGame}>Reiniciar el Juego</button>
      <section className="game">
        {board.map((_, index) => {
          return (
            <Squeare key={index} index={index} updateBoard={updateBoard}>
              {board[index]}
            </Squeare>
          );
        })}
      </section>

      <section className="turn">
        <Squeare isSelected={turn === TURNS.X}>{TURNS.X}</Squeare>
        <Squeare isSelected={turn === TURNS.O}>{TURNS.O}</Squeare>
      </section>
      <WinnerModal resetGame={resetGame} winner={winner} />
    </main>
  );
}

export default App;
