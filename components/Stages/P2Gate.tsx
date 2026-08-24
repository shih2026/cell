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

export default function P2Gate({ unlockNext, addScore }: { unlockNext: () => void, addScore?: (p: number) => void }) {
  const [passed, setPassed] = useState(false);
  return (
    <StageWrapper 
      title="細胞膜" subtitle="" 
      metaphor={{ icon: '🚪', title: '大門警衛', desc: '負責檢查所有進出的對象。' }} 
      unlockQuizKey="p2_gate_unlock" onUnlock={unlockNext} hideMetaphor isReadyToUnlock={passed} addScore={addScore}
    >
      <DropdownTextQuiz
        onPass={() => setPassed(true)}
        addScore={addScore}
        parts={[
          "細胞膜是維持細胞完整性的",
          { answer: "薄膜狀構造", options: ["薄膜狀構造", "堅硬外殼", "液態物質"] },
          "，能夠",
          { answer: "區隔", options: ["區隔", "融合", "打破"] },
          "細胞內、外環境，並負責",
          { answer: "控制物質進出", options: ["產生能量", "控制物質進出", "儲存遺傳物質"] },
          "細胞。"
        ]}
      />
      <CellImagePair animalImg="animal-cell-membrane.png" plantImg="plant-cell-membrane.png" />
    </StageWrapper>
  );
}

