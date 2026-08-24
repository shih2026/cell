"use client";

import React from "react";


export const Highlight = ({ children }: { children: React.ReactNode }) => (
  <span className="bg-[#faff00] px-2 py-0.5 rounded-sm font-black text-brand-headline shadow-[2px_2px_0px_#00332c] mx-1">
    {children}
  </span>
);

export const Connect = ({ children }: { children: React.ReactNode }) => (
  <span className="border-2 border-brand-border/30 rounded-full px-3 py-1 mx-1 inline-block text-brand-headline font-black text-base md:text-lg bg-white/50">
    {children}
  </span>
);

