"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import Image from "next/image";
import { Trophy, CheckCircle2, Lock, XCircle, Mic, CirclePlay, Search, ShieldCheck, Zap, Box, Castle, Sun, Microscope, Unlock, ClipboardCheck, Lightbulb, ChevronUp, ChevronDown, ChevronLeft, ChevronRight, Gamepad2, ArrowRight, RefreshCw } from "lucide-react";
import { STAGES, QUIZ_DATA, GAME_TASKS, CHALLENGE_QUESTIONS } from "@/lib/constants";
import { Question, TabContent, DropdownOption } from "@/lib/types";
import { auth, db, handleFirestoreError, OperationType } from "@/lib/firebase";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import StageWrapper from "@/components/Shared/StageWrapper";
import QuizComponent from "@/components/Shared/QuizComponent";
import CellImagePair from "@/components/Shared/CellImagePair";
import { Highlight, Connect } from "@/components/Shared/Styling";
import MicroscopeKnob from "@/components/Shared/MicroscopeKnob";
import DropdownTextQuiz from "@/components/Shared/DropdownTextQuiz";

export default function P11FinalGame({
  updateGameHighScore,
  studentInfo,
  setStudentInfo,
}: {
  updateGameHighScore: (p: number) => void;
  studentInfo: any;
  setStudentInfo: any;
}) {
  const [gameState, setGameState] = useState<"idle" | "playing" | "result">(
    "idle",
  );
  const [gameScore, setGameScore] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [feedback, setFeedback] = useState<{
    text: string;
    color: string;
  } | null>(null);
  const [progress, setProgress] = useState(0);
  const [tasks, setTasks] = useState(GAME_TASKS);
  const [hasScored, setHasScored] = useState(false);

  const startGame = useCallback(() => {
    setTasks([...GAME_TASKS].sort(() => Math.random() - 0.5));
    setGameState("playing");
    setGameScore(0);
    setCurrentIndex(0);
    setFeedback(null);
    setProgress(0);
    setHasScored(false);
  }, []);

  const finishGame = useCallback(() => {
    setGameState("result");
  }, []);

  useEffect(() => {
    if (gameState === "result" && !hasScored) {
      const timer = setTimeout(() => {
        updateGameHighScore(gameScore);
        setHasScored(true);
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [gameState, hasScored, updateGameHighScore, gameScore]);

  // High score logic is handled in useEffect above

  const handleNext = useCallback(() => {
    setFeedback(null);
    setProgress(0);
    if (currentIndex + 1 < tasks.length) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      finishGame();
    }
  }, [currentIndex, tasks.length, finishGame]);

  const handleAnswer = (mission: string) => {
    if (gameState !== "playing" || feedback) return;

    const currentTask = tasks[currentIndex];
    if (!currentTask) return;

    const isCorrect = mission === currentTask.mission;

    if (isCorrect) {
      const timeBonus = Math.max(0, 100 - progress);
      const points = 100 + timeBonus;
      setGameScore((prev) => prev + Math.floor(points));
      setFeedback({
        text: timeBonus > 70 ? "PERFECT! ⚡" : "GOOD! ✅",
        color: "text-green-500",
      });
    } else {
      setFeedback({ text: "WRONG! ❌", color: "text-red-500" });
    }

    setTimeout(handleNext, 600);
  };

  // Timer effect for progress bar
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (gameState === "playing" && !feedback) {
      interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) return 100;
          return prev + 0.5;
        });
      }, 50);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [gameState, feedback]);

  // Handle timeout
  useEffect(() => {
    if (progress >= 100 && gameState === "playing" && !feedback) {
      const timer = setTimeout(() => {
        setFeedback({ text: "TIME OUT! 💨", color: "text-gray-400" });
        setTimeout(handleNext, 600);
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [progress, gameState, feedback, handleNext]);

  const currentTask = tasks[currentIndex];

  if (gameState === "idle") {
    return (
      <div className="max-w-4xl mx-auto text-center space-y-12 py-20">
        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          className="space-y-6"
        >
          <Gamepad2 size={120} className="mx-auto text-brand-button" />
          <h2 className="text-6xl font-black text-brand-headline tracking-tighter uppercase italic">
            細胞構造快閃賽
          </h2>
          <p className="text-2xl text-brand-paragraph font-bold opacity-70">
            圖片會從左至右快速移動，你必須在消失前點選正確的功能！
          </p>
        </motion.div>

        <button
          onClick={startGame}
          className="btn-bold bg-brand-headline text-brand-button px-20 py-8 text-4xl shadow-[10px_10px_0px_#000000] hover:scale-110 active:translate-y-2 transition-all"
        >
          START CHALLENGE
        </button>
      </div>
    );
  }

  if (gameState === "result") {
    return (
      <div className="max-w-4xl mx-auto space-y-12 text-center py-20">
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-brand-headline text-white p-16 rounded-[4rem] border-8 border-brand-border shadow-[20px_20px_0px_#faae2b] space-y-10"
        >
          <Trophy size={100} className="mx-auto text-brand-button" />
          <h2 className="text-5xl font-black italic tracking-tighter uppercase text-brand-button">
            遊戲結束！
          </h2>
          <div className="space-y-2">
            <p className="text-xl font-bold opacity-60 uppercase tracking-widest">
              Your Score
            </p>
            <p className="text-8xl font-black tabular-nums">{gameScore}</p>
          </div>

          <div className="flex gap-4 justify-center">
            <button
              onClick={startGame}
              className="btn-bold bg-white text-brand-headline px-10 py-5 text-xl flex items-center gap-3"
            >
              <RefreshCw /> 再試一次
            </button>
            <button
              onClick={() => {
                alert(`恭喜！得分 ${gameScore} 已記錄。請繼續完成後續挑戰！`);
              }}
              className="btn-bold bg-brand-button text-brand-headline px-10 py-5 text-xl"
            >
              確認成績
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  if (!currentTask) return null;

  return (
    <div className="max-w-6xl mx-auto space-y-10 relative pb-20">
      {/* Game Header */}
      <div className="flex justify-between items-center bg-white/80 backdrop-blur p-6 border-4 border-brand-border rounded-3xl relative z-20">
        <div className="flex flex-col">
          <span className="text-[10px] font-black uppercase tracking-widest opacity-40">
            Challenge
          </span>
          <span className="text-3xl font-black text-brand-headline">
            {currentIndex + 1} / {tasks.length}
          </span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-[10px] font-black uppercase tracking-widest opacity-40">
            Score
          </span>
          <motion.span
            key={gameScore}
            initial={{ scale: 1.2 }}
            animate={{ scale: 1 }}
            className="text-4xl font-black text-brand-headline tabular-nums"
          >
            {gameScore}
          </motion.span>
        </div>
        <div className="w-1/3">
          <div className="h-4 bg-brand-bg rounded-full border-2 border-brand-border overflow-hidden">
            <motion.div
              className={`h-full ${progress > 70 ? "bg-red-500" : "bg-brand-button"}`}
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.05 }}
            />
          </div>
        </div>
      </div>

      {/* Play Area - Reduced Height */}
      <div className="relative h-[250px] w-full border-y-4 border-brand-border border-dashed bg-white/30 overflow-hidden flex items-center">
        <AnimatePresence mode="wait">
          {!feedback && (
            <motion.div
              key={currentIndex}
              initial={{ x: -250, opacity: 0 }}
              animate={{ x: `${progress * 1.6}%`, opacity: 1 }} // Moves across screen
              exit={{ opacity: 0, scale: 0.5 }}
              className="absolute flex flex-col items-center gap-4"
            >
              <div
                className={`w-44 h-44 bg-white border-8 ${currentTask.type === "plant" ? "border-green-600" : "border-brand-border"} rounded-[2.5rem] shadow-xl p-4 flex flex-col items-center justify-center overflow-hidden gap-1`}
              >
                <div className="relative w-24 h-24">
                  <Image
                    src={`/images/${encodeURIComponent(currentTask.img || "")}`}
                    alt={currentTask.name}
                    fill
                    className="object-contain"
                    referrerPolicy="no-referrer"
                    unoptimized={true}
                  />
                </div>
                <div className="text-xl font-black text-brand-headline tracking-tighter text-center leading-none border-t-2 border-brand-border/10 pt-1 w-full">
                  {currentTask.name}
                </div>
              </div>
              <span
                className={`px-4 py-1 rounded-lg font-black text-white text-[10px] tracking-widest ${currentTask.type === "plant" ? "bg-green-700" : "bg-brand-headline"}`}
              >
                {currentTask.type === "plant" ? "PLANT CELL" : "ANIMAL CELL"}
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Feedback Overlay */}
        <AnimatePresence>
          {feedback && (
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1.5, opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex items-center justify-center pointer-events-none z-30"
            >
              <span
                className={`text-8xl font-black drop-shadow-xl ${feedback.color}`}
              >
                {feedback.text}
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Answer Area - Expanded & Larger Fonts */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-6 relative z-20">
        {GAME_TASKS.map((t) => (
          <button
            key={t.id}
            onClick={() => handleAnswer(t.mission)}
            className="card-bold bg-white p-8 hover:bg-brand-button/20 hover:border-brand-button transition-all group flex flex-col min-h-[140px] items-center justify-center gap-3 shadow-[8px_8px_0px_#00332c] active:translate-y-1 active:shadow-none"
          >
            <div className="text-[10px] font-black opacity-30 bg-gray-100 px-3 py-1 rounded-full group-hover:bg-brand-button group-hover:opacity-100 transition-all uppercase tracking-[0.2em]">
              Function Card
            </div>
            <span className="text-2xl font-black text-brand-headline text-center leading-tight italic tracking-tighter">
              {t.mission}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

