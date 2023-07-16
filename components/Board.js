import React from 'react';

const Board = ({ squares, onClick, disabled }) => {
  const handleClick = (index) => {
    if (!disabled) {
      onClick(index);
    } else {
      alert('The board is disabled. Please start a new game.');
    }
  };

  return (
    <div className="mt-4">
      <div className="grid grid-cols-3 gap-4" onClick={() => handleClick()}>
        {squares.map((square, index) => (
          <button
            key={index}
            className="w-12 h-12 bg-gray-200 border border-gray-300 flex items-center justify-center text-4xl font-bold"
            onClick={() => handleClick(index)}
          >
            {square}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Board;
