import connectDB from './db';
import Game from './models/Game';


connectDB();

export default async function handler(req, res) {
  if (req.method === 'GET') {

    try {
      const games = await Game.find();
      res.status(200).json(games);
    } catch (error) {
      console.error('Failed to retrieve game data:', error);
      res.status(500).json({ error: 'Failed to retrieve game data' });
    }
  } else if (req.method === 'POST') {
  
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
   
   const { id } = req.query;

   if (req.url.endsWith('/end')) {
   
    try {
      const game = await Game.findById(id);
  
      if (!game) {
        return res.status(404).json({ error: 'Game session not found' });
      }
  
      
      game.gameData = {
        player1Wins: game.player1Wins,
        player2Wins: game.player2Wins,
        draws: game.draws,
      };
  
      
      await game.save();
  
      
      res.status(200).json({ message: 'Game session ended and data saved' });
    } catch (error) {
      console.error('Failed to end the game session:', error);
      res.status(500).json({ error: 'Failed to end the game session' });
    }
  }
   else {
    
     try {
       const game = await Game.findById(id);

       if (!game) {
         return res.status(404).json({ error: 'Game session not found' });
       }

       const { result } = req.body;
       game.winner = result;

       if (result === 'player1') {
         game.player1Wins += 1;
       } else if (result === 'player2') {
         game.player2Wins += 1;
       } else if (result === 'draw') {
         game.draws += 1;
       }

       await game.save();

       res.status(200).json(game);
     } catch (error) {
       console.error('Failed to update the game session:', error);
       res.status(500).json({ error: 'Failed to update the game session' });
     }
   }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}
