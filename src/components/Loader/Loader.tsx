import React, { useEffect, useState } from 'react';

interface LoaderProps {
  isLoading: boolean;
  isFinishing: boolean;
  duration?: number; // Duration in ms
  onComplete?: () => void;
}

const TARGET_TEXT = "NIRMALHK7";
const CHARACTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

const Loader: React.FC<LoaderProps> = ({ isLoading, isFinishing, duration = 3000, onComplete }) => {
  const [displayText, setDisplayText] = useState<string[]>(Array(TARGET_TEXT.length).fill(""));
  const [completedIndex, setCompletedIndex] = useState(0);

  useEffect(() => {
    if (completedIndex >= TARGET_TEXT.length && isFinishing) {
      if (onComplete) {
        setTimeout(onComplete, 200);
      }
    }
  }, [completedIndex, isFinishing, onComplete]);

  useEffect(() => {
    if (!isLoading) return;

    const cycleInterval = setInterval(() => {
      setDisplayText(prev => prev.map((char, index) => {
        if (index < completedIndex) return TARGET_TEXT[index]; // Keep locked chars
        return CHARACTERS[Math.floor(Math.random() * CHARACTERS.length)];
      }));
    }, 50);

    return () => clearInterval(cycleInterval);
  }, [isLoading, completedIndex]); 
  
  useEffect(() => {
    if (!isLoading || !isFinishing) {
      setCompletedIndex(0);
      return;
    }

    const lockIntervalTime = duration / TARGET_TEXT.length;
    const lockInterval = setInterval(() => {
      setCompletedIndex(prev => {
        if (prev >= TARGET_TEXT.length) {
          clearInterval(lockInterval);
          return prev;
        }
        return prev + 1;
      });
    }, lockIntervalTime);

    return () => clearInterval(lockInterval);
  }, [isLoading, isFinishing, duration]);

  return (
    <div className={`fixed inset-0 w-full h-full bg-black flex justify-center items-center z-[9999] transition-all duration-500 ease-in-out ${!isLoading ? 'opacity-0 invisible pointer-events-none' : ''}`}>
      <div className="flex gap-2">
        {displayText.map((char, index) => (
          <div key={index} className="relative w-[60px] h-[90px] bg-[#222] rounded overflow-hidden shadow-[0_2px_5px_rgba(0,0,0,0.5)] [perspective:1000px]">
            <div className="w-full h-full flex justify-center items-center font-mono text-5xl font-bold text-slate-200 bg-[#222] relative z-[1] before:content-[''] before:absolute before:top-0 before:left-0 before:w-full before:h-1/2 before:pointer-events-none before:bg-gradient-to-b before:from-white/5 before:to-black/10 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-1/2 after:pointer-events-none after:bg-gradient-to-b after:from-black/10 after:to-white/5">
              {char}
              <div className="absolute top-1/2 left-0 w-full h-0.5 bg-black/80 z-[2] -translate-y-1/2 shadow-[0_1px_0_rgba(255,255,255,0.1)]"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Loader;
