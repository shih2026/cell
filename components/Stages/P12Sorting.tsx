"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import Image from "next/image";
import { Trophy, CheckCircle2, Lock, XCircle, Mic, CirclePlay, Search, ShieldCheck, Zap, Box, Castle, Sun, Microscope, Unlock, ClipboardCheck, Lightbulb, ChevronUp, ChevronDown, ChevronLeft, ChevronRight, Gamepad2, ArrowRight, Award, RefreshCw } from "lucide-react";
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

export default function P12Sorting({
  updateGameHighScore,
}: {
  updateGameHighScore: (p: number) => void;
}) {
  const [gameState, setGameState] = useState<"start" | "playing" | "result">(
    "start",
  );
  const [gameScore, setGameScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [timeLeft, setTimeLeft] = useState(30);
  const [currentItem, setCurrentItem] = useState<any>(null);
  const [feedback, setFeedback] = useState<{
    text: string;
    color: string;
  } | null>(null);
  const [hasScored, setHasScored] = useState(false);

  const POOL = [
    { name: "細胞核", category: "both", img: "animal-cell-nucleus.png" },
    { name: "細胞膜", category: "both", img: "plant-cell-membrane.png" },
    { name: "細胞質", category: "both", img: "animal-cell-cytoplasm.png" },
    { name: "粒線體", category: "both", img: "animal-cell-mitochondria.png" },
    { name: "液胞", category: "both", img: "plant-cell-vacuole.png" },
    { name: "細胞壁", category: "plant", img: "plant-cell-wall.png" },
    { name: "葉綠體", category: "plant", img: "plant-cell-chloroplast.png" },
  ];

  const startGame = () => {
    setGameScore(0);
    setLives(3);
    setTimeLeft(30);
    setGameState("playing");
    setHasScored(false);
    nextItem();
  };

  const gameScoreRef = useRef(0);
  useEffect(() => {
    gameScoreRef.current = gameScore;
  }, [gameScore]);

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

  const nextItem = () => {
    const random = POOL[Math.floor(Math.random() * POOL.length)];
    setCurrentItem({ ...random, id: Math.random() });
  };

  const handleChoice = (choice: "both" | "plant" | "animal") => {
    if (gameState !== "playing" || !currentItem) return;

    let newLives = lives;
    let newScore = gameScore;
    if (currentItem.category === choice) {
      newScore = gameScore + 100;
      setGameScore(newScore);
      setFeedback({ text: "⭕", color: "text-green-400" });
    } else {
      newLives = lives - 1;
      setLives(newLives);
      setFeedback({ text: "❌", color: "text-red-400" });
    }

    if (newLives <= 0) {
      finishGame();
    } else {
      setTimeout(() => setFeedback(null), 400);
      nextItem();
    }
  };

  useEffect(() => {
    if (gameState === "playing") {
      const timer = setInterval(() => {
        setTimeLeft((t) => {
          if (t <= 0) return 0;
          return t - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [gameState]);

  useEffect(() => {
    if (gameState === "playing" && timeLeft === 0) {
      const timer = setTimeout(() => {
        finishGame();
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [timeLeft, gameState, finishGame]);

  if (gameState === "start") {
    return (
      <div className="max-w-4xl mx-auto text-center py-20 space-y-12">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="card-bold bg-white p-16 border-8 border-brand-border rounded-[4rem] shadow-[20px_20px_0px_#faae2b]"
        >
          <Gamepad2 size={120} className="mx-auto text-brand-headline mb-8" />
          <h2 className="text-6xl font-black italic tracking-tighter uppercase mb-6">
            構造分類王
          </h2>
          <p className="text-2xl font-bold opacity-60 mb-12 italic">
            根據圖片構造，判斷它是出現在哪種細胞中！
          </p>
          <button
            onClick={startGame}
            className="btn-bold bg-brand-headline text-brand-button px-20 py-8 text-4xl shadow-[10px_10px_0px_#000000] hover:scale-110 active:translate-y-2 transition-all"
          >
            START
          </button>
        </motion.div>
      </div>
    );
  }

  if (gameState === "result") {
    return (
      <div className="max-w-4xl mx-auto text-center py-20 space-y-12">
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-brand-headline text-white p-16 rounded-[4rem] border-8 border-brand-border shadow-[20px_20px_0px_#faae2b] space-y-10"
        >
          <Award size={100} className="mx-auto text-brand-button" />
          <h2 className="text-5xl font-black italic tracking-tighter uppercase text-brand-button">
            時間到！
          </h2>
          <div className="space-y-4">
            <p className="text-xl font-bold opacity-60 uppercase tracking-widest text-white/50">
              Your Score
            </p>
            <p className="text-8xl font-black tabular-nums">{gameScore}</p>
          </div>
          <button
            onClick={startGame}
            className="btn-bold bg-white text-brand-headline px-10 py-5 text-xl flex items-center gap-3 mx-auto"
          >
            <RefreshCw /> 再玩一次
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-12">
      <div className="flex justify-between items-center bg-white border-4 border-brand-border p-8 rounded-[2.5rem] shadow-[10px_10px_0px_#00332c]">
        <div className="flex gap-12 text-left">
          <div className="flex flex-col">
            <span className="text-[10px] font-black uppercase tracking-widest opacity-40 mb-1">
              Time
            </span>
            <span
              className={`text-4xl font-black tabular-nums ${timeLeft < 10 ? "text-red-500 animate-pulse" : "text-brand-headline"}`}
            >
              {timeLeft}s
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-black uppercase tracking-widest opacity-40 mb-1">
              Score
            </span>
            <span className="text-4xl font-black tabular-nums text-brand-headline">
              {gameScore}
            </span>
          </div>
        </div>
        <div className="flex gap-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className={`w-10 h-10 rounded-xl border-4 border-brand-border ${i < lives ? "bg-red-500 shadow-[2px_2px_0px_#000]" : "bg-gray-100 opacity-20"}`}
            />
          ))}
        </div>
      </div>

      <div className="relative h-[480px] bg-brand-headline rounded-[4rem] border-[12px] border-brand-border shadow-inner flex flex-col items-center justify-center overflow-hidden">
        <div className="absolute inset-x-0 bottom-1/4 h-16 bg-black/20 border-y-4 border-white/5 flex items-center justify-around overflow-hidden opacity-30">
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={i}
              className="w-16 h-16 border-4 border-white/10 rounded-full flex items-center justify-center font-black text-white/5 italic"
            ></div>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {currentItem && (
            <motion.div
              key={currentItem.id}
              initial={{ x: 500, opacity: 0, rotate: 10 }}
              animate={{ x: 0, opacity: 1, rotate: 0 }}
              exit={{ x: -500, opacity: 0, scale: 1.5 }}
              transition={{ type: "spring", damping: 20 }}
              className="flex flex-col items-center gap-10 relative z-10"
            >
              <div className="w-72 h-72 bg-white border-8 border-brand-button rounded-[4rem] p-10 shadow-[0_30px_60px_rgba(0,0,0,0.6)] flex items-center justify-center relative">
                <div className="absolute -top-4 -right-4 w-12 h-12 bg-brand-button border-4 border-brand-border rounded-full flex items-center justify-center font-black z-20">
                  ?
                </div>
                <div className="relative w-full h-full">
                  <Image
                    src={`/images/${encodeURIComponent(currentItem.img || "")}`}
                    alt="細胞構造問題"
                    fill
                    className="object-contain"
                    unoptimized={true}
                    priority
                    referrerPolicy="no-referrer"
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {feedback && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 3 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex items-center justify-center pointer-events-none z-50"
            >
              <span
                className={`text-6xl font-black italic drop-shadow-2xl ${feedback.color}`}
              >
                {feedback.text}
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <button
          onClick={() => handleChoice("animal")}
          className="group relative btn-bold bg-white text-brand-headline border-8 border-brand-border p-8 hover:bg-brand-button/20 active:translate-y-2 transition-all flex flex-col items-center gap-4 rounded-[3rem] shadow-[10px_10px_0px_#00332c]"
        >
          <span className="text-6xl group-hover:scale-125 transition-transform">
            🦁
          </span>
          <span className="text-2xl font-black uppercase italic tracking-tighter text-center">
            只有動物細胞有
          </span>
        </button>

        <button
          onClick={() => handleChoice("plant")}
          className="group relative btn-bold bg-white text-green-900 border-8 border-green-600 p-8 hover:bg-green-50 active:translate-y-2 transition-all flex flex-col items-center gap-4 rounded-[3rem] shadow-[10px_10px_0px_#14532d]"
        >
          <span className="text-6xl group-hover:scale-125 transition-transform">
            🌲
          </span>
          <span className="text-2xl font-black uppercase italic tracking-tighter text-center">
            只有植物細胞有
          </span>
        </button>

        <button
          onClick={() => handleChoice("both")}
          className="group relative btn-bold bg-brand-button text-brand-headline border-8 border-brand-border p-8 hover:opacity-90 active:translate-y-2 transition-all flex flex-col items-center gap-4 rounded-[3rem] shadow-[10px_10px_0px_#000]"
        >
          <span className="text-6xl group-hover:scale-125 transition-transform">
            🧬
          </span>
          <span className="text-2xl font-black uppercase italic tracking-tighter text-center">
            兩者皆有
          </span>
        </button>
      </div>
    </div>
  );
}


