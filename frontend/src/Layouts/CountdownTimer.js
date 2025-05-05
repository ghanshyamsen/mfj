import React, { useEffect, useState } from 'react';
import './layout.css';

const CountdownTimer = ({ minutes, startTime }) => {
  const [timeLeft, setTimeLeft] = useState(minutes * 60);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    if (isRunning) {
      const intervalId = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 0) {
            clearInterval(intervalId);
            setIsRunning(false);
            console.log('The clock has stopped!');
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);

      return () => clearInterval(intervalId);
    }
  }, [isRunning]);

  useEffect(() => {
    if (timeLeft > 0) {
      console.log('Clock interval', timeLeft);
    }
  }, [timeLeft]);

  const startCountdown = () => {
    if (!isRunning) {
      setIsRunning(true);
    }
  };

  const stopCountdown = () => {
    setIsRunning(false);
  };

  const formatTime = (time) => {
    const mins = Math.floor(time / 60).toString().padStart(2, '0');
    const secs = (time % 60).toString().padStart(2, '0');
    return { mins, secs };
  };

  const { mins, secs } = formatTime(timeLeft);

  return (
    <div className="countdown">
      <div className="countdown-display">
        <div className="flip-card">
          <span className="top">{mins}</span>
          <span className="bottom">{mins}</span>
        </div>
        <div className="colon">:</div>
        <div className="flip-card">
          <span className="top">{secs}</span>
          <span className="bottom">{secs}</span>
        </div>
      </div>
      <button onClick={startCountdown}>Start Countdown</button>
      <button onClick={stopCountdown}>Stop Countdown</button>
    </div>
  );
};

export default CountdownTimer;
