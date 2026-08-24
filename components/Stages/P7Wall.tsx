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

export default function P7Wall({ unlockNext, addScore }: { unlockNext: () => void, addScore?: (p: number) => void }) {
  const [passed, setPassed] = useState(false);
  return (
    <StageWrapper 
      title="細胞壁" subtitle="" 
      metaphor={{ icon: '🧱', title: '堅固城牆', desc: '植物專屬的防禦與支撐結構。' }} 
      unlockQuizKey="p7_wall_unlock" onUnlock={unlockNext} hideMetaphor isReadyToUnlock={passed} addScore={addScore}
    >
      <DropdownTextQuiz
        onPass={() => setPassed(true)}
        addScore={addScore}
        parts={[
          "細胞壁是",
          { answer: "植物細胞", options: ["動物細胞", "植物細胞", "所有細胞"] },
          "特有的構造，位於細胞膜的",
          { answer: "外側", options: ["內側", "外側", "中間"] },
          "，主要由",
          { answer: "纖維素", options: ["蛋白質", "脂肪", "纖維素"] },
          "組成。功能是",
          { answer: "保護與支持", options: ["產生能量", "保護與支持", "控制物質進出"] },
          "細胞，並維持",
          { answer: "細胞形狀", options: ["細胞形狀", "溫度", "酸鹼值"] },
          "。"
        ]}
      />
      <CellImagePair animalExists={false} plantImg="plant-cell-wall.png" />
    </StageWrapper>
  );
}

