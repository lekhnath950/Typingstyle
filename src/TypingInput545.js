import React, { useState, useEffect, useRef } from "react";
import "./styles.css";
import levels from "./levels";

export default function TypingTest() {
  const [level, setLevel] = useState(null);
  const [sampleText, setSampleText] = useState([]);
  const [currentSentenceIndex, setCurrentSentenceIndex] = useState(0);
  const [input, setInput] = useState("");
  const [startTime, setStartTime] = useState(null);
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [timer, setTimer] = useState(60);
  const inputRef = useRef(null);
  const errorSound = new Audio("https://www.fesliyanstudios.com/play-mp3/4387");

  useEffect(() => {
    let interval;
    if (startTime) {
      interval = setInterval(() => {
        setTimer((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [startTime]);

  useEffect(() => {
    if (input.length === 1 && !startTime) {
      setStartTime(Date.now());
    }
    
    if (input.length > 0) {
      const timeElapsed = (Date.now() - startTime) / 60000; // minutes
      const wordsTyped = input.trim().split(" ").length;
      setWpm(Math.round(wordsTyped / timeElapsed));
      
      let correctChars = 0;
      input.split("").forEach((char, index) => {
        if (char === sampleText[currentSentenceIndex][index]) correctChars++;
        else errorSound.play();
      });
      setAccuracy(((correctChars / input.length) * 100).toFixed(2));
    }
  }, [input]);

  const handleLevelChange = (newLevel) => {
    setLevel(newLevel);
    setSampleText(levels[newLevel]);
    setCurrentSentenceIndex(0);
    setInput("");
    setStartTime(null);
    setWpm(0);
    setAccuracy(100);
    setTimer(60);
  };

  return (
    <div className="p-6 text-center bg-gray-900 text-white min-h-screen flex flex-col justify-center items-center">
      <h1 className="text-4xl font-bold mb-6">Professional Typing Master</h1>
      {!level ? (
        <div className="mb-6 flex space-x-4">
          <button onClick={() => handleLevelChange("simple")} className="p-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl shadow-md">Simple</button>
          <button onClick={() => handleLevelChange("medium")} className="p-3 bg-green-500 hover:bg-green-600 text-white rounded-xl shadow-md">Medium</button>
          <button onClick={() => handleLevelChange("hard")} className="p-3 bg-red-500 hover:bg-red-600 text-white rounded-xl shadow-md">Hard</button>
        </div>
      ) : (
        <p className="text-lg font-semibold mb-4">Level: {level.toUpperCase()}</p>
      )}
      {level && (
        <>
          <p className="type mb-4 text-xl font-mono bg-gray-800 p-3 rounded-lg shadow-lg">
            {sampleText[currentSentenceIndex].split("" ).map((char, index) => {
              let className = "text-gray-500"; // Default gray
              if (input[index]) {
                if (input[index] === char) {
                  className = "text-white font-bold"; // Correct input
                } else { 
                  className = "text-red-500"; // Incorrect input
                }
              }
              return (
                <span key={index} className={className}>{char}</span>
              );
            })}
          </p>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-3/4 p-2 text-xl border-2 border-gray-400 rounded-md focus:outline-none focus:border-blue-500 bg-gray-700 text-white"
            autoFocus
          />
          <div className="mt-6 flex space-x-6 text-xl">
            <p>⏳ Timer: <span className="font-bold">{timer}s</span></p>
            <p>⚡ WPM: <span className="font-bold">{wpm}</span></p>
            <p>🎯 Accuracy: <span className="font-bold">{accuracy}%</span></p>
          </div>
        </>
      )}
    </div>
  );
}
