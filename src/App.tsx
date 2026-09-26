import React, { useState, useEffect} from 'react';
import logo from './logo.svg';
import './App.css';

import playImg from "./assets/play.png";
import resetImg from "./assets/reset.png";
import workBtnClicked from "./assets/work-clicked.png";
import workBtn from "./assets/work.png";
import breakBtnClicked from "./assets/break-clicked.png";
import breakBtn from "./assets/break.png";
import idleGif from "./assets/idle.gif";
import workGif from "./assets/work.gif";
import breakGif from "./assets/break.gif";
import meowSound from "./assets/meow.mp3";
import closeBtn from "./assets/close.png";

function App() {

  const [timeLeft, setTimeLeft] = useState(50 * 60); // 25 minutes in seconds
  const [isRunning, setIsRunning] = useState(false);
  const [breakButtonImage, setBreakButtonImage] = useState(breakBtn);
  const [workButtonImage, setWorkButtonImage] = useState(workBtn);
  const [isBreak, setIsBreak] = useState(false);
  const [encouragement, setEncouragement] = useState('');
  const [gifImage, setGifImage] = useState(idleGif);
  const [image, setImage] = useState(playImg);
  const meowAudio = new Audio(meowSound);

  const cheermessage = [
    "Just a matter of minutes",
    "Rewiring out brain",
    "Doing the right thing",
    "Just like any other emotions, being Happy isnt permanent",
    "Am I curious? Am I living?",
  ]

  const breakmessage = [
    "Walk 10 min, maybe? Steps ++",
    "Snacks, maybe?",
    "Stretch your legs",
    "Drink Water",
    "I love you <3",
  ]

  // Encouragement message updater
  useEffect(() =>{
    let messageInterval: NodeJS.Timeout;

    if (isRunning) {
      const messages = isBreak? breakmessage : cheermessage;
      setEncouragement(messages[0]); // set first message initially
      let index = 1

      messageInterval = setInterval(() => {
        setEncouragement(messages[index]); 
        index = (index + 1) % messages.length;
      }, 4000); // every 4 sec 
    } else {
      setEncouragement("")
    }

    return () => clearInterval(messageInterval);
  }, [isRunning, isBreak]);



  // Countdown Timer
  useEffect( () => {
    let timer: NodeJS.Timeout;
    if (isRunning && timeLeft > 0) {
      timer = setInterval( () => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    }

    return() => clearInterval(timer);
  }, [isRunning, timeLeft]);

  //set initial switch mode to False
  useEffect(() => {
    switchMode(false);
  }, []);

  // meow sound
  useEffect(() => {
    if (timeLeft === 0 && isRunning) {
        meowAudio.play().catch(err => {
            console.error("Audio play failed:", err);
        });
        setIsRunning(false); // Optional: auto-stop the timer
        setImage(playImg);   // Reset to play button
        setGifImage(idleGif); // Reset to idle gif
        setTimeLeft(isBreak ? 5 * 60 : 50 * 60);
    }
}, [timeLeft]);

  const formatTime = (seconds: number): string => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');

    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const switchMode = (breakMode: boolean) => {
    setIsBreak(breakMode);
    setIsRunning(false);
    setBreakButtonImage(breakMode? breakBtnClicked : breakBtn);
    setWorkButtonImage(breakMode? workBtn: workBtnClicked);
    setTimeLeft(breakMode? 5 * 60 : 50 * 60);
    setGifImage(idleGif);
  }

  const handleClick = () => {
    if (!isRunning) {
      setIsRunning(true);
      setGifImage(isBreak? breakGif: workGif);
      setImage(resetImg)
    } else {
      setIsRunning(false);
      setTimeLeft(isBreak? 5*60: 50*60);
      setGifImage(idleGif);
      setImage(playImg);
    }
  }

  const handleCloseClick = () => {
    if (window.electronAPI?.closeApp) {
      window.electronAPI.closeApp();
    } else {
      console.warn("Electron API not available");
    }
  }

  const containerClass = `home-container ${isRunning ? 'backgroung-green' : ''}`;
  return (
    <div className={containerClass} style={{position: 'relative'}}>
    <div>
      <button className='close-button' onClick={handleCloseClick}>
        <img src={closeBtn} alt = "Close"/>
      </button>
    </div>
    
    <div className='home-content'>
      <div className='home-controls'>
        <button className='image-button' onClick={ () => switchMode(false)}>
          <img src={workButtonImage} alt = "Work" />
        </button>
        <button className='image-button' onClick={ () => switchMode(true)}>
          <img src={breakButtonImage} alt = "Break" />
        </button>
      </div>

      <p className={`encouragement-text ${!isRunning ? "hidden": ""}`}>
        { encouragement}
      </p>
      <h1 className='home-timer'>{formatTime(timeLeft)}</h1>
      <img src={gifImage} alt = "Timer Staus" className="gif-image" />

      <button className='home-button' onClick={handleClick}>
        <img src={image} alt = "Button Icon"/>
      </button>
    </div>
    </div>
  );
}

export default App;
