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

export default function P4Floor({ unlockNext, addScore }: { unlockNext: () => void, addScore?: (p: number) => void }) {
  const [passed, setPassed] = useState(false);
  return (
    <StageWrapper 
      title="細胞質" subtitle="" 
      metaphor={{ icon: '🧪', title: '化學工廠', desc: '各式各樣的反應都在這裡發生。' }} 
      unlockQuizKey="p4_floor_unlock" onUnlock={unlockNext} hideMetaphor isReadyToUnlock={passed} addScore={addScore}
    >
      <DropdownTextQuiz
        onPass={() => setPassed(true)}
        addScore={addScore}
        parts={[
          "細胞質由",
          { answer: "膠狀的水溶液", options: ["膠狀的水溶液", "固體結晶", "氣體"] },
          "以及散布在其中各種",
          { answer: "胞器", options: ["骨骼", "胞器", "血管"] },
          "所組成。是細胞進行",
          { answer: "代謝作用的場所", options: ["光合作用的唯一場所", "代謝作用的場所", "呼吸作用的唯一場所"] },
          "。內有許多胞器，是散布於細胞質中具",
          { answer: "特定功能", options: ["相同功能", "沒有功能", "特定功能"] },
          "的微小構造。"
        ]}
      />
      <CellImagePair animalImg="animal-cell-cytoplasm.png" plantImg="plant-cell-cytoplasm.png" />
    </StageWrapper>
  );
}

