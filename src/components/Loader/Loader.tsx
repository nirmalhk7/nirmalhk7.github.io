import React, { useEffect, useState } from 'react';
import styles from './loader.module.scss';

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
    <div className={`${styles.loaderContainer} ${!isLoading ? styles.hidden : ''}`}>
      <div className={styles.board}>
        {displayText.map((char, index) => (
          <div key={index} className={styles.letterContainer}>
            <div className={styles.letter}>
              {char}
              <div className={styles.splitLine}></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Loader;
