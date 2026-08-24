"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import Image from "next/image";
import { Trophy, CheckCircle2, Lock, XCircle, Mic, CirclePlay, Search, ShieldCheck, Zap, Box, Castle, Sun, Microscope, Unlock, ClipboardCheck, Lightbulb, ChevronUp, ChevronDown, ChevronLeft, ChevronRight, Gamepad2, ArrowRight } from "lucide-react";
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

export default function P13SummaryChallenge({
  updateGameHighScore,
}: {
  updateGameHighScore: (p: number) => void;
}) {
  const [gameState, setGameState] = useState<"start" | "playing" | "result">(
    "start",
  );
  const [answers, setAnswers] = useState<(number | null)[]>(
    new Array(10).fill(null),
  );
  const [showIncompleteError, setShowIncompleteError] = useState(false);
  const [score, setScore] = useState(0);

  const handleSubmit = () => {
    if (answers.includes(null)) {
      setShowIncompleteError(true);
      return;
    }

    let total = 0;
    answers.forEach((ans, idx) => {
      if (ans === CHALLENGE_QUESTIONS[idx].correct) total += 100;
    });

    setScore(total);
    setGameState("result");
    updateGameHighScore(total);
  };

  if (gameState === "start") {
    return (
      <div className="min-h-[700px] flex items-center justify-center p-10">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="card-bold bg-white p-12 border-8 border-brand-border rounded-[4rem] shadow-[20px_20px_0px_#faae2b] text-center max-w-2xl"
        >
          <ClipboardCheck
            size={100}
            className="mx-auto text-brand-headline mb-8"
          />
          <h2 className="text-6xl font-black italic tracking-tighter uppercase mb-6">
            總結挑戰
          </h2>
          <p className="text-2xl font-bold opacity-60 mb-12 italic">
            精選 10 題核心觀念，檢驗你的細胞學實力！
            <br />
            每題 100 分，拿到 1000 分才算完美通關！
          </p>
          <button
            onClick={() => setGameState("playing")}
            className="btn-bold bg-brand-headline text-brand-button px-20 py-8 text-4xl shadow-[10px_10px_0px_#000000] hover:scale-110 active:translate-y-2 transition-all"
          >
            開始測驗
          </button>
        </motion.div>
      </div>
    );
  }

  if (gameState === "result") {
    return (
      <div className="min-h-[700px] p-10 overflow-auto">
        <div className="max-w-4xl mx-auto space-y-10 pb-20">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="card-bold bg-white p-10 border-8 border-brand-border rounded-[3rem] shadow-[15px_15px_0px_#faae2b] text-center"
          >
            <h2 className="text-5xl font-black italic tracking-tighter mb-4">
              測驗結果
            </h2>
            <div className="text-8xl font-black text-brand-headline mb-6">
              {score}{" "}
              <span className="text-4xl text-brand-paragraph/40">/ 1000</span>
            </div>

            {score === 1000 ? (
              <p className="text-3xl text-green-600 font-black italic mb-8">
                太完美了！你是細胞構造大師！ 🎉
              </p>
            ) : (
              <p className="text-2xl text-brand-paragraph font-bold mb-8 italic">
                還有進步空間！請查看下方提示並重新嘗試！ 💪
              </p>
            )}

            <button
              onClick={() => {
                setGameState("start");
                setAnswers(new Array(10).fill(null));
              }}
              className="btn-bold bg-brand-headline text-brand-button px-16 py-6 text-3xl shadow-[8px_8px_0px_#000] hover:scale-105 active:translate-y-1 transition-all"
            >
              重新挑戰
            </button>
          </motion.div>

          <div className="space-y-6">
            <h3 className="text-3xl font-black italic tracking-tight flex items-center gap-3">
              <Lightbulb className="text-yellow-500" /> 解題溫故
            </h3>
            {CHALLENGE_QUESTIONS.map((q, idx) => {
              const isCorrect = answers[idx] === q.correct;
              return (
                <motion.div
                  key={idx}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: idx * 0.1 }}
                  className={`p-8 border-4 rounded-[2rem] shadow-[8px_8px_0px_#cbd5e1] ${isCorrect ? "bg-green-50 border-green-500 shadow-green-100" : "bg-red-50 border-red-500 shadow-red-100"}`}
                >
                  <div className="flex justify-between items-start mb-4">
                    <span className="bg-white/80 px-4 py-1 rounded-full text-sm font-black border-2 border-brand-border">
                      題目 {idx + 1}
                    </span>
                    <span
                      className={`text-2xl font-black ${isCorrect ? "text-green-600" : "text-red-600"}`}
                    >
                      {isCorrect ? "⭕ 正確" : "❌ 錯誤"}
                    </span>
                  </div>
                  <p className="text-xl font-bold mb-4">{q.q}</p>
                  {!isCorrect && (
                    <div className="bg-white/60 p-4 rounded-xl border-t-4 border-red-200">
                      <p className="text-red-900 font-bold mb-1 italic">
                        提示：
                      </p>
                      <p className="text-red-800 opacity-80">{q.hint}</p>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[700px] p-10 overflow-auto">
      <div className="max-w-4xl mx-auto space-y-10 pb-20">
        <div className="flex justify-between items-center bg-white/80 p-6 rounded-[2rem] border-4 border-brand-border shadow-[8px_8px_0px_#000] sticky top-4 z-50">
          <h2 className="text-3xl font-black italic tracking-tighter">
            總結測驗專區
          </h2>
          <div className="flex items-center gap-4">
            <span className="text-sm font-bold opacity-50">
              進度: {answers.filter((a) => a !== null).length} / 10
            </span>
            <button
              onClick={handleSubmit}
              className="btn-bold bg-brand-headline text-brand-button px-8 py-3 rounded-xl shadow-[4px_4px_0px_#000] hover:scale-105 active:translate-y-1 transition-all"
            >
              送出提交
            </button>
          </div>
        </div>

        {showIncompleteError && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: "auto" }}
            className="bg-red-100 border-4 border-red-500 p-4 rounded-2xl text-red-600 font-black text-center italic"
          >
            ⚠️ 請完成所有題目後再送出！
          </motion.div>
        )}

        <div className="grid gap-10">
          {CHALLENGE_QUESTIONS.map((q, idx) => (
            <motion.div
              key={idx}
              initial={{ scale: 0.95, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              className="card-bold bg-white p-10 border-8 border-brand-border rounded-[3rem] shadow-[12px_12px_0px_#00332c] grid md:grid-cols-[1fr_2fr] gap-10 items-center"
            >
              <div className="bg-brand-headline rounded-2xl p-4 aspect-square border-4 border-black/10 flex items-center justify-center overflow-hidden relative">
                <Image
                  src={`/images/${encodeURIComponent(q.img || "")}`}
                  alt="Question Image"
                  fill
                  className="object-contain p-2"
                  unoptimized={true}
                  priority
                  referrerPolicy="no-referrer"
                />
              </div>

              <div>
                <div className="flex gap-4 items-center mb-6">
                  <span className="w-12 h-12 bg-brand-button border-4 border-brand-border rounded-full flex items-center justify-center font-black text-2xl">
                    {idx + 1}
                  </span>
                  <h3 className="text-2xl font-black">{q.q}</h3>
                </div>

                <div className="grid gap-4">
                  {q.options.map((opt, oIdx) => (
                    <button
                      key={oIdx}
                      onClick={() => {
                        const newAns = [...answers];
                        newAns[idx] = oIdx;
                        setAnswers(newAns);
                        setShowIncompleteError(false);
                      }}
                      className={`w-full text-left p-6 rounded-2xl border-4 font-black transition-all flex items-center justify-between ${
                        answers[idx] === oIdx
                          ? "bg-brand-button border-brand-border shadow-[4px_4px_0px_#00332c]"
                          : "bg-white border-brand-border/20 hover:border-brand-border hover:bg-gray-50"
                      }`}
                    >
                      <span className="text-xl">{opt}</span>
                      {answers[idx] === oIdx && (
                        <div className="w-6 h-6 bg-brand-headline rounded-full border-2 border-brand-border" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="flex justify-center pt-10">
          <button
            onClick={handleSubmit}
            className="btn-bold bg-brand-headline text-brand-button px-24 py-8 text-4xl shadow-[12px_12px_0px_#000] hover:scale-110 active:translate-y-2 transition-all"
          >
            送出測驗
          </button>
        </div>
      </div>
    </div>
  );
}

