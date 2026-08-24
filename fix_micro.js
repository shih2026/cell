const fs = require('fs');
const path = require('path');

const filePath = path.resolve('app/page.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// We will insert MicroscopeKnob before P10CellLab
const knobCode = `
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
    const dy = startY.current - e.clientY; // drag up -> positive
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
          style={{ transform: \`translateY(\${(value % 20) - 10}px)\` }}
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

`;

if (!content.includes('function MicroscopeKnob')) {
  content = content.replace('function P10CellLab', knobCode + 'function P10CellLab');
}

// Replace micro case
const microStart = "case 'micro': {";
const microEnd = "case 'report': {";

const mStartIndex = content.indexOf(microStart);
const mEndIndex = content.indexOf(microEnd);

const microReplacement = `case 'micro': {
        const cDiff = Math.abs(50 - labState.coarse);
        const fDiff = Math.abs(70 - labState.fine);
        const focusOk = cDiff < 4 && fDiff < 6;
        
        const totalMag = labState.eyepiece * labState.objective;
        const magScale = totalMag / 100;

        let blurValue = 20; 
        if (cDiff < 25 && fDiff < 30) {
          blurValue = (cDiff * 0.4) + (fDiff * 0.2);
        }
        
        // Aperture affects blur slightly
        blurValue += Math.abs(50 - labState.aperture) * 0.05;
        if (blurValue > 20) blurValue = 20;
        if (focusOk) blurValue = Math.abs(50 - labState.aperture) * 0.05; // slight blur if aperture is off

        // Brightness calculation
        // Base brightness 1.0. 
        // Aperture: 0 to 100 -> -0.4 to +0.4
        // Magnification: 100 -> 0, 150 -> -0.2, 225 -> -0.4
        let brightness = 1.0 + ((labState.aperture - 50) / 100) * 0.8 - ((totalMag - 100) / 100) * 0.3;
        if (brightness < 0.2) brightness = 0.2;

        const sampleData = SAMPLES.find(s => s.id === selectedSample);
        const currentImg = (labState.stainApplied && sampleData?.stainedImg) ? sampleData.stainedImg : sampleData?.img;
        
        return (
          <div className="grid md:grid-cols-5 gap-8">
            <div className="md:col-span-3 space-y-6">
              <div className="relative aspect-square bg-[#0a0a0a] rounded-[4rem] border-[20px] border-brand-border overflow-hidden shadow-[inset_0_0_100px_rgba(0,0,0,1)] flex items-center justify-center">
                <div 
                  className="absolute inset-0 transition-all duration-300 pointer-events-none"
                  style={{ 
                    filter: \`blur(\${blurValue}px) contrast(1.1) brightness(\${brightness})\`,
                    transform: \`scale(\${magScale})\`,
                    opacity: blurValue > 18 ? 0.4 : 1
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
                   <div className="px-6 py-2 bg-white/10 backdrop-blur-md rounded-2xl text-sm font-black text-white italic border border-white/20 shadow-lg">
                     總倍率: {totalMag}X
                   </div>
                </div>
                
                {blurValue > 10 && (
                   <div className="absolute inset-0 flex flex-col items-center justify-center text-white/30 font-black text-2xl uppercase tracking-widest pointer-events-none gap-4">
                     <span className="animate-pulse">順時針轉動旋鈕</span>
                     <span className="animate-pulse opacity-50">提高載物台進行對焦</span>
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
                    <span className="text-xs font-black uppercase text-brand-paragraph">目鏡 (Eyepiece)</span>
                    <div className="flex flex-col gap-2">
                      <button 
                        onClick={() => setLabState(s => ({ ...s, eyepiece: 10 }))}
                        className={\`py-2 font-black rounded-xl border-4 transition-all \${labState.eyepiece === 10 ? 'bg-brand-headline text-white border-brand-border' : 'bg-gray-50 text-gray-400 border-gray-200'}\`}
                      >10X</button>
                      <button 
                        onClick={() => setLabState(s => ({ ...s, eyepiece: 15 }))}
                        className={\`py-2 font-black rounded-xl border-4 transition-all \${labState.eyepiece === 15 ? 'bg-brand-headline text-white border-brand-border' : 'bg-gray-50 text-gray-400 border-gray-200'}\`}
                      >15X</button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <span className="text-xs font-black uppercase text-brand-paragraph">物鏡 (Objective)</span>
                    <div className="flex flex-col gap-2">
                      <button 
                        onClick={() => setLabState(s => ({ ...s, objective: 10 }))}
                        className={\`py-2 font-black rounded-xl border-4 transition-all \${labState.objective === 10 ? 'bg-brand-headline text-white border-brand-border' : 'bg-gray-50 text-gray-400 border-gray-200'}\`}
                      >10X</button>
                      <button 
                        onClick={() => setLabState(s => ({ ...s, objective: 15 }))}
                        className={\`py-2 font-black rounded-xl border-4 transition-all \${labState.objective === 15 ? 'bg-brand-headline text-white border-brand-border' : 'bg-gray-50 text-gray-400 border-gray-200'}\`}
                      >15X</button>
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

`;

content = content.substring(0, mStartIndex) + microReplacement + content.substring(mEndIndex);

// Also need to update report view transform
content = content.replace(
  `transform: \`scale(\${labState.lens === 'high' ? 3.5 : 1.2})\`,`,
  `transform: \`scale(\${(labState.eyepiece * labState.objective) / 100 * 1.2})\`,`
);

fs.writeFileSync(filePath, content, 'utf8');
console.log('Micro case updated');
