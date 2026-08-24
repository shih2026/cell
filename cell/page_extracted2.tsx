'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Image from 'next/image';
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
  ChevronLeft
} from 'lucide-react';

// --- Types ---
interface Question {
  id: string;
  question: string;
  options: string[];
  answer: string;
  explanation: string;
}

interface TabContent {
  id: string;
  title: string;
  type: 'learning' | 'quiz' | 'ai' | 'game';
}

// --- Mock Data ---
const STAGES: TabContent[] = [
  { id: 'p1_blocks', title: '細胞', type: 'learning' },
  { id: 'p2_gate', title: '細胞膜', type: 'learning' },
  { id: 'p3_center', title: '細胞核', type: 'learning' },
  { id: 'p4_floor', title: '細胞質', type: 'learning' },
  { id: 'p5_power', title: '粒線體', type: 'learning' },
  { id: 'p6_store', title: '液胞', type: 'learning' },
  { id: 'p7_wall', title: '細胞壁', type: 'learning' },
  { id: 'p8_solar', title: '葉綠體', type: 'learning' },
  { id: 'p9_compare', title: '動植比較', type: 'learning' },
  { id: 'p10_lab', title: '觀察細胞', type: 'learning' },
  { id: 'p11_observe', title: '觀察總結', type: 'learning' },
  { id: 'p12_factory', title: '功能跑酷', type: 'game' },
  { id: 'p13_sorting', title: '構造分類王', type: 'game' },
  { id: 'p14_challenge', title: '總結挑戰', type: 'game' }
];

const QUIZ_DATA: Record<string, Question[]> = {
  p1_blocks: [{ id: 'q1', question: '人體最基本的組成單位是？', options: ['組織', '器官', '系統', '細胞'], answer: '細胞', explanation: '細胞是生物體構造與功能的基本單位。' }],
  p2_gate_unlock: [{ id: 'q2', question: '細胞膜最主要的功能是？', options: ['控制物質進出', '產生能量', '儲存水分', '進行分裂'], answer: '控制物質進出', explanation: '它就像學校大門，負責篩選進出的物體。' }],
  p3_center_unlock: [{ id: 'q3', question: '細胞核內最重要的是什麼？', options: ['水分', '遺傳物質 DNA', '葉綠體', '纖維素'], answer: '遺傳物質 DNA', explanation: 'DNA 儲存了生命的所有設計圖。' }],
  p4_floor_unlock: [{ id: 'q4', question: '細胞質的主要功能？', options: ['保護細胞', '化學反應進行場所', '維持形狀', '製造葡萄糖'], answer: '化學反應進行場所', explanation: '它是細胞內大部分生化反應發生的工作區。' }],
  p5_power_unlock: [{ id: 'q5', question: '粒線體的功能是？', options: ['光合作用', '儲存廢物', '產生能量', '保護 DNA'], answer: '產生能量', explanation: '它是細胞的發電廠，將養分轉為活動所需能量。' }],
  p6_store_unlock: [{ id: 'q6', question: '液胞的主要功能？', options: ['控制進出', '進行呼吸', '儲存物質 (水、養分、廢物)', '支撐身體'], answer: '儲存物質 (水、養分、廢物)', explanation: '它是儲藏室，植物的液胞通常較大。' }],
  p7_wall_unlock: [{ id: 'q7', question: '細胞壁的主要功能？', options: ['製造養分', '保護與支持、維持形狀', '連通外界', '儲存遺傳物質'], answer: '保護與支持、維持形狀', explanation: '它是城堡的城牆，由堅韌的纖維素組成。' }],
  p8_solar_unlock: [{ id: 'q8', question: '葉綠體的功能？', options: ['呼吸作用', '產生熱量', '光合作用製造養分', '過濾水分'], answer: '光合作用製造養分', explanation: '它是太陽能板，能將光能轉為化學能。' }],
  p9_compare_unlock: [{ id: 'q9', question: '植物細胞特有、而動物細胞沒有的構造是？', options: ['細胞核、細胞膜', '細胞質、粒線體', '細胞壁、葉綠體', '液胞、核糖體'], answer: '細胞壁、葉綠體', explanation: '細胞壁和葉綠體是植物細胞的專屬特徵。' }],
  p10_lab_unlock: [{ id: 'q10', question: '觀察細胞時，通常從哪種倍率開始觀察？', options: ['低倍鏡', '高倍鏡', '電子顯微鏡', '肉眼直接看'], answer: '低倍鏡', explanation: '低倍鏡視野廣，容易找到目標物。' }],
  p11_observe_unlock: [{ id: 'q11', question: '比較洋蔥表皮細胞、口腔皮膜細胞與風車草葉片細胞，下列何種構造是這三種細胞皆具備的？', options: ['細胞壁、細胞膜', '細胞核、葉綠體', '細胞膜、細胞質、細胞核', '細胞壁、細胞質、液胞'], answer: '細胞膜、細胞質、細胞核', explanation: '無論是動植物細胞，皆具備細胞膜、細胞質與細胞核這三大基本構造。' }]
};

// --- Constants ---
const GAME_TASKS = [
  { id: 'n_a', name: '細胞核', img: 'animal-cell-nucleus.png', type: 'animal', mission: '控制活動與保存遺傳物質' },
  { id: 'm_p', name: '細胞膜', img: 'plant-cell-membrane.png', type: 'plant', mission: '管控物質進出' },
  { id: 'mit_a', name: '粒線體', img: 'animal-cell-mitochondria.png', type: 'animal', mission: '負責呼吸作用產生能量' },
  { id: 'v_p', name: '液胞', img: 'plant-cell-vacuole.png', type: 'plant', mission: '儲存水分養分與廢物' },
  { id: 'w_p', name: '細胞壁', img: 'plant-cell-wall.png', type: 'plant', mission: '提供支持力並保護細胞' },
  { id: 'chl_p', name: '葉綠體', img: 'plant-cell-chloroplast.png', type: 'plant', mission: '吸收光能進行光合作用' },
];

export default function LearningApp() {
  const [activeTab, setActiveTab] = useState(0);
  const [unlockedTabs, setUnlockedTabs] = useState([0]);
  const [learningScore, setLearningScore] = useState(0);
  const [factoryHighScore, setFactoryHighScore] = useState(0);
  const [sortingHighScore, setSortingHighScore] = useState(0);
  const [summaryHighScore, setSummaryHighScore] = useState(0);
  const [studentInfo, setStudentInfo] = useState({ 
    school: '', 
    classNo: '01', 
    seatNo: '01',
    hasSubmitted: false
  });

  const addLearningScore = useCallback((points: number) => {
    setLearningScore(prev => prev + points);
  }, []);

  const updateFactoryHighScore = useCallback((newScore: number) => {
    setFactoryHighScore(prev => Math.max(prev, newScore));
  }, []);

  const updateSortingHighScore = useCallback((newScore: number) => {
    setSortingHighScore(prev => Math.max(prev, newScore));
  }, []);

  const updateSummaryHighScore = useCallback((newScore: number) => {
    setSummaryHighScore(prev => Math.max(prev, newScore));
  }, []);

  const handleTabChange = (index: number) => {
    if (unlockedTabs.includes(index)) {
      setActiveTab(index);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const unlockNext = () => {
    if (!unlockedTabs.includes(activeTab + 1) && activeTab + 1 < STAGES.length) {
      setUnlockedTabs(prev => [...prev, activeTab + 1]);
    }
  };

  const unlockAll = () => {
    setUnlockedTabs(STAGES.map((_, i) => i));
  };

  const renderTabContent = (idx: number) => {
    switch (idx) {
      case 0: return <P1Blocks unlockNext={unlockNext} />;
      case 1: return <P2Gate unlockNext={unlockNext} />;
      case 2: return <P3Center unlockNext={unlockNext} />;
      case 3: return <P4Floor unlockNext={unlockNext} />;
      case 4: return <P5Power unlockNext={unlockNext} />;
      case 5: return <P6Store unlockNext={unlockNext} />;
      case 6: return <P7Wall unlockNext={unlockNext} />;
      case 7: return <P8Solar unlockNext={unlockNext} />;
      case 8: return <P9Compare addScore={addLearningScore} unlockNext={unlockNext} />;
      case 9: return <P10CellLab unlockNext={unlockNext} />;
      case 10: return <P11ObserveSummary unlockNext={unlockNext} />;
      case 11: return <P11FinalGame updateGameHighScore={updateFactoryHighScore} studentInfo={studentInfo} setStudentInfo={setStudentInfo} />;
      case 12: return <P12Sorting updateGameHighScore={updateSortingHighScore} />;
      case 13: return <P13SummaryChallenge updateGameHighScore={updateSummaryHighScore} />;
      default: return null;
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
               <span className="text-[8px] font-black uppercase tracking-widest text-[#00332c] opacity-50">學習進度 EXP</span>
               <span className="text-2xl font-black text-[#00332c] tabular-nums">{learningScore.toLocaleString()}</span>
            </div>
            
            <div className="flex flex-col items-center border-l-2 border-brand-border/20 pl-6">
               <span className="text-[8px] font-black uppercase tracking-widest text-[#00332c] opacity-50">功能最高分 HI</span>
               <span className="text-2xl font-black text-[#00332c] tabular-nums">{factoryHighScore.toLocaleString()}</span>
            </div>

            <div className="flex flex-col items-center border-l-2 border-brand-border/20 pl-6">
               <span className="text-[8px] font-black uppercase tracking-widest text-[#00332c] opacity-50">分類最高分 HI</span>
               <span className="text-2xl font-black text-[#00332c] tabular-nums">{sortingHighScore.toLocaleString()}</span>
            </div>

            <div className="flex flex-col items-center border-l-2 border-brand-border/20 pl-6">
               <span className="text-[8px] font-black uppercase tracking-widest text-[#00332c] opacity-50">總結最高分 HI</span>
               <span className="text-2xl font-black text-[#00332c] tabular-nums">{summaryHighScore.toLocaleString()}</span>
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
                  ? 'bg-brand-button text-brand-headline shadow-[4px_4px_0px_#00332c] scale-105' 
                  : unlockedTabs.includes(idx)
                    ? 'bg-white text-brand-paragraph hover:bg-gray-50'
                    : 'bg-gray-100 text-gray-300 cursor-not-allowed opacity-50'
              }`}
            >
              {idx + 1 < 10 ? `0${idx + 1}` : idx + 1} {tab.title}
            </button>
          ))}
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

      {/* Floating UI */}
      <button 
        onClick={unlockAll}
        className="fixed bottom-32 left-10 p-4 bg-orange-500 text-white font-black rounded-full shadow-[4px_4px_0px_#000000] z-50 hover:scale-110 transition-transform border-4 border-brand-border"
        title="DEBUG: Unlock All"
      >
        <Unlock size={24} />
      </button>



      {/* Progress Footer */}
      <footer className="fixed bottom-0 left-0 right-0 max-w-[1024px] mx-auto bg-brand-headline h-20 flex items-center px-10 gap-8 z-50 rounded-t-[3rem] border-x-8 border-t-8 border-brand-border">
        <span className="text-brand-button font-black text-xs uppercase tracking-[0.2em] italic">Systems.OS</span>
        <div className="flex-grow h-4 bg-white/10 rounded-full flex gap-1.5 p-1 overflow-hidden border-2 border-white/5">
          {STAGES.map((_, i) => (
            <div 
              key={i} 
              className={`h-full rounded-full transition-all duration-700 ${
                i <= activeTab ? 'bg-brand-button flex-grow' : 'bg-white/10 w-8'
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

function CellImagePair({ 
  animalImg, 
  plantImg, 
  animalExists = true, 
  plantExists = true 
}: { 
  animalImg?: string, 
  plantImg?: string, 
  animalExists?: boolean,
  plantExists?: boolean 
}) {
  return (
    <div className="grid grid-cols-2 gap-8 mb-12">
      {/* Animal Section */}
      <div className="flex flex-col items-center">
        <div className="text-xl font-black mb-4 uppercase tracking-tighter italic text-brand-headline flex items-center gap-2">
          <span className="w-8 h-8 rounded-full bg-brand-headline text-white flex items-center justify-center text-xs not-italic">A</span>
          動物細胞
        </div>
        <div className="w-full aspect-[4/3] bg-white rounded-[2.5rem] border-4 border-brand-border shadow-[6px_6px_0px_#00332c] overflow-hidden flex items-center justify-center relative">
          {!animalExists ? (
            <div className="text-9xl font-black text-red-500 opacity-20 select-none">✕</div>
          ) : animalImg ? (
            <div className="relative w-full h-full">
              <div className="absolute inset-0 p-6">
                <Image 
                  src={`/images/${encodeURIComponent(animalImg || '')}`} 
                  alt="動物細胞構造" 
                  fill 
                  className="object-contain"
                  referrerPolicy="no-referrer"
                  unoptimized={true}
                />
              </div>
            </div>
          ) : (
            <div className="text-gray-300 font-black italic">圖片待補</div>
          )}
        </div>
      </div>
      {/* Plant Section */}
      <div className="flex flex-col items-center">
        <div className="text-xl font-black mb-4 uppercase tracking-tighter italic text-green-900 flex items-center gap-2">
          <span className="w-8 h-8 rounded-full bg-green-900 text-white flex items-center justify-center text-xs not-italic">P</span>
          植物細胞
        </div>
        <div className="w-full aspect-[4/3] bg-white rounded-[2.5rem] border-4 border-green-600 shadow-[6px_6px_0px_#14532d] overflow-hidden flex items-center justify-center relative">
          {!plantExists ? (
            <div className="text-9xl font-black text-red-500 opacity-20 select-none">✕</div>
          ) : plantImg ? (
            <div className="relative w-full h-full">
              <div className="absolute inset-0 p-6">
                <Image 
                  src={`/images/${encodeURIComponent(plantImg || '')}`} 
                  alt="植物細胞構造" 
                  fill 
                  className="object-contain"
                  referrerPolicy="no-referrer"
                  unoptimized={true}
                />
              </div>
            </div>
          ) : (
            <div className="text-gray-400 font-black italic">圖片待補</div>
          )}
        </div>
      </div>
    </div>
  );
}

function StageWrapper({ children, title, subtitle, metaphor, unlockQuizKey, onUnlock, hideMetaphor }: { 
  children: React.ReactNode, 
  title: string, 
  subtitle: string, 
  metaphor?: { icon: string, title: string, desc: string },
  unlockQuizKey: string,
  onUnlock: () => void,
  hideMetaphor?: boolean
}) {
  const [showQuiz, setShowQuiz] = useState(false);

  return (
    <div className="max-w-4xl mx-auto space-y-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 pb-10 border-b-4 border-brand-border border-dashed">
        <div className="space-y-3">
          <h2 className="text-5xl font-black text-brand-headline uppercase tracking-tighter italic">{title}</h2>
          <p className="text-2xl text-brand-paragraph font-bold opacity-70 border-l-8 border-brand-button pl-6">{subtitle}</p>
        </div>
        {!hideMetaphor && metaphor && (
          <div className="card-bold bg-white p-6 flex items-center gap-5 border-brand-headline shadow-[6px_6px_0px_#00332c]">
            <div className="w-14 h-14 bg-brand-button rounded-2xl border-4 border-brand-border flex items-center justify-center text-3xl shadow-inner">
              {metaphor.icon}
            </div>
            <div>
              <div className="text-[10px] font-black uppercase tracking-widest text-brand-border opacity-50">就像是</div>
              <div className="font-black text-2xl text-brand-headline tracking-tighter">{metaphor.title}</div>
            </div>
          </div>
        )}
      </div>

      <div className="space-y-12 min-h-[400px]">
        {children}
      </div>

      {!showQuiz ? (
        <div className="text-center py-16 bg-white/50 rounded-[4rem] border-8 border-brand-border border-dashed">
          <button 
            id="unlock-quiz-trigger"
            onClick={() => setShowQuiz(true)}
            className="flex items-center gap-4 mx-auto btn-bold bg-brand-headline text-brand-button px-16 py-8 text-3xl hover:rotate-1 transition-transform"
          >
            <CirclePlay size={40} />
            任務完成：前往認證解鎖
          </button>
        </div>
      ) : (
        <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} className="pt-20">
          <QuizComponent 
            questions={QUIZ_DATA[unlockQuizKey]} 
            onComplete={() => {
              onUnlock();
              setShowQuiz(false);
            }} 
          />
        </motion.div>
      )}
    </div>
  );
}

function QuizComponent({ questions, onComplete }: { questions: Question[], onComplete: () => void }) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [tries, setTries] = useState(1);
  const [isFinished, setIsFinished] = useState(false);

  const currentQ = questions[currentIdx];

  const handleSelect = (idx: number) => {
    if (isCorrect) return;
    setSelectedIdx(idx);
    const correct = currentQ.options[idx] === currentQ.answer;
    setIsCorrect(correct);
    if (!correct) setTries(prev => prev + 1);
  };

  const nextQ = () => {
    if (currentIdx + 1 < questions.length) {
      setCurrentIdx(i => i + 1);
      setSelectedIdx(null);
      setIsCorrect(null);
      setTries(1);
    } else {
      setIsFinished(true);
      onComplete();
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-10">
      <div className="flex items-center justify-between bg-white border-4 border-brand-border p-6 rounded-[2rem] shadow-[8px_8px_0px_#00332c]">
         <div className="flex flex-col">
            <span className="text-[10px] font-black uppercase tracking-widest opacity-40">Challenge Node</span>
            <span className="text-2xl font-black text-brand-headline">Q{currentIdx + 1 < 10 ? `0${currentIdx + 1}` : currentIdx + 1}</span>
         </div>
         <div className="flex gap-2">
            {[1, 2, 3].map(t => (
              <div key={t} className={`w-6 h-6 rounded-lg border-2 border-brand-border ${tries >= t ? 'bg-red-500 scale-110' : 'bg-gray-100 opacity-20'}`} />
            ))}
         </div>
      </div>

      <h3 className="text-4xl font-black text-brand-headline leading-tight">{currentQ.question}</h3>

      <div className="space-y-4">
        {currentQ.options.map((opt, i) => (
          <button
            key={i}
            onClick={() => handleSelect(i)}
            className={`w-full p-8 rounded-3xl border-4 text-2xl font-black transition-all flex items-center justify-between group ${
              selectedIdx === i
                ? isCorrect
                  ? 'bg-green-100 border-green-600 text-green-900 shadow-[6px_6px_0px_#163c2c]'
                  : 'bg-red-100 border-red-600 text-red-900 shadow-[6px_6px_0px_#4c1d1d]'
                : 'bg-white border-brand-border/10 hover:border-brand-button hover:bg-brand-button/5'
            }`}
          >
            <span>{opt}</span>
            {selectedIdx === i && isCorrect === true && <CheckCircle2 className="text-green-600" size={32} />}
            {selectedIdx === i && isCorrect === false && <XCircle className="text-red-600" size={32} />}
          </button>
        ))}
      </div>

      <AnimatePresence>
        {isCorrect === false && (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-brand-headline text-white p-10 rounded-[3rem] border-8 border-brand-border shadow-[12px_12px_0px_#fa5246] flex gap-8 italic">
             <div className="text-5xl">⚡</div>
             <p className="text-xl font-bold leading-relaxed opacity-90">{currentQ.explanation}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {isCorrect === true && (
        <button onClick={nextQ} className="w-full btn-bold bg-brand-headline text-brand-button py-8 text-3xl uppercase tracking-[0.2em] italic">
          Next Phase
        </button>
      )}
    </div>
  );
}

// --- Specific Stage Content ---

// --- Helper Components for Styling ---
const Highlight = ({ children }: { children: React.ReactNode }) => (
  <span className="bg-[#faff00] px-2 py-0.5 rounded-sm font-black text-brand-headline shadow-[2px_2px_0px_#00332c] mx-1">
    {children}
  </span>
);

const Connect = ({ children }: { children: React.ReactNode }) => (
  <span className="border-2 border-brand-border/30 rounded-full px-3 py-1 mx-1 inline-block text-brand-headline font-black text-base md:text-lg bg-white/50">
    {children}
  </span>
);

function P1Blocks({ unlockNext }: { unlockNext: () => void }) {
  return (
    <StageWrapper 
      title="細胞的種類" 
      subtitle=""
      metaphor={{ icon: '🧩', title: '樂高積木', desc: '所有的複雜結構都由最小單元組成。' }}
      unlockQuizKey="p1_blocks"
      onUnlock={unlockNext}
      hideMetaphor
    >
      <div className="card-bold bg-white border-8 border-brand-border p-12 rounded-[4rem] shadow-[20px_20px_0px_#faae2b] relative overflow-hidden">
        <div className="relative z-10">
          <p className="text-3xl md:text-4xl font-bold leading-[2] text-brand-headline italic text-center">
            細胞的<Highlight>種類有很多</Highlight>，<Connect>但</Connect>大多具有相似的<Highlight>基本構造</Highlight>，主要包含<Highlight>細胞核</Highlight>、<Highlight>細胞質</Highlight><Connect>與</Connect><Highlight>細胞膜</Highlight>等共有構造。
          </p>
        </div>
      </div>
      <CellImagePair animalImg="animal-cell-full.png" plantImg="plant-cell-full.png" />
    </StageWrapper>
  );
}

function P2Gate({ unlockNext }: { unlockNext: () => void }) {
  return (
    <StageWrapper 
      title="細胞膜" 
      subtitle=""
      metaphor={{ icon: '🚪', title: '大門警衛', desc: '負責檢查所有進出的對象。' }}
      unlockQuizKey="p2_gate_unlock"
      onUnlock={unlockNext}
      hideMetaphor
    >
      <div className="card-bold bg-white border-8 border-brand-border p-10 rounded-[3rem] shadow-[20px_20px_0px_#faae2b] space-y-12 font-bold text-brand-paragraph italic">
        <div className="flex gap-6 items-start">
          <div className="flex-1">
            <span className="text-xl font-black bg-brand-headline text-white px-4 py-1 rounded-lg mb-2 inline-block shadow-[3px_3px_0px_#000]">功能</span>
            <p className="text-2xl leading-relaxed mt-2">
              <Connect>是</Connect>維持細胞完整性的<Highlight>薄膜狀構造</Highlight>，<Connect>能夠</Connect><Highlight>區隔</Highlight>細胞內、外環境，<Connect>並</Connect>負責<Highlight>控制物質進出</Highlight>細胞。
            </p>
          </div>
        </div>
      </div>
      <CellImagePair animalImg="animal-cell-membrane.png" plantImg="plant-cell-membrane.png" />
    </StageWrapper>
  );
}

function P3Center({ unlockNext }: { unlockNext: () => void }) {
  return (
    <StageWrapper 
      title="細胞核" 
      subtitle=""
      metaphor={{ icon: '👑', title: '校長室', desc: '發號施令，保存全校最重要的文件。' }}
      unlockQuizKey="p3_center_unlock"
      onUnlock={unlockNext}
      hideMetaphor
    >
      <div className="card-bold bg-white border-8 border-brand-border p-10 rounded-[3rem] shadow-[20px_20px_0px_#faae2b] space-y-12">
        <div className="space-y-10 font-bold text-brand-paragraph italic">
          <div className="flex gap-6 items-start">
            <span className="text-3xl">①</span>
            <div className="flex-1">
              <span className="text-xl font-black bg-brand-headline text-white px-4 py-1 rounded-lg mb-2 inline-block shadow-[3px_3px_0px_#000]">外觀與組成</span>
              <p className="text-2xl leading-relaxed mt-2">
                多呈<Highlight>球形</Highlight>，<Connect>由</Connect><Highlight>核膜</Highlight>包覆，其內部<Connect>含有</Connect><Highlight>遺傳物質</Highlight>。
              </p>
            </div>
          </div>
          <div className="flex gap-6 items-start">
            <span className="text-3xl">②</span>
            <div className="flex-1">
              <span className="text-xl font-black bg-brand-headline text-white px-4 py-1 rounded-lg mb-2 inline-block shadow-[3px_3px_0px_#000]">功能</span>
              <p className="text-2xl leading-relaxed mt-2">
                <Connect>是</Connect>細胞的<Highlight>生命中樞</Highlight>，負責<Highlight>控制</Highlight>細胞的<Highlight>代謝作用</Highlight>。<Connect>若</Connect>將細胞核除去，細胞將會逐漸死亡。
              </p>
            </div>
          </div>
        </div>
      </div>
      <CellImagePair animalImg="animal-cell-nucleus.png" plantImg="plant-cell-nucleus.png" />
    </StageWrapper>
  );
}

function P4Floor({ unlockNext }: { unlockNext: () => void }) {
  return (
    <StageWrapper 
      title="細胞質" 
      subtitle=""
      metaphor={{ icon: '🏭', title: '工廠地板', desc: '機器在上面運作、反應在上面發生。' }}
      unlockQuizKey="p4_floor_unlock"
      onUnlock={unlockNext}
      hideMetaphor
    >
      <div className="card-bold bg-white border-8 border-brand-border p-10 rounded-[3rem] shadow-[20px_20px_0px_#faae2b] space-y-12 font-bold text-brand-paragraph italic">
        <div className="flex gap-6 items-start">
          <span className="text-3xl">①</span>
          <div className="flex-1">
            <span className="text-xl font-black bg-brand-headline text-white px-4 py-1 rounded-lg mb-2 inline-block shadow-[3px_3px_0px_#000]">組成</span>
            <p className="text-2xl leading-relaxed mt-2">
              <Connect>由</Connect><Highlight>膠狀的水溶液</Highlight><Connect>以及</Connect>散布在其中各種<Highlight>「胞器」</Highlight><Connect>所</Connect>組成。
            </p>
          </div>
        </div>
        <div className="flex gap-6 items-start">
          <span className="text-3xl">②</span>
          <div className="flex-1">
            <span className="text-xl font-black bg-brand-headline text-white px-4 py-1 rounded-lg mb-2 inline-block shadow-[3px_3px_0px_#000]">功能</span>
            <p className="text-2xl leading-relaxed mt-2">
              <Connect>是</Connect>細胞進行<Highlight>代謝作用的場所</Highlight>。<Connect>內有</Connect>許多胞器，<Connect>是</Connect>散布<Connect>於</Connect>細胞質中具<Highlight>特定功能</Highlight>的微小構造。
            </p>
          </div>
        </div>
      </div>
      <CellImagePair animalImg="animal-cell-cytoplasm.png" plantImg="plant-cell-cytoplasm.png" />
    </StageWrapper>
  );
}

function P5Power({ unlockNext }: { unlockNext: () => void }) {
  return (
    <StageWrapper 
      title="粒線體" 
      subtitle=""
      metaphor={{ icon: '🔋', title: '手機電池', desc: '沒有電力，再強的功能都無法運行。' }}
      unlockQuizKey="p5_power_unlock"
      onUnlock={unlockNext}
      hideMetaphor
    >
      <div className="card-bold bg-white border-8 border-brand-border p-12 rounded-[4rem] shadow-[20px_20px_0px_#faae2b]">
        <p className="text-2xl md:text-3xl font-bold leading-[2] text-brand-paragraph italic text-center">
          一種<Highlight>胞器</Highlight>，<Connect>可</Connect>利用<Highlight>養分</Highlight>進行<Highlight>呼吸作用</Highlight>，<Connect>藉此</Connect>產生細胞運作<Highlight>所需的能量</Highlight>。
        </p>
      </div>
      <CellImagePair animalImg="animal-cell-mitochondria.png" plantImg="plant-cell-mitochondria.png" />
    </StageWrapper>
  );
}

function P6Store({ unlockNext }: { unlockNext: () => void }) {
  return (
    <StageWrapper 
      title="液胞" 
      subtitle=""
      metaphor={{ icon: '📦', title: '大冰箱', desc: '儲存生存所需，也暫存要丟的垃圾。' }}
      unlockQuizKey="p6_store_unlock"
      onUnlock={unlockNext}
      hideMetaphor
    >
      <div className="card-bold bg-white border-8 border-brand-border p-10 rounded-[3rem] shadow-[20px_20px_0px_#faae2b] text-brand-headline font-bold italic">
        <p className="text-2xl md:text-3xl leading-relaxed mb-8">
          一種<Highlight>胞器</Highlight>，外觀呈<Highlight>囊泡狀</Highlight>，主要功能<Connect>為</Connect><Highlight>儲存水分、養分或廢物</Highlight>等物質。
        </p>
        <div className="bg-brand-bg md:p-8 p-6 border-4 border-brand-border border-dashed rounded-3xl space-y-6">
           <span className="text-xl font-black bg-brand-headline text-white px-4 py-1 rounded-lg mb-2 inline-block shadow-[3px_3px_0px_#000]">比較</span>
           <p className="text-xl md:text-2xl leading-relaxed">
             通常植物細胞的液胞<Highlight>較大</Highlight>，<Connect>有的</Connect>成熟植物細胞<Connect>只有一個</Connect>液胞，<Connect>還具有</Connect>維持<Highlight>細胞形狀</Highlight>的功能，<Connect>而</Connect>動物細胞的液胞<Connect>則</Connect><Highlight>較小</Highlight>。
           </p>
        </div>
      </div>
      <CellImagePair animalImg="animal-cell-vacuole.png" plantImg="plant-cell-vacuole.png" />
    </StageWrapper>
  );
}

function P7Wall({ unlockNext }: { unlockNext: () => void }) {
  return (
    <StageWrapper 
      title="細胞壁" 
      subtitle=""
      metaphor={{ icon: '🏰', title: '城堡城牆', desc: '堅硬的防禦工事，維持建築形狀。' }}
      unlockQuizKey="p7_wall_unlock"
      onUnlock={unlockNext}
      hideMetaphor
    >
      <div className="card-bold bg-white border-8 border-brand-border p-10 rounded-[3rem] shadow-[20px_20px_0px_#faae2b] space-y-12 font-bold text-brand-paragraph italic">
        <div className="flex gap-6 items-start">
          <span className="text-3xl">①</span>
          <div className="flex-1">
            <span className="text-xl font-black bg-brand-headline text-white px-4 py-1 rounded-lg mb-2 inline-block shadow-[3px_3px_0px_#000]">位置與成分</span>
            <p className="text-2xl leading-relaxed mt-2">
              <Connect>位於</Connect>植物細胞膜的<Highlight>外側</Highlight>，主要<Connect>由</Connect><Highlight>纖維素</Highlight><Connect>所</Connect>組成。
            </p>
          </div>
        </div>
        <div className="flex gap-6 items-start">
          <span className="text-3xl">②</span>
          <div className="flex-1">
            <span className="text-xl font-black bg-brand-headline text-white px-4 py-1 rounded-lg mb-2 inline-block shadow-[3px_3px_0px_#000]">功能</span>
            <p className="text-2xl leading-relaxed mt-2">
              <Highlight>具有保護</Highlight>細胞、<Highlight>維持細胞形狀</Highlight><Connect>以及</Connect><Highlight>支持植物體</Highlight>的作用。
            </p>
          </div>
        </div>
      </div>
      <CellImagePair animalExists={false} plantImg="plant-cell-wall.png" />
    </StageWrapper>
  );
}

function P8Solar({ unlockNext }: { unlockNext: () => void }) {
  return (
    <StageWrapper 
      title="葉綠體" 
      subtitle=""
      metaphor={{ icon: '☀️', title: '太陽能板', desc: '不花錢買燃料，靠太陽自製乾糧。' }}
      unlockQuizKey="p8_solar_unlock"
      onUnlock={unlockNext}
      hideMetaphor
    >
      <div className="card-bold bg-white border-8 border-brand-border p-10 rounded-[3rem] shadow-[20px_20px_0px_#faae2b] space-y-12 font-bold text-brand-paragraph italic">
        <div className="flex gap-6 items-start">
          <span className="text-3xl">①</span>
          <div className="flex-1">
            <span className="text-xl font-black bg-brand-headline text-white px-4 py-1 rounded-lg mb-2 inline-block shadow-[3px_3px_0px_#000]">存在對象</span>
            <p className="text-2xl leading-relaxed mt-2">
              <Connect>有些</Connect>植物細胞，<Connect>如</Connect>綠色植物的<Highlight>葉肉細胞</Highlight><Connect>和</Connect><Highlight>保衛細胞</Highlight>。
            </p>
          </div>
        </div>
        <div className="flex gap-6 items-start">
          <span className="text-3xl">②</span>
          <div className="flex-1">
            <span className="text-xl font-black bg-brand-headline text-white px-4 py-1 rounded-lg mb-2 inline-block shadow-[3px_3px_0px_#000]">功能</span>
            <p className="text-2xl leading-relaxed mt-2">
              <Connect>進行</Connect><Highlight>光合作用</Highlight><Connect>以</Connect>製造<Highlight>葡萄糖</Highlight>。
            </p>
          </div>
        </div>
      </div>
      <CellImagePair animalExists={false} plantImg="plant-cell-chloroplast.png" />
    </StageWrapper>
  );
}

function P9Compare({ addScore, unlockNext }: { addScore: (p: number) => void, unlockNext: () => void }) {
  const ORGANELLES = [
    { id: 'nucleus', name: '細胞核', category: 'both', desc: '含有遺傳物質 (DNA)，是細胞的生命中樞。', img: 'plant-cell-nucleus.png', note: '兩者都有細胞核來控制生理活動。' },
    { id: 'membrane', name: '細胞膜', category: 'both', desc: '控制物質進出，就像大門警衛。', img: 'plant-cell-membrane.png', note: '兩者都有細胞膜來維持完整性。' },
    { id: 'cytoplasm', name: '細胞質', category: 'both', desc: '化學反應發生的工作區，呈膠體狀。', img: 'plant-cell-cytoplasm.png', note: '兩者都有細胞質。' },
    { id: 'mitochondria', name: '粒線體', category: 'both', desc: '細胞的發電廠，負責進行呼吸作用。', img: 'plant-cell-mitochondria.png', note: '兩者都需要粒線體產生能量。' },
    { id: 'vacuole', name: '液胞', category: 'both', desc: '儲存水分與養分。植物的極大，動物的極小。', img: 'plant-cell-vacuole.png', note: '兩者都有，但植物液胞占據細胞大部分空間。' },
    { id: 'wall', name: '細胞壁', category: 'plant', desc: '位於最外層，提供支持力與保護。', img: 'plant-cell-wall.png', note: '植物細胞特有，主要成分是纖維素。' },
    { id: 'chloroplast', name: '葉綠體', category: 'plant', desc: '負責進行光合作用製造養分。', img: 'plant-cell-chloroplast.png', note: '植物細胞特有，能將光能轉為化學能。' }
  ];

  const [currentIdx, setCurrentIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState<'animal' | 'plant' | 'both' | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showSummary, setShowSummary] = useState(false);

  const handleChoice = (category: 'animal' | 'plant' | 'both') => {
    if (selected !== null) return;
    setSelected(category);
    const correct = ORGANELLES[currentIdx].category === category;
    setIsCorrect(correct);
    if (correct) {
      setScore(s => s + 100);
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
        metaphor={{ icon: '⚖️', title: '天平比較', desc: '看清兩者的異同。' }}
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
                  <th className="p-4 border-r-4 border-brand-border">動物細胞</th>
                  <th className="p-4 border-r-4 border-brand-border">植物細胞</th>
                  <th className="p-4">主要功能 / 特徵</th>
                </tr>
              </thead>
              <tbody className="divide-y-4 divide-brand-border/20">
                <tr className="bg-orange-50/50">
                  <td className="p-4 border-r-4 border-brand-border font-black text-brand-headline">細胞核</td>
                  <td className="p-4 border-r-4 border-brand-border text-green-600 text-center">✓ 有</td>
                  <td className="p-4 border-r-4 border-brand-border text-green-600 text-center">✓ 有</td>
                  <td className="p-4 text-brand-paragraph text-sm font-semibold">含有 DNA，控制生理活動。</td>
                </tr>
                <tr>
                  <td className="p-4 border-r-4 border-brand-border font-black text-brand-headline">細胞膜</td>
                  <td className="p-4 border-r-4 border-brand-border text-green-600 text-center">✓ 有</td>
                  <td className="p-4 border-r-4 border-brand-border text-green-600 text-center">✓ 有</td>
                  <td className="p-4 text-brand-paragraph text-sm font-semibold">控制物質進出。</td>
                </tr>
                <tr className="bg-orange-50/50">
                  <td className="p-4 border-r-4 border-brand-border font-black text-brand-headline">細胞質</td>
                  <td className="p-4 border-r-4 border-brand-border text-green-600 text-center">✓ 有</td>
                  <td className="p-4 border-r-4 border-brand-border text-green-600 text-center">✓ 有</td>
                  <td className="p-4 text-brand-paragraph text-sm font-semibold">多種化學反應發生的場所。</td>
                </tr>
                <tr>
                  <td className="p-4 border-r-4 border-brand-border font-black text-brand-headline">粒線體</td>
                  <td className="p-4 border-r-4 border-brand-border text-green-600 text-center">✓ 有</td>
                  <td className="p-4 border-r-4 border-brand-border text-green-600 text-center">✓ 有</td>
                  <td className="p-4 text-brand-paragraph text-sm font-semibold">呼吸作用產生能量 (ATP)。</td>
                </tr>
                <tr className="bg-orange-50/50">
                  <td className="p-4 border-r-4 border-brand-border font-black text-brand-headline">液胞</td>
                  <td className="p-4 border-r-4 border-brand-border text-brand-paragraph text-center">✓ 有 (小、多)</td>
                  <td className="p-4 border-r-4 border-brand-border text-green-600 text-center font-black">✓ 有 (特大)</td>
                  <td className="p-4 text-brand-paragraph text-sm font-semibold">儲存水、養分、廢物。植物液胞極大可用於支撐。</td>
                </tr>
                <tr className="bg-red-50">
                  <td className="p-4 border-r-4 border-brand-border font-black text-brand-headline">細胞壁</td>
                  <td className="p-4 border-r-4 border-brand-border text-red-500 text-center">✕ 無</td>
                  <td className="p-4 border-r-4 border-brand-border text-green-600 text-center font-black bg-green-50">✓ 有</td>
                  <td className="p-4 text-brand-paragraph text-sm font-semibold">支持與保護，主要成分為纖維素。</td>
                </tr>
                <tr className="bg-red-50">
                  <td className="p-4 border-r-4 border-brand-border font-black text-brand-headline">葉綠體</td>
                  <td className="p-4 border-r-4 border-brand-border text-red-500 text-center">✕ 無</td>
                  <td className="p-4 border-r-4 border-brand-border text-green-600 text-center font-black bg-green-50">✓ 有 (綠色細胞)</td>
                  <td className="p-4 text-brand-paragraph text-sm font-semibold">進行光合作用，製造有機養分。</td>
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
      metaphor={{ icon: '⚖️', title: '天平比較', desc: '看清兩者的異同。' }}
      unlockQuizKey="p9_compare_unlock"
      onUnlock={unlockNext}
      hideMetaphor
    >
      <div className="max-w-2xl mx-auto space-y-10">
        <div className="bg-white border-4 border-brand-border p-6 rounded-[2rem] shadow-[8px_8px_0px_#00332c] flex justify-between items-center">
          <div className="flex flex-col">
            <span className="text-[10px] font-black uppercase tracking-widest opacity-40">Organelle Sorting</span>
            <span className="text-2xl font-black text-brand-headline">第 {currentIdx + 1} / {ORGANELLES.length} 題</span>
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
                src={`/images/${encodeURIComponent(currentOrg.img || '')}`} 
                alt={currentOrg.name} 
                fill 
                className="object-contain p-2"
                referrerPolicy="no-referrer"
                unoptimized={true}
              />
            </div>
          )}
          <div className="space-y-2">
            <h4 className="text-4xl font-black text-brand-headline">{currentOrg.name}</h4>
            <p className="text-lg text-brand-paragraph font-bold opacity-70">{currentOrg.desc}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
            <button 
              onClick={() => handleChoice('animal')}
              disabled={selected !== null}
              className={`p-5 rounded-2xl border-4 text-xl font-black transition-all ${
                selected === 'animal'
                  ? isCorrect
                    ? 'bg-green-100 border-green-600 text-green-900 shadow-[4px_4px_0px_#163c2c]'
                    : 'bg-red-100 border-red-600 text-red-900 shadow-[4px_4px_0px_#4c1d1d]'
                  : 'bg-white border-brand-border/10 hover:border-brand-button hover:bg-brand-button/5'
              }`}
            >
              動物細胞特有
            </button>
            <button 
              onClick={() => handleChoice('plant')}
              disabled={selected !== null}
              className={`p-5 rounded-2xl border-4 text-xl font-black transition-all ${
                selected === 'plant'
                  ? isCorrect
                    ? 'bg-green-100 border-green-600 text-green-900 shadow-[4px_4px_0px_#163c2c]'
                    : 'bg-red-100 border-red-600 text-red-900 shadow-[4px_4px_0px_#4c1d1d]'
                  : 'bg-white border-brand-border/10 hover:border-brand-button hover:bg-brand-button/5'
              }`}
            >
              植物細胞特有
            </button>
            <button 
              onClick={() => handleChoice('both')}
              disabled={selected !== null}
              className={`p-5 rounded-2xl border-4 text-xl font-black transition-all ${
                selected === 'both'
                  ? isCorrect
                    ? 'bg-green-100 border-green-600 text-green-900 shadow-[4px_4px_0px_#163c2c]'
                    : 'bg-red-100 border-red-600 text-red-900 shadow-[4px_4px_0px_#4c1d1d]'
                  : 'bg-white border-brand-border/10 hover:border-brand-button hover:bg-brand-button/5'
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
                isCorrect ? 'bg-green-50 border-green-600 text-green-900' : 'bg-red-50 border-red-600 text-red-900'
              }`}
            >
              <p className="text-xl mb-2">{isCorrect ? '答對了！' : '答錯了！'}</p>
              <p className="text-sm font-semibold text-brand-paragraph opacity-80">{currentOrg.note}</p>
              <button 
                onClick={handleNext}
                className="mt-6 btn-bold bg-brand-headline text-brand-button px-10 py-3 text-lg"
              >
                {currentIdx + 1 < ORGANELLES.length ? '下一題' : '完成分類，看對照表'}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </StageWrapper>
  );
}

function MicroscopeKnob({ value, onChange, label }: { value: number, onChange: (v: number) => void, label: string }) {
  const [isDragging, setIsDragging] = useState(false);
  const startY = useRef(0);
  const startVal = useRef(value);

  const handlePointerDown = (e: React.PointerEvent) => {
    setIsDragging(true);
    startY.current = e.clientY;
    startVal.current = value;
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    const dy = startY.current - e.clientY;
    let newVal = startVal.current + dy * 0.5;
    if (newVal > 100) newVal = 100;
    if (newVal < 0) newVal = 0;
    onChange(newVal);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    setIsDragging(false);
    e.currentTarget.releasePointerCapture(e.pointerId);
  };

  return (
    <div className="flex flex-col items-center gap-3 select-none">
      <div 
        className="w-20 h-32 bg-[#2a2a2a] rounded-[1rem] border-4 border-[#1a1a1a] shadow-[4px_4px_0px_rgba(0,0,0,0.5)] relative overflow-hidden flex items-center justify-center cursor-ns-resize touch-none active:scale-95 transition-transform"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >
        <div 
          className="w-full h-full absolute flex flex-col justify-around transition-transform duration-75"
          style={{ transform: `translateY(${(value % 20) - 10}px)` }}
        >
          {Array.from({length: 10}).map((_, i) => (
            <div key={i} className="w-full h-1 bg-black/60" />
          ))}
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-black/60 pointer-events-none" />
      </div>
      <div className="text-center space-y-1">
        <div className="font-black text-xs uppercase tracking-widest text-brand-paragraph opacity-70">{label}</div>
        <div className="text-brand-button font-black text-lg">{Math.round(value)}</div>
      </div>
    </div>
  );
}

function P10CellLab({ unlockNext }: { unlockNext: () => void }) {
  const [phase, setPhase] = useState<'intro' | 'prep' | 'micro' | 'report' | 'inquiry' | 'result'>('intro');
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
    offsetY: 0
  });

  const SAMPLES = [
    { id: 'onion', title: '洋蔥表皮細胞', color: 'bg-orange-50', img: '洋蔥表皮細胞.png', stainedImg: '洋蔥表皮細胞染色.png', steps: ['載玻片', '滴清水', '撕取表皮', '放置樣本', '蓋蓋玻片', '滴碘液', '吸水紙'] },
    { id: 'zebrina', title: '風車草下表皮', color: 'bg-green-50', img: '風車草下表皮細胞.png', stainedImg: '風車草下表皮細胞.png', steps: ['載玻片', '滴清水', '撕取表皮', '放置樣本', '蓋蓋玻片', '吸水紙'] },
    { id: 'cheek', title: '口腔皮膜細胞', color: 'bg-pink-50', img: '口腔皮膜細胞.png', stainedImg: '口腔皮膜細胞.png', steps: ['載玻片', '滴亞甲藍', '刮取細胞', '放置樣本', '蓋蓋玻片', '吸水紙'] }
  ];

  const TOOLS = [
    { id: 1, name: '載玻片', icon: '05_載玻片.png', instruction: '❶ 準備：在實驗桌中央放置一片乾淨、乾燥的載玻片' },
    { id: 2, name: '滴管 (水)', icon: '01_滴管.png', instruction: '❷ 滴液：在載玻片中央滴一滴清水，保持表皮細胞活性' },
    { id: 5, name: '滴管 (染色)', icon: '06_滴瓶.png', instruction: '❸ 染色：滴加染液使細胞核更清晰便於觀察' },
    { id: 3, name: '鑷子/牙籤', icon: '02_鑷子.png', instruction: '❹ 樣本：用鑷子或牙籤將樣本展開平放於載玻片中央' },
    { id: 4, name: '蓋玻片', icon: '04_蓋玻片.png', instruction: '❺ 覆蓋：以 45 度角由一側輕輕蓋上，避免產生氣泡' },
    { id: 6, name: '吸水紙', icon: '08_吸水紙.png', instruction: '❻ 吸引：從另一側吸取多餘染液以引導其均勻滲透' }
  ];

  const LABEL_TARGETS: Record<string, { id: string; label: string; x: number; y: number }[]> = {
    onion: [
      { id: 'onion-nucleus', label: '細胞核', x: 48, y: 35 },
      { id: 'onion-wall', label: '細胞壁', x: 22, y: 15 },
      { id: 'onion-cyto', label: '細胞質', x: 70, y: 65 }
    ],
    zebrina: [
      { id: 'zebrina-nucleus', label: '細胞核', x: 20, y: 25 },
      { id: 'zebrina-wall', label: '細胞壁', x: 45, y: 15 },
      { id: 'zebrina-cyto', label: '細胞質', x: 15, y: 60 },
      { id: 'zebrina-guard', label: '保衛細胞', x: 60, y: 50 },
      { id: 'zebrina-stoma', label: '氣孔', x: 75, y: 72 }
    ],
    cheek: [
      { id: 'cheek-nucleus', label: '細胞核', x: 45, y: 45 },
      { id: 'cheek-membrane', label: '細胞膜', x: 75, y: 20 },
      { id: 'cheek-cyto', label: '細胞質', x: 30, y: 65 }
    ]
  };

  const getToolInstruction = (toolId: number, sampleId: string) => {
    if (sampleId === 'onion') {
      switch (toolId) {
        case 1: return '❶ 載玻片：請點擊工具列的「載玻片」，在實驗桌中央放置一片乾淨乾燥的載玻片。';
        case 2: return '❷ 滴清水：點擊「滴管 (水)」，在載玻片中央滴一滴清水，為洋蔥表皮準備濕潤環境。';
        case 3: return '❸ 撕取與放置樣本：點擊「鑷子/牙籤」，輕輕撕下洋蔥內側表皮，展開平放於清水滴中。';
        case 4: return '❹ 蓋蓋玻片：點擊「蓋玻片」，呈 45 度角緩慢蓋上，以防止空氣泡殘留。';
        case 5: return '❺ 滴碘液染色：點擊「滴管 (染色)」，在蓋玻片一側滴加一滴碘液（會使細胞核染成黃褐色）。';
        case 6: return '❻ 吸水紙引流：點擊「吸水紙」，從蓋玻片另一側吸引碘液，引導其均勻滲入蓋玻片下。';
        default: return '準備就緒...';
      }
    } else if (sampleId === 'zebrina') {
      switch (toolId) {
        case 1: return '❶ 載玻片：請點擊工具列的「載玻片」，在實驗桌中央放置一片乾淨乾燥的載玻片。';
        case 2: return '❷ 滴清水：點擊「滴管 (水)」，在載玻片中央滴一滴清水，為風車草下表皮提供介質。';
        case 3: return '❸ 撕取與放置樣本：點擊「鑷子/牙籤」，撕下葉片下表皮的一小層薄膜，展開平放於清水滴中。';
        case 4: return '❹ 蓋蓋玻片：點擊「蓋玻片」，呈 45 度角緩慢蓋上，防止氣泡封入。';
        case 6: return '❺ 吸水紙吸水：風車草下表皮細胞富含綠色葉綠體，不需染色即可看清，點擊「吸水紙」吸除多餘水分。';
        default: return '準備就緒...';
      }
    } else {
      switch (toolId) {
        case 1: return '❶ 載玻片：請點擊工具列的「載玻片」，在實驗桌中央放置一片乾淨乾燥的載玻片。';
        case 5: return '❷ 滴亞甲藍液：點擊「滴管 (染色)」，在載玻片中央滴一滴亞甲藍液（能將動物細胞核染成藍色）。';
        case 3: return '❸ 刮取與塗抹樣本：點擊「牙籤/棉棒」，在口腔兩側頰黏膜輕刮數下，並在染液中均勻塗抹。';
        case 4: return '❹ 蓋蓋玻片：點擊「蓋玻片」，呈 45 度角緩慢蓋上，避免封入空氣泡。';
        case 6: return '❺ 吸水紙引流：點擊「吸水紙」，吸除蓋玻片周圍多餘的亞甲藍染液，使顯微鏡下的視野更加乾淨。';
        default: return '準備就緒...';
      }
    }
  };

  const startLab = (sampleId: string) => {
    setSelectedSample(sampleId);
    setPhase('prep');
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
      offsetY: 0
    });
  };

  const getNextRequiredTool = () => {
    const currentCount = prepSteps.length;
    if (selectedSample === 'onion') {
      const onionOrder = [1, 2, 3, 4, 5, 6];
      return onionOrder[currentCount];
    } else if (selectedSample === 'zebrina') {
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
        if (toolId === 5) setLabState(s => ({ ...s, stainApplied: true }));
        
        const requiredCount = selectedSample === 'onion' ? 6 : 5;

        // Sequence check for phase transition
        if (nextSteps.length === requiredCount) {
          setTimeout(() => setPhase('micro'), 1000);
        }
      }, 1200);
    }
  };

  const handleSlotClick = (targetId: string, expectedLabel: string) => {
    if (!selectedLabel) return;
    
    if (selectedLabel === expectedLabel) {
      setCorrectlyPlaced(prev => [...prev, targetId]);
      setSelectedLabel(null);
      setLabState(s => ({ ...s, labelScore: s.labelScore + 20 }));
    } else {
      setShakeTargetId(targetId);
      setTimeout(() => setShakeTargetId(null), 500);
    }
  };

  const renderPhase = () => {
    switch (phase) {
      case 'intro':
        return (
          <div className="space-y-12">
            <div className="text-center space-y-4">
              <h3 className="text-4xl font-black text-brand-headline flex items-center justify-center gap-4">
                <Microscope size={48} className="text-brand-button" /> 歡迎來到虛擬細胞實驗室
              </h3>
              <p className="text-xl font-bold text-brand-paragraph opacity-70">選擇一個你想要觀察的樣本開始實驗</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {SAMPLES.map(s => (
                <button 
                  key={s.id} 
                  onClick={() => startLab(s.id)}
                  className={`${s.color} border-8 border-brand-border p-10 rounded-[3rem] shadow-[12px_12px_0px_#00332c] hover:scale-105 transition-all text-center space-y-6 group`}
                >
                  <div className="w-32 h-32 mx-auto bg-white rounded-full border-4 border-brand-border flex items-center justify-center overflow-hidden">
                    <Image src={`/images/${encodeURIComponent(s.img || '')}`} alt={s.title} width={100} height={100} className="object-cover group-hover:scale-125 transition-transform" unoptimized={true} priority referrerPolicy="no-referrer" />
                  </div>
                  <div className="text-2xl font-black text-brand-headline">{s.title}</div>
                  <div className="btn-bold bg-brand-button text-brand-headline px-6 py-2">開始實驗</div>
                </button>
              ))}
            </div>
          </div>
        );

      case 'prep':
        const nextToolId = getNextRequiredTool();
        const nextTool = TOOLS.find(t => t.id === nextToolId);
        const sample = SAMPLES.find(s => s.id === selectedSample);
        const stepList = selectedSample === 'cheek' ? [1, 5, 3, 4, 6] : (selectedSample === 'onion' ? [1, 2, 3, 4, 5, 6] : [1, 2, 3, 4, 6]);

        return (
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-white border-4 border-brand-border p-6 rounded-[2rem] shadow-[6px_6px_0px_#00332c]">
                <h4 className="text-xl font-black mb-4 flex items-center gap-2">
                  <ClipboardCheck className="text-brand-button" /> 實驗步驟清單
                </h4>
                <div className="space-y-4">
                  {stepList.map((toolId, idx) => {
                    const t = TOOLS.find(tool => tool.id === toolId);
                    if (!t) return null;
                    const isDone = prepSteps.includes(t.id);
                    const isNext = t.id === nextToolId;
                    return (
                      <div key={t.id} className={`flex items-center gap-3 p-3 rounded-xl border-2 transition-all ${isDone ? 'bg-green-50 border-green-200 opacity-60' : isNext ? 'bg-brand-button/10 border-brand-button animate-pulse' : 'bg-gray-50 border-gray-100'}`}>
                        {isDone ? <CheckCircle2 className="text-green-500 shrink-0" size={20} /> : <div className="w-5 h-5 rounded-full border-2 border-gray-300 shrink-0 flex items-center justify-center text-[10px] font-bold text-gray-400">{idx + 1}</div>}
                        <span className={`text-sm font-bold ${isDone ? 'text-green-700 line-through' : isNext ? 'text-brand-headline' : 'text-gray-400'}`}>
                          {t.id === 5 && selectedSample === 'cheek' ? '滴亞甲藍液' : t.id === 6 && selectedSample === 'zebrina' ? '吸除多餘水分' : t.name}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className="bg-brand-headline p-6 rounded-[2rem] text-white border-4 border-brand-border shadow-[6px_6px_0px_#faae2b]">
                <div className="flex items-center gap-3 mb-2">
                  <Info size={20} className="text-brand-button" />
                  <span className="font-black text-sm uppercase tracking-widest">當前任務</span>
                </div>
                <p className="font-bold leading-relaxed">
                  {getToolInstruction(nextToolId, selectedSample || 'onion')}
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
                        transition={{ duration: 0.5, type: 'spring' }}
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
                        {prepSteps.includes(5) && selectedSample === 'cheek' && (
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
                              src={`/images/${encodeURIComponent(sample?.img || '')}`} 
                              alt="樣本切片" 
                              fill 
                              className={`object-cover ${prepSteps.includes(5) && selectedSample === 'onion' ? 'sepia hue-rotate-[15deg] saturate-150' : ''}`}
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
                        {prepSteps.includes(5) && selectedSample === 'onion' && (
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
                           x: animatingTool === 6 ? 160 : (animatingTool === 4 ? -60 : 80), 
                           rotate: animatingTool === 4 ? -45 : 0,
                           opacity: 0 
                         }}
                         animate={{ 
                           y: animatingTool === 6 ? 0 : -70, 
                           x: animatingTool === 6 ? 80 : 0, 
                           rotate: animatingTool === 2 || animatingTool === 5 ? -30 : (animatingTool === 4 ? -25 : 0),
                           opacity: 1 
                         }}
                         exit={{ 
                           y: animatingTool === 6 ? 60 : -160, 
                           x: animatingTool === 6 ? 220 : (animatingTool === 4 ? 30 : -80), 
                           opacity: 0 
                         }}
                         transition={{ duration: 0.7 }}
                         className="absolute z-50 pointer-events-none"
                       >
                         <div className="relative">
                           <Image 
                             src={`/images/${encodeURIComponent(TOOLS.find(t => t.id === animatingTool)?.icon || '')}`} 
                             alt="Tool" width={110} height={110} className="object-contain" unoptimized={true} referrerPolicy="no-referrer"
                           />
                           
                           {/* Tweezers carrying the tiny microscopic slice */}
                           {animatingTool === 3 && (
                             <motion.div 
                               initial={{ scale: 0.7, y: 15, x: 10 }}
                               animate={{ scale: 0.7, y: 15, x: 10 }}
                               className="absolute bottom-[-10px] left-[15px] w-8 h-6 overflow-hidden rounded border border-white/50 shadow-md"
                             >
                               <Image src={`/images/${encodeURIComponent(sample?.img || '')}`} alt="specimen slice" fill className="object-cover" unoptimized={true} referrerPolicy="no-referrer" />
                             </motion.div>
                           )}

                           {/* Falling droplet animation for droppers */}
                           {(animatingTool === 2 || animatingTool === 5) && (
                             <motion.div 
                               initial={{ y: 15, x: -10, scale: 0, opacity: 0 }}
                               animate={{ y: 120, x: -10, scale: [0, 1, 1, 0.8], opacity: [0, 1, 1, 0] }}
                               transition={{ delay: 0.3, duration: 0.6 }}
                               className={`absolute w-3 h-6 rounded-full ${animatingTool === 5 ? (selectedSample === 'cheek' ? 'bg-blue-500' : 'bg-amber-600') : 'bg-blue-300'}`}
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
                     <p className="font-black italic text-3xl">點選下方工具開始製片</p>
                   </div>
                 )}
              </div>

              {/* Grid of Interactive Tool buttons */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6 bg-brand-bg/50 p-6 rounded-[2rem] border-4 border-dashed border-brand-border">
                {TOOLS.map(tool => {
                  const isAvailable = tool.id === nextToolId;
                  const isDone = prepSteps.includes(tool.id);
                  return (
                    <button 
                      key={tool.id} 
                      onClick={() => handleToolClick(tool.id)}
                      disabled={!isAvailable || animatingTool !== null}
                      className={`group bg-white border-4 p-5 rounded-3xl shadow-[6px_6px_0px_#00332c] hover:translate-y-[-4px] active:translate-y-0 transition-all flex flex-col items-center gap-4 relative overflow-hidden ${!isAvailable && !isDone ? 'opacity-30 grayscale cursor-not-allowed' : 'border-brand-border'} ${isDone ? 'bg-green-50 border-green-500 shadow-[6px_6px_0px_#14532d]' : ''} ${isAvailable ? 'ring-8 ring-brand-button/20 border-brand-button' : ''}`}
                    >
                      {isDone && (
                        <div className="absolute top-2 right-2 text-green-600">
                          <ShieldCheck size={24} />
                        </div>
                      )}
                      <div className="w-20 h-20 flex items-center justify-center transform group-hover:scale-110 transition-transform">
                        <Image src={`/images/${encodeURIComponent(tool.icon || '')}`} alt={tool.name} width={80} height={80} className="object-contain" unoptimized={true} referrerPolicy="no-referrer" />
                      </div>
                      <span className="text-xs font-black text-brand-headline text-center leading-tight">
                        {tool.id === 5 && selectedSample === 'cheek' ? '亞甲藍液' : tool.id === 6 && selectedSample === 'zebrina' ? '吸除水分' : tool.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        );

      case 'micro': {
        // 粗調一刻度等同細調50刻度
        const currentFocus = labState.coarse * 50 + labState.fine;
        const targetFocus = 50 * 50 + 50; // 2550 為完美對焦平面
        const focusDiff = Math.abs(currentFocus - targetFocus);

        let blurValue = focusDiff * 0.1;
        if (blurValue > 20) blurValue = 20;

        const totalMag = labState.eyepiece * labState.objective;
        const magScale = (totalMag / 100) * 1.5;
        
        const focusOk = focusDiff <= 2;

        let brightness = 1.0 + ((labState.aperture - 50) / 100) * 0.8 - ((totalMag - 100) / 100) * 0.15;
        if (brightness < 0.2) brightness = 0.2;

        const sampleData = SAMPLES.find(s => s.id === selectedSample);
        const currentImg = (labState.stainApplied && sampleData?.stainedImg) ? sampleData.stainedImg : sampleData?.img;
        
        return (
          <div className="grid md:grid-cols-5 gap-8">
            <div className="md:col-span-3 space-y-6">
              <div className="relative aspect-square bg-[#ebf9f9] rounded-[4rem] border-[20px] border-brand-border overflow-hidden shadow-[inset_0_0_100px_rgba(0,0,0,0.1)] flex items-center justify-center">
                <div 
                  className="absolute inset-0 transition-all duration-300 pointer-events-none"
                  style={{ 
                    filter: `blur(${blurValue}px) contrast(1.1) brightness(${brightness})`,
                    transform: `translate(${labState.offsetX}px, ${labState.offsetY}px) scale(${magScale})`,
                    opacity: blurValue > 18 ? 0.8 : 1
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
                     <span className="animate-pulse drop-shadow-md">滑動轉軸進行對焦</span>
                   </div>
                )}
              </div>
            </div>

            <div className="md:col-span-2 space-y-8 bg-white border-8 border-brand-border p-10 rounded-[4rem] shadow-[12px_12px_0px_#faae2b] flex flex-col h-full">
               <div className="text-center">
                  <h4 className="text-3xl font-black text-brand-headline italic">顯微鏡調節</h4>
               </div>
               
               <div className="flex justify-around items-end pt-4 pb-4">
                  <MicroscopeKnob 
                    label="粗調節輪" 
                    value={labState.coarse} 
                    onChange={v => setLabState(s => ({...s, coarse: v}))} 
                  />
                  <MicroscopeKnob 
                    label="細調節輪" 
                    value={labState.fine} 
                    onChange={v => setLabState(s => ({...s, fine: v}))} 
                  />
               </div>

               <div className="space-y-4 pt-4 border-t-4 border-brand-bg">
                  <div className="flex flex-col items-center gap-2">
                    <span className="text-xs font-black uppercase text-brand-paragraph w-full text-left">載物台移動 (Stage)</span>
                    <div className="grid grid-cols-3 gap-2 w-40">
                      <div />
                      <button 
                        onClick={() => setLabState(s => ({ ...s, offsetY: s.offsetY + 40 }))}
                        className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center border-4 border-gray-300 hover:bg-gray-200 active:scale-95 text-gray-600 transition-all shadow-[2px_2px_0px_rgba(0,0,0,0.2)] active:shadow-none active:translate-y-[2px]"
                      >
                        <ChevronUp size={24} />
                      </button>
                      <div />
                      <button 
                        onClick={() => setLabState(s => ({ ...s, offsetX: s.offsetX + 40 }))}
                        className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center border-4 border-gray-300 hover:bg-gray-200 active:scale-95 text-gray-600 transition-all shadow-[2px_2px_0px_rgba(0,0,0,0.2)] active:shadow-none active:translate-y-[2px]"
                      >
                        <ChevronLeft size={24} />
                      </button>
                      <button 
                        onClick={() => setLabState(s => ({ ...s, offsetY: s.offsetY - 40 }))}
                        className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center border-4 border-gray-300 hover:bg-gray-200 active:scale-95 text-gray-600 transition-all shadow-[2px_2px_0px_rgba(0,0,0,0.2)] active:shadow-none active:translate-y-[2px]"
                      >
                        <ChevronDown size={24} />
                      </button>
                      <button 
                        onClick={() => setLabState(s => ({ ...s, offsetX: s.offsetX - 40 }))}
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
                     <span className="text-brand-button">{labState.aperture}%</span>
                  </div>
                  <input 
                    type="range" min="0" max="100" value={labState.aperture} 
                    onChange={e => setLabState(s => ({ ...s, aperture: parseInt(e.target.value) }))}
                    className="w-full h-8 bg-brand-bg rounded-full appearance-none cursor-pointer border-4 border-brand-border accent-brand-headline"
                  />
               </div>

               <div className="grid grid-cols-2 gap-4 pt-4 border-t-4 border-brand-bg">
                  <div className="space-y-2">
                    <span className="text-xs font-black uppercase text-brand-paragraph">目鏡</span>
                    <div className="flex flex-col gap-2">
                      <button 
                        onClick={() => setLabState(s => ({ ...s, eyepiece: 10 }))}
                        className={`py-2 font-black rounded-xl border-4 transition-all ${labState.eyepiece === 10 ? 'bg-brand-headline text-white border-brand-border' : 'bg-gray-50 text-gray-400 border-gray-200'}`}
                      >10X</button>
                      <button 
                        onClick={() => setLabState(s => ({ ...s, eyepiece: 15 }))}
                        className={`py-2 font-black rounded-xl border-4 transition-all ${labState.eyepiece === 15 ? 'bg-brand-headline text-white border-brand-border' : 'bg-gray-50 text-gray-400 border-gray-200'}`}
                      >15X</button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <span className="text-xs font-black uppercase text-brand-paragraph">物鏡</span>
                    <div className="flex flex-col gap-2">
                      <button 
                        onClick={() => setLabState(s => ({ ...s, objective: 10 }))}
                        className={`py-2 font-black rounded-xl border-4 transition-all ${labState.objective === 10 ? 'bg-brand-headline text-white border-brand-border' : 'bg-gray-50 text-gray-400 border-gray-200'}`}
                      >10X</button>
                      <button 
                        onClick={() => setLabState(s => ({ ...s, objective: 40 }))}
                        className={`py-2 font-black rounded-xl border-4 transition-all ${labState.objective === 40 ? 'bg-brand-headline text-white border-brand-border' : 'bg-gray-50 text-gray-400 border-gray-200'}`}
                      >40X</button>
                    </div>
                  </div>
               </div>
               
               <AnimatePresence>
                 {focusOk && (
                   <motion.button 
                     initial={{ opacity: 0, scale: 0.9 }} 
                     animate={{ opacity: 1, scale: 1 }}
                     onClick={() => setPhase('report')}
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

      case 'report': {
        const targets = LABEL_TARGETS[selectedSample || 'onion'] || [];
        const labelsList = targets.map(t => t.label);
        const sampleObj = SAMPLES.find(s => s.id === selectedSample);
        const microscopeImg = (labState.stainApplied && sampleObj?.stainedImg) ? sampleObj.stainedImg : sampleObj?.img;

        return (
          <div className="grid md:grid-cols-5 gap-8">
            {/* Viewport with labeling dots */}
            <div className="md:col-span-3 space-y-4">
              <div className="relative aspect-square bg-[#ebf9f9] rounded-[4rem] border-[16px] border-brand-border overflow-hidden shadow-2xl flex items-center justify-center">
                <div 
                  className="absolute inset-0 pointer-events-none transition-all duration-300"
                  style={{ 
                    transform: `translate(${labState.offsetX}px, ${labState.offsetY}px) scale(${(labState.eyepiece * labState.objective) / 100 * 1.5})`,
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
                {targets.map(target => {
                  const isPlaced = correctlyPlaced.includes(target.id);
                  const isShaking = shakeTargetId === target.id;
                  return (
                    <button
                      key={target.id}
                      onClick={() => handleSlotClick(target.id, target.label)}
                      className={`absolute w-10 h-10 -ml-5 -mt-5 rounded-full border-4 flex items-center justify-center transition-all ${
                        isPlaced 
                          ? 'bg-green-500 border-green-200 text-white shadow-lg' 
                          : 'bg-orange-500 border-white text-white hover:scale-110 animate-bounce'
                      } ${isShaking ? 'animate-shake' : ''}`}
                      style={{ left: `${target.x}%`, top: `${target.y}%` }}
                    >
                      {isPlaced ? '✓' : '?'}
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
                  <h4 className="text-2xl font-black text-brand-headline">構造標記挑戰</h4>
                  <p className="text-sm font-bold text-brand-paragraph opacity-70 mt-2">
                    請點選下方【構造標籤】後，點擊顯微鏡中對應的【橘色問號目標】。
                  </p>
                </div>

                <div className="flex flex-col gap-3">
                  <span className="text-[10px] font-black uppercase tracking-widest opacity-40">構造標籤</span>
                  <div className="flex flex-wrap gap-3">
                    {labelsList.map(label => {
                      const isSelected = selectedLabel === label;
                      const hasBeenCorrectlyPlaced = targets.some(
                        t => t.label === label && correctlyPlaced.includes(t.id)
                      );
                      return (
                        <button
                          key={label}
                          onClick={() => !hasBeenCorrectlyPlaced && setSelectedLabel(label)}
                          disabled={hasBeenCorrectlyPlaced}
                          className={`px-5 py-3 rounded-2xl border-4 text-base font-black transition-all ${
                            hasBeenCorrectlyPlaced
                              ? 'bg-green-100 border-green-600 text-green-950 line-through opacity-50 cursor-not-allowed'
                              : isSelected
                              ? 'bg-brand-button border-brand-border text-brand-headline shadow-[4px_4px_0px_#000] scale-105'
                              : 'bg-white border-brand-border hover:bg-brand-bg'
                          }`}
                        >
                          {label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="bg-brand-bg p-4 rounded-2xl border-2 border-brand-border flex justify-between items-center">
                  <span className="text-sm font-black text-brand-headline">完成進度</span>
                  <span className="text-xl font-black text-brand-headline">
                    {correctlyPlaced.length} / {targets.length}
                  </span>
                </div>
              </div>

              <button 
                onClick={() => setPhase('inquiry')}
                disabled={correctlyPlaced.length < targets.length}
                className={`w-full btn-bold py-6 text-2xl font-black italic tracking-widest uppercase transition-all ${
                  correctlyPlaced.length < targets.length
                    ? 'bg-gray-200 text-gray-400 border-gray-300 cursor-not-allowed opacity-50'
                    : 'bg-brand-headline text-brand-button hover:scale-105 shadow-[6px_6px_0px_#faae2b]'
                }`}
              >
                提交報告
              </button>
            </div>
          </div>
        );
      }

      case 'inquiry':
        return (
          <div className="max-w-4xl mx-auto space-y-12">
            <div className="bg-white border-8 border-brand-border p-16 rounded-[5rem] shadow-[20px_20px_0px_#faae2b] space-y-12">
               <div className="space-y-8">
                  <div className="flex items-start gap-6">
                    <span className="w-12 h-12 bg-brand-headline text-brand-button rounded-full flex items-center justify-center font-black text-2xl shrink-0">1</span>
                    <h5 className="text-3xl font-black text-brand-headline leading-tight">洋蔥表皮細胞在染色前、後有什麼最明顯的差異？</h5>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-18">
                    {[
                      { text: '顏色變深，細胞核更清晰', correct: true },
                      { text: '顏色變淡，細胞壁消失', correct: false },
                      { text: '細胞會開始運動', correct: false },
                      { text: '沒有任何改變', correct: false }
                    ].map((ans, i) => {
                      const isSelected = selectedAns1 === i;
                      return (
                        <button 
                          key={i} 
                          onClick={() => setSelectedAns1(i)}
                          className={`text-left p-8 border-4 rounded-3xl font-black text-xl transition-all shadow-[4px_4px_0px_#000] active:translate-y-1 ${
                            isSelected 
                              ? ans.correct 
                                ? 'bg-green-100 border-green-600 text-green-950' 
                                : 'bg-red-100 border-red-600 text-red-950'
                              : 'bg-white border-brand-border hover:bg-brand-button/10'
                          }`}
                        >
                          {ans.text}
                          {isSelected && (ans.correct ? ' (正確 ✓)' : ' (錯誤 ✕)')}
                        </button>
                      );
                    })}
                  </div>
               </div>

               <div className="pt-12 border-t-8 border-dashed border-brand-bg space-y-8">
                  <div className="flex items-start gap-6">
                    <span className="w-12 h-12 bg-brand-headline text-brand-button rounded-full flex items-center justify-center font-black text-2xl shrink-0">2</span>
                    <h5 className="text-3xl font-black text-brand-headline leading-tight">在這次實驗觀察的細胞中，哪種細胞可以行光合作用？</h5>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-18">
                    {[
                      { text: '洋蔥表皮細胞（鱗片葉）', correct: false },
                      { text: '風車草下表皮（保衛細胞）', correct: true },
                      { text: '口腔皮膜細胞', correct: false },
                      { text: '以上皆是', correct: false }
                    ].map((ans, i) => {
                      const isSelected = selectedAns2 === i;
                      return (
                        <button 
                          key={i} 
                          onClick={() => setSelectedAns2(i)}
                          className={`text-left p-8 border-4 rounded-3xl font-black text-xl transition-all shadow-[4px_4px_0px_#000] active:translate-y-1 ${
                            isSelected 
                              ? ans.correct 
                                ? 'bg-green-100 border-green-600 text-green-950' 
                                : 'bg-red-100 border-red-600 text-red-950'
                              : 'bg-white border-brand-border hover:bg-brand-button/10'
                          }`}
                        >
                          {ans.text}
                          {isSelected && (ans.correct ? ' (正確 ✓)' : ' (錯誤 ✕)')}
                        </button>
                      );
                    })}
                  </div>
               </div>

               <button 
                 onClick={() => setPhase('result')}
                 disabled={selectedAns1 === null || selectedAns2 === null}
                 className={`w-full btn-bold py-10 text-4xl italic tracking-tighter ${
                   (selectedAns1 === null || selectedAns2 === null)
                     ? 'bg-gray-200 text-gray-400 border-gray-300 cursor-not-allowed opacity-50 shadow-none'
                     : 'bg-brand-headline text-brand-button hover:scale-105 shadow-[10px_10px_0px_#faae2b]'
                 }`}
               >
                 查看實驗評價 & 結算 XP
               </button>
            </div>
          </div>
        );

      case 'result':
        return (
          <div className="max-w-3xl mx-auto text-center space-y-12">
             <motion.div 
               initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
               className="p-16 bg-white border-[12px] border-brand-border rounded-[6rem] shadow-[25px_25px_0px_#00332c] relative"
             >
               <div className="absolute -top-12 -right-12 w-32 h-32 bg-brand-button border-8 border-brand-border rounded-full flex items-center justify-center text-6xl shadow-2xl rotate-12">
                 🌟
               </div>
               <h3 className="text-6xl font-black text-brand-headline italic mb-2 tracking-tighter">實驗圓滿完成！</h3>
               <div className="text-2xl font-bold opacity-40 mb-12 uppercase tracking-widest">Laboratory Certification System</div>
               
               <div className="flex justify-center gap-8 mb-16">
                 {[1, 2, 3].map(s => (
                   <motion.div key={s} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: s * 0.2, type: 'spring' }}>
                     <Award size={100} className="text-brand-button drop-shadow-[6px_6px_0px_#000]" />
                   </motion.div>
                 ))}
               </div>

               <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 <div className="bg-brand-bg p-8 rounded-[3rem] border-4 border-brand-border">
                   <div className="text-[10px] font-black opacity-40 mb-2">XP GAINED</div>
                   <div className="text-4xl font-black">+1,200</div>
                 </div>
                 <div className="bg-brand-bg p-8 rounded-[3rem] border-4 border-brand-border">
                   <div className="text-[10px] font-black opacity-40 mb-2">PRECISION</div>
                   <div className="text-4xl font-black text-green-600">S+</div>
                 </div>
                 <div className="bg-brand-bg p-8 rounded-[3rem] border-4 border-brand-border">
                   <div className="text-[10px] font-black opacity-40 mb-2">COMPLETION</div>
                   <div className="text-4xl font-black">100%</div>
                 </div>
               </div>
             </motion.div>

             <div className="flex flex-col md:flex-row gap-8">
                <button 
                  onClick={() => {
                    setPhase('intro');
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
                      offsetY: 0
                    });
                  }} 
                  className="flex-1 btn-bold bg-white text-brand-headline py-8 text-3xl border-brand-border hover:bg-gray-50"
                >
                  RESET LAB
                </button>
                <button onClick={unlockNext} className="flex-1 btn-bold bg-brand-headline text-brand-button py-8 text-4xl italic tracking-tighter">
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
      metaphor={{ icon: '🧪', title: '微觀探險', desc: '在顯微鏡下，一滴水也是一個宇宙。' }}
      unlockQuizKey="p10_lab_unlock"
      onUnlock={unlockNext}
      hideMetaphor
    >
       <div className="min-h-[800px] py-10">
         {renderPhase()}
       </div>
    </StageWrapper>
  );
}


function P11ObserveSummary({ unlockNext }: { unlockNext: () => void }) {
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
               <Image src="/images/洋蔥表皮細胞染色.png" alt="洋蔥表皮細胞" width={128} height={128} className="object-cover" unoptimized referrerPolicy="no-referrer" />
             </div>
             <h4 className="text-2xl font-black text-brand-headline">洋蔥表皮細胞</h4>
             <ul className="text-left font-bold text-brand-paragraph space-y-2 w-full text-lg">
               <li>✅ 可見：細胞壁、染色細胞核</li>
               <li>❌ 不可見：葉綠體 (地下莖無光合作用)</li>
             </ul>
          </div>
          <div className="bg-pink-50/50 p-6 rounded-[2rem] border-4 border-brand-border shadow-[8px_8px_0px_#00332c] flex flex-col items-center text-center space-y-4">
             <div className="w-32 h-32 rounded-full border-4 border-brand-border overflow-hidden">
               <Image src="/images/口腔皮膜細胞.png" alt="口腔皮膜細胞" width={128} height={128} className="object-cover" unoptimized referrerPolicy="no-referrer" />
             </div>
             <h4 className="text-2xl font-black text-brand-headline">口腔皮膜細胞</h4>
             <ul className="text-left font-bold text-brand-paragraph space-y-2 w-full text-lg">
               <li>✅ 可見：細胞膜、染色細胞核</li>
               <li>❌ 不可見：細胞壁、葉綠體</li>
             </ul>
          </div>
          <div className="bg-green-50/50 p-6 rounded-[2rem] border-4 border-brand-border shadow-[8px_8px_0px_#00332c] flex flex-col items-center text-center space-y-4">
             <div className="w-32 h-32 rounded-full border-4 border-brand-border overflow-hidden">
               <Image src="/images/風車草下表皮細胞.png" alt="風車草葉片" width={128} height={128} className="object-cover" unoptimized referrerPolicy="no-referrer" />
             </div>
             <h4 className="text-2xl font-black text-brand-headline">風車草下表皮細胞</h4>
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
            細胞內許多構造（如<Highlight>細胞膜</Highlight>、<Highlight>細胞質</Highlight>）是完全透明的，在一般光學顯微鏡下無法直接看到。但根據生物學知識，所有細胞都必須具備<b>細胞膜</b>、<b>細胞質</b>和<b>細胞核</b>，因此我們能推論它們確實存在，只是需要特殊染色或更高倍率的顯微鏡才能觀察。
          </p>
        </div>
      </div>
    </StageWrapper>
  );
}

function P11FinalGame({ updateGameHighScore, studentInfo, setStudentInfo }: { 
  updateGameHighScore: (p: number) => void,
  studentInfo: any, 
  setStudentInfo: any 
}) {
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'result'>('idle');
  const [gameScore, setGameScore] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [feedback, setFeedback] = useState<{ text: string, color: string } | null>(null);
  const [progress, setProgress] = useState(0);
  const [tasks, setTasks] = useState(GAME_TASKS);
  const [hasScored, setHasScored] = useState(false);

  const startGame = useCallback(() => {
    setTasks([...GAME_TASKS].sort(() => Math.random() - 0.5));
    setGameState('playing');
    setGameScore(0);
    setCurrentIndex(0);
    setFeedback(null);
    setProgress(0);
    setHasScored(false);
  }, []);

  const finishGame = useCallback(() => {
    setGameState('result');
  }, []);

  useEffect(() => {
    if (gameState === 'result' && !hasScored) {
      const timer = setTimeout(() => {
        updateGameHighScore(gameScore);
        setHasScored(true);
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [gameState, hasScored, updateGameHighScore, gameScore]);

  // High score logic is handled in useEffect above

  const handleNext = useCallback(() => {
    setFeedback(null);
    setProgress(0);
    if (currentIndex + 1 < tasks.length) {
      setCurrentIndex(prev => prev + 1);
    } else {
      finishGame();
    }
  }, [currentIndex, tasks.length, finishGame]);

  const handleAnswer = (mission: string) => {
    if (gameState !== 'playing' || feedback) return;

    const currentTask = tasks[currentIndex];
    if (!currentTask) return;

    const isCorrect = mission === currentTask.mission;

    if (isCorrect) {
      const timeBonus = Math.max(0, 100 - progress);
      const points = 100 + timeBonus;
      setGameScore(prev => prev + Math.floor(points));
      setFeedback({ text: timeBonus > 70 ? 'PERFECT! ⚡' : 'GOOD! ✅', color: 'text-green-500' });
    } else {
      setFeedback({ text: 'WRONG! ❌', color: 'text-red-500' });
    }

    setTimeout(handleNext, 600);
  };

  // Timer effect for progress bar
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (gameState === 'playing' && !feedback) {
      interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) return 100;
          return prev + 0.5;
        });
      }, 50);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [gameState, feedback]);

  // Handle timeout
  useEffect(() => {
    if (progress >= 100 && gameState === 'playing' && !feedback) {
      const timer = setTimeout(() => {
        setFeedback({ text: 'TIME OUT! 💨', color: 'text-gray-400' });
        setTimeout(handleNext, 600);
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [progress, gameState, feedback, handleNext]);

  const currentTask = tasks[currentIndex];

  if (gameState === 'idle') {
    return (
      <div className="max-w-4xl mx-auto text-center space-y-12 py-20">
        <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="space-y-6">
          <Gamepad2 size={120} className="mx-auto text-brand-button" />
          <h2 className="text-6xl font-black text-brand-headline tracking-tighter uppercase italic">細胞構造快閃賽</h2>
          <p className="text-2xl text-brand-paragraph font-bold opacity-70">圖片會從左至右快速移動，你必須在消失前點選正確的功能！</p>
        </motion.div>
        
        <button 
          onClick={startGame}
          className="btn-bold bg-brand-headline text-brand-button px-20 py-8 text-4xl shadow-[10px_10px_0px_#000000] hover:scale-110 active:translate-y-2 transition-all"
        >
          START CHALLENGE
        </button>
      </div>
    );
  }

  if (gameState === 'result') {
    return (
      <div className="max-w-4xl mx-auto space-y-12 text-center py-20">
        <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="bg-brand-headline text-white p-16 rounded-[4rem] border-8 border-brand-border shadow-[20px_20px_0px_#faae2b] space-y-10">
          <Trophy size={100} className="mx-auto text-brand-button" />
          <h2 className="text-5xl font-black italic tracking-tighter uppercase text-brand-button">遊戲結束！</h2>
          <div className="space-y-2">
            <p className="text-xl font-bold opacity-60 uppercase tracking-widest">Your Score</p>
            <p className="text-8xl font-black tabular-nums">{gameScore}</p>
          </div>
          
          <div className="flex gap-4 justify-center">
            <button onClick={startGame} className="btn-bold bg-white text-brand-headline px-10 py-5 text-xl flex items-center gap-3">
              <RefreshCw /> 再試一次
            </button>
            <button 
              onClick={() => {
                alert(`恭喜！得分 ${gameScore} 已認證。`);
                setStudentInfo({ ...studentInfo, hasSubmitted: true });
              }}
              className="btn-bold bg-brand-button text-brand-headline px-10 py-5 text-xl"
            >
              提交認證
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  if (!currentTask) return null;

  return (
    <div className="max-w-6xl mx-auto space-y-10 relative pb-20">
      {/* Game Header */}
      <div className="flex justify-between items-center bg-white/80 backdrop-blur p-6 border-4 border-brand-border rounded-3xl relative z-20">
        <div className="flex flex-col">
          <span className="text-[10px] font-black uppercase tracking-widest opacity-40">Challenge</span>
          <span className="text-3xl font-black text-brand-headline">{currentIndex + 1} / {tasks.length}</span>
        </div>
        <div className="flex flex-col items-center">
            <span className="text-[10px] font-black uppercase tracking-widest opacity-40">Score</span>
            <motion.span key={gameScore} initial={{ scale: 1.2 }} animate={{ scale: 1 }} className="text-4xl font-black text-brand-headline tabular-nums">{gameScore}</motion.span>
        </div>
        <div className="w-1/3">
           <div className="h-4 bg-brand-bg rounded-full border-2 border-brand-border overflow-hidden">
              <motion.div 
                className={`h-full ${progress > 70 ? 'bg-red-500' : 'bg-brand-button'}`}
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.05 }}
              />
           </div>
        </div>
      </div>

      {/* Play Area - Reduced Height */}
      <div className="relative h-[250px] w-full border-y-4 border-brand-border border-dashed bg-white/30 overflow-hidden flex items-center">
         <AnimatePresence mode="wait">
            {!feedback && (
               <motion.div
                 key={currentIndex}
                 initial={{ x: -250, opacity: 0 }}
                 animate={{ x: `${progress * 1.6}%`, opacity: 1 }} // Moves across screen
                 exit={{ opacity: 0, scale: 0.5 }}
                 className="absolute flex flex-col items-center gap-4"
               >
                  <div className={`w-44 h-44 bg-white border-8 ${currentTask.type === 'plant' ? 'border-green-600' : 'border-brand-border'} rounded-[2.5rem] shadow-xl p-4 flex flex-col items-center justify-center overflow-hidden gap-1`}>
                     <div className="relative w-24 h-24">
                       <Image 
                         src={`/images/${encodeURIComponent(currentTask.img || '')}`} 
                         alt={currentTask.name} 
                         fill 
                         className="object-contain"
                         referrerPolicy="no-referrer"
                         unoptimized={true}
                       />
                     </div>
                     <div className="text-xl font-black text-brand-headline tracking-tighter text-center leading-none border-t-2 border-brand-border/10 pt-1 w-full">
                       {currentTask.name}
                     </div>
                  </div>
                  <span className={`px-4 py-1 rounded-lg font-black text-white text-[10px] tracking-widest ${currentTask.type === 'plant' ? 'bg-green-700' : 'bg-brand-headline'}`}>
                    {currentTask.type === 'plant' ? 'PLANT CELL' : 'ANIMAL CELL'}
                  </span>
               </motion.div>
            )}
         </AnimatePresence>

         {/* Feedback Overlay */}
         <AnimatePresence>
           {feedback && (
             <motion.div 
               initial={{ scale: 0.5, opacity: 0 }} 
               animate={{ scale: 1.5, opacity: 1 }} 
               exit={{ opacity: 0 }}
               className="absolute inset-0 flex items-center justify-center pointer-events-none z-30"
             >
                <span className={`text-8xl font-black drop-shadow-xl ${feedback.color}`}>{feedback.text}</span>
             </motion.div>
           )}
         </AnimatePresence>
      </div>

      {/* Answer Area - Expanded & Larger Fonts */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-6 relative z-20">
         {GAME_TASKS.map(t => (
           <button
             key={t.id}
             onClick={() => handleAnswer(t.mission)}
             className="card-bold bg-white p-8 hover:bg-brand-button/20 hover:border-brand-button transition-all group flex flex-col min-h-[140px] items-center justify-center gap-3 shadow-[8px_8px_0px_#00332c] active:translate-y-1 active:shadow-none"
           >
              <div className="text-[10px] font-black opacity-30 bg-gray-100 px-3 py-1 rounded-full group-hover:bg-brand-button group-hover:opacity-100 transition-all uppercase tracking-[0.2em]">Function Card</div>
              <span className="text-2xl font-black text-brand-headline text-center leading-tight italic tracking-tighter">{t.mission}</span>
           </button>
         ))}
      </div>
    </div>
  );
}

function P12Sorting({ updateGameHighScore }: { updateGameHighScore: (p: number) => void }) {
  const [gameState, setGameState] = useState<'start' | 'playing' | 'result'>('start');
  const [gameScore, setGameScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [timeLeft, setTimeLeft] = useState(30);
  const [currentItem, setCurrentItem] = useState<any>(null);
  const [feedback, setFeedback] = useState<{ text: string, color: string } | null>(null);
  const [hasScored, setHasScored] = useState(false);

  const POOL = [
    { name: '細胞核', category: 'both', img: 'animal-cell-nucleus.png' },
    { name: '細胞膜', category: 'both', img: 'plant-cell-membrane.png' },
    { name: '細胞質', category: 'both', img: 'animal-cell-cytoplasm.png' },
    { name: '粒線體', category: 'both', img: 'animal-cell-mitochondria.png' },
    { name: '液胞', category: 'both', img: 'plant-cell-vacuole.png' },
    { name: '細胞壁', category: 'plant', img: 'plant-cell-wall.png' },
    { name: '葉綠體', category: 'plant', img: 'plant-cell-chloroplast.png' },
  ];

  const startGame = () => {
    setGameScore(0);
    setLives(3);
    setTimeLeft(30);
    setGameState('playing');
    setHasScored(false);
    nextItem();
  };

  const gameScoreRef = useRef(0);
  useEffect(() => { gameScoreRef.current = gameScore; }, [gameScore]);

  const finishGame = useCallback(() => {
    setGameState('result');
  }, []);

  useEffect(() => {
    if (gameState === 'result' && !hasScored) {
      const timer = setTimeout(() => {
        updateGameHighScore(gameScore);
        setHasScored(true);
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [gameState, hasScored, updateGameHighScore, gameScore]);

  const nextItem = () => {
    const random = POOL[Math.floor(Math.random() * POOL.length)];
    setCurrentItem({ ...random, id: Math.random() });
  };

  const handleChoice = (choice: 'both' | 'plant' | 'animal') => {
    if (gameState !== 'playing' || !currentItem) return;

    let newLives = lives;
    let newScore = gameScore;
    if (currentItem.category === choice) {
      newScore = gameScore + 100;
      setGameScore(newScore);
      setFeedback({ text: '⭕', color: 'text-green-400' });
    } else {
      newLives = lives - 1;
      setLives(newLives);
      setFeedback({ text: '❌', color: 'text-red-400' });
    }

    if (newLives <= 0) {
      finishGame();
    } else {
      setTimeout(() => setFeedback(null), 400);
      nextItem();
    }
  };

  useEffect(() => {
    if (gameState === 'playing') {
      const timer = setInterval(() => {
        setTimeLeft(t => {
          if (t <= 0) return 0;
          return t - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [gameState]);

  useEffect(() => {
    if (gameState === 'playing' && timeLeft === 0) {
      const timer = setTimeout(() => {
        finishGame();
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [timeLeft, gameState, finishGame]);

  if (gameState === 'start') {
    return (
      <div className="max-w-4xl mx-auto text-center py-20 space-y-12">
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="card-bold bg-white p-16 border-8 border-brand-border rounded-[4rem] shadow-[20px_20px_0px_#faae2b]">
          <Gamepad2 size={120} className="mx-auto text-brand-headline mb-8" />
          <h2 className="text-6xl font-black italic tracking-tighter uppercase mb-6">構造分類王</h2>
          <p className="text-2xl font-bold opacity-60 mb-12 italic">根據圖片構造，判斷它是出現在哪種細胞中！</p>
          <button onClick={startGame} className="btn-bold bg-brand-headline text-brand-button px-20 py-8 text-4xl shadow-[10px_10px_0px_#000000] hover:scale-110 active:translate-y-2 transition-all">
            START
          </button>
        </motion.div>
      </div>
    );
  }

  if (gameState === 'result') {
    return (
      <div className="max-w-4xl mx-auto text-center py-20 space-y-12">
        <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="bg-brand-headline text-white p-16 rounded-[4rem] border-8 border-brand-border shadow-[20px_20px_0px_#faae2b] space-y-10">
          <Award size={100} className="mx-auto text-brand-button" />
          <h2 className="text-5xl font-black italic tracking-tighter uppercase text-brand-button">時間到！</h2>
          <div className="space-y-4">
            <p className="text-xl font-bold opacity-60 uppercase tracking-widest text-white/50">Your Score</p>
            <p className="text-8xl font-black tabular-nums">{gameScore}</p>
          </div>
          <button onClick={startGame} className="btn-bold bg-white text-brand-headline px-10 py-5 text-xl flex items-center gap-3 mx-auto">
            <RefreshCw /> 再玩一次
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-12">
      <div className="flex justify-between items-center bg-white border-4 border-brand-border p-8 rounded-[2.5rem] shadow-[10px_10px_0px_#00332c]">
        <div className="flex gap-12 text-left">
          <div className="flex flex-col">
             <span className="text-[10px] font-black uppercase tracking-widest opacity-40 mb-1">Time</span>
             <span className={`text-4xl font-black tabular-nums ${timeLeft < 10 ? 'text-red-500 animate-pulse' : 'text-brand-headline'}`}>{timeLeft}s</span>
          </div>
          <div className="flex flex-col">
             <span className="text-[10px] font-black uppercase tracking-widest opacity-40 mb-1">Score</span>
             <span className="text-4xl font-black tabular-nums text-brand-headline">{gameScore}</span>
          </div>
        </div>
        <div className="flex gap-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className={`w-10 h-10 rounded-xl border-4 border-brand-border ${i < lives ? 'bg-red-500 shadow-[2px_2px_0px_#000]' : 'bg-gray-100 opacity-20'}`} />
          ))}
        </div>
      </div>

      <div className="relative h-[480px] bg-brand-headline rounded-[4rem] border-[12px] border-brand-border shadow-inner flex flex-col items-center justify-center overflow-hidden">
        <div className="absolute inset-x-0 bottom-1/4 h-16 bg-black/20 border-y-4 border-white/5 flex items-center justify-around overflow-hidden opacity-30">
           {Array.from({ length: 12 }).map((_, i) => (
             <div key={i} className="w-16 h-16 border-4 border-white/10 rounded-full flex items-center justify-center font-black text-white/5 italic"></div>
           ))}
        </div>

        <AnimatePresence mode="wait">
          {currentItem && (
            <motion.div
              key={currentItem.id}
              initial={{ x: 500, opacity: 0, rotate: 10 }}
              animate={{ x: 0, opacity: 1, rotate: 0 }}
              exit={{ x: -500, opacity: 0, scale: 1.5 }}
              transition={{ type: 'spring', damping: 20 }}
              className="flex flex-col items-center gap-10 relative z-10"
            >
               <div className="w-72 h-72 bg-white border-8 border-brand-button rounded-[4rem] p-10 shadow-[0_30px_60px_rgba(0,0,0,0.6)] flex items-center justify-center relative">
                  <div className="absolute -top-4 -right-4 w-12 h-12 bg-brand-button border-4 border-brand-border rounded-full flex items-center justify-center font-black z-20">?</div>
                  <div className="relative w-full h-full">
                    <Image 
                      src={`/images/${encodeURIComponent(currentItem.img || '')}`} 
                      alt="細胞構造問題" 
                      fill 
                      className="object-contain"
                      unoptimized={true}
                      priority
                      referrerPolicy="no-referrer"
                    />
                  </div>
               </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {feedback && (
            <motion.div initial={{ scale: 0 }} animate={{ scale: 3 }} exit={{ opacity: 0 }} className="absolute inset-0 flex items-center justify-center pointer-events-none z-50">
               <span className={`text-6xl font-black italic drop-shadow-2xl ${feedback.color}`}>{feedback.text}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <button 
          onClick={() => handleChoice('animal')}
          className="group relative btn-bold bg-white text-brand-headline border-8 border-brand-border p-8 hover:bg-brand-button/20 active:translate-y-2 transition-all flex flex-col items-center gap-4 rounded-[3rem] shadow-[10px_10px_0px_#00332c]"
        >
           <span className="text-6xl group-hover:scale-125 transition-transform">🦁</span>
           <span className="text-2xl font-black uppercase italic tracking-tighter text-center">只有動物細胞有</span>
        </button>

        <button 
          onClick={() => handleChoice('plant')}
          className="group relative btn-bold bg-white text-green-900 border-8 border-green-600 p-8 hover:bg-green-50 active:translate-y-2 transition-all flex flex-col items-center gap-4 rounded-[3rem] shadow-[10px_10px_0px_#14532d]"
        >
           <span className="text-6xl group-hover:scale-125 transition-transform">🌲</span>
           <span className="text-2xl font-black uppercase italic tracking-tighter text-center">只有植物細胞有</span>
        </button>

        <button 
          onClick={() => handleChoice('both')}
          className="group relative btn-bold bg-brand-button text-brand-headline border-8 border-brand-border p-8 hover:opacity-90 active:translate-y-2 transition-all flex flex-col items-center gap-4 rounded-[3rem] shadow-[10px_10px_0px_#000]"
        >
           <span className="text-6xl group-hover:scale-125 transition-transform">🧬</span>
           <span className="text-2xl font-black uppercase italic tracking-tighter text-center">兩者皆有</span>
        </button>
      </div>
    </div>
  );
}

const CHALLENGE_QUESTIONS = [
  {
    q: "哪一個構造被稱為細胞的「能源工廠」？",
    options: ["細胞核", "粒線體", "葉綠體", "液胞"],
    correct: 1,
    hint: "粒線體負責呼吸作用，產生能量。",
    img: "plant-cell-mitochondria.png"
  },
  {
    q: "關於細胞壁的敘述，下列何者正確？",
    options: ["動植物細胞均有", "位於細胞膜內側", "主要功能是支持植物體", "透明且能進行光合作用"],
    correct: 2,
    hint: "細胞壁主要由纖維素構成，具支持功能。",
    img: "plant-cell-wall.png"
  },
  {
    q: "哪一種細胞通常具有一個「大型液胞」？",
    options: ["老鼠細胞", "人類神經細胞", "成熟植物細胞", "口腔上皮細胞"],
    correct: 2,
    hint: "植物細胞的液胞隨成熟而增大。",
    img: "plant-cell-vacuole.png"
  },
  {
    q: "細胞的「生命中樞」是哪個構造？",
    options: ["細胞核", "細胞質", "細胞膜", "細胞壁"],
    correct: 0,
    hint: "細胞核內含遺傳物質，控制細胞生理活動。",
    img: "animal-cell-nucleus.png"
  },
  {
    q: "哪種構造能進行光合作用？",
    options: ["粒線體", "葉綠體", "液胞", "細胞核"],
    correct: 1,
    hint: "葉綠體含有葉綠素，能吸收光能。",
    img: "plant-cell-chloroplast.png"
  },
  {
    q: "控制物質進出細胞的門哨是？",
    options: ["細胞壁", "細胞膜", "細胞核", "粒線體"],
    correct: 1,
    hint: "細胞膜具有選擇性通透，控制進出。",
    img: "animal-cell-membrane.png"
  },
  {
    q: "動物細胞「不具有」下列哪項構造？",
    options: ["細胞核", "粒線體", "細胞膜", "細胞壁"],
    correct: 3,
    hint: "細胞壁是植物、真菌、細菌特有的構造。",
    img: "animal-cell-full.png"
  },
  {
    q: "細胞內許多生化反應發生的場所是？",
    options: ["細胞質", "液胞", "細胞膜", "細胞壁"],
    correct: 0,
    hint: "細胞質為膠狀物質，是許多反應的場所。",
    img: "plant-cell-cytoplasm.png"
  },
  {
    q: "關於葉綠體的分布，下列何者正確？",
    options: ["所有植物細胞均有", "洋蔥鱗片葉表皮細胞有", "植物的根部細胞一定有", "藍綠菌沒有葉綠體但有葉綠素"],
    correct: 3,
    hint: "只有具備行光合作用功能的植物細胞才有葉綠體。藍綠菌則是沒有葉綠體但有葉綠素。",
    img: "plant-cell-full.png"
  },
  {
    q: "下列哪一構造的大小，常用來區分動、植物細胞？",
    options: ["細胞核", "液胞", "粒線體", "細胞質"],
    correct: 1,
    hint: "植物液胞大且固定，動物液胞小且暫時。",
    img: "animal-cell-vacuole.png"
  }
];

function P13SummaryChallenge({ updateGameHighScore }: { updateGameHighScore: (p: number) => void }) {
  const [gameState, setGameState] = useState<'start' | 'playing' | 'result'>('start');
  const [answers, setAnswers] = useState<(number | null)[]>(new Array(10).fill(null));
  const [showIncompleteError, setShowIncompleteError] = useState(false);
  const [score, setScore] = useState(0);

  const handleSubmit = () => {
    if (answers.includes(null)) {
      setShowIncompleteError(true);
      return;
    }

    let total = 0;
    answers.forEach((ans, idx) => {
      if (ans === CHALLENGE_QUESTIONS[idx].correct) total += 100;
    });

    setScore(total);
    setGameState('result');
    updateGameHighScore(total);
  };

  if (gameState === 'start') {
    return (
      <div className="min-h-[700px] flex items-center justify-center p-10">
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="card-bold bg-white p-12 border-8 border-brand-border rounded-[4rem] shadow-[20px_20px_0px_#faae2b] text-center max-w-2xl">
          <ClipboardCheck size={100} className="mx-auto text-brand-headline mb-8" />
          <h2 className="text-6xl font-black italic tracking-tighter uppercase mb-6">總結挑戰</h2>
          <p className="text-2xl font-bold opacity-60 mb-12 italic">精選 10 題核心觀念，檢驗你的細胞學實力！<br/>每題 100 分，拿到 1000 分才算完美通關！</p>
          <button onClick={() => setGameState('playing')} className="btn-bold bg-brand-headline text-brand-button px-20 py-8 text-4xl shadow-[10px_10px_0px_#000000] hover:scale-110 active:translate-y-2 transition-all">
            開始測驗
          </button>
        </motion.div>
      </div>
    );
  }

  if (gameState === 'result') {
    return (
      <div className="min-h-[700px] p-10 overflow-auto">
        <div className="max-w-4xl mx-auto space-y-10 pb-20">
          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="card-bold bg-white p-10 border-8 border-brand-border rounded-[3rem] shadow-[15px_15px_0px_#faae2b] text-center">
            <h2 className="text-5xl font-black italic tracking-tighter mb-4">測驗結果</h2>
            <div className="text-8xl font-black text-brand-headline mb-6">{score} <span className="text-4xl text-brand-paragraph/40">/ 1000</span></div>
            
            {score === 1000 ? (
              <p className="text-3xl text-green-600 font-black italic mb-8">太完美了！你是細胞構造大師！ 🎉</p>
            ) : (
              <p className="text-2xl text-brand-paragraph font-bold mb-8 italic">還有進步空間！請查看下方提示並重新嘗試！ 💪</p>
            )}

            <button onClick={() => { setGameState('start'); setAnswers(new Array(10).fill(null)); }} className="btn-bold bg-brand-headline text-brand-button px-16 py-6 text-3xl shadow-[8px_8px_0px_#000] hover:scale-105 active:translate-y-1 transition-all">
              重新挑戰
            </button>
          </motion.div>

          <div className="space-y-6">
            <h3 className="text-3xl font-black italic tracking-tight flex items-center gap-3">
              <Lightbulb className="text-yellow-500" /> 解題溫故
            </h3>
            {CHALLENGE_QUESTIONS.map((q, idx) => {
              const isCorrect = answers[idx] === q.correct;
              return (
                <motion.div 
                  key={idx} 
                  initial={{ x: -20, opacity: 0 }} 
                  animate={{ x: 0, opacity: 1 }} 
                  transition={{ delay: idx * 0.1 }}
                  className={`p-8 border-4 rounded-[2rem] shadow-[8px_8px_0px_#cbd5e1] ${isCorrect ? 'bg-green-50 border-green-500 shadow-green-100' : 'bg-red-50 border-red-500 shadow-red-100'}`}
                >
                  <div className="flex justify-between items-start mb-4">
                    <span className="bg-white/80 px-4 py-1 rounded-full text-sm font-black border-2 border-brand-border">題目 {idx + 1}</span>
                    <span className={`text-2xl font-black ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>{isCorrect ? '⭕ 正確' : '❌ 錯誤'}</span>
                  </div>
                  <p className="text-xl font-bold mb-4">{q.q}</p>
                  {!isCorrect && (
                    <div className="bg-white/60 p-4 rounded-xl border-t-4 border-red-200">
                      <p className="text-red-900 font-bold mb-1 italic">提示：</p>
                      <p className="text-red-800 opacity-80">{q.hint}</p>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[700px] p-10 overflow-auto">
      <div className="max-w-4xl mx-auto space-y-10 pb-20">
        <div className="flex justify-between items-center bg-white/80 p-6 rounded-[2rem] border-4 border-brand-border shadow-[8px_8px_0px_#000] sticky top-4 z-50">
          <h2 className="text-3xl font-black italic tracking-tighter">總結測驗專區</h2>
          <div className="flex items-center gap-4">
             <span className="text-sm font-bold opacity-50">進度: {answers.filter(a => a !== null).length} / 10</span>
             <button onClick={handleSubmit} className="btn-bold bg-brand-headline text-brand-button px-8 py-3 rounded-xl shadow-[4px_4px_0px_#000] hover:scale-105 active:translate-y-1 transition-all">送出提交</button>
          </div>
        </div>

        {showIncompleteError && (
          <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} className="bg-red-100 border-4 border-red-500 p-4 rounded-2xl text-red-600 font-black text-center italic">
            ⚠️ 請完成所有題目後再送出！
          </motion.div>
        )}

        <div className="grid gap-10">
          {CHALLENGE_QUESTIONS.map((q, idx) => (
            <motion.div 
              key={idx} 
              initial={{ scale: 0.95, opacity: 0 }} 
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              className="card-bold bg-white p-10 border-8 border-brand-border rounded-[3rem] shadow-[12px_12px_0px_#00332c] grid md:grid-cols-[1fr_2fr] gap-10 items-center"
            >
              <div className="bg-brand-headline rounded-2xl p-4 aspect-square border-4 border-black/10 flex items-center justify-center overflow-hidden relative">
                <Image 
                  src={`/images/${encodeURIComponent(q.img || '')}`} 
                  alt="Question Image" 
                  fill
                  className="object-contain p-2"
                  unoptimized={true}
                  priority
                  referrerPolicy="no-referrer"
                />
              </div>

              <div>
                <div className="flex gap-4 items-center mb-6">
                  <span className="w-12 h-12 bg-brand-button border-4 border-brand-border rounded-full flex items-center justify-center font-black text-2xl">{idx + 1}</span>
                  <h3 className="text-2xl font-black">{q.q}</h3>
                </div>

                <div className="grid gap-4">
                  {q.options.map((opt, oIdx) => (
                    <button 
                      key={oIdx}
                      onClick={() => {
                        const newAns = [...answers];
                        newAns[idx] = oIdx;
                        setAnswers(newAns);
                        setShowIncompleteError(false);
                      }}
                      className={`w-full text-left p-6 rounded-2xl border-4 font-black transition-all flex items-center justify-between ${
                        answers[idx] === oIdx 
                          ? 'bg-brand-button border-brand-border shadow-[4px_4px_0px_#00332c]' 
                          : 'bg-white border-brand-border/20 hover:border-brand-border hover:bg-gray-50'
                      }`}
                    >
                      <span className="text-xl">{opt}</span>
                      {answers[idx] === oIdx && <div className="w-6 h-6 bg-brand-headline rounded-full border-2 border-brand-border" />}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="flex justify-center pt-10">
          <button onClick={handleSubmit} className="btn-bold bg-brand-headline text-brand-button px-24 py-8 text-4xl shadow-[12px_12px_0px_#000] hover:scale-110 active:translate-y-2 transition-all">
            送出測驗
          </button>
        </div>
      </div>
    </div>
  );
}
