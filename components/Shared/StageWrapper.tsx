"use client";

import React, { useState } from "react";
import { motion } from "motion/react";
import { CheckCircle2, Lock, CirclePlay } from "lucide-react";
import QuizComponent from "./QuizComponent";
import { QUIZ_DATA } from "@/lib/constants";


export default function StageWrapper({ children, title, subtitle, metaphor, unlockQuizKey, onUnlock, hideMetaphor, isReadyToUnlock = true, addScore }: { 
  children: React.ReactNode, 
  title: string, 
  subtitle: string, 
  metaphor?: { icon: string, title: string, desc: string },
  unlockQuizKey: string,
  onUnlock: () => void,
  hideMetaphor?: boolean,
  isReadyToUnlock?: boolean,
  addScore?: (p: number) => void
}) {
  const [showQuiz, setShowQuiz] = useState(false);

  return (
    <div className="max-w-4xl mx-auto space-y-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 pb-10 border-b-4 border-brand-border border-dashed">
        <div className="space-y-3">
          <h2 className="text-5xl font-black text-brand-headline uppercase tracking-tighter italic">
            {title}
          </h2>
          <p className="text-2xl text-brand-paragraph font-bold opacity-70 border-l-8 border-brand-button pl-6">
            {subtitle}
          </p>
        </div>
        {!hideMetaphor && metaphor && (
          <div className="card-bold bg-white p-6 flex items-center gap-5 border-brand-headline shadow-[6px_6px_0px_#00332c]">
            <div className="w-14 h-14 bg-brand-button rounded-2xl border-4 border-brand-border flex items-center justify-center text-3xl shadow-inner">
              {metaphor.icon}
            </div>
            <div>
              <div className="text-[10px] font-black uppercase tracking-widest text-brand-border opacity-50">
                就像是
              </div>
              <div className="font-black text-2xl text-brand-headline tracking-tighter">
                {metaphor.title}
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="space-y-12 min-h-[400px]">{children}</div>

      {QUIZ_DATA[unlockQuizKey] && (
        !showQuiz ? (
          <div className="text-center py-16 bg-white/50 rounded-[4rem] border-8 border-brand-border border-dashed">
            <button 
              id="unlock-quiz-trigger"
              disabled={!isReadyToUnlock}
              onClick={() => setShowQuiz(true)}
              className={`flex items-center gap-4 mx-auto btn-bold px-16 py-8 text-3xl transition-transform ${isReadyToUnlock ? 'bg-brand-headline text-brand-button hover:rotate-1' : 'bg-gray-300 text-gray-500 cursor-not-allowed opacity-50'}`}
            >
              <CirclePlay size={40} />
              {isReadyToUnlock ? '任務完成：前往認證解鎖' : '請先完成上方學習任務'}
            </button>
          </div>
        ) : (
          <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} className="pt-20">
            <QuizComponent 
              questions={QUIZ_DATA[unlockQuizKey]} 
              addScore={addScore}
              onComplete={() => {
                onUnlock();
                setShowQuiz(false);
              }} 
            />
          </motion.div>
        )
      )}
    </div>
  );
}
