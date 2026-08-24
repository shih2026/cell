import { Question, TabContent } from "./types";

// --- Mock Data ---
export const STAGES: TabContent[] = [
  { id: "p1_blocks", title: "細胞", type: "learning" },
  { id: "p2_gate", title: "細胞膜", type: "learning" },
  { id: "p3_center", title: "細胞核", type: "learning" },
  { id: "p4_floor", title: "細胞質", type: "learning" },
  { id: "p5_power", title: "粒線體", type: "learning" },
  { id: "p6_store", title: "液胞", type: "learning" },
  { id: "p7_wall", title: "細胞壁", type: "learning" },
  { id: "p8_solar", title: "葉綠體", type: "learning" },
  { id: "p9_compare", title: "動植比較", type: "learning" },
  { id: "p10_lab", title: "觀察細胞", type: "learning" },
  { id: "p11_observe", title: "觀察總結", type: "learning" },
  { id: "p12_factory", title: "功能跑酷", type: "game" },
  { id: "p13_sorting", title: "構造分類王", type: "game" },
  { id: "p14_challenge", title: "總結挑戰", type: "game" },
  { id: "p15_submit", title: "學習認證", type: "learning" },
];

export const QUIZ_DATA: Record<string, Question[]> = {
  p1_blocks: [
    {
      id: "q1",
      question: "人體最基本的組成單位是？",
      options: ["組織", "器官", "系統", "細胞"],
      answer: "細胞",
      explanation: "細胞是生物體構造與功能的基本單位。",
    },
  ],
  p2_gate_unlock: [
    {
      id: "q2",
      question: "細胞膜最主要的功能是？",
      options: ["控制物質進出", "產生能量", "儲存水分", "進行分裂"],
      answer: "控制物質進出",
      explanation: "它就像學校大門，負責篩選進出的物體。",
    },
  ],
  p3_center_unlock: [
    {
      id: "q3",
      question: "細胞核內最重要的是什麼？",
      options: ["水分", "遺傳物質 DNA", "葉綠體", "纖維素"],
      answer: "遺傳物質 DNA",
      explanation: "DNA 儲存了生命的所有設計圖。",
    },
  ],
  p4_floor_unlock: [
    {
      id: "q4",
      question: "細胞質的主要功能？",
      options: ["保護細胞", "化學反應進行場所", "維持形狀", "製造葡萄糖"],
      answer: "化學反應進行場所",
      explanation: "它是細胞內大部分生化反應發生的工作區。",
    },
  ],
  p5_power_unlock: [
    {
      id: "q5",
      question: "粒線體的功能是？",
      options: ["光合作用", "儲存廢物", "產生能量", "保護 DNA"],
      answer: "產生能量",
      explanation: "它是細胞的發電廠，將養分轉為活動所需能量。",
    },
  ],
  p6_store_unlock: [
    {
      id: "q6",
      question: "液胞的主要功能？",
      options: [
        "控制進出",
        "進行呼吸",
        "儲存物質 (水、養分、廢物)",
        "支撐身體",
      ],
      answer: "儲存物質 (水、養分、廢物)",
      explanation: "它是儲藏室，植物的液胞通常較大。",
    },
  ],
  p7_wall_unlock: [
    {
      id: "q7",
      question: "細胞壁的主要功能？",
      options: ["製造養分", "保護與支持、維持形狀", "連通外界", "儲存遺傳物質"],
      answer: "保護與支持、維持形狀",
      explanation: "它是城堡的城牆，由堅韌的纖維素組成。",
    },
  ],
  p8_solar_unlock: [
    {
      id: "q8",
      question: "葉綠體的功能？",
      options: ["呼吸作用", "產生熱量", "光合作用製造養分", "過濾水分"],
      answer: "光合作用製造養分",
      explanation: "它是太陽能板，能將光能轉為化學能。",
    },
  ],
  p9_compare_unlock: [
    {
      id: "q9",
      question: "植物細胞特有、而動物細胞沒有的構造是？",
      options: [
        "細胞核、細胞膜",
        "細胞質、粒線體",
        "細胞壁、葉綠體",
        "液胞、核糖體",
      ],
      answer: "細胞壁、葉綠體",
      explanation: "細胞壁和葉綠體是植物細胞的專屬特徵。",
    },
  ],
  p10_lab_unlock: [
    {
      id: "q10",
      question: "觀察細胞時，通常從哪種倍率開始觀察？",
      options: ["低倍鏡", "高倍鏡", "電子顯微鏡", "肉眼直接看"],
      answer: "低倍鏡",
      explanation: "低倍鏡視野廣，容易找到目標物。",
    },
  ],
  p11_observe_unlock: [
    {
      id: "q11",
      question:
        "比較洋蔥表皮細胞、口腔皮膜細胞與風車草葉片細胞，下列何種構造是這三種細胞皆具備的？",
      options: [
        "細胞壁、細胞膜",
        "細胞核、葉綠體",
        "細胞膜、細胞質、細胞核",
        "細胞壁、細胞質、液胞",
      ],
      answer: "細胞膜、細胞質、細胞核",
      explanation:
        "無論是動植物細胞，皆具備細胞膜、細胞質與細胞核這三大基本構造。",
    },
  ],
};

// --- Constants ---
export const GAME_TASKS = [
  {
    id: "n_a",
    name: "細胞核",
    img: "animal-cell-nucleus.png",
    type: "animal",
    mission: "控制活動與保存遺傳物質",
  },
  {
    id: "m_p",
    name: "細胞膜",
    img: "plant-cell-membrane.png",
    type: "plant",
    mission: "管控物質進出",
  },
  {
    id: "mit_a",
    name: "粒線體",
    img: "animal-cell-mitochondria.png",
    type: "animal",
    mission: "負責呼吸作用產生能量",
  },
  {
    id: "v_p",
    name: "液胞",
    img: "plant-cell-vacuole.png",
    type: "plant",
    mission: "儲存水分養分與廢物",
  },
  {
    id: "w_p",
    name: "細胞壁",
    img: "plant-cell-wall.png",
    type: "plant",
    mission: "提供支持力並保護細胞",
  },
  {
    id: "chl_p",
    name: "葉綠體",
    img: "plant-cell-chloroplast.png",
    type: "plant",
    mission: "吸收光能進行光合作用",
  },
];

export const CHALLENGE_QUESTIONS = [
  {
    q: "哪一個構造被稱為細胞的「能源工廠」？",
    options: ["細胞核", "粒線體", "葉綠體", "液胞"],
    correct: 1,
    hint: "粒線體負責呼吸作用，產生能量。",
    img: "plant-cell-mitochondria.png",
  },
  {
    q: "關於細胞壁的敘述，下列何者正確？",
    options: [
      "動植物細胞均有",
      "位於細胞膜內側",
      "主要功能是支持植物體",
      "透明且能進行光合作用",
    ],
    correct: 2,
    hint: "細胞壁主要由纖維素構成，具支持功能。",
    img: "plant-cell-wall.png",
  },
  {
    q: "哪一種細胞通常具有一個「大型液胞」？",
    options: ["老鼠細胞", "人類神經細胞", "成熟植物細胞", "口腔上皮細胞"],
    correct: 2,
    hint: "植物細胞的液胞隨成熟而增大。",
    img: "plant-cell-vacuole.png",
  },
  {
    q: "細胞的「生命中樞」是哪個構造？",
    options: ["細胞核", "細胞質", "細胞膜", "細胞壁"],
    correct: 0,
    hint: "細胞核內含遺傳物質，控制細胞生理活動。",
    img: "animal-cell-nucleus.png",
  },
  {
    q: "哪種構造能進行光合作用？",
    options: ["粒線體", "葉綠體", "液胞", "細胞核"],
    correct: 1,
    hint: "葉綠體含有葉綠素，能吸收光能。",
    img: "plant-cell-chloroplast.png",
  },
  {
    q: "控制物質進出細胞的門哨是？",
    options: ["細胞壁", "細胞膜", "細胞核", "粒線體"],
    correct: 1,
    hint: "細胞膜具有選擇性通透，控制進出。",
    img: "animal-cell-membrane.png",
  },
  {
    q: "動物細胞「不具有」下列哪項構造？",
    options: ["細胞核", "粒線體", "細胞膜", "細胞壁"],
    correct: 3,
    hint: "細胞壁是植物、真菌、細菌特有的構造。",
    img: "animal-cell-full.png",
  },
  {
    q: "細胞內許多生化反應發生的場所是？",
    options: ["細胞質", "液胞", "細胞膜", "細胞壁"],
    correct: 0,
    hint: "細胞質為膠狀物質，是許多反應的場所。",
    img: "plant-cell-cytoplasm.png",
  },
  {
    q: "關於葉綠體的分布，下列何者正確？",
    options: [
      "所有植物細胞均有",
      "洋蔥鱗片葉表皮細胞有",
      "植物的根部細胞一定有",
      "藍綠菌沒有葉綠體但有葉綠素",
    ],
    correct: 3,
    hint: "只有具備行光合作用功能的植物細胞才有葉綠體。藍綠菌則是沒有葉綠體但有葉綠素。",
    img: "plant-cell-full.png",
  },
  {
    q: "下列哪一構造的大小，常用來區分動、植物細胞？",
    options: ["細胞核", "液胞", "粒線體", "細胞質"],
    correct: 1,
    hint: "植物液胞大且固定，動物液胞小且暫時。",
    img: "animal-cell-vacuole.png",
  },
];
