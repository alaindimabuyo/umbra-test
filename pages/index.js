import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import 'tailwindcss/tailwind.css';

const Home = () => {
  const [games, setGames] = useState([]);

  useEffect(() => {
    fetchGames();
  }, []);

  const fetchGames = async () => {
    try {
      const response = await axios.get('/api/games');
      setGames(response.data);
    } catch (error) {
      console.error('Failed to retrieve game data:', error);
    }
  };

  return (
    <div className="mt-4 flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold">Tic Tac Toe App</h1>
      <h2 className="text-2xl font-semibold">Previous Games</h2>
      <ul>
        {games.map((game) => (
          <li key={game._id} className="text-lg">
            {game.player1} vs {game.player2}
          </li>
        ))}
      </ul>
      <Link className="mt-4 inline-block px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600" href="/gameplay">
          Start New Game
     
      </Link>
    </div>
  );
};

export default Home;
