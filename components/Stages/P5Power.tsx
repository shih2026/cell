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

export default function P5Power({ unlockNext, addScore }: { unlockNext: () => void, addScore?: (p: number) => void }) {
  const [passed, setPassed] = useState(false);
  return (
    <StageWrapper 
      title="粒線體" subtitle="" 
      metaphor={{ icon: '🔋', title: '發電廠', desc: '將燃料轉換為可以使用的能量。' }} 
      unlockQuizKey="p5_power_unlock" onUnlock={unlockNext} hideMetaphor isReadyToUnlock={passed} addScore={addScore}
    >
      <DropdownTextQuiz
        onPass={() => setPassed(true)}
        addScore={addScore}
        parts={[
          "粒線體是一種",
          { answer: "胞器", options: ["細胞", "胞器", "器官"] },
          "，可利用",
          { answer: "養分", options: ["陽光", "養分", "二氧化碳"] },
          "進行",
          { answer: "呼吸作用", options: ["光合作用", "呼吸作用", "消化作用"] },
          "，藉此產生細胞運作",
          { answer: "所需的能量", options: ["所需的能量", "所需的水分", "所需的氧氣"] },
          "。"
        ]}
      />
      <CellImagePair animalImg="animal-cell-mitochondria.png" plantImg="plant-cell-mitochondria.png" />
    </StageWrapper>
  );
}

