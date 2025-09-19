
import React from 'react';

interface StatsDisplayProps {
  wpm: number;
  accuracy: number;
}

const StatsDisplay: React.FC<StatsDisplayProps> = ({ wpm, accuracy }) => {
  return (
    <div className="flex justify-around p-4 bg-slate-100 rounded-lg">
      <div className="text-center">
        <div className="text-sm font-medium text-slate-500">WPM</div>
        <div className="text-4xl font-bold text-blue-600">{wpm}</div>
      </div>
      <div className="border-l border-slate-300"></div>
      <div className="text-center">
        <div className="text-sm font-medium text-slate-500">ACCURACY</div>
        <div className="text-4xl font-bold text-green-600">{accuracy}%</div>
      </div>
    </div>
  );
};

export default StatsDisplay;
