"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { CheckCircle2, XCircle, Trophy } from "lucide-react";
import { Question } from "@/lib/types";


export default function QuizComponent({ questions, onComplete, addScore }: { questions: Question[], onComplete: () => void, addScore?: (p: number) => void }) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [tries, setTries] = useState(1);
  const [isFinished, setIsFinished] = useState(false);

  const currentQ = questions[currentIdx];

  const handleSelect = (idx: number) => {
    if (isCorrect) return;
    setSelectedIdx(idx);
    const correct = currentQ.options[idx] === currentQ.answer;
    setIsCorrect(correct);
    if (!correct) {
      setTries(prev => prev + 1);
    } else if (addScore) {
      if (tries === 1) addScore(100);
      else if (tries === 2) addScore(50);
      else addScore(0);
    }
  };

  const nextQ = () => {
    if (currentIdx + 1 < questions.length) {
      setCurrentIdx((i) => i + 1);
      setSelectedIdx(null);
      setIsCorrect(null);
      setTries(1);
    } else {
      setIsFinished(true);
      onComplete();
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-10">
      <div className="flex items-center justify-between bg-white border-4 border-brand-border p-6 rounded-[2rem] shadow-[8px_8px_0px_#00332c]">
        <div className="flex flex-col">
          <span className="text-[10px] font-black uppercase tracking-widest opacity-40">
            Challenge Node
          </span>
          <span className="text-2xl font-black text-brand-headline">
            Q{currentIdx + 1 < 10 ? `0${currentIdx + 1}` : currentIdx + 1}
          </span>
        </div>
        <div className="flex gap-2">
          {[1, 2, 3].map((t) => (
            <div
              key={t}
              className={`w-6 h-6 rounded-lg border-2 border-brand-border ${tries >= t ? "bg-red-500 scale-110" : "bg-gray-100 opacity-20"}`}
            />
          ))}
        </div>
      </div>

      <h3 className="text-4xl font-black text-brand-headline leading-tight">
        {currentQ.question}
      </h3>

      <div className="space-y-4">
        {currentQ.options.map((opt, i) => (
          <button
            key={i}
            onClick={() => handleSelect(i)}
            className={`w-full p-8 rounded-3xl border-4 text-2xl font-black transition-all flex items-center justify-between group ${
              selectedIdx === i
                ? isCorrect
                  ? "bg-green-100 border-green-600 text-green-900 shadow-[6px_6px_0px_#163c2c]"
                  : "bg-red-100 border-red-600 text-red-900 shadow-[6px_6px_0px_#4c1d1d]"
                : "bg-white border-brand-border/10 hover:border-brand-button hover:bg-brand-button/5"
            }`}
          >
            <span>{opt}</span>
            {selectedIdx === i && isCorrect === true && (
              <CheckCircle2 className="text-green-600" size={32} />
            )}
            {selectedIdx === i && isCorrect === false && (
              <XCircle className="text-red-600" size={32} />
            )}
          </button>
        ))}
      </div>

      <AnimatePresence>
        {isCorrect === false && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-brand-headline text-white p-10 rounded-[3rem] border-8 border-brand-border shadow-[12px_12px_0px_#fa5246] flex gap-8 italic"
          >
            <div className="text-5xl">⚡</div>
            <p className="text-xl font-bold leading-relaxed opacity-90">
              {currentQ.explanation}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {isCorrect === true && (
        <button
          onClick={nextQ}
          className="w-full btn-bold bg-brand-headline text-brand-button py-8 text-3xl uppercase tracking-[0.2em] italic"
        >
          Next Phase
        </button>
      )}
    </div>
  );
}
