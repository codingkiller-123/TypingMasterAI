import React, { useState } from 'react';
import { useTypingGame } from '../hooks/useTypingGame';
import { GameStatus } from '../types';
import VirtualKeyboard from './VirtualKeyboard';
import StatsDisplay from './StatsDisplay';
import { generatePracticeLesson } from '../services/aiService';

interface TypingTutorProps {
  lessonText: string;
  onLessonComplete: () => void;
  voiceFeedbackEnabled: boolean;
  onNewLessonGenerated: (lesson: string) => void;
}

const Character: React.FC<{ char: string; state: 'correct' | 'incorrect' | 'current' | 'upcoming' }> = ({ char, state }) => {
    const stateClasses = {
        correct: 'text-slate-500',
        incorrect: 'text-red-500 bg-red-100 rounded-sm',
        current: 'text-blue-600 bg-blue-100 rounded-sm animate-pulse',
        upcoming: 'text-slate-800',
    };
    return <span className={`font-mono text-2xl sm:text-3xl lg:text-4xl px-0.5 ${stateClasses[state]}`}>{char}</span>;
};

const MistakeAnalysis: React.FC<{ errors: Map<number, string>; lessonText: string; onGenerateLesson: (summary: string) => void; }> = ({ errors, lessonText, onGenerateLesson }) => {
    const [isGenerating, setIsGenerating] = useState(false);
    
    const getMistakeSummary = (): { summary: string, mostCommon: string | null } => {
        if (errors.size === 0) return { summary: "No mistakes made. Great job!", mostCommon: null };

        const mistakeCounts: { [key: string]: number } = {};
        errors.forEach((typedChar, index) => {
            const expectedChar = lessonText[index];
            const mistakeKey = `"${expectedChar}" (typed "${typedChar}")`;
            mistakeCounts[mistakeKey] = (mistakeCounts[mistakeKey] || 0) + 1;
        });

        const sortedMistakes = Object.entries(mistakeCounts).sort((a, b) => b[1] - a[1]);
        
        const summary = sortedMistakes.map(([key, count]) => `${key} x${count}`).join(', ');
        return { summary, mostCommon: sortedMistakes[0][0] };
    };

    const { summary, mostCommon } = getMistakeSummary();

    const handleGenerateClick = async () => {
        setIsGenerating(true);
        await onGenerateLesson(summary);
        setIsGenerating(false);
    };

    return (
        <div className="text-center my-4 p-4 bg-amber-50 rounded-lg border border-amber-200">
            <h3 className="text-xl font-bold text-amber-800">Smart Mistake Analysis</h3>
            <p className="text-slate-600 mt-2">
                {errors.size > 0 ? `Your most common mistake was: ${mostCommon}.` : "Perfect accuracy!"}
            </p>
            {errors.size > 0 && (
                 <button
                    onClick={handleGenerateClick}
                    disabled={isGenerating}
                    className="mt-4 px-6 py-2 bg-amber-600 text-white font-semibold rounded-lg shadow-md hover:bg-amber-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 disabled:bg-slate-400 disabled:cursor-not-allowed"
                >
                    {isGenerating ? 'Generating...' : 'Create AI Practice Lesson'}
                </button>
            )}
        </div>
    );
};


const TypingTutor: React.FC<TypingTutorProps> = ({ lessonText, onLessonComplete, voiceFeedbackEnabled, onNewLessonGenerated }) => {
  const { status, typedText, errors, wpm, accuracy, nextChar, resetGame } = useTypingGame(lessonText, voiceFeedbackEnabled);
  const currentIndex = typedText.length;

  const handleGenerateAndStartLesson = async (mistakeSummary: string) => {
    const newLesson = await generatePracticeLesson(mistakeSummary);
    if (!newLesson.startsWith("Error:")) {
        onNewLessonGenerated(newLesson);
    } else {
        alert(newLesson); // Or show a toast notification
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8 w-full">
      <StatsDisplay wpm={wpm} accuracy={accuracy} />
      
      <div className="mt-6 mb-8 p-4 bg-slate-50 rounded-lg shadow-inner relative overflow-hidden">
        <p className="whitespace-pre-wrap leading-relaxed tracking-wider">
          {lessonText.split('').map((char, index) => {
            let state: 'correct' | 'incorrect' | 'current' | 'upcoming' = 'upcoming';
            if (index < currentIndex) {
              state = lessonText[index] === typedText[index] ? 'correct' : 'incorrect';
            } else if (index === currentIndex) {
              state = 'current';
            }
            return <Character key={index} char={char} state={state} />;
          })}
        </p>
        {status === GameStatus.Waiting && (
            <div className="absolute inset-0 bg-white bg-opacity-70 flex items-center justify-center backdrop-blur-sm">
                <p className="text-xl font-semibold text-slate-700">Start typing to begin...</p>
            </div>
        )}
      </div>

      {status === GameStatus.Finished && (
        <>
            <div className="text-center my-6 p-6 bg-green-50 rounded-lg border border-green-200">
                <h2 className="text-2xl font-bold text-green-800">Lesson Complete!</h2>
                <div className="flex justify-center gap-8 mt-4">
                    <div className="text-slate-700"><span className="block text-3xl font-bold">{wpm}</span><span className="text-sm">WPM</span></div>
                    <div className="text-slate-700"><span className="block text-3xl font-bold">{accuracy}%</span><span className="text-sm">Accuracy</span></div>
                </div>
            </div>

            <MistakeAnalysis errors={errors} lessonText={lessonText} onGenerateLesson={handleGenerateAndStartLesson} />
            
            <div className="mt-6 flex justify-center gap-4">
                <button onClick={resetGame} className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                Try Again
                </button>
                <button onClick={onLessonComplete} className="px-6 py-2 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                Next Lesson
                </button>
            </div>
        </>
      )}

      <VirtualKeyboard nextChar={nextChar} />
    </div>
  );
};

export default TypingTutor;