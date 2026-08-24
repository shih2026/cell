const fs = require('fs');
const path = require('path');
const file = path.resolve('app/page.tsx');
let content = fs.readFileSync(file, 'utf8');

// Replace everything from `const QUIZ_DATA` to `// --- Constants ---`
content = content.replace(/const QUIZ_DATA: Record<string, Question\[\]> = \{[\s\S]*?\/\/\s*---\s*Constants\s*---/m, 
`const QUIZ_DATA: Record<string, Question[]> = {
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

// --- Constants ---`);
fs.writeFileSync(file, content, 'utf8');
