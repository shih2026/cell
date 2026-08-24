const fs = require('fs');
const path = require('path');
const file = path.resolve('app/page.tsx');
let content = fs.readFileSync(file, 'utf8');

// Update StageWrapper signature
content = content.replace(
  /function StageWrapper\(\{\s*children,\s*title,\s*subtitle,\s*metaphor,\s*unlockQuizKey,\s*onUnlock,\s*hideMetaphor,\s*\}\:\s*\{[\s\S]*?\}\)\s*\{/,
  `function StageWrapper({ children, title, subtitle, metaphor, unlockQuizKey, onUnlock, hideMetaphor, isReadyToUnlock = true, addScore }: { 
  children: React.ReactNode, 
  title: string, 
  subtitle: string, 
  metaphor?: { icon: string, title: string, desc: string },
  unlockQuizKey: string,
  onUnlock: () => void,
  hideMetaphor?: boolean,
  isReadyToUnlock?: boolean,
  addScore?: (p: number) => void
}) {`
);

// Update StageWrapper buttons and QuizComponent props
content = content.replace(
  /\{\!showQuiz \? \([\s\S]*?<\/div>\s*\)\s*:\s*\([\s\S]*?\}\)\s*\}/,
  `{!showQuiz ? (
        <div className="text-center py-16 bg-white/50 rounded-[4rem] border-8 border-brand-border border-dashed">
          <button 
            id="unlock-quiz-trigger"
            disabled={!isReadyToUnlock}
            onClick={() => setShowQuiz(true)}
            className={\`flex items-center gap-4 mx-auto btn-bold px-16 py-8 text-3xl transition-transform \${isReadyToUnlock ? 'bg-brand-headline text-brand-button hover:rotate-1' : 'bg-gray-300 text-gray-500 cursor-not-allowed opacity-50'}\`}
          >
            <CirclePlay size={40} />
            {isReadyToUnlock ? '任務完成：前往認證解鎖' : '請先完成上方學習任務'}
          </button>
        </div>
      ) : (
        <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} className="pt-20">
          <QuizComponent 
            questions={QUIZ_DATA[unlockQuizKey]} 
            addScore={addScore}
            onComplete={() => {
              onUnlock();
              setShowQuiz(false);
            }} 
          />
        </motion.div>
      )}`
);

// Update QuizComponent signature and handleSelect
content = content.replace(
  /function QuizComponent\(\{[\s\S]*?\}\)\s*\{/,
  `function QuizComponent({ questions, onComplete, addScore }: { questions: Question[], onComplete: () => void, addScore?: (p: number) => void }) {`
);

content = content.replace(
  /    if \(\!correct\) setTries\(\(prev\) => prev \+ 1\);\n  \};/,
  `    if (!correct) {
      setTries(prev => prev + 1);
    } else if (addScore) {
      if (tries === 1) addScore(100);
      else if (tries === 2) addScore(50);
      else addScore(0);
    }
  };`
);

fs.writeFileSync(file, content, 'utf8');
