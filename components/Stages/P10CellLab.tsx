"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import Image from "next/image";
import { Trophy, CheckCircle2, Lock, XCircle, Mic, CirclePlay, Search, ShieldCheck, Zap, Box, Castle, Sun, Microscope, Unlock, ClipboardCheck, Lightbulb, ChevronUp, ChevronDown, ChevronLeft, ChevronRight, Gamepad2, ArrowRight, Info, Award } from "lucide-react";
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

export default function P10CellLab({ unlockNext }: { unlockNext: () => void }) {
  const [phase, setPhase] = useState<
    "intro" | "prep" | "micro" | "report" | "inquiry" | "result"
  >("intro");
  const [selectedSample, setSelectedSample] = useState<string | null>(null);
  const [prepSteps, setPrepSteps] = useState<number[]>([]);
  const [animatingTool, setAnimatingTool] = useState<number | null>(null);
  const [selectedLabel, setSelectedLabel] = useState<string | null>(null);
  const [correctlyPlaced, setCorrectlyPlaced] = useState<string[]>([]);
  const [shakeTargetId, setShakeTargetId] = useState<string | null>(null);
  const [selectedAns1, setSelectedAns1] = useState<number | null>(null);
  const [selectedAns2, setSelectedAns2] = useState<number | null>(null);

  const [labState, setLabState] = useState({
    coarse: 0,
    fine: 0,
    eyepiece: 10,
    objective: 10,
    aperture: 50,
    stainApplied: false,
    labelScore: 0,
    stars: 0,
    xp: 0,
    offsetX: 0,
    offsetY: 0,
  });

  const SAMPLES = [
    {
      id: "onion",
      title: "洋蔥表皮細胞",
      color: "bg-orange-50",
      img: "洋蔥表皮細胞.png",
      stainedImg: "洋蔥表皮細胞染色.png",
      steps: [
        "載玻片",
        "滴清水",
        "撕取表皮",
        "放置樣本",
        "蓋蓋玻片",
        "滴碘液",
        "吸水紙",
      ],
    },
    {
      id: "zebrina",
      title: "風車草下表皮",
      color: "bg-green-50",
      img: "風車草下表皮細胞.png",
      stainedImg: "風車草下表皮細胞.png",
      steps: ["載玻片", "滴清水", "撕取表皮", "放置樣本", "蓋蓋玻片", "吸水紙"],
    },
    {
      id: "cheek",
      title: "口腔皮膜細胞",
      color: "bg-pink-50",
      img: "口腔皮膜細胞.png",
      stainedImg: "口腔皮膜細胞.png",
      steps: [
        "載玻片",
        "滴亞甲藍",
        "刮取細胞",
        "放置樣本",
        "蓋蓋玻片",
        "吸水紙",
      ],
    },
  ];

  const TOOLS = [
    {
      id: 1,
      name: "載玻片",
      icon: "05_載玻片.png",
      instruction: "❶ 準備：在實驗桌中央放置一片乾淨、乾燥的載玻片",
    },
    {
      id: 2,
      name: "滴管 (水)",
      icon: "01_滴管.png",
      instruction: "❷ 滴液：在載玻片中央滴一滴清水，保持表皮細胞活性",
    },
    {
      id: 5,
      name: "滴管 (染色)",
      icon: "06_滴瓶.png",
      instruction: "❸ 染色：滴加染液使細胞核更清晰便於觀察",
    },
    {
      id: 3,
      name: "鑷子/牙籤",
      icon: "02_鑷子.png",
      instruction: "❹ 樣本：用鑷子或牙籤將樣本展開平放於載玻片中央",
    },
    {
      id: 4,
      name: "蓋玻片",
      icon: "04_蓋玻片.png",
      instruction: "❺ 覆蓋：以 45 度角由一側輕輕蓋上，避免產生氣泡",
    },
    {
      id: 6,
      name: "吸水紙",
      icon: "08_吸水紙.png",
      instruction: "❻ 吸引：從另一側吸取多餘染液以引導其均勻滲透",
    },
  ];

  const LABEL_TARGETS: Record<
    string,
    { id: string; label: string; x: number; y: number }[]
  > = {
    onion: [
      { id: "onion-nucleus", label: "細胞核", x: 48, y: 35 },
      { id: "onion-wall", label: "細胞壁", x: 22, y: 15 },
      { id: "onion-cyto", label: "細胞質", x: 70, y: 65 },
    ],
    zebrina: [
      { id: "zebrina-nucleus", label: "細胞核", x: 20, y: 25 },
      { id: "zebrina-wall", label: "細胞壁", x: 45, y: 15 },
      { id: "zebrina-cyto", label: "細胞質", x: 15, y: 60 },
      { id: "zebrina-guard", label: "保衛細胞", x: 60, y: 50 },
      { id: "zebrina-stoma", label: "氣孔", x: 75, y: 72 },
    ],
    cheek: [
      { id: "cheek-nucleus", label: "細胞核", x: 45, y: 45 },
      { id: "cheek-membrane", label: "細胞膜", x: 75, y: 20 },
      { id: "cheek-cyto", label: "細胞質", x: 30, y: 65 },
    ],
  };

  const getToolInstruction = (toolId: number, sampleId: string) => {
    if (sampleId === "onion") {
      switch (toolId) {
        case 1:
          return "❶ 載玻片：請點擊工具列的「載玻片」，在實驗桌中央放置一片乾淨乾燥的載玻片。";
        case 2:
          return "❷ 滴清水：點擊「滴管 (水)」，在載玻片中央滴一滴清水，為洋蔥表皮準備濕潤環境。";
        case 3:
          return "❸ 撕取與放置樣本：點擊「鑷子/牙籤」，輕輕撕下洋蔥內側表皮，展開平放於清水滴中。";
        case 4:
          return "❹ 蓋蓋玻片：點擊「蓋玻片」，呈 45 度角緩慢蓋上，以防止空氣泡殘留。";
        case 5:
          return "❺ 滴碘液染色：點擊「滴管 (染色)」，在蓋玻片一側滴加一滴碘液（會使細胞核染成黃褐色）。";
        case 6:
          return "❻ 吸水紙引流：點擊「吸水紙」，從蓋玻片另一側吸引碘液，引導其均勻滲入蓋玻片下。";
        default:
          return "準備就緒...";
      }
    } else if (sampleId === "zebrina") {
      switch (toolId) {
        case 1:
          return "❶ 載玻片：請點擊工具列的「載玻片」，在實驗桌中央放置一片乾淨乾燥的載玻片。";
        case 2:
          return "❷ 滴清水：點擊「滴管 (水)」，在載玻片中央滴一滴清水，為風車草下表皮提供介質。";
        case 3:
          return "❸ 撕取與放置樣本：點擊「鑷子/牙籤」，撕下葉片下表皮的一小層薄膜，展開平放於清水滴中。";
        case 4:
          return "❹ 蓋蓋玻片：點擊「蓋玻片」，呈 45 度角緩慢蓋上，防止氣泡封入。";
        case 6:
          return "❺ 吸水紙吸水：風車草下表皮細胞富含綠色葉綠體，不需染色即可看清，點擊「吸水紙」吸除多餘水分。";
        default:
          return "準備就緒...";
      }
    } else {
      switch (toolId) {
        case 1:
          return "❶ 載玻片：請點擊工具列的「載玻片」，在實驗桌中央放置一片乾淨乾燥的載玻片。";
        case 5:
          return "❷ 滴亞甲藍液：點擊「滴管 (染色)」，在載玻片中央滴一滴亞甲藍液（能將動物細胞核染成藍色）。";
        case 3:
          return "❸ 刮取與塗抹樣本：點擊「牙籤/棉棒」，在口腔兩側頰黏膜輕刮數下，並在染液中均勻塗抹。";
        case 4:
          return "❹ 蓋蓋玻片：點擊「蓋玻片」，呈 45 度角緩慢蓋上，避免封入空氣泡。";
        case 6:
          return "❺ 吸水紙引流：點擊「吸水紙」，吸除蓋玻片周圍多餘的亞甲藍染液，使顯微鏡下的視野更加乾淨。";
        default:
          return "準備就緒...";
      }
    }
  };

  const startLab = (sampleId: string) => {
    setSelectedSample(sampleId);
    setPhase("prep");
    setPrepSteps([]);
    setCorrectlyPlaced([]);
    setSelectedLabel(null);
    setLabState({
      coarse: 0,
      fine: 0,
      eyepiece: 10,
      objective: 10,
      aperture: 50,
      stainApplied: false,
      labelScore: 0,
      stars: 0,
      xp: 0,
      offsetX: 0,
      offsetY: 0,
    });
  };

  const getNextRequiredTool = () => {
    const currentCount = prepSteps.length;
    if (selectedSample === "onion") {
      const onionOrder = [1, 2, 3, 4, 5, 6];
      return onionOrder[currentCount];
    } else if (selectedSample === "zebrina") {
      const zebrinaOrder = [1, 2, 3, 4, 6];
      return zebrinaOrder[currentCount];
    } else {
      const cheekOrder = [1, 5, 3, 4, 6];
      return cheekOrder[currentCount];
    }
  };

  const handleToolClick = (toolId: number) => {
    if (prepSteps.includes(toolId) || animatingTool) return;

    const required = getNextRequiredTool();
    if (toolId === required) {
      setAnimatingTool(toolId);
      setTimeout(() => {
        const nextSteps = [...prepSteps, toolId];
        setPrepSteps(nextSteps);
        setAnimatingTool(null);
        if (toolId === 5) setLabState((s) => ({ ...s, stainApplied: true }));

        const requiredCount = selectedSample === "onion" ? 6 : 5;

        // Sequence check for phase transition
        if (nextSteps.length === requiredCount) {
          setTimeout(() => setPhase("micro"), 1000);
        }
      }, 1200);
    }
  };

  const handleSlotClick = (targetId: string, expectedLabel: string) => {
    if (!selectedLabel) return;

    if (selectedLabel === expectedLabel) {
      setCorrectlyPlaced((prev) => [...prev, targetId]);
      setSelectedLabel(null);
      setLabState((s) => ({ ...s, labelScore: s.labelScore + 20 }));
    } else {
      setShakeTargetId(targetId);
      setTimeout(() => setShakeTargetId(null), 500);
    }
  };

  const renderPhase = () => {
    switch (phase) {
      case "intro":
        return (
          <div className="space-y-12">
            <div className="text-center space-y-4">
              <h3 className="text-4xl font-black text-brand-headline flex items-center justify-center gap-4">
                <Microscope size={48} className="text-brand-button" />{" "}
                歡迎來到虛擬細胞實驗室
              </h3>
              <p className="text-xl font-bold text-brand-paragraph opacity-70">
                選擇一個你想要觀察的樣本開始實驗
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {SAMPLES.map((s) => (
                <button
                  key={s.id}
                  onClick={() => startLab(s.id)}
                  className={`${s.color} border-8 border-brand-border p-10 rounded-[3rem] shadow-[12px_12px_0px_#00332c] hover:scale-105 transition-all text-center space-y-6 group`}
                >
                  <div className="w-32 h-32 mx-auto bg-white rounded-full border-4 border-brand-border flex items-center justify-center overflow-hidden">
                    <Image
                      src={`/images/${encodeURIComponent(s.img || "")}`}
                      alt={s.title}
                      width={100}
                      height={100}
                      className="object-cover group-hover:scale-125 transition-transform"
                      unoptimized={true}
                      priority
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="text-2xl font-black text-brand-headline">
                    {s.title}
                  </div>
                  <div className="btn-bold bg-brand-button text-brand-headline px-6 py-2">
                    開始實驗
                  </div>
                </button>
              ))}
            </div>
          </div>
        );

      case "prep":
        const nextToolId = getNextRequiredTool();
        const nextTool = TOOLS.find((t) => t.id === nextToolId);
        const sample = SAMPLES.find((s) => s.id === selectedSample);
        const stepList =
          selectedSample === "cheek"
            ? [1, 5, 3, 4, 6]
            : selectedSample === "onion"
              ? [1, 2, 3, 4, 5, 6]
              : [1, 2, 3, 4, 6];

        return (
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-white border-4 border-brand-border p-6 rounded-[2rem] shadow-[6px_6px_0px_#00332c]">
                <h4 className="text-xl font-black mb-4 flex items-center gap-2">
                  <ClipboardCheck className="text-brand-button" /> 實驗步驟清單
                </h4>
                <div className="space-y-4">
                  {stepList.map((toolId, idx) => {
                    const t = TOOLS.find((tool) => tool.id === toolId);
                    if (!t) return null;
                    const isDone = prepSteps.includes(t.id);
                    const isNext = t.id === nextToolId;
                    return (
                      <div
                        key={t.id}
                        className={`flex items-center gap-3 p-3 rounded-xl border-2 transition-all ${isDone ? "bg-green-50 border-green-200 opacity-60" : isNext ? "bg-brand-button/10 border-brand-button animate-pulse" : "bg-gray-50 border-gray-100"}`}
                      >
                        {isDone ? (
                          <CheckCircle2
                            className="text-green-500 shrink-0"
                            size={20}
                          />
                        ) : (
                          <div className="w-5 h-5 rounded-full border-2 border-gray-300 shrink-0 flex items-center justify-center text-[10px] font-bold text-gray-400">
                            {idx + 1}
                          </div>
                        )}
                        <span
                          className={`text-sm font-bold ${isDone ? "text-green-700 line-through" : isNext ? "text-brand-headline" : "text-gray-400"}`}
                        >
                          {t.id === 5 && selectedSample === "cheek"
                            ? "滴亞甲藍液"
                            : t.id === 6 && selectedSample === "zebrina"
                              ? "吸除多餘水分"
                              : t.name}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className="bg-brand-headline p-6 rounded-[2rem] text-white border-4 border-brand-border shadow-[6px_6px_0px_#faae2b]">
                <div className="flex items-center gap-3 mb-2">
                  <Info size={20} className="text-brand-button" />
                  <span className="font-black text-sm uppercase tracking-widest">
                    當前任務
                  </span>
                </div>
                <p className="font-bold leading-relaxed">
                  {getToolInstruction(nextToolId, selectedSample || "onion")}
                </p>
              </div>
            </div>

            <div className="lg:col-span-2 space-y-8">
              <div className="bg-white border-8 border-brand-border p-10 rounded-[3rem] shadow-[15px_15px_0px_#00332c] min-h-[480px] flex items-center justify-center relative overflow-hidden">
                {/* Slide Bench Background */}
                <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:24px_24px] opacity-50" />

                {/* Preparation Animation Stage */}
                <div className="relative w-full h-[320px] flex items-center justify-center">
                  {/* Slide Base Layer (Using actual PNG load instead of custom vector shape) */}
                  {prepSteps.includes(1) && (
                    <motion.div
                      initial={{ y: 100, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ duration: 0.5, type: "spring" }}
                      className="relative z-10 w-[350px] h-[100px] flex items-center justify-center"
                    >
                      <Image
                        src="/images/05_載玻片.png"
                        alt="載玻片"
                        width={350}
                        height={100}
                        className="object-contain drop-shadow-[0_12px_20px_rgba(0,0,0,0.15)]"
                        unoptimized={true}
                        referrerPolicy="no-referrer"
                      />

                      {/* Liquid Drop Layer */}
                      {prepSteps.includes(2) && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute w-12 h-10 rounded-full bg-blue-300/40 border-2 border-blue-400/30 blur-[1px] shadow-inner z-20 flex items-center justify-center"
                        />
                      )}

                      {/* Stained Cheek liquid (which goes before placing sample) */}
                      {prepSteps.includes(5) && selectedSample === "cheek" && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute w-14 h-12 rounded-full bg-blue-500/50 border border-blue-600/30 blur-[2px] z-20"
                        />
                      )}

                      {/* Placed Specimen Layer (Real Cell Micro Slice!) */}
                      {prepSteps.includes(3) && (
                        <motion.div
                          initial={{ scale: 0, rotate: -25 }}
                          animate={{ scale: 1, rotate: 5 }}
                          className="absolute w-14 h-10 overflow-hidden border border-white/40 rounded-sm shadow-md z-30"
                        >
                          <Image
                            src={`/images/${encodeURIComponent(sample?.img || "")}`}
                            alt="樣本切片"
                            fill
                            className={`object-cover ${prepSteps.includes(5) && selectedSample === "onion" ? "sepia hue-rotate-[15deg] saturate-150" : ""}`}
                            unoptimized={true}
                            referrerPolicy="no-referrer"
                          />
                        </motion.div>
                      )}

                      {/* Coverslip Layer (Using real coverslip PNG) */}
                      {prepSteps.includes(4) && (
                        <motion.div
                          initial={{ y: -80, rotate: -30, opacity: 0 }}
                          animate={{ y: 0, rotate: 0, opacity: 0.8 }}
                          transition={{ duration: 0.5 }}
                          className="absolute w-[100px] h-[100px] z-40 flex items-center justify-center pointer-events-none"
                        >
                          <Image
                            src="/images/04_蓋玻片.png"
                            alt="蓋玻片"
                            width={100}
                            height={100}
                            className="object-contain drop-shadow-[0_4px_8px_rgba(0,0,0,0.1)] border-2 border-white/10"
                            unoptimized={true}
                            referrerPolicy="no-referrer"
                          />
                        </motion.div>
                      )}

                      {/* Iodine stained droplet overlay for Onion (After cover slip is placed) */}
                      {prepSteps.includes(5) && selectedSample === "onion" && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 0.7 }}
                          className="absolute w-16 h-12 rounded-full bg-amber-500/50 border border-amber-600/30 blur-[2px] z-25"
                        />
                      )}
                    </motion.div>
                  )}

                  {/* Active Animating Tool Overlay using only the actual tool images */}
                  <AnimatePresence>
                    {animatingTool && (
                      <motion.div
                        initial={{
                          y: animatingTool === 6 ? 0 : -140,
                          x:
                            animatingTool === 6
                              ? 160
                              : animatingTool === 4
                                ? -60
                                : 80,
                          rotate: animatingTool === 4 ? -45 : 0,
                          opacity: 0,
                        }}
                        animate={{
                          y: animatingTool === 6 ? 0 : -70,
                          x: animatingTool === 6 ? 80 : 0,
                          rotate:
                            animatingTool === 2 || animatingTool === 5
                              ? -30
                              : animatingTool === 4
                                ? -25
                                : 0,
                          opacity: 1,
                        }}
                        exit={{
                          y: animatingTool === 6 ? 60 : -160,
                          x:
                            animatingTool === 6
                              ? 220
                              : animatingTool === 4
                                ? 30
                                : -80,
                          opacity: 0,
                        }}
                        transition={{ duration: 0.7 }}
                        className="absolute z-50 pointer-events-none"
                      >
                        <div className="relative">
                          <Image
                            src={`/images/${encodeURIComponent(TOOLS.find((t) => t.id === animatingTool)?.icon || "")}`}
                            alt="Tool"
                            width={110}
                            height={110}
                            className="object-contain"
                            unoptimized={true}
                            referrerPolicy="no-referrer"
                          />

                          {/* Tweezers carrying the tiny microscopic slice */}
                          {animatingTool === 3 && (
                            <motion.div
                              initial={{ scale: 0.7, y: 15, x: 10 }}
                              animate={{ scale: 0.7, y: 15, x: 10 }}
                              className="absolute bottom-[-10px] left-[15px] w-8 h-6 overflow-hidden rounded border border-white/50 shadow-md"
                            >
                              <Image
                                src={`/images/${encodeURIComponent(sample?.img || "")}`}
                                alt="specimen slice"
                                fill
                                className="object-cover"
                                unoptimized={true}
                                referrerPolicy="no-referrer"
                              />
                            </motion.div>
                          )}

                          {/* Falling droplet animation for droppers */}
                          {(animatingTool === 2 || animatingTool === 5) && (
                            <motion.div
                              initial={{ y: 15, x: -10, scale: 0, opacity: 0 }}
                              animate={{
                                y: 120,
                                x: -10,
                                scale: [0, 1, 1, 0.8],
                                opacity: [0, 1, 1, 0],
                              }}
                              transition={{ delay: 0.3, duration: 0.6 }}
                              className={`absolute w-3 h-6 rounded-full ${animatingTool === 5 ? (selectedSample === "cheek" ? "bg-blue-500" : "bg-amber-600") : "bg-blue-300"}`}
                            />
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {prepSteps.length === 0 && !animatingTool && (
                  <div className="text-center space-y-4 opacity-30 select-none absolute">
                    <Box size={100} className="mx-auto" />
                    <p className="font-black italic text-3xl">
                      點選下方工具開始製片
                    </p>
                  </div>
                )}
              </div>

              {/* Grid of Interactive Tool buttons */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6 bg-brand-bg/50 p-6 rounded-[2rem] border-4 border-dashed border-brand-border">
                {TOOLS.map((tool) => {
                  const isAvailable = tool.id === nextToolId;
                  const isDone = prepSteps.includes(tool.id);
                  return (
                    <button
                      key={tool.id}
                      onClick={() => handleToolClick(tool.id)}
                      disabled={!isAvailable || animatingTool !== null}
                      className={`group bg-white border-4 p-5 rounded-3xl shadow-[6px_6px_0px_#00332c] hover:translate-y-[-4px] active:translate-y-0 transition-all flex flex-col items-center gap-4 relative overflow-hidden ${!isAvailable && !isDone ? "opacity-30 grayscale cursor-not-allowed" : "border-brand-border"} ${isDone ? "bg-green-50 border-green-500 shadow-[6px_6px_0px_#14532d]" : ""} ${isAvailable ? "ring-8 ring-brand-button/20 border-brand-button" : ""}`}
                    >
                      {isDone && (
                        <div className="absolute top-2 right-2 text-green-600">
                          <ShieldCheck size={24} />
                        </div>
                      )}
                      <div className="w-20 h-20 flex items-center justify-center transform group-hover:scale-110 transition-transform">
                        <Image
                          src={`/images/${encodeURIComponent(tool.icon || "")}`}
                          alt={tool.name}
                          width={80}
                          height={80}
                          className="object-contain"
                          unoptimized={true}
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <span className="text-xs font-black text-brand-headline text-center leading-tight">
                        {tool.id === 5 && selectedSample === "cheek"
                          ? "亞甲藍液"
                          : tool.id === 6 && selectedSample === "zebrina"
                            ? "吸除水分"
                            : tool.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        );

      case "micro": {
        // 粗調一刻度等同細調50刻度
        const currentFocus = labState.coarse * 50 + labState.fine;
        const targetFocus = 50 * 50 + 50; // 2550 為完美對焦平面
        const focusDiff = Math.abs(currentFocus - targetFocus);

        let blurValue = focusDiff * 0.1;
        if (blurValue > 20) blurValue = 20;

        const totalMag = labState.eyepiece * labState.objective;
        const magScale = (totalMag / 100) * 1.5;

        const focusOk = focusDiff <= 2;

        let brightness =
          1.0 +
          ((labState.aperture - 50) / 100) * 0.8 -
          ((totalMag - 100) / 100) * 0.15;
        if (brightness < 0.2) brightness = 0.2;

        const sampleData = SAMPLES.find((s) => s.id === selectedSample);
        const currentImg =
          labState.stainApplied && sampleData?.stainedImg
            ? sampleData.stainedImg
            : sampleData?.img;

        return (
          <div className="grid md:grid-cols-5 gap-8">
            <div className="md:col-span-3 space-y-6">
              <div className="relative aspect-square bg-[#ebf9f9] rounded-[4rem] border-[20px] border-brand-border overflow-hidden shadow-[inset_0_0_100px_rgba(0,0,0,0.1)] flex items-center justify-center">
                <div
                  className="absolute inset-0 transition-all duration-300 pointer-events-none"
                  style={{
                    filter: `blur(${blurValue}px) contrast(1.1) brightness(${brightness})`,
                    transform: `translate(${labState.offsetX}px, ${labState.offsetY}px) scale(${magScale})`,
                    opacity: blurValue > 18 ? 0.8 : 1,
                  }}
                >
                  {currentImg && (
                    <Image
                      src={`/images/${encodeURIComponent(currentImg)}`}
                      alt="微觀細胞"
                      fill
                      className="object-cover"
                      unoptimized={true}
                      priority
                      referrerPolicy="no-referrer"
                    />
                  )}
                </div>
                <div className="absolute inset-0 pointer-events-none border-[60px] border-black/70 rounded-[3rem]" />
                <div className="absolute top-8 left-8">
                  <div className="px-6 py-2 bg-white/10 backdrop-blur-md rounded-2xl text-sm font-black text-white italic border border-white/20 shadow-lg">
                    總倍率: {totalMag}X
                  </div>
                </div>

                {blurValue > 5 && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-white/50 font-black text-2xl uppercase tracking-widest pointer-events-none gap-4">
                    <span className="animate-pulse drop-shadow-md">
                      滑動轉軸進行對焦
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="md:col-span-2 space-y-8 bg-white border-8 border-brand-border p-10 rounded-[4rem] shadow-[12px_12px_0px_#faae2b] flex flex-col h-full">
              <div className="text-center">
                <h4 className="text-3xl font-black text-brand-headline italic">
                  顯微鏡調節
                </h4>
              </div>

              <div className="flex justify-around items-end pt-4 pb-4">
                <MicroscopeKnob
                  label="粗調節輪"
                  value={labState.coarse}
                  onChange={(v) => setLabState((s) => ({ ...s, coarse: v }))}
                />
                <MicroscopeKnob
                  label="細調節輪"
                  value={labState.fine}
                  onChange={(v) => setLabState((s) => ({ ...s, fine: v }))}
                />
              </div>

              <div className="space-y-4 pt-4 border-t-4 border-brand-bg">
                <div className="flex flex-col items-center gap-2">
                  <span className="text-xs font-black uppercase text-brand-paragraph w-full text-left">
                    載物台移動 (Stage)
                  </span>
                  <div className="grid grid-cols-3 gap-2 w-40">
                    <div />
                    <button
                      onClick={() =>
                        setLabState((s) => ({ ...s, offsetY: s.offsetY + 40 }))
                      }
                      className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center border-4 border-gray-300 hover:bg-gray-200 active:scale-95 text-gray-600 transition-all shadow-[2px_2px_0px_rgba(0,0,0,0.2)] active:shadow-none active:translate-y-[2px]"
                    >
                      <ChevronUp size={24} />
                    </button>
                    <div />
                    <button
                      onClick={() =>
                        setLabState((s) => ({ ...s, offsetX: s.offsetX + 40 }))
                      }
                      className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center border-4 border-gray-300 hover:bg-gray-200 active:scale-95 text-gray-600 transition-all shadow-[2px_2px_0px_rgba(0,0,0,0.2)] active:shadow-none active:translate-y-[2px]"
                    >
                      <ChevronLeft size={24} />
                    </button>
                    <button
                      onClick={() =>
                        setLabState((s) => ({ ...s, offsetY: s.offsetY - 40 }))
                      }
                      className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center border-4 border-gray-300 hover:bg-gray-200 active:scale-95 text-gray-600 transition-all shadow-[2px_2px_0px_rgba(0,0,0,0.2)] active:shadow-none active:translate-y-[2px]"
                    >
                      <ChevronDown size={24} />
                    </button>
                    <button
                      onClick={() =>
                        setLabState((s) => ({ ...s, offsetX: s.offsetX - 40 }))
                      }
                      className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center border-4 border-gray-300 hover:bg-gray-200 active:scale-95 text-gray-600 transition-all shadow-[2px_2px_0px_rgba(0,0,0,0.2)] active:shadow-none active:translate-y-[2px]"
                    >
                      <ChevronRight size={24} />
                    </button>
                  </div>
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t-4 border-brand-bg">
                <div className="flex justify-between font-black text-sm uppercase tracking-widest text-brand-paragraph">
                  <span>光圈 (Aperture)</span>
                  <span className="text-brand-button">
                    {labState.aperture}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={labState.aperture}
                  onChange={(e) =>
                    setLabState((s) => ({
                      ...s,
                      aperture: parseInt(e.target.value),
                    }))
                  }
                  className="w-full h-8 bg-brand-bg rounded-full appearance-none cursor-pointer border-4 border-brand-border accent-brand-headline"
                />
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t-4 border-brand-bg">
                <div className="space-y-2">
                  <span className="text-xs font-black uppercase text-brand-paragraph">
                    目鏡
                  </span>
                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() =>
                        setLabState((s) => ({ ...s, eyepiece: 10 }))
                      }
                      className={`py-2 font-black rounded-xl border-4 transition-all ${labState.eyepiece === 10 ? "bg-brand-headline text-white border-brand-border" : "bg-gray-50 text-gray-400 border-gray-200"}`}
                    >
                      10X
                    </button>
                    <button
                      onClick={() =>
                        setLabState((s) => ({ ...s, eyepiece: 15 }))
                      }
                      className={`py-2 font-black rounded-xl border-4 transition-all ${labState.eyepiece === 15 ? "bg-brand-headline text-white border-brand-border" : "bg-gray-50 text-gray-400 border-gray-200"}`}
                    >
                      15X
                    </button>
                  </div>
                </div>
                <div className="space-y-2">
                  <span className="text-xs font-black uppercase text-brand-paragraph">
                    物鏡
                  </span>
                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() =>
                        setLabState((s) => ({ ...s, objective: 10 }))
                      }
                      className={`py-2 font-black rounded-xl border-4 transition-all ${labState.objective === 10 ? "bg-brand-headline text-white border-brand-border" : "bg-gray-50 text-gray-400 border-gray-200"}`}
                    >
                      10X
                    </button>
                    <button
                      onClick={() =>
                        setLabState((s) => ({ ...s, objective: 40 }))
                      }
                      className={`py-2 font-black rounded-xl border-4 transition-all ${labState.objective === 40 ? "bg-brand-headline text-white border-brand-border" : "bg-gray-50 text-gray-400 border-gray-200"}`}
                    >
                      40X
                    </button>
                  </div>
                </div>
              </div>

              <AnimatePresence>
                {focusOk && (
                  <motion.button
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    onClick={() => setPhase("report")}
                    className="mt-auto w-full btn-bold bg-green-600 text-white py-6 text-2xl shadow-[6px_6px_0px_#14532d] flex items-center justify-center gap-3 border-4 border-green-900"
                  >
                    <ShieldCheck size={28} /> 對焦成功！
                  </motion.button>
                )}
              </AnimatePresence>
            </div>
          </div>
        );
      }

      case "report": {
        const targets = LABEL_TARGETS[selectedSample || "onion"] || [];
        const labelsList = targets.map((t) => t.label);
        const sampleObj = SAMPLES.find((s) => s.id === selectedSample);
        const microscopeImg =
          labState.stainApplied && sampleObj?.stainedImg
            ? sampleObj.stainedImg
            : sampleObj?.img;

        return (
          <div className="grid md:grid-cols-5 gap-8">
            {/* Viewport with labeling dots */}
            <div className="md:col-span-3 space-y-4">
              <div className="relative aspect-square bg-[#ebf9f9] rounded-[4rem] border-[16px] border-brand-border overflow-hidden shadow-2xl flex items-center justify-center">
                <div
                  className="absolute inset-0 pointer-events-none transition-all duration-300"
                  style={{
                    transform: `translate(${labState.offsetX}px, ${labState.offsetY}px) scale(${((labState.eyepiece * labState.objective) / 100) * 1.5})`,
                  }}
                >
                  {microscopeImg && (
                    <Image
                      src={`/images/${encodeURIComponent(microscopeImg)}`}
                      alt="標記細胞"
                      fill
                      className="object-cover"
                      unoptimized={true}
                      priority
                      referrerPolicy="no-referrer"
                    />
                  )}
                </div>
                <div className="absolute inset-0 pointer-events-none border-[40px] border-black/40 rounded-[3rem]" />

                {/* Target placement spots */}
                {targets.map((target) => {
                  const isPlaced = correctlyPlaced.includes(target.id);
                  const isShaking = shakeTargetId === target.id;
                  return (
                    <button
                      key={target.id}
                      onClick={() => handleSlotClick(target.id, target.label)}
                      className={`absolute w-10 h-10 -ml-5 -mt-5 rounded-full border-4 flex items-center justify-center transition-all ${
                        isPlaced
                          ? "bg-green-500 border-green-200 text-white shadow-lg"
                          : "bg-orange-500 border-white text-white hover:scale-110 animate-bounce"
                      } ${isShaking ? "animate-shake" : ""}`}
                      style={{ left: `${target.x}%`, top: `${target.y}%` }}
                    >
                      {isPlaced ? "✓" : "?"}
                      {/* Show label text on hover or when placed */}
                      {isPlaced && (
                        <span className="absolute top-12 bg-brand-headline border-2 border-brand-border text-white text-xs font-black px-3 py-1 rounded-xl whitespace-nowrap shadow-md">
                          {target.label}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Side Control panel with instructions and label options */}
            <div className="md:col-span-2 space-y-6 flex flex-col justify-between bg-white border-8 border-brand-border p-8 rounded-[3rem] shadow-[10px_10px_0px_#faae2b]">
              <div className="space-y-6">
                <div>
                  <h4 className="text-2xl font-black text-brand-headline">
                    構造標記挑戰
                  </h4>
                  <p className="text-sm font-bold text-brand-paragraph opacity-70 mt-2">
                    請點選下方【構造標籤】後，點擊顯微鏡中對應的【橘色問號目標】。
                  </p>
                </div>

                <div className="flex flex-col gap-3">
                  <span className="text-[10px] font-black uppercase tracking-widest opacity-40">
                    構造標籤
                  </span>
                  <div className="flex flex-wrap gap-3">
                    {labelsList.map((label) => {
                      const isSelected = selectedLabel === label;
                      const hasBeenCorrectlyPlaced = targets.some(
                        (t) =>
                          t.label === label && correctlyPlaced.includes(t.id),
                      );
                      return (
                        <button
                          key={label}
                          onClick={() =>
                            !hasBeenCorrectlyPlaced && setSelectedLabel(label)
                          }
                          disabled={hasBeenCorrectlyPlaced}
                          className={`px-5 py-3 rounded-2xl border-4 text-base font-black transition-all ${
                            hasBeenCorrectlyPlaced
                              ? "bg-green-100 border-green-600 text-green-950 line-through opacity-50 cursor-not-allowed"
                              : isSelected
                                ? "bg-brand-button border-brand-border text-brand-headline shadow-[4px_4px_0px_#000] scale-105"
                                : "bg-white border-brand-border hover:bg-brand-bg"
                          }`}
                        >
                          {label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="bg-brand-bg p-4 rounded-2xl border-2 border-brand-border flex justify-between items-center">
                  <span className="text-sm font-black text-brand-headline">
                    完成進度
                  </span>
                  <span className="text-xl font-black text-brand-headline">
                    {correctlyPlaced.length} / {targets.length}
                  </span>
                </div>
              </div>

              <button
                onClick={() => setPhase("inquiry")}
                disabled={correctlyPlaced.length < targets.length}
                className={`w-full btn-bold py-6 text-2xl font-black italic tracking-widest uppercase transition-all ${
                  correctlyPlaced.length < targets.length
                    ? "bg-gray-200 text-gray-400 border-gray-300 cursor-not-allowed opacity-50"
                    : "bg-brand-headline text-brand-button hover:scale-105 shadow-[6px_6px_0px_#faae2b]"
                }`}
              >
                提交報告
              </button>
            </div>
          </div>
        );
      }

      case "inquiry":
        return (
          <div className="max-w-4xl mx-auto space-y-12">
            <div className="bg-white border-8 border-brand-border p-16 rounded-[5rem] shadow-[20px_20px_0px_#faae2b] space-y-12">
              <div className="space-y-8">
                <div className="flex items-start gap-6">
                  <span className="w-12 h-12 bg-brand-headline text-brand-button rounded-full flex items-center justify-center font-black text-2xl shrink-0">
                    1
                  </span>
                  <h5 className="text-3xl font-black text-brand-headline leading-tight">
                    洋蔥表皮細胞在染色前、後有什麼最明顯的差異？
                  </h5>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-18">
                  {[
                    { text: "顏色變深，細胞核更清晰", correct: true },
                    { text: "顏色變淡，細胞壁消失", correct: false },
                    { text: "細胞會開始運動", correct: false },
                    { text: "沒有任何改變", correct: false },
                  ].map((ans, i) => {
                    const isSelected = selectedAns1 === i;
                    return (
                      <button
                        key={i}
                        onClick={() => setSelectedAns1(i)}
                        className={`text-left p-8 border-4 rounded-3xl font-black text-xl transition-all shadow-[4px_4px_0px_#000] active:translate-y-1 ${
                          isSelected
                            ? ans.correct
                              ? "bg-green-100 border-green-600 text-green-950"
                              : "bg-red-100 border-red-600 text-red-950"
                            : "bg-white border-brand-border hover:bg-brand-button/10"
                        }`}
                      >
                        {ans.text}
                        {isSelected &&
                          (ans.correct ? " (正確 ✓)" : " (錯誤 ✕)")}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="pt-12 border-t-8 border-dashed border-brand-bg space-y-8">
                <div className="flex items-start gap-6">
                  <span className="w-12 h-12 bg-brand-headline text-brand-button rounded-full flex items-center justify-center font-black text-2xl shrink-0">
                    2
                  </span>
                  <h5 className="text-3xl font-black text-brand-headline leading-tight">
                    在這次實驗觀察的細胞中，哪種細胞可以行光合作用？
                  </h5>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-18">
                  {[
                    { text: "洋蔥表皮細胞（鱗片葉）", correct: false },
                    { text: "風車草下表皮（保衛細胞）", correct: true },
                    { text: "口腔皮膜細胞", correct: false },
                    { text: "以上皆是", correct: false },
                  ].map((ans, i) => {
                    const isSelected = selectedAns2 === i;
                    return (
                      <button
                        key={i}
                        onClick={() => setSelectedAns2(i)}
                        className={`text-left p-8 border-4 rounded-3xl font-black text-xl transition-all shadow-[4px_4px_0px_#000] active:translate-y-1 ${
                          isSelected
                            ? ans.correct
                              ? "bg-green-100 border-green-600 text-green-950"
                              : "bg-red-100 border-red-600 text-red-950"
                            : "bg-white border-brand-border hover:bg-brand-button/10"
                        }`}
                      >
                        {ans.text}
                        {isSelected &&
                          (ans.correct ? " (正確 ✓)" : " (錯誤 ✕)")}
                      </button>
                    );
                  })}
                </div>
              </div>

              <button
                onClick={() => setPhase("result")}
                disabled={selectedAns1 === null || selectedAns2 === null}
                className={`w-full btn-bold py-10 text-4xl italic tracking-tighter ${
                  selectedAns1 === null || selectedAns2 === null
                    ? "bg-gray-200 text-gray-400 border-gray-300 cursor-not-allowed opacity-50 shadow-none"
                    : "bg-brand-headline text-brand-button hover:scale-105 shadow-[10px_10px_0px_#faae2b]"
                }`}
              >
                查看實驗評價 & 結算 XP
              </button>
            </div>
          </div>
        );

      case "result":
        return (
          <div className="max-w-3xl mx-auto text-center space-y-12">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="p-16 bg-white border-[12px] border-brand-border rounded-[6rem] shadow-[25px_25px_0px_#00332c] relative"
            >
              <div className="absolute -top-12 -right-12 w-32 h-32 bg-brand-button border-8 border-brand-border rounded-full flex items-center justify-center text-6xl shadow-2xl rotate-12">
                🌟
              </div>
              <h3 className="text-6xl font-black text-brand-headline italic mb-2 tracking-tighter">
                實驗圓滿完成！
              </h3>
              <div className="text-2xl font-bold opacity-40 mb-12 uppercase tracking-widest">
                Laboratory Certification System
              </div>

              <div className="flex justify-center gap-8 mb-16">
                {[1, 2, 3].map((s) => (
                  <motion.div
                    key={s}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: s * 0.2, type: "spring" }}
                  >
                    <Award
                      size={100}
                      className="text-brand-button drop-shadow-[6px_6px_0px_#000]"
                    />
                  </motion.div>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-brand-bg p-8 rounded-[3rem] border-4 border-brand-border">
                  <div className="text-[10px] font-black opacity-40 mb-2">
                    XP GAINED
                  </div>
                  <div className="text-4xl font-black">+1,200</div>
                </div>
                <div className="bg-brand-bg p-8 rounded-[3rem] border-4 border-brand-border">
                  <div className="text-[10px] font-black opacity-40 mb-2">
                    PRECISION
                  </div>
                  <div className="text-4xl font-black text-green-600">S+</div>
                </div>
                <div className="bg-brand-bg p-8 rounded-[3rem] border-4 border-brand-border">
                  <div className="text-[10px] font-black opacity-40 mb-2">
                    COMPLETION
                  </div>
                  <div className="text-4xl font-black">100%</div>
                </div>
              </div>
            </motion.div>

            <div className="flex flex-col md:flex-row gap-8">
              <button
                onClick={() => {
                  setPhase("intro");
                  setSelectedSample(null);
                  setPrepSteps([]);
                  setCorrectlyPlaced([]);
                  setSelectedAns1(null);
                  setSelectedAns2(null);
                  setLabState({
                    coarse: 0,
                    fine: 0,
                    eyepiece: 10,
                    objective: 10,
                    aperture: 50,
                    stainApplied: false,
                    labelScore: 0,
                    stars: 0,
                    xp: 0,
                    offsetX: 0,
                    offsetY: 0,
                  });
                }}
                className="flex-1 btn-bold bg-white text-brand-headline py-8 text-3xl border-brand-border hover:bg-gray-50"
              >
                RESET LAB
              </button>
              <button
                onClick={unlockNext}
                className="flex-1 btn-bold bg-brand-headline text-brand-button py-8 text-4xl italic tracking-tighter"
              >
                CONTINUE <ChevronRight size={40} className="inline" />
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <StageWrapper
      title="虛擬實驗室"
      subtitle="細胞觀察闖關：完成你的實驗紀錄"
      metaphor={{
        icon: "🧪",
        title: "微觀探險",
        desc: "在顯微鏡下，一滴水也是一個宇宙。",
      }}
      unlockQuizKey="p10_lab_unlock"
      onUnlock={unlockNext}
      hideMetaphor
    >
      <div className="min-h-[800px] py-10">{renderPhase()}</div>
    </StageWrapper>
  );
}

