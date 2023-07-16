import connectDB from './db';
import Game from './models/Game';

// Connect to MongoDB
connectDB();

export default async function handler(req, res) {
  if (req.method === 'GET') {
    // Retrieve all previous game data
    try {
      const games = await Game.find();
      res.status(200).json(games);
    } catch (error) {
      console.error('Failed to retrieve game data:', error);
      res.status(500).json({ error: 'Failed to retrieve game data' });
    }
  } else if (req.method === 'POST') {
    // Handle the creation of a new game session
    try {
      const { player1, player2 } = req.body;
      const newGame = new Game({ player1, player2 });
      await newGame.save();
      res.status(201).json(newGame);
    } catch (error) {
      console.error('Failed to start a new game session:', error);
      res.status(500).json({ error: 'Failed to start a new game session' });
    }
  } else if (req.method === 'PUT') {
    // Handle updating the game session
    const { id } = req.query;

    try {
      const game = await Game.findById(id);

      if (!game) {
        return res.status(404).json({ error: 'Game session not found' });
      }

      const { result } = req.body;
      game.rounds.push({ result });
      await game.save();

      res.status(200).json(game);
    } catch (error) {
      console.error('Failed to update the game session:', error);
      res.status(500).json({ error: 'Failed to update the game session' });
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}
