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

export default function P1Blocks({ unlockNext, addScore }: { unlockNext: () => void, addScore?: (p: number) => void }) {
  const [passed, setPassed] = useState(false);
  return (
    <StageWrapper 
      title="細胞的種類" subtitle="" 
      metaphor={{ icon: '🧩', title: '樂高積木', desc: '所有的複雜結構都由最小單元組成。' }} 
      unlockQuizKey="p1_blocks" onUnlock={unlockNext} hideMetaphor isReadyToUnlock={passed} addScore={addScore}
    >
      <DropdownTextQuiz
        onPass={() => setPassed(true)}
        addScore={addScore}
        parts={[
          "細胞的",
          { answer: "種類有很多", options: ["種類有很多", "都長得一樣", "沒有特定功能"] },
          "，但大多具有相似的",
          { answer: "基本構造", options: ["基本構造", "複雜外觀", "化學成分"] },
          "，主要包含",
          { answer: "細胞核", options: ["細胞核", "葉綠體", "細胞壁"] },
          "、",
          { answer: "細胞質", options: ["粒線體", "細胞質", "液胞"] },
          "與",
          { answer: "細胞膜", options: ["細胞壁", "細胞膜", "葉綠體"] },
          "等共有構造。"
        ]}
      />
      <CellImagePair animalImg="animal-cell-full.png" plantImg="plant-cell-full.png" />
    </StageWrapper>
  );
}

