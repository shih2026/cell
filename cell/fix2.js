const fs = require('fs');
const path = require('path');
const file = path.resolve('app/page.tsx');
let lines = fs.readFileSync(file, 'utf8').split('\n');

const stageStart = lines.findIndex(l => l.includes('const STAGES: TabContent[] = ['));
const stageEnd = lines.findIndex((l, i) => i > stageStart && l.includes('];'));

lines.splice(stageStart, stageEnd - stageStart + 1, ...`const STAGES: TabContent[] = [
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
];`.split('\n'));

const quizStart = lines.findIndex(l => l.includes('const QUIZ_DATA: Record<string, Question[]> = {'));
const quizEnd = lines.findIndex((l, i) => i > quizStart && l.includes('};'));

lines.splice(quizStart, quizEnd - quizStart + 1, ...`const QUIZ_DATA: Record<string, Question[]> = {
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
};`.split('\n'));

// Now find the switch case and update it
const switchStart = lines.findIndex(l => l.includes('case 0: return <P1Blocks unlockNext={unlockNext} />'));
const switchEnd = lines.findIndex((l, i) => i > switchStart && l.includes('default: return null;'));

lines.splice(switchStart, switchEnd - switchStart, ...`      case 0: return <P1Blocks unlockNext={unlockNext} />;
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
      case 13: return <P13SummaryChallenge updateGameHighScore={updateSummaryHighScore} />;`.split('\n'));

fs.writeFileSync(file, lines.join('\n'), 'utf8');
