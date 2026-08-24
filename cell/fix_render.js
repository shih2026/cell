const fs = require('fs');
const path = require('path');
const file = path.resolve('app/page.tsx');
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  /const renderTabContent = \(idx: number\) => \{[\s\S]*?default: return null;\n    \}/,
  `const renderTabContent = (idx: number) => {
    switch (idx) {
      case 0: return <P1Blocks unlockNext={unlockNext} addScore={addLearningScore} />;
      case 1: return <P2Gate unlockNext={unlockNext} addScore={addLearningScore} />;
      case 2: return <P3Center unlockNext={unlockNext} addScore={addLearningScore} />;
      case 3: return <P4Floor unlockNext={unlockNext} addScore={addLearningScore} />;
      case 4: return <P5Power unlockNext={unlockNext} addScore={addLearningScore} />;
      case 5: return <P6Store unlockNext={unlockNext} addScore={addLearningScore} />;
      case 6: return <P7Wall unlockNext={unlockNext} addScore={addLearningScore} />;
      case 7: return <P8Solar unlockNext={unlockNext} addScore={addLearningScore} />;
      case 8: return <P9Compare addScore={addLearningScore} unlockNext={unlockNext} />;
      case 9: return <P10CellLab unlockNext={unlockNext} />;
      case 10: return <P11ObserveSummary unlockNext={unlockNext} />;
      case 11: return <P11FinalGame updateGameHighScore={updateFactoryHighScore} studentInfo={studentInfo} setStudentInfo={setStudentInfo} />;
      case 12: return <P12Sorting updateGameHighScore={updateSortingHighScore} />;
      case 13: return <P13SummaryChallenge updateGameHighScore={updateSummaryHighScore} />;
      default: return null;
    }`
);

fs.writeFileSync(file, content, 'utf8');
