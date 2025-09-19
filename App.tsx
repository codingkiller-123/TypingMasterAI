import React, { useState, useCallback } from 'react';
import TypingTutor from './components/TypingTutor';
import { LESSONS } from './constants';
import { generateMasteryLesson } from './services/aiService';

type AppMode = 'lessons' | 'mastery';

const App: React.FC = () => {
  const [currentLesson, setCurrentLesson] = useState(LESSONS[0]);
  const [lessonTitle, setLessonTitle] = useState('Lesson 1');
  const [appMode, setAppMode] = useState<AppMode>('lessons');
  const [isGenerating, setIsGenerating] = useState(false);
  const [voiceFeedbackEnabled, setVoiceFeedbackEnabled] = useState(false);

  const handleSelectLesson = (index: number) => {
    setCurrentLesson(LESSONS[index]);
    setLessonTitle(`Lesson ${index + 1}`);
    setAppMode('lessons');
  };
  
  const handleNextLesson = useCallback(() => {
    const currentIndex = LESSONS.indexOf(currentLesson);
    const nextIndex = (currentIndex + 1) % LESSONS.length;
    handleSelectLesson(nextIndex);
  }, [currentLesson]);

  const handleNewLessonGenerated = (lesson: string) => {
    setCurrentLesson(lesson);
    setLessonTitle('AI Practice');
    setAppMode('lessons'); // Stay in lesson mode, but with AI content
  };
  
  const handleMasteryLesson = async (topic: 'news' | 'code' | 'quote') => {
      setIsGenerating(true);
      setAppMode('mastery');
      setLessonTitle('Loading...');
      setCurrentLesson('');
      const newLesson = await generateMasteryLesson(topic);
      if(!newLesson.startsWith("Error:")) {
        setCurrentLesson(newLesson);
        setLessonTitle(`Mastery: ${topic.charAt(0).toUpperCase() + topic.slice(1)}`);
      } else {
        alert(newLesson);
        setLessonTitle('Error');
      }
      setIsGenerating(false);
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-start p-4 sm:p-6 lg:p-8 font-sans">
      <header className="w-full max-w-6xl mb-6 text-center">
        <h1 className="text-4xl sm:text-5xl font-bold text-slate-900">
          AI Typing Tutor
        </h1>
        <p className="text-slate-600 mt-2">
          Hone your typing skills with adaptive lessons and smart feedback.
        </p>
      </header>
      
      <div className="w-full max-w-6xl p-4 bg-white rounded-xl shadow-lg mb-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex-1">
                <h2 className="text-lg font-semibold text-slate-700">Beginner Lessons</h2>
                <div className="flex flex-wrap gap-2 mt-2">
                {LESSONS.map((_, index) => (
                    <button key={index} onClick={() => handleSelectLesson(index)}
                    className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                        lessonTitle === `Lesson ${index + 1}`
                        ? 'bg-blue-600 text-white shadow-md'
                        : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                    }`}>
                    Lesson {index + 1}
                    </button>
                ))}
                </div>
            </div>
             <div className="border-t sm:border-t-0 sm:border-l border-slate-200 mx-4 h-full"></div>
            <div className="flex-1">
                 <h2 className="text-lg font-semibold text-slate-700">Mastery Mode (AI)</h2>
                <div className="flex flex-wrap gap-2 mt-2">
                    <button onClick={() => handleMasteryLesson('news')} className="px-3 py-1.5 text-sm bg-purple-200 text-purple-800 hover:bg-purple-300 rounded-md transition-colors">News Headline</button>
                    <button onClick={() => handleMasteryLesson('code')} className="px-3 py-1.5 text-sm bg-sky-200 text-sky-800 hover:bg-sky-300 rounded-md transition-colors">Code Snippet</button>
                    <button onClick={() => handleMasteryLesson('quote')} className="px-3 py-1.5 text-sm bg-teal-200 text-teal-800 hover:bg-teal-300 rounded-md transition-colors">Quote</button>
                </div>
            </div>
        </div>
         <div className="mt-4 pt-4 border-t border-slate-200">
            <div className="flex items-center gap-3">
                 <h2 className="text-lg font-semibold text-slate-700">Settings</h2>
                 <label className="flex items-center cursor-pointer">
                    <div className="relative">
                        <input type="checkbox" className="sr-only" checked={voiceFeedbackEnabled} onChange={() => setVoiceFeedbackEnabled(!voiceFeedbackEnabled)} />
                        <div className={`block w-14 h-8 rounded-full ${voiceFeedbackEnabled ? 'bg-green-500' : 'bg-slate-300'}`}></div>
                        <div className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform ${voiceFeedbackEnabled ? 'translate-x-full' : ''}`}></div>
                    </div>
                    <div className="ml-3 text-slate-700 font-medium">
                        Voice Feedback on Mistakes
                    </div>
                </label>
            </div>
        </div>
      </div>
      

      <main className="w-full max-w-6xl">
        <h2 className="text-2xl font-bold text-slate-800 mb-4">{lessonTitle}</h2>
        {isGenerating ? (
            <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8 w-full flex justify-center items-center h-64">
                <p className="text-xl font-semibold text-slate-600 animate-pulse">Generating AI Lesson...</p>
            </div>
        ) : (
            <TypingTutor
            key={currentLesson} 
            lessonText={currentLesson}
            onLessonComplete={handleNextLesson}
            voiceFeedbackEnabled={voiceFeedbackEnabled}
            onNewLessonGenerated={handleNewLessonGenerated}
            />
        )}
      </main>
    </div>
  );
};

export default App;