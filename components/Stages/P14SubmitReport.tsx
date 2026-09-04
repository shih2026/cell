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

export default function P14SubmitReport({
  learningScore,
  factoryHighScore,
  sortingHighScore,
  summaryHighScore,
  studentInfo,
  setStudentInfo,
}: {
  learningScore: number;
  factoryHighScore: number;
  sortingHighScore: number;
  summaryHighScore: number;
  studentInfo: any;
  setStudentInfo: any;
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState<"idle" | "success" | "error">("idle");
  const totalScore = learningScore + factoryHighScore + sortingHighScore + summaryHighScore;

  const handleSubmit = async () => {
    if (!studentInfo.school || !studentInfo.classNo || !studentInfo.seatNo) {
      alert("請填寫完整的學校、班級、座號資訊！");
      return;
    }

    setIsSubmitting(true);
    setSubmitResult("idle");

    const submissionData = {
      school: studentInfo.school,
      classNo: studentInfo.classNo,
      seatNo: studentInfo.seatNo,
      learningScore,
      factoryHighScore,
      sortingHighScore,
      summaryHighScore,
      totalScore,
      createdAt: serverTimestamp(),
    };

    try {
      const studentId = `${studentInfo.school}_${studentInfo.classNo}_${studentInfo.seatNo}`;
      
      // 1. 寫入 Firebase
      await setDoc(doc(db, "students", studentId), submissionData);

      // 2. 寫入 Google 試算表
      // 請將下方的 scriptUrl 替換為您部署的 Google Apps Script 網址
      const scriptUrl = "請替換為您的_Google_Apps_Script_Web_App_URL"; 
      if (scriptUrl !== "請替換為您的_Google_Apps_Script_Web_App_URL") {
        await fetch(scriptUrl, {
          method: "POST",
          body: JSON.stringify({
            ...submissionData,
            createdAt: new Date().toISOString()
          }),
          headers: {
            "Content-Type": "text/plain;charset=utf-8",
          },
        }).catch(err => console.warn("Google Sheets Sync Warning:", err));
      }

      setStudentInfo({ ...studentInfo, hasSubmitted: true });
      setSubmitResult("success");
    } catch (error) {
      try {
        handleFirestoreError(error, OperationType.WRITE, "students");
      } catch (formattedError) {
        setSubmitResult("error");
        console.error("Submit Error:", formattedError);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <StageWrapper
      title="學習認證"
      subtitle=""
      metaphor={{ icon: '🎓', title: '畢業證書', desc: '恭喜你完成細胞工廠的學習與挑戰！' }}
      unlockQuizKey="p15_submit"
      onUnlock={() => {}}
      hideMetaphor
      isReadyToUnlock={true}
    >
      <div className="card-bold bg-white border-8 border-brand-border p-12 rounded-[4rem] shadow-[20px_20px_0px_#faae2b] max-w-4xl mx-auto space-y-12">
        
        {/* Report Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="bg-yellow-50 p-6 rounded-3xl border-4 border-yellow-200 shadow-sm">
            <p className="text-sm font-bold text-yellow-800 mb-2">學習積分</p>
            <p className="text-4xl font-black tabular-nums text-yellow-600">{learningScore}</p>
          </div>
          <div className="bg-blue-50 p-6 rounded-3xl border-4 border-blue-200 shadow-sm">
            <p className="text-sm font-bold text-blue-800 mb-2">功能跑酷</p>
            <p className="text-4xl font-black tabular-nums text-blue-600">{factoryHighScore}</p>
          </div>
          <div className="bg-purple-50 p-6 rounded-3xl border-4 border-purple-200 shadow-sm">
            <p className="text-sm font-bold text-purple-800 mb-2">分類大師</p>
            <p className="text-4xl font-black tabular-nums text-purple-600">{sortingHighScore}</p>
          </div>
          <div className="bg-green-50 p-6 rounded-3xl border-4 border-green-200 shadow-sm">
            <p className="text-sm font-bold text-green-800 mb-2">總結挑戰</p>
            <p className="text-4xl font-black tabular-nums text-green-600">{summaryHighScore}</p>
          </div>
        </div>

        <div className="bg-brand-headline p-10 rounded-3xl text-center text-white border-4 border-brand-border shadow-md">
           <h3 className="text-2xl font-black opacity-80 uppercase tracking-widest mb-4">Total Score</h3>
           <p className="text-8xl font-black text-brand-button tabular-nums">{totalScore}</p>
        </div>

        {/* Input Form */}
        <div className="space-y-6">
          <h3 className="text-2xl font-black italic tracking-tighter">請輸入你的資料以登錄成績</h3>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold opacity-70">學校</label>
              <input 
                type="text" 
                maxLength={50}
                placeholder="例如：建國國中"
                value={studentInfo.school}
                onChange={(e) => setStudentInfo({...studentInfo, school: e.target.value})}
                disabled={studentInfo.hasSubmitted || isSubmitting}
                className="w-full bg-gray-50 border-4 border-gray-200 p-4 rounded-2xl font-bold text-xl outline-none focus:border-brand-button focus:bg-yellow-50 transition-colors"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold opacity-70">班級</label>
              <input 
                type="text" 
                maxLength={10}
                placeholder="例如：701"
                value={studentInfo.classNo}
                onChange={(e) => setStudentInfo({...studentInfo, classNo: e.target.value})}
                disabled={studentInfo.hasSubmitted || isSubmitting}
                className="w-full bg-gray-50 border-4 border-gray-200 p-4 rounded-2xl font-bold text-xl outline-none focus:border-brand-button focus:bg-yellow-50 transition-colors"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold opacity-70">座號</label>
              <input 
                type="text" 
                maxLength={10}
                placeholder="例如：01"
                value={studentInfo.seatNo}
                onChange={(e) => setStudentInfo({...studentInfo, seatNo: e.target.value})}
                disabled={studentInfo.hasSubmitted || isSubmitting}
                className="w-full bg-gray-50 border-4 border-gray-200 p-4 rounded-2xl font-bold text-xl outline-none focus:border-brand-button focus:bg-yellow-50 transition-colors"
              />
            </div>
          </div>
        </div>

        <div className="pt-8 flex flex-col items-center gap-6">
          <button
            onClick={handleSubmit}
            disabled={isSubmitting || studentInfo.hasSubmitted}
            className={`btn-bold text-2xl px-16 py-6 shadow-[8px_8px_0px_#000] w-full md:w-auto transition-all ${
              studentInfo.hasSubmitted ? 'bg-gray-200 text-gray-500 shadow-none cursor-not-allowed' : 'bg-brand-button text-brand-headline hover:scale-105'
            }`}
          >
            {isSubmitting ? '正在提交...' : studentInfo.hasSubmitted ? '🎉 成績已送出' : '送出成績認證'}
          </button>
          
          {submitResult === "error" && (
            <p className="text-red-500 font-bold text-xl flex items-center gap-2">
              <XCircle /> 提交失敗，請檢查網路連線或權限設定。
            </p>
          )}
        </div>
      </div>
    </StageWrapper>
  );
}
