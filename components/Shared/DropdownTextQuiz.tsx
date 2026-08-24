"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import Image from "next/image";
import { Trophy, CheckCircle2, Lock, XCircle, Mic, CirclePlay, Search, ShieldCheck, Zap, Box, Castle, Sun, Microscope, Unlock, ClipboardCheck, Lightbulb, ChevronUp, ChevronDown, ChevronLeft, ChevronRight, Gamepad2, ArrowRight } from "lucide-react";
import { STAGES, QUIZ_DATA, GAME_TASKS, CHALLENGE_QUESTIONS } from "@/lib/constants";
import { Question, TabContent, DropdownOption } from "@/lib/types";
import { auth, db, handleFirestoreError, OperationType } from "@/lib/firebase";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";

export default function DropdownTextQuiz({
  parts,
  onPass,
  addScore
}: {
  parts: (string | DropdownOption)[];
  onPass: () => void;
  addScore?: (p: number) => void;
}) {
  const [selections, setSelections] = useState<Record<number, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [passed, setPassed] = useState(false);
  const [tries, setTries] = useState(1);
  const [errors, setErrors] = useState<Record<number, boolean>>({});

  const dropdownCount = parts.filter(p => typeof p !== 'string').length;

  const handleSubmit = () => {
    if (passed) return;
    let allCorrect = true;
    const newErrors: Record<number, boolean> = {};
    
    parts.forEach((p, i) => {
      if (typeof p !== 'string') {
        if (selections[i] !== p.answer) {
          allCorrect = false;
          newErrors[i] = true;
        } else {
          newErrors[i] = false;
        }
      }
    });

    setErrors(newErrors);
    setSubmitted(true);

    if (allCorrect) {
      setPassed(true);
      if (addScore) {
        if (tries === 1) addScore(100);
        else if (tries === 2) addScore(50);
        else addScore(0);
      }
      onPass();
    } else {
      setTries(t => t + 1);
    }
  };

  return (
    <div className="card-bold bg-white border-8 border-brand-border p-12 rounded-[4rem] shadow-[20px_20px_0px_#faae2b] relative overflow-hidden">
      <div className="relative z-10 space-y-8">
        <p className="text-3xl md:text-4xl font-bold leading-[2.5] text-brand-headline italic text-center">
          {parts.map((p, i) => {
            if (typeof p === 'string') {
              return <span key={i}>{p}</span>;
            } else {
              return (
                <select
                  key={i}
                  value={selections[i] || ''}
                  onChange={(e) => {
                    setSelections({ ...selections, [i]: e.target.value });
                    setSubmitted(false);
                  }}
                  className={`mx-2 text-3xl font-black rounded-xl border-4 px-8 py-2 min-w-[240px] ${submitted ? (errors[i] ? 'bg-red-100 border-red-500 text-red-600' : 'bg-green-100 border-green-500 text-green-600') : 'bg-yellow-50 border-brand-border text-brand-headline focus:ring-4 ring-brand-button outline-none'} transition-all appearance-none cursor-pointer text-center`}
                  disabled={passed}
                >
                  <option value="" disabled>請選擇</option>
                  {p.options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
              );
            }
          })}
        </p>
        {!passed && (
          <div className="flex justify-center pt-8">
            <button
              onClick={handleSubmit}
              disabled={Object.keys(selections).length !== dropdownCount}
              className="btn-bold bg-brand-button text-brand-headline px-12 py-4 text-2xl disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 transition-transform"
            >
              送出答案
            </button>
          </div>
        )}
        {submitted && !passed && (
          <p className="text-red-500 font-bold text-center text-xl mt-4">
            有幾個選項不正確喔！再試試看吧！（這是第 {tries} 次嘗試）
          </p>
        )}
        {passed && (
          <p className="text-green-600 font-black text-center text-2xl mt-4">
            ✅ 完全正確！
          </p>
        )}
      </div>
    </div>
  );
}

