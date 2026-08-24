import * as fs from 'fs';
import * as path from 'path';

const filePath = path.join(__dirname, 'page.tsx');
let content = fs.readFileSync(filePath, 'utf8');

const startMarker = "      case 'micro': {";
const endMarker = "      case 'inquiry': {";

const startIndex = content.indexOf(startMarker);
const endIndex = content.indexOf(endMarker);

if (startIndex === -1 || endIndex === -1) {
  console.error("Markers not found! startIndex:", startIndex, "endIndex:", endIndex);
  process.exit(1);
}

const replacement = `      case 'micro': {
        const cDiff = Math.abs(50 - labState.coarse);
        const fDiff = Math.abs(70 - labState.fine);
        const focusOk = cDiff < 4 && fDiff < 6;
        
        // Calculate dynamic blur
        let blurValue = 20; // Maximum blur limit is 20px so a hint of image is always visible to students
        if (cDiff < 25 && fDiff < 30) {
          blurValue = (cDiff * 0.4) + (fDiff * 0.2);
        }
        if (blurValue > 20) blurValue = 20;
        if (focusOk) blurValue = 0;

        const sampleData = SAMPLES.find(s => s.id === selectedSample);
        const currentImg = (labState.stainApplied && sampleData?.stainedImg) ? sampleData.stainedImg : sampleData?.img;
        
        return (
          <div className="grid md:grid-cols-3 gap-12">
            <div className="md:col-span-2 space-y-8">
              {/* Microscope viewport frame with absolute inset image container to prevent rendering crash */}
              <div className="relative aspect-square bg-[#0a0a0a] rounded-[4rem] border-[20px] border-brand-border overflow-hidden shadow-[inset_0_0_100px_rgba(0,0,0,1)] flex items-center justify-center">
                <div 
                  className="absolute inset-0 transition-all duration-300 pointer-events-none"
                  style={{ 
                    filter: \`blur(\${blurValue}px) contrast(1.1) brightness(\${focusOk ? 1.1 : 0.85})\`,
                    transform: \`scale(\${labState.lens === 'high' ? 3.8 : 1.3})\`,
                    opacity: blurValue > 15 ? 0.6 : 1
                  }}
                >
                  {currentImg && (
                    <Image 
                      src={\`/images/\${currentImg}\`} 
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
                   <div className="px-6 py-2 bg-white/10 backdrop-blur-md rounded-2xl text-xs font-black text-white italic border border-white/20">
                     VIEWPORT: {labState.lens === 'low' ? '100X' : '400X'}
                   </div>
                </div>
                
                {blurValue > 10 && (
                   <div className="absolute inset-0 flex items-center justify-center text-white/30 font-black text-2xl uppercase tracking-widest animate-pulse pointer-events-none">
                     旋轉調節輪進行對焦
                   </div>
                )}
              </div>
            </div>

            <div className="space-y-10 bg-white border-8 border-brand-border p-12 rounded-[4rem] shadow-[12px_12px_0px_#faae2b] flex flex-col justify-center">
               <div className="space-y-2 text-center mb-4">
                  <h4 className="text-2xl font-black text-brand-headline">顯微鏡調節</h4>
                  <p className="text-brand-paragraph text-sm font-bold opacity-60">滑動旋鈕使圓形影像最清晰</p>
               </div>
               <div className="space-y-6">
                  <div className="flex justify-between font-black text-sm uppercase tracking-widest text-brand-paragraph">
                     <span>粗調節輪 (Coarse)</span>
                     <span className="text-brand-button text-lg">{labState.coarse}%</span>
                  </div>
                  <input 
                    type="range" min="0" max="100" value={labState.coarse} 
                    onChange={e => setLabState(s => ({ ...s, coarse: parseInt(e.target.value) }))}
                    className="w-full h-12 bg-brand-bg rounded-2xl appearance-none cursor-pointer border-4 border-brand-border accent-brand-headline"
                  />
               </div>
               <div className="space-y-6">
                  <div className="flex justify-between font-black text-sm uppercase tracking-widest text-brand-paragraph">
                     <span>細調節輪 (Fine)</span>
                     <span className="text-brand-button text-lg">{labState.fine}%</span>
                  </div>
                  <input 
                    type="range" min="0" max="100" value={labState.fine} 
                    onChange={e => setLabState(s => ({ ...s, fine: parseInt(e.target.value) }))}
                    className="w-full h-12 bg-brand-bg rounded-2xl appearance-none cursor-pointer border-4 border-brand-border accent-brand-button"
                  />
               </div>
               <div className="grid grid-cols-2 gap-4 pt-4">
                  <button 
                    onClick={() => setLabState(s => ({ ...s, lens: 'low' }))}
                    className={\`py-4 font-black rounded-2xl border-4 transition-all shadow-[4px_4px_0px_#000] active:translate-y-1 active:shadow-none \${labState.lens === 'low' ? 'bg-brand-headline text-white border-brand-border' : 'bg-gray-50 text-gray-400 border-gray-200'}\`}
                  >
                    10X (低倍)
                  </button>
                  <button 
                    onClick={() => setLabState(s => ({ ...s, lens: 'high' }))}
                    className={\`py-4 font-black rounded-2xl border-4 transition-all shadow-[4px_4px_0px_#000] active:translate-y-1 active:shadow-none \${labState.lens === 'high' ? 'bg-brand-headline text-white border-brand-border' : 'bg-gray-50 text-gray-400 border-gray-200'}\`}
                  >
                    40X (高倍)
                  </button>
               </div>
               
               <AnimatePresence>
                 {focusOk && (
                   <motion.button 
                     initial={{ opacity: 0, scale: 0.9 }} 
                     animate={{ opacity: 1, scale: 1 }}
                     onClick={() => setPhase('report')}
                     className="mt-8 w-full btn-bold bg-green-600 text-white py-8 text-2xl shadow-[8px_8px_0px_#14532d] flex items-center justify-center gap-3 border-4 border-green-900"
                   >
                     <ShieldCheck size={32} /> 影像對焦成功！
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
              <div className="relative aspect-square bg-[#0a0a0a] rounded-[4rem] border-[16px] border-brand-border overflow-hidden shadow-2xl flex items-center justify-center">
                <div 
                  className="absolute inset-0 pointer-events-none"
                  style={{ 
                    transform: \`scale(\${labState.lens === 'high' ? 3.5 : 1.2})\`,
                  }}
                >
                  {microscopeImg && (
                    <Image 
                      src={\`/images/\${microscopeImg}\`} 
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
                      className={\`absolute w-10 h-10 -ml-5 -mt-5 rounded-full border-4 flex items-center justify-center transition-all \${
                        isPlaced 
                          ? 'bg-green-500 border-green-200 text-white shadow-lg' 
                          : 'bg-orange-500 border-white text-white hover:scale-110 animate-bounce'
                      } \${isShaking ? 'animate-shake' : ''}\`}
                      style={{ left: \`\${target.x}%\`, top: \`\${target.y}%\` }}
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
                          className={\`px-5 py-3 rounded-2xl border-4 text-base font-black transition-all \${
                            hasBeenCorrectlyPlaced
                              ? 'bg-green-100 border-green-600 text-green-950 line-through opacity-50 cursor-not-allowed'
                              : isSelected
                              ? 'bg-brand-button border-brand-border text-brand-headline shadow-[4px_4px_0px_#000] scale-105'
                              : 'bg-white border-brand-border hover:bg-brand-bg'
                          }\`}
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
                className={\`w-full btn-bold py-6 text-2xl font-black italic tracking-widest uppercase transition-all \${
                  correctlyPlaced.length < targets.length
                    ? 'bg-gray-200 text-gray-400 border-gray-300 cursor-not-allowed opacity-50'
                    : 'bg-brand-headline text-brand-button hover:scale-105 shadow-[6px_6px_0px_#faae2b]'
                }\`}
              >
                提交報告
              </button>
            </div>
          </div>
        );
      }

`;

const newContent = content.substring(0, startIndex) + replacement + content.substring(endIndex);
fs.writeFileSync(filePath, newContent, 'utf8');
console.log("Successfully replaced block!");
