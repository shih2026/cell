"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import Image from "next/image";
import { Trophy, CheckCircle2, Lock, XCircle, Mic, CirclePlay, Search, ShieldCheck, Zap, Box, Castle, Sun, Microscope, Unlock, ClipboardCheck, Lightbulb, ChevronUp, ChevronDown, ChevronLeft, ChevronRight, Gamepad2, ArrowRight } from "lucide-react";
import { STAGES, QUIZ_DATA, GAME_TASKS, CHALLENGE_QUESTIONS } from "@/lib/constants";
import { Question, TabContent, DropdownOption } from "@/lib/types";
import { auth, db, handleFirestoreError, OperationType } from "@/lib/firebase";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";

export default function MicroscopeKnob({
  value,
  onChange,
  label,
}: {
  value: number;
  onChange: (v: number) => void;
  label: string;
}) {
  const [isDragging, setIsDragging] = useState(false);
  const startY = useRef(0);
  const startVal = useRef(value);

  const handlePointerDown = (e: React.PointerEvent) => {
    setIsDragging(true);
    startY.current = e.clientY;
    startVal.current = value;
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    const dy = startY.current - e.clientY;
    let newVal = startVal.current + dy * 0.5;
    if (newVal > 100) newVal = 100;
    if (newVal < 0) newVal = 0;
    onChange(newVal);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    setIsDragging(false);
    e.currentTarget.releasePointerCapture(e.pointerId);
  };

  return (
    <div className="flex flex-col items-center gap-3 select-none">
      <div
        className="w-20 h-32 bg-[#2a2a2a] rounded-[1rem] border-4 border-[#1a1a1a] shadow-[4px_4px_0px_rgba(0,0,0,0.5)] relative overflow-hidden flex items-center justify-center cursor-ns-resize touch-none active:scale-95 transition-transform"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >
        <div
          className="w-full h-full absolute flex flex-col justify-around transition-transform duration-75"
          style={{ transform: `translateY(${(value % 20) - 10}px)` }}
        >
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="w-full h-1 bg-black/60" />
          ))}
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-black/60 pointer-events-none" />
      </div>
      <div className="text-center space-y-1">
        <div className="font-black text-xs uppercase tracking-widest text-brand-paragraph opacity-70">
          {label}
        </div>
        <div className="text-brand-button font-black text-lg">
          {Math.round(value)}
        </div>
      </div>
    </div>
  );
}

