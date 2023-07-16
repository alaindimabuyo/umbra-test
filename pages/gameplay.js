import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Link from 'next/link';
import Board from '../components/Board';
import 'tailwindcss/tailwind.css';

const Gameplay = () => {
  const [player1, setPlayer1] = useState('');
  const [player2, setPlayer2] = useState('');
  const [currentPlayer, setCurrentPlayer] = useState(1);
  const [squares, setSquares] = useState(Array(9).fill(''));
  const [result, setResult] = useState('');
  const [winner, setWinner] = useState('');
  const [gameStarted, setGameStarted] = useState(false);
  const [gameId, setGameId] = useState('');

  const winningConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  const startNewGame = async (e) => {
    console.log("Hello")
    e.preventDefault();
  
    // Validate player names
    if (player1.trim() === '' || player2.trim() === '') {
      alert('Please enter both player names.');
      return;
    }
  
    try {
      const response = await axios.post('/api/games', {
        player1,
        player2,
      });
      console.log('New game session started:', response.data);
      setGameId(response.data._id);
      setGameStarted(true);
    } catch (error) {
      console.error('Failed to start a new game session:', error);
    }
  };
  

  const recordResult = async () => {
    handleReset()
    try {
      await axios.put(`/api/games/${gameId}`, {
        result,
      });
      console.log('Result recorded successfully');
    } catch (error) {
      console.error('Failed to record the game result:', error);
    }
  };

  const endGameSession = async () => {
    try {
      await axios.put(`/api/games/${gameId}/end`);
      console.log('Game session ended successfully');
    } catch (error) {
      console.error('Failed to end the game session:', error);
    }
  };

  const checkWinner = (player) => {
    for (let i = 0; i < winningConditions.length; i++) {
      const [a, b, c] = winningConditions[i];
      if (
        squares[a] === player &&
        squares[b] === player &&
        squares[c] === player
      ) {
        return true;
      }
    }
    return false;
  };

  useEffect(() => {
    if (checkWinner('X')) {
      setWinner(player1);
    } else if (checkWinner('O')) {
      setWinner(player2);
    }
  }, [squares]);

  const handleClick = (index) => {
    if (squares[index] === '' && !winner && gameStarted) {
      const updatedSquares = [...squares];
      updatedSquares[index] = currentPlayer === 1 ? 'X' : 'O';
      setSquares(updatedSquares);
      setCurrentPlayer(currentPlayer === 1 ? 2 : 1);
    }
  };

  const handleReset = () => {
    setPlayer1('');
    setPlayer2('');
    setCurrentPlayer(1);
    setSquares(Array(9).fill(''));
    setResult('');
    setWinner('');
    setGameStarted(false);
  };

  return (
    <div className="mt-4 flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold">New Game Session</h1>
      <form onSubmit={startNewGame}>
        <input
          type="text"
          placeholder="Player 1"
          value={player1}
          onChange={(e) => setPlayer1(e.target.value)}
          className="mt-2 px-4 py-2 border border-gray-300 rounded"
        />
        <input
          type="text"
          placeholder="Player 2"
          value={player2}
          onChange={(e) => setPlayer2(e.target.value)}
          className="mt-2 px-4 py-2 border border-gray-300 rounded"
        />
        <button
          type="submit"
          className="mt-4 px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
        >
          Start
        </button>
        <Link className="ml-2 inline-block px-4 py-2 text-blue-500 rounded hover:bg-blue-100" href="/">

            Cancel
         
        </Link>
      </form>
   
      <h2 className="text-2xl">
        Current Player: {currentPlayer === 1 ? player1 : player2}
      </h2>
      <Board
        squares={squares}
        onClick={handleClick}
        disabled={!gameStarted || !!winner}
      />
      {winner && (
        <div className="mt-4">
          <h2 className="text-2xl">Winner: {winner}</h2>
        </div>
      )}
      <div className="mt-4">
       
        <div className="mt-4">
          <button
            onClick={recordResult}
            className="px-4 py-2 text-white bg-green-500 rounded hover:bg-green-600"
          >
            Continue
          </button>
          <button
            onClick={endGameSession}
            className="ml-2 px-4 py-2 text-white bg-red-500 rounded hover:bg-red-600"
          >
            Stop
          </button>
          <button
            onClick={handleReset}
            className="ml-2 px-4 py-2 text-white bg-gray-500 rounded hover:bg-gray-600"
          >
            Reset
          </button>
        </div>
      </div>
      <Link className="mt-4 inline-block px-4 py-2 text-blue-500 rounded hover:bg-blue-100" href="/">
      
          Return to Home
      
      </Link>
    </div>
  );
};

export default Gameplay;
