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

export default function P3Center({ unlockNext, addScore }: { unlockNext: () => void, addScore?: (p: number) => void }) {
  const [passed, setPassed] = useState(false);
  return (
    <StageWrapper 
      title="細胞核" subtitle="" 
      metaphor={{ icon: '🧠', title: '大腦中樞', desc: '發號施令，並儲存重要的設計圖。' }} 
      unlockQuizKey="p3_center_unlock" onUnlock={unlockNext} hideMetaphor isReadyToUnlock={passed} addScore={addScore}
    >
      <DropdownTextQuiz
        onPass={() => setPassed(true)}
        addScore={addScore}
        parts={[
          "細胞核多呈",
          { answer: "球形", options: ["方形", "球形", "不規則形"] },
          "，由",
          { answer: "核膜", options: ["核膜", "細胞壁", "葉綠體"] },
          "包覆，其內部含有",
          { answer: "遺傳物質", options: ["遺傳物質", "水分", "空氣"] },
          "。是細胞的",
          { answer: "生命中樞", options: ["發電廠", "儲藏室", "生命中樞"] },
          "，負責",
          { answer: "控制", options: ["產生", "分解", "控制"] },
          "細胞的代謝作用。"
        ]}
      />
      <CellImagePair animalImg="animal-cell-nucleus.png" plantImg="plant-cell-nucleus.png" />
    </StageWrapper>
  );
}

