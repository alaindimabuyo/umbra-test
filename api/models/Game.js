import mongoose from 'mongoose';

const gameSchema = new mongoose.Schema({
  player1: String,
  player2: String,
  rounds: [
    {
      result: String,
    },
  ],
  sessionStatus: {
    type: String,
    default: 'active',
  },
});

export default mongoose.models.Game || mongoose.model('Game', gameSchema);
