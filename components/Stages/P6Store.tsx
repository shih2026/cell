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

export default function P6Store({ unlockNext, addScore }: { unlockNext: () => void, addScore?: (p: number) => void }) {
  const [passed, setPassed] = useState(false);
  return (
    <StageWrapper 
      title="液胞" subtitle="" 
      metaphor={{ icon: '📦', title: '儲藏室', desc: '存放各種物資，甚至還能支撐結構。' }} 
      unlockQuizKey="p6_store_unlock" onUnlock={unlockNext} hideMetaphor isReadyToUnlock={passed} addScore={addScore}
    >
      <DropdownTextQuiz
        onPass={() => setPassed(true)}
        addScore={addScore}
        parts={[
          "液胞是一種胞器，外觀呈",
          { answer: "囊泡狀", options: ["管狀", "囊泡狀", "絲狀"] },
          "，主要功能為",
          { answer: "儲存水分、養分或廢物", options: ["產生能量", "儲存水分、養分或廢物", "合成蛋白質"] },
          "。通常植物細胞的液胞",
          { answer: "較大", options: ["較大", "較小", "不存在"] },
          "，還具有維持",
          { answer: "細胞形狀", options: ["細胞形狀", "體溫", "運動"] },
          "的功能，而動物細胞的液胞則",
          { answer: "較小", options: ["較大", "較小", "不存在"] },
          "。"
        ]}
      />
      <CellImagePair animalImg="animal-cell-vacuole.png" plantImg="plant-cell-vacuole.png" />
    </StageWrapper>
  );
}

