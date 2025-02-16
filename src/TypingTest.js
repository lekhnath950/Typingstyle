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
  const [isFinished, setIsFinished] = useState(false);
  const [correctChars, setCorrectChars] = useState(0);
  const [totalChars, setTotalChars] = useState(0);
  const inputRef = useRef(null);

  useEffect(() => {
    let interval;
    if (startTime) {
      interval = setInterval(() => {
        setTimer((prev) => {
          if (prev > 1) return prev - 1;
          setIsFinished(true);
          clearInterval(interval);
          saveScore();
          return 0;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [startTime]);

  useEffect(() => {
    if (input.length === 1 && !startTime) {
      setStartTime(Date.now());
    }
    if (!sampleText.length) return;
    
    const correctText = sampleText[currentSentenceIndex] || "";
    const correctWords = correctText.split(" ");
    const currentInputWords = input.trim().split(" ");
    
    let correctCount = 0;
    let incorrectCount = 0;
    
    for (let i = 0; i < currentInputWords.length; i++) {
      if (currentInputWords[i] === correctWords[i]) {
        correctCount++;
      } else {
        incorrectCount++;
      }
    }
    
    setCorrectChars(input.length - incorrectCount);
    setTotalChars(correctText.length);
    setAccuracy(((correctChars / totalChars) * 100).toFixed(2));
    
    if (currentInputWords.length === correctWords.length) {
      setIsFinished(true);
      saveScore();
    }
    
    if (startTime) {
      const timeElapsed = (Date.now() - startTime) / 60000;
      setWpm(Math.round(correctCount / timeElapsed));
    }
  }, [input]);

  const handleLevelChange = (newLevel) => {
    setLevel(newLevel);
    setSampleText(levels[newLevel].sort(() => Math.random() - 0.5));
    setCurrentSentenceIndex(0);
    setInput("");
    setStartTime(null);
    setWpm(0);
    setAccuracy(100);
    setTimer(levels[newLevel][0].split(" ").length + 2);
    setIsFinished(false);
  };

  const saveScore = () => {
    const scores = JSON.parse(localStorage.getItem("typingScores")) || [];
    const newScore = { level, wpm, accuracy, date: new Date().toLocaleString() };
    localStorage.setItem("typingScores", JSON.stringify([...scores, newScore]));
  };

  return (
    <div className=" p-6 text-center bg-gray-900 text-white min-h-screen flex flex-col justify-center items-center">
      <h1 className="text-4xl font-bold mb-6">PROFESSIONAL TYPING STYLE </h1>

      {!level ? (
        <div className="mb-6 flex space-x-4">
          <button onClick={() => handleLevelChange("simple")} className="level-button bg-blue-500">Simple</button>
          <button onClick={() => handleLevelChange("medium")} className="level-button bg-green-500">Medium</button>
          <button onClick={() => handleLevelChange("hard")} className="level-button bg-red-500">Hard</button>
        </div>
      ) : isFinished ? (
        <div className="text-center">
          <h2 className="text-2xl font-bold">Your Result</h2>
          <p>⚡ WPM: {wpm}</p>
          <p>🎯 Completed: {accuracy}%</p>
          <button onClick={() => setLevel(null)} className=" mt-4 p-3 bg-yellow-500 hover:bg-yellow-600 text-white rounded-xl shadow-md">Retry</button>
        </div>
      ) : (
        <>
          <p className="text-lg font-semibold mb-4">Level: {level.toUpperCase()}</p>
          <p className="type mb-4 text-xl font-mono bg-gray-800 p-3 rounded-lg shadow-lg">
            {sampleText[currentSentenceIndex]?.split(" ").map((word, index) => (
              <span key={index} className={`word ${input.split(" ")[index] === word ? "correct" : input.split(" ")[index] ? "incorrect" : ""}`}>{word} </span>
            ))}
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
            <p>🎯 Completed: <span className="font-bold">{accuracy}%</span></p>
          </div>

          
        </>
      )}
    </div>
    
  );
}
