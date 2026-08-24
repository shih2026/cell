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

export default function P8Solar({ unlockNext, addScore }: { unlockNext: () => void, addScore?: (p: number) => void }) {
  const [passed, setPassed] = useState(false);
  return (
    <StageWrapper 
      title="葉綠體" subtitle="" 
      metaphor={{ icon: '☀️', title: '太陽能板', desc: '能捕捉陽光製造養分。' }} 
      unlockQuizKey="p8_solar_unlock" onUnlock={unlockNext} hideMetaphor isReadyToUnlock={passed} addScore={addScore}
    >
      <DropdownTextQuiz
        onPass={() => setPassed(true)}
        addScore={addScore}
        parts={[
          "葉綠體是",
          { answer: "植物細胞", options: ["動物細胞", "植物細胞", "所有細胞"] },
          "特有的構造（多存在於葉片），含有",
          { answer: "葉綠素", options: ["血紅素", "葉綠素", "黑色素"] },
          "。能夠吸收太陽能，進行",
          { answer: "光合作用", options: ["呼吸作用", "光合作用", "消化作用"] },
          "，以製造",
          { answer: "養分", options: ["水分", "二氧化碳", "養分"] },
          "供植物細胞使用。"
        ]}
      />
      <CellImagePair animalExists={false} plantImg="plant-cell-chloroplast.png" />
    </StageWrapper>
  );
}

