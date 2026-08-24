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

export default function P9Compare({
  addScore,
  unlockNext,
}: {
  addScore: (p: number) => void;
  unlockNext: () => void;
}) {
  const ORGANELLES = [
    {
      id: "nucleus",
      name: "細胞核",
      category: "both",
      desc: "含有遺傳物質 (DNA)，是細胞的生命中樞。",
      img: "plant-cell-nucleus.png",
      note: "兩者都有細胞核來控制生理活動。",
    },
    {
      id: "membrane",
      name: "細胞膜",
      category: "both",
      desc: "控制物質進出，就像大門警衛。",
      img: "plant-cell-membrane.png",
      note: "兩者都有細胞膜來維持完整性。",
    },
    {
      id: "cytoplasm",
      name: "細胞質",
      category: "both",
      desc: "化學反應發生的工作區，呈膠體狀。",
      img: "plant-cell-cytoplasm.png",
      note: "兩者都有細胞質。",
    },
    {
      id: "mitochondria",
      name: "粒線體",
      category: "both",
      desc: "細胞的發電廠，負責進行呼吸作用。",
      img: "plant-cell-mitochondria.png",
      note: "兩者都需要粒線體產生能量。",
    },
    {
      id: "vacuole",
      name: "液胞",
      category: "both",
      desc: "儲存水分與養分。植物的極大，動物的極小。",
      img: "plant-cell-vacuole.png",
      note: "兩者都有，但植物液胞占據細胞大部分空間。",
    },
    {
      id: "wall",
      name: "細胞壁",
      category: "plant",
      desc: "位於最外層，提供支持力與保護。",
      img: "plant-cell-wall.png",
      note: "植物細胞特有，主要成分是纖維素。",
    },
    {
      id: "chloroplast",
      name: "葉綠體",
      category: "plant",
      desc: "負責進行光合作用製造養分。",
      img: "plant-cell-chloroplast.png",
      note: "植物細胞特有，能將光能轉為化學能。",
    },
  ];

  const [currentIdx, setCurrentIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState<"animal" | "plant" | "both" | null>(
    null,
  );
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showSummary, setShowSummary] = useState(false);

  const handleChoice = (category: "animal" | "plant" | "both") => {
    if (selected !== null) return;
    setSelected(category);
    const correct = ORGANELLES[currentIdx].category === category;
    setIsCorrect(correct);
    if (correct) {
      setScore((s) => s + 100);
      addScore(100);
    }
  };

  const handleNext = () => {
    setSelected(null);
    setIsCorrect(null);
    if (currentIdx + 1 < ORGANELLES.length) {
      setCurrentIdx(currentIdx + 1);
    } else {
      setShowSummary(true);
    }
  };

  const currentOrg = ORGANELLES[currentIdx];

  if (showSummary) {
    return (
      <StageWrapper
        title="動植比較"
        subtitle="任務完成：讓我們看看動植物細胞的構造對照表"
        metaphor={{ icon: "⚖️", title: "天平比較", desc: "看清兩者的異同。" }}
        unlockQuizKey="p9_compare_unlock"
        onUnlock={unlockNext}
        hideMetaphor
      >
        <div className="card-bold bg-white border-8 border-brand-border p-8 rounded-[3rem] shadow-[15px_15px_0px_#00332c] space-y-8">
          <h3 className="text-3xl font-black text-brand-headline flex items-center gap-3">
            <Trophy className="text-brand-button" />
            動植物細胞構造總覽
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse border-4 border-brand-border text-lg font-bold">
              <thead>
                <tr className="bg-brand-headline text-white border-b-4 border-brand-border">
                  <th className="p-4 border-r-4 border-brand-border">構造</th>
                  <th className="p-4 border-r-4 border-brand-border">
                    動物細胞
                  </th>
                  <th className="p-4 border-r-4 border-brand-border">
                    植物細胞
                  </th>
                  <th className="p-4">主要功能 / 特徵</th>
                </tr>
              </thead>
              <tbody className="divide-y-4 divide-brand-border/20">
                <tr className="bg-orange-50/50">
                  <td className="p-4 border-r-4 border-brand-border font-black text-brand-headline">
                    細胞核
                  </td>
                  <td className="p-4 border-r-4 border-brand-border text-green-600 text-center">
                    ✓ 有
                  </td>
                  <td className="p-4 border-r-4 border-brand-border text-green-600 text-center">
                    ✓ 有
                  </td>
                  <td className="p-4 text-brand-paragraph text-sm font-semibold">
                    含有 DNA，控制生理活動。
                  </td>
                </tr>
                <tr>
                  <td className="p-4 border-r-4 border-brand-border font-black text-brand-headline">
                    細胞膜
                  </td>
                  <td className="p-4 border-r-4 border-brand-border text-green-600 text-center">
                    ✓ 有
                  </td>
                  <td className="p-4 border-r-4 border-brand-border text-green-600 text-center">
                    ✓ 有
                  </td>
                  <td className="p-4 text-brand-paragraph text-sm font-semibold">
                    控制物質進出。
                  </td>
                </tr>
                <tr className="bg-orange-50/50">
                  <td className="p-4 border-r-4 border-brand-border font-black text-brand-headline">
                    細胞質
                  </td>
                  <td className="p-4 border-r-4 border-brand-border text-green-600 text-center">
                    ✓ 有
                  </td>
                  <td className="p-4 border-r-4 border-brand-border text-green-600 text-center">
                    ✓ 有
                  </td>
                  <td className="p-4 text-brand-paragraph text-sm font-semibold">
                    多種化學反應發生的場所。
                  </td>
                </tr>
                <tr>
                  <td className="p-4 border-r-4 border-brand-border font-black text-brand-headline">
                    粒線體
                  </td>
                  <td className="p-4 border-r-4 border-brand-border text-green-600 text-center">
                    ✓ 有
                  </td>
                  <td className="p-4 border-r-4 border-brand-border text-green-600 text-center">
                    ✓ 有
                  </td>
                  <td className="p-4 text-brand-paragraph text-sm font-semibold">
                    呼吸作用產生能量 (ATP)。
                  </td>
                </tr>
                <tr className="bg-orange-50/50">
                  <td className="p-4 border-r-4 border-brand-border font-black text-brand-headline">
                    液胞
                  </td>
                  <td className="p-4 border-r-4 border-brand-border text-brand-paragraph text-center">
                    ✓ 有 (小、多)
                  </td>
                  <td className="p-4 border-r-4 border-brand-border text-green-600 text-center font-black">
                    ✓ 有 (特大)
                  </td>
                  <td className="p-4 text-brand-paragraph text-sm font-semibold">
                    儲存水、養分、廢物。植物液胞極大可用於支撐。
                  </td>
                </tr>
                <tr className="bg-red-50">
                  <td className="p-4 border-r-4 border-brand-border font-black text-brand-headline">
                    細胞壁
                  </td>
                  <td className="p-4 border-r-4 border-brand-border text-red-500 text-center">
                    ✕ 無
                  </td>
                  <td className="p-4 border-r-4 border-brand-border text-green-600 text-center font-black bg-green-50">
                    ✓ 有
                  </td>
                  <td className="p-4 text-brand-paragraph text-sm font-semibold">
                    支持與保護，主要成分為纖維素。
                  </td>
                </tr>
                <tr className="bg-red-50">
                  <td className="p-4 border-r-4 border-brand-border font-black text-brand-headline">
                    葉綠體
                  </td>
                  <td className="p-4 border-r-4 border-brand-border text-red-500 text-center">
                    ✕ 無
                  </td>
                  <td className="p-4 border-r-4 border-brand-border text-green-600 text-center font-black bg-green-50">
                    ✓ 有 (綠色細胞)
                  </td>
                  <td className="p-4 text-brand-paragraph text-sm font-semibold">
                    進行光合作用，製造有機養分。
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </StageWrapper>
    );
  }

  return (
    <StageWrapper
      title="動植比較"
      subtitle="挑戰：分類以下構造究竟是植物獨有、或是兩者共有呢？"
      metaphor={{ icon: "⚖️", title: "天平比較", desc: "看清兩者的異同。" }}
      unlockQuizKey="p9_compare_unlock"
      onUnlock={unlockNext}
      hideMetaphor
    >
      <div className="max-w-2xl mx-auto space-y-10">
        <div className="bg-white border-4 border-brand-border p-6 rounded-[2rem] shadow-[8px_8px_0px_#00332c] flex justify-between items-center">
          <div className="flex flex-col">
            <span className="text-[10px] font-black uppercase tracking-widest opacity-40">
              Organelle Sorting
            </span>
            <span className="text-2xl font-black text-brand-headline">
              第 {currentIdx + 1} / {ORGANELLES.length} 題
            </span>
          </div>
          <div className="bg-brand-button px-6 py-2 border-2 border-brand-border rounded-xl font-black text-brand-headline">
            得分: {score} XP
          </div>
        </div>

        <motion.div
          key={currentIdx}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white border-8 border-brand-border rounded-[3rem] p-10 shadow-[12px_12px_0px_#00332c] space-y-8 flex flex-col items-center text-center"
        >
          {currentOrg.img && (
            <div className="relative w-36 h-36 border-4 border-brand-border rounded-2xl p-2 bg-brand-bg flex items-center justify-center">
              <Image
                src={`/images/${encodeURIComponent(currentOrg.img || "")}`}
                alt={currentOrg.name}
                fill
                className="object-contain p-2"
                referrerPolicy="no-referrer"
                unoptimized={true}
              />
            </div>
          )}
          <div className="space-y-2">
            <h4 className="text-4xl font-black text-brand-headline">
              {currentOrg.name}
            </h4>
            <p className="text-lg text-brand-paragraph font-bold opacity-70">
              {currentOrg.desc}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
            <button
              onClick={() => handleChoice("animal")}
              disabled={selected !== null}
              className={`p-5 rounded-2xl border-4 text-xl font-black transition-all ${
                selected === "animal"
                  ? isCorrect
                    ? "bg-green-100 border-green-600 text-green-900 shadow-[4px_4px_0px_#163c2c]"
                    : "bg-red-100 border-red-600 text-red-900 shadow-[4px_4px_0px_#4c1d1d]"
                  : "bg-white border-brand-border/10 hover:border-brand-button hover:bg-brand-button/5"
              }`}
            >
              動物細胞特有
            </button>
            <button
              onClick={() => handleChoice("plant")}
              disabled={selected !== null}
              className={`p-5 rounded-2xl border-4 text-xl font-black transition-all ${
                selected === "plant"
                  ? isCorrect
                    ? "bg-green-100 border-green-600 text-green-900 shadow-[4px_4px_0px_#163c2c]"
                    : "bg-red-100 border-red-600 text-red-900 shadow-[4px_4px_0px_#4c1d1d]"
                  : "bg-white border-brand-border/10 hover:border-brand-button hover:bg-brand-button/5"
              }`}
            >
              植物細胞特有
            </button>
            <button
              onClick={() => handleChoice("both")}
              disabled={selected !== null}
              className={`p-5 rounded-2xl border-4 text-xl font-black transition-all ${
                selected === "both"
                  ? isCorrect
                    ? "bg-green-100 border-green-600 text-green-900 shadow-[4px_4px_0px_#163c2c]"
                    : "bg-red-100 border-red-600 text-red-900 shadow-[4px_4px_0px_#4c1d1d]"
                  : "bg-white border-brand-border/10 hover:border-brand-button hover:bg-brand-button/5"
              }`}
            >
              兩者皆有
            </button>
          </div>
        </motion.div>

        <AnimatePresence>
          {selected !== null && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className={`p-6 rounded-2xl border-4 font-black text-lg text-center ${
                isCorrect
                  ? "bg-green-50 border-green-600 text-green-900"
                  : "bg-red-50 border-red-600 text-red-900"
              }`}
            >
              <p className="text-xl mb-2">
                {isCorrect ? "答對了！" : "答錯了！"}
              </p>
              <p className="text-sm font-semibold text-brand-paragraph opacity-80">
                {currentOrg.note}
              </p>
              <button
                onClick={handleNext}
                className="mt-6 btn-bold bg-brand-headline text-brand-button px-10 py-3 text-lg"
              >
                {currentIdx + 1 < ORGANELLES.length
                  ? "下一題"
                  : "完成分類，看對照表"}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </StageWrapper>
  );
}

