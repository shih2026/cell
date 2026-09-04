"use client";

import P1Blocks from "@/components/Stages/P1Blocks";
import P2Gate from "@/components/Stages/P2Gate";
import P3Center from "@/components/Stages/P3Center";
import P4Floor from "@/components/Stages/P4Floor";
import P5Power from "@/components/Stages/P5Power";
import P6Store from "@/components/Stages/P6Store";
import P7Wall from "@/components/Stages/P7Wall";
import P8Solar from "@/components/Stages/P8Solar";
import P9Compare from "@/components/Stages/P9Compare";
import P10CellLab from "@/components/Stages/P10CellLab";
import P11ObserveSummary from "@/components/Stages/P11ObserveSummary";
import P11FinalGame from "@/components/Stages/P11FinalGame";
import P12Sorting from "@/components/Stages/P12Sorting";
import P13SummaryChallenge from "@/components/Stages/P13SummaryChallenge";
import P14SubmitReport from "@/components/Stages/P14SubmitReport";


import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import Image from "next/image";
import { auth, db, handleFirestoreError, OperationType } from "@/lib/firebase";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import {
  ChevronRight,
  CheckCircle2,
  XCircle,
  Trophy,
  Brain,
  Gamepad2,
  Mic,
  Info,
  ArrowRight,
  RefreshCw,
  Award,
  CirclePlay,
  Search,
  ShieldCheck,
  Zap,
  Box,
  Castle,
  Sun,
  Microscope,
  Unlock,
  ClipboardCheck,
  Lightbulb,
  ChevronUp,
  ChevronDown,
  ChevronLeft,
} from "lucide-react";
import { Question, TabContent, DropdownOption } from "@/lib/types";
import { STAGES, QUIZ_DATA, GAME_TASKS, CHALLENGE_QUESTIONS } from "@/lib/constants";

export default function LearningApp() {
  const [activeTab, setActiveTab] = useState(0);
  const [unlockedTabs, setUnlockedTabs] = useState([0]);
  const [learningScore, setLearningScore] = useState(0);
  const [factoryHighScore, setFactoryHighScore] = useState(0);
  const [sortingHighScore, setSortingHighScore] = useState(0);
  const [summaryHighScore, setSummaryHighScore] = useState(0);
  const [studentInfo, setStudentInfo] = useState({
    school: "",
    classNo: "",
    seatNo: "",
    hasSubmitted: false,
  });

  const addLearningScore = useCallback((points: number) => {
    setLearningScore((prev) => prev + points);
  }, []);

  const updateFactoryHighScore = useCallback((newScore: number) => {
    setFactoryHighScore((prev) => Math.max(prev, newScore));
  }, []);

  const updateSortingHighScore = useCallback((newScore: number) => {
    setSortingHighScore((prev) => Math.max(prev, newScore));
  }, []);

  const updateSummaryHighScore = useCallback((newScore: number) => {
    setSummaryHighScore((prev) => Math.max(prev, newScore));
  }, []);

  const handleTabChange = (index: number) => {
    if (unlockedTabs.includes(index)) {
      setActiveTab(index);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const unlockNext = () => {
    if (
      !unlockedTabs.includes(activeTab + 1) &&
      activeTab + 1 < STAGES.length
    ) {
      setUnlockedTabs((prev) => [...prev, activeTab + 1]);
    }
  };

  const unlockAll = () => {
    setUnlockedTabs(STAGES.map((_, i) => i));
  };

  const handleUnlockWithPassword = () => {
    const pwd = window.prompt("請輸入解鎖密碼：");
    if (pwd === "cbb") {
      unlockAll();
    } else if (pwd !== null) {
      alert("密碼錯誤！");
    }
  };

  const renderTabContent = (idx: number) => {
    switch (idx) {
      case 0:
        return <P1Blocks unlockNext={unlockNext} addScore={addLearningScore} />;
      case 1:
        return <P2Gate unlockNext={unlockNext} addScore={addLearningScore} />;
      case 2:
        return <P3Center unlockNext={unlockNext} addScore={addLearningScore} />;
      case 3:
        return <P4Floor unlockNext={unlockNext} addScore={addLearningScore} />;
      case 4:
        return <P5Power unlockNext={unlockNext} addScore={addLearningScore} />;
      case 5:
        return <P6Store unlockNext={unlockNext} addScore={addLearningScore} />;
      case 6:
        return <P7Wall unlockNext={unlockNext} addScore={addLearningScore} />;
      case 7:
        return <P8Solar unlockNext={unlockNext} addScore={addLearningScore} />;
      case 8:
        return (
          <P9Compare addScore={addLearningScore} unlockNext={unlockNext} />
        );
      case 9:
        return <P10CellLab unlockNext={unlockNext} />;
      case 10:
        return <P11ObserveSummary unlockNext={unlockNext} />;
      case 11:
        return (
          <P11FinalGame
            updateGameHighScore={updateFactoryHighScore}
            studentInfo={studentInfo}
            setStudentInfo={setStudentInfo}
          />
        );
      case 12:
        return <P12Sorting updateGameHighScore={updateSortingHighScore} />;
      case 13:
        return (
          <P13SummaryChallenge updateGameHighScore={updateSummaryHighScore} />
        );
      case 14:
        return (
          <P14SubmitReport
            learningScore={learningScore}
            factoryHighScore={factoryHighScore}
            sortingHighScore={sortingHighScore}
            summaryHighScore={summaryHighScore}
            studentInfo={studentInfo}
            setStudentInfo={setStudentInfo}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col min-h-screen font-sans border-[12px] border-brand-border bg-[#f2f7f5]">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b-4 border-brand-border p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row justify-between items-center mb-6 gap-6">
          <h1 className="text-2xl md:text-3xl font-black text-brand-headline tracking-tighter uppercase italic underline decoration-brand-button decoration-8 decoration-skip-ink-none text-center lg:text-left">
            細胞工廠：解密實驗室
          </h1>

          <motion.div
            id="score-board"
            className="bg-brand-button border-4 border-brand-border p-4 rounded-[1.5rem] shadow-[4px_4px_0px_#00332c] flex flex-wrap gap-6 justify-center items-center"
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex flex-col items-center">
              <span className="text-[8px] font-black uppercase tracking-widest text-[#00332c] opacity-50">
                學習進度 EXP
              </span>
              <span className="text-2xl font-black text-[#00332c] tabular-nums">
                {learningScore.toLocaleString()}
              </span>
            </div>

            <div className="flex flex-col items-center border-l-2 border-brand-border/20 pl-6">
              <span className="text-[8px] font-black uppercase tracking-widest text-[#00332c] opacity-50">
                功能最高分 HI
              </span>
              <span className="text-2xl font-black text-[#00332c] tabular-nums">
                {factoryHighScore.toLocaleString()}
              </span>
            </div>

            <div className="flex flex-col items-center border-l-2 border-brand-border/20 pl-6">
              <span className="text-[8px] font-black uppercase tracking-widest text-[#00332c] opacity-50">
                分類最高分 HI
              </span>
              <span className="text-2xl font-black text-[#00332c] tabular-nums">
                {sortingHighScore.toLocaleString()}
              </span>
            </div>

            <div className="flex flex-col items-center border-l-2 border-brand-border/20 pl-6">
              <span className="text-[8px] font-black uppercase tracking-widest text-[#00332c] opacity-50">
                總結最高分 HI
              </span>
              <span className="text-2xl font-black text-[#00332c] tabular-nums">
                {summaryHighScore.toLocaleString()}
              </span>
            </div>
          </motion.div>
        </div>

        <div className="flex overflow-x-auto gap-3 px-2 no-scrollbar pb-2">
          {STAGES.map((tab, idx) => (
            <button
              key={tab.id}
              id={`tab-${tab.id}`}
              onClick={() => handleTabChange(idx)}
              disabled={!unlockedTabs.includes(idx)}
              className={`px-6 py-2 rounded-full whitespace-nowrap transition-all text-sm font-black border-2 border-brand-border ${
                activeTab === idx
                  ? "bg-brand-button text-brand-headline shadow-[4px_4px_0px_#00332c] scale-105"
                  : unlockedTabs.includes(idx)
                    ? "bg-white text-brand-paragraph hover:bg-gray-50"
                    : "bg-gray-100 text-gray-300 cursor-not-allowed opacity-50"
              }`}
            >
              {idx + 1 < 10 ? `0${idx + 1}` : idx + 1} {tab.title}
            </button>
          ))}
          <button
            onClick={handleUnlockWithPassword}
            className="px-6 py-2 rounded-full whitespace-nowrap transition-all text-sm font-black border-2 border-brand-border bg-gray-800 text-white hover:bg-gray-700 flex items-center gap-2"
            title="Unlock All Pages"
          >
            <Unlock size={16} /> 解鎖全部
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-10 pb-40">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
          >
            {renderTabContent(activeTab)}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Progress Footer */}
      <footer className="fixed bottom-0 left-0 right-0 max-w-[1024px] mx-auto bg-brand-headline h-20 flex items-center px-10 gap-8 z-50 rounded-t-[3rem] border-x-8 border-t-8 border-brand-border">
        <span className="text-brand-button font-black text-xs uppercase tracking-[0.2em] italic">
          Systems.OS
        </span>
        <div className="flex-grow h-4 bg-white/10 rounded-full flex gap-1.5 p-1 overflow-hidden border-2 border-white/5">
          {STAGES.map((_, i) => (
            <div
              key={i}
              className={`h-full rounded-full transition-all duration-700 ${
                i <= activeTab ? "bg-brand-button flex-grow" : "bg-white/10 w-8"
              }`}
            />
          ))}
        </div>
        <div className="flex items-center gap-6">
          <span className="text-white font-black text-sm uppercase tracking-tighter tabular-nums">
            {activeTab + 1}/{STAGES.length}
          </span>
          {unlockedTabs.includes(activeTab + 1) && (
            <button
              id="next-stage-btn"
              onClick={() => handleTabChange(activeTab + 1)}
              className="flex items-center gap-2 bg-brand-button text-brand-headline px-8 h-12 rounded-xl font-black text-sm uppercase tracking-widest border-4 border-brand-border shadow-[4px_4px_0px_#000000] active:translate-y-1 active:shadow-none transition-all"
            >
              NEXT <ArrowRight size={18} />
            </button>
          )}
        </div>
      </footer>
    </div>
  );
}

// --- Helper Components ---
