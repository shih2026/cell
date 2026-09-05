"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import Image from "next/image";
import { Trophy, CheckCircle2, Lock, XCircle, Mic, CirclePlay, Search, ShieldCheck, Zap, Box, Castle, Sun, Microscope, Unlock, ClipboardCheck, Lightbulb, ChevronUp, ChevronDown, ChevronLeft, ChevronRight, Gamepad2, ArrowRight, Info } from "lucide-react";
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

export default function P11ObserveSummary({ unlockNext }: { unlockNext: () => void }) {
  return (
    <StageWrapper
      title="觀察總結"
      subtitle="細胞構造的推論與比較"
      unlockQuizKey="p11_observe_unlock"
      onUnlock={unlockNext}
      hideMetaphor
    >
      <div className="space-y-12">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-orange-50/50 p-6 rounded-[2rem] border-4 border-brand-border shadow-[8px_8px_0px_#00332c] flex flex-col items-center text-center space-y-4">
            <div className="w-32 h-32 rounded-full border-4 border-brand-border overflow-hidden">
              <Image
                src="/images/洋蔥表皮細胞染色.png"
                alt="洋蔥表皮細胞"
                width={128}
                height={128}
                className="object-cover"
                unoptimized
                referrerPolicy="no-referrer"
              />
            </div>
            <h4 className="text-2xl font-black text-brand-headline">
              洋蔥表皮細胞
            </h4>
            <ul className="text-left font-bold text-brand-paragraph space-y-2 w-full text-lg">
              <li>✅ 可見：細胞壁、染色細胞核</li>
              <li>❌ 不可見：葉綠體 (地下莖無光合作用)</li>
            </ul>
          </div>
          <div className="bg-pink-50/50 p-6 rounded-[2rem] border-4 border-brand-border shadow-[8px_8px_0px_#00332c] flex flex-col items-center text-center space-y-4">
            <div className="w-32 h-32 rounded-full border-4 border-brand-border overflow-hidden">
              <Image
                src="/images/口腔皮膜細胞.png"
                alt="口腔皮膜細胞"
                width={128}
                height={128}
                className="object-cover"
                unoptimized
                referrerPolicy="no-referrer"
              />
            </div>
            <h4 className="text-2xl font-black text-brand-headline">
              口腔皮膜細胞
            </h4>
            <ul className="text-left font-bold text-brand-paragraph space-y-2 w-full text-lg">
              <li>✅ 可見：細胞膜、染色細胞核</li>
              <li>❌ 不可見：細胞壁、葉綠體</li>
            </ul>
          </div>
          <div className="bg-green-50/50 p-6 rounded-[2rem] border-4 border-brand-border shadow-[8px_8px_0px_#00332c] flex flex-col items-center text-center space-y-4">
            <div className="w-32 h-32 rounded-full border-4 border-brand-border overflow-hidden">
              <Image
                src="/images/風車草下表皮細胞.png"
                alt="風車草葉片"
                width={128}
                height={128}
                className="object-cover"
                unoptimized
                referrerPolicy="no-referrer"
              />
            </div>
            <h4 className="text-2xl font-black text-brand-headline">
              風車草下表皮細胞
            </h4>
            <ul className="text-left font-bold text-brand-paragraph space-y-2 w-full text-lg">
              <li>✅ 可見：細胞壁、保衛細胞的葉綠體</li>
              <li>⚠️ 注意：表皮細胞本身無葉綠體</li>
            </ul>
          </div>
        </div>

        <div className="bg-blue-50/50 p-8 rounded-[2rem] border-4 border-brand-border">
          <h4 className="text-2xl font-black text-brand-headline mb-4 flex items-center gap-2">
            <Info className="text-blue-500" /> 透明構造的推理
          </h4>
          <p className="text-xl leading-relaxed text-brand-paragraph font-bold">
            細胞內許多構造（如<Highlight>細胞膜</Highlight>、
            <Highlight>細胞質</Highlight>
            ）是完全透明的，在一般光學顯微鏡下無法直接看到。但根據生物學知識，所有細胞都必須具備
            <b>細胞膜</b>、<b>細胞質</b>和<b>細胞核</b>
            ，因此我們能推論它們確實存在，只是需要特殊染色或更高倍率的顯微鏡才能觀察。
          </p>
        </div>
      </div>
    </StageWrapper>
  );
}

