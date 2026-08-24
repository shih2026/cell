"use client";

import Image from "next/image";


export default function CellImagePair({
  animalImg,
  plantImg,
  animalExists = true,
  plantExists = true,
}: {
  animalImg?: string;
  plantImg?: string;
  animalExists?: boolean;
  plantExists?: boolean;
}) {
  return (
    <div className="grid grid-cols-2 gap-8 mb-12">
      {/* Animal Section */}
      <div className="flex flex-col items-center">
        <div className="text-xl font-black mb-4 uppercase tracking-tighter italic text-brand-headline flex items-center gap-2">
          <span className="w-8 h-8 rounded-full bg-brand-headline text-white flex items-center justify-center text-xs not-italic">
            A
          </span>
          動物細胞
        </div>
        <div className="w-full aspect-[4/3] bg-white rounded-[2.5rem] border-4 border-brand-border shadow-[6px_6px_0px_#00332c] overflow-hidden flex items-center justify-center relative">
          {!animalExists ? (
            <div className="text-9xl font-black text-red-500 opacity-20 select-none">
              ✕
            </div>
          ) : animalImg ? (
            <div className="relative w-full h-full">
              <div className="absolute inset-0 p-6">
                <Image
                  src={`/images/${encodeURIComponent(animalImg || "")}`}
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
          <span className="w-8 h-8 rounded-full bg-green-900 text-white flex items-center justify-center text-xs not-italic">
            P
          </span>
          植物細胞
        </div>
        <div className="w-full aspect-[4/3] bg-white rounded-[2.5rem] border-4 border-green-600 shadow-[6px_6px_0px_#14532d] overflow-hidden flex items-center justify-center relative">
          {!plantExists ? (
            <div className="text-9xl font-black text-red-500 opacity-20 select-none">
              ✕
            </div>
          ) : plantImg ? (
            <div className="relative w-full h-full">
              <div className="absolute inset-0 p-6">
                <Image
                  src={`/images/${encodeURIComponent(plantImg || "")}`}
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
