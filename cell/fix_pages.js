const fs = require('fs');
const path = require('path');
const file = path.resolve('app/page.tsx');
let content = fs.readFileSync(file, 'utf8');

const replacement = `
function P1Blocks({ unlockNext, addScore }: { unlockNext: () => void, addScore?: (p: number) => void }) {
  const [passed, setPassed] = React.useState(false);
  return (
    <StageWrapper 
      title="細胞的種類" subtitle="" 
      metaphor={{ icon: '🧩', title: '樂高積木', desc: '所有的複雜結構都由最小單元組成。' }} 
      unlockQuizKey="p1_blocks" onUnlock={unlockNext} hideMetaphor isReadyToUnlock={passed} addScore={addScore}
    >
      <DropdownTextQuiz
        onPass={() => setPassed(true)}
        addScore={addScore}
        parts={[
          "細胞的",
          { answer: "種類有很多", options: ["種類有很多", "都長得一樣", "沒有特定功能"] },
          "，但大多具有相似的",
          { answer: "基本構造", options: ["基本構造", "複雜外觀", "化學成分"] },
          "，主要包含",
          { answer: "細胞核", options: ["細胞核", "葉綠體", "細胞壁"] },
          "、",
          { answer: "細胞質", options: ["細胞膜", "細胞質", "粒線體"] },
          "與",
          { answer: "細胞膜", options: ["細胞質", "細胞膜", "液胞"] },
          "等共有構造。"
        ]}
      />
      <CellImagePair animalImg="animal-cell-full.png" plantImg="plant-cell-full.png" />
    </StageWrapper>
  );
}

function P2Gate({ unlockNext, addScore }: { unlockNext: () => void, addScore?: (p: number) => void }) {
  const [passed, setPassed] = React.useState(false);
  return (
    <StageWrapper 
      title="細胞膜" subtitle="" 
      metaphor={{ icon: '🚪', title: '大門警衛', desc: '負責檢查所有進出的對象。' }} 
      unlockQuizKey="p2_gate_unlock" onUnlock={unlockNext} hideMetaphor isReadyToUnlock={passed} addScore={addScore}
    >
      <DropdownTextQuiz
        onPass={() => setPassed(true)}
        addScore={addScore}
        parts={[
          "細胞膜是維持細胞完整性的",
          { answer: "薄膜狀構造", options: ["薄膜狀構造", "堅硬外殼", "液態物質"] },
          "，能夠",
          { answer: "區隔", options: ["區隔", "融合", "打破"] },
          "細胞內、外環境，並負責",
          { answer: "控制物質進出", options: ["產生能量", "控制物質進出", "儲存遺傳物質"] },
          "細胞。"
        ]}
      />
      <CellImagePair animalImg="animal-cell-membrane.png" plantImg="plant-cell-membrane.png" />
    </StageWrapper>
  );
}

function P3Center({ unlockNext, addScore }: { unlockNext: () => void, addScore?: (p: number) => void }) {
  const [passed, setPassed] = React.useState(false);
  return (
    <StageWrapper 
      title="細胞核" subtitle="" 
      metaphor={{ icon: '🧠', title: '大腦中樞', desc: '發號施令，並儲存重要的設計圖。' }} 
      unlockQuizKey="p3_center_unlock" onUnlock={unlockNext} hideMetaphor isReadyToUnlock={passed} addScore={addScore}
    >
      <DropdownTextQuiz
        onPass={() => setPassed(true)}
        addScore={addScore}
        parts={[
          "細胞核多呈",
          { answer: "球形", options: ["方形", "球形", "不規則形"] },
          "，由",
          { answer: "核膜", options: ["核膜", "細胞壁", "葉綠體"] },
          "包覆，其內部含有",
          { answer: "遺傳物質", options: ["遺傳物質", "水分", "空氣"] },
          "。是細胞的",
          { answer: "生命中樞", options: ["發電廠", "儲藏室", "生命中樞"] },
          "，負責控制細胞的",
          { answer: "代謝作用", options: ["呼吸作用", "光合作用", "代謝作用"] },
          "。"
        ]}
      />
      <CellImagePair animalImg="animal-cell-nucleus.png" plantImg="plant-cell-nucleus.png" />
    </StageWrapper>
  );
}

function P4Floor({ unlockNext, addScore }: { unlockNext: () => void, addScore?: (p: number) => void }) {
  const [passed, setPassed] = React.useState(false);
  return (
    <StageWrapper 
      title="細胞質" subtitle="" 
      metaphor={{ icon: '🧪', title: '化學工廠', desc: '各式各樣的反應都在這裡發生。' }} 
      unlockQuizKey="p4_floor_unlock" onUnlock={unlockNext} hideMetaphor isReadyToUnlock={passed} addScore={addScore}
    >
      <DropdownTextQuiz
        onPass={() => setPassed(true)}
        addScore={addScore}
        parts={[
          "細胞質由",
          { answer: "膠狀的水溶液", options: ["膠狀的水溶液", "固體結晶", "氣體"] },
          "以及散布在其中各種",
          { answer: "胞器", options: ["骨骼", "胞器", "血管"] },
          "所組成。是細胞進行",
          { answer: "代謝作用的場所", options: ["光合作用的唯一場所", "代謝作用的場所", "呼吸作用的唯一場所"] },
          "。內有許多胞器，是散布於細胞質中具",
          { answer: "特定功能", options: ["相同功能", "沒有功能", "特定功能"] },
          "的微小構造。"
        ]}
      />
      <CellImagePair animalImg="animal-cell-cytoplasm.png" plantImg="plant-cell-cytoplasm.png" />
    </StageWrapper>
  );
}

function P5Power({ unlockNext, addScore }: { unlockNext: () => void, addScore?: (p: number) => void }) {
  const [passed, setPassed] = React.useState(false);
  return (
    <StageWrapper 
      title="粒線體" subtitle="" 
      metaphor={{ icon: '🔋', title: '發電廠', desc: '將燃料轉換為可以使用的能量。' }} 
      unlockQuizKey="p5_power_unlock" onUnlock={unlockNext} hideMetaphor isReadyToUnlock={passed} addScore={addScore}
    >
      <DropdownTextQuiz
        onPass={() => setPassed(true)}
        addScore={addScore}
        parts={[
          "粒線體是一種",
          { answer: "胞器", options: ["細胞", "胞器", "器官"] },
          "，可利用",
          { answer: "養分", options: ["陽光", "養分", "二氧化碳"] },
          "進行",
          { answer: "呼吸作用", options: ["光合作用", "呼吸作用", "消化作用"] },
          "，藉此產生細胞運作",
          { answer: "所需的能量", options: ["所需的能量", "所需的水分", "所需的氧氣"] },
          "。"
        ]}
      />
      <CellImagePair animalImg="animal-cell-mitochondria.png" plantImg="plant-cell-mitochondria.png" />
    </StageWrapper>
  );
}

function P6Store({ unlockNext, addScore }: { unlockNext: () => void, addScore?: (p: number) => void }) {
  const [passed, setPassed] = React.useState(false);
  return (
    <StageWrapper 
      title="液胞" subtitle="" 
      metaphor={{ icon: '📦', title: '儲藏室', desc: '存放各種物資，甚至還能支撐結構。' }} 
      unlockQuizKey="p6_store_unlock" onUnlock={unlockNext} hideMetaphor isReadyToUnlock={passed} addScore={addScore}
    >
      <DropdownTextQuiz
        onPass={() => setPassed(true)}
        addScore={addScore}
        parts={[
          "液胞是一種胞器，外觀呈",
          { answer: "囊泡狀", options: ["管狀", "囊泡狀", "絲狀"] },
          "，主要功能為",
          { answer: "儲存水分、養分或廢物", options: ["產生能量", "儲存水分、養分或廢物", "合成蛋白質"] },
          "。通常植物細胞的液胞",
          { answer: "較大", options: ["較大", "較小", "不存在"] },
          "，還具有維持",
          { answer: "細胞形狀", options: ["細胞形狀", "體溫", "運動"] },
          "的功能，而動物細胞的液胞則",
          { answer: "較小", options: ["較大", "較小", "不存在"] },
          "。"
        ]}
      />
      <CellImagePair animalImg="animal-cell-vacuole.png" plantImg="plant-cell-vacuole.png" />
    </StageWrapper>
  );
}

function P7Wall({ unlockNext, addScore }: { unlockNext: () => void, addScore?: (p: number) => void }) {
  const [passed, setPassed] = React.useState(false);
  return (
    <StageWrapper 
      title="細胞壁" subtitle="" 
      metaphor={{ icon: '🧱', title: '堅固城牆', desc: '植物專屬的防禦與支撐結構。' }} 
      unlockQuizKey="p7_wall_unlock" onUnlock={unlockNext} hideMetaphor isReadyToUnlock={passed} addScore={addScore}
    >
      <DropdownTextQuiz
        onPass={() => setPassed(true)}
        addScore={addScore}
        parts={[
          "細胞壁是",
          { answer: "植物細胞", options: ["動物細胞", "植物細胞", "所有細胞"] },
          "特有的構造，位於細胞膜的",
          { answer: "外側", options: ["內側", "外側", "中間"] },
          "，主要由",
          { answer: "纖維素", options: ["蛋白質", "脂肪", "纖維素"] },
          "組成。功能是",
          { answer: "保護與支持", options: ["產生能量", "保護與支持", "控制物質進出"] },
          "細胞，並維持",
          { answer: "細胞形狀", options: ["細胞形狀", "溫度", "酸鹼值"] },
          "。"
        ]}
      />
      <CellImagePair animalExists={false} plantImg="plant-cell-wall.png" />
    </StageWrapper>
  );
}

function P8Solar({ unlockNext, addScore }: { unlockNext: () => void, addScore?: (p: number) => void }) {
  const [passed, setPassed] = React.useState(false);
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
          { answer: "養分", options: ["水分", "氧氣", "養分"] },
          "供植物細胞使用。"
        ]}
      />
      <CellImagePair animalExists={false} plantImg="plant-cell-chloroplast.png" />
    </StageWrapper>
  );
}
`;

content = content.replace(
  /function P1Blocks\(\{[\s\S]*?function P9Compare/m,
  replacement + '\nfunction P9Compare'
);

// We should also replace the cases in `LearningApp`'s `renderTabContent`.
// But wait, it's safer to use a very specific string replace.
const oldRender = `const renderTabContent = (idx: number) => {
    switch (idx) {
      case 0:
        return <P1Blocks unlockNext={unlockNext} />;
      case 1:
        return <P2Gate unlockNext={unlockNext} />;
      case 2:
        return <P3Center unlockNext={unlockNext} />;
      case 3:
        return <P4Floor unlockNext={unlockNext} />;
      case 4:
        return <P5Power unlockNext={unlockNext} />;
      case 5:
        return <P6Store unlockNext={unlockNext} />;
      case 6:
        return <P7Wall unlockNext={unlockNext} />;
      case 7:
        return <P8Solar unlockNext={unlockNext} />;
      case 8:
        return <P9Compare addScore={addLearningScore} unlockNext={unlockNext} />;
      case 9:
        return <P10CellLab unlockNext={unlockNext} />;
      case 10:
        return <P11ObserveSummary unlockNext={unlockNext} />;`;

const newRender = `const renderTabContent = (idx: number) => {
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
        return <P9Compare addScore={addLearningScore} unlockNext={unlockNext} />;
      case 9:
        return <P10CellLab unlockNext={unlockNext} />;
      case 10:
        return <P11ObserveSummary unlockNext={unlockNext} />;`;

// Instead of matching exactly spaces, let's use a regex to match the switch cases safely.
content = content.replace(/case 0:\s*return <P1Blocks unlockNext=\{unlockNext\} \/>;/, 'case 0:\n        return <P1Blocks unlockNext={unlockNext} addScore={addLearningScore} />;');
content = content.replace(/case 1:\s*return <P2Gate unlockNext=\{unlockNext\} \/>;/, 'case 1:\n        return <P2Gate unlockNext={unlockNext} addScore={addLearningScore} />;');
content = content.replace(/case 2:\s*return <P3Center unlockNext=\{unlockNext\} \/>;/, 'case 2:\n        return <P3Center unlockNext={unlockNext} addScore={addLearningScore} />;');
content = content.replace(/case 3:\s*return <P4Floor unlockNext=\{unlockNext\} \/>;/, 'case 3:\n        return <P4Floor unlockNext={unlockNext} addScore={addLearningScore} />;');
content = content.replace(/case 4:\s*return <P5Power unlockNext=\{unlockNext\} \/>;/, 'case 4:\n        return <P5Power unlockNext={unlockNext} addScore={addLearningScore} />;');
content = content.replace(/case 5:\s*return <P6Store unlockNext=\{unlockNext\} \/>;/, 'case 5:\n        return <P6Store unlockNext={unlockNext} addScore={addLearningScore} />;');
content = content.replace(/case 6:\s*return <P7Wall unlockNext=\{unlockNext\} \/>;/, 'case 6:\n        return <P7Wall unlockNext={unlockNext} addScore={addLearningScore} />;');
content = content.replace(/case 7:\s*return <P8Solar unlockNext=\{unlockNext\} \/>;/, 'case 7:\n        return <P8Solar unlockNext={unlockNext} addScore={addLearningScore} />;');

fs.writeFileSync(file, content, 'utf8');
