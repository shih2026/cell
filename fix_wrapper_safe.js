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

// We replace the render part for StageWrapper
// We know it looks like this:
/*
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
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          className="pt-20"
        >
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
*/
// Let's replace precisely by slicing.
const searchStr = `{!showQuiz ? (
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
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          className="pt-20"
        >
          <QuizComponent
            questions={QUIZ_DATA[unlockQuizKey]}
            onComplete={() => {
              onUnlock();
              setShowQuiz(false);
            }}
          />
        </motion.div>
      )}`;

const replacementStr = `{!showQuiz ? (
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
      )}`;

if (content.includes(searchStr)) {
  content = content.replace(searchStr, replacementStr);
} else {
  console.log("Could not find StageWrapper button part! Spaces might be mismatched.");
}

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
