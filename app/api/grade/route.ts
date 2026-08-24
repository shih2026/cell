import { GoogleGenAI } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";

const ai = new GoogleGenAI({ 
  apiKey: process.env.GEMINI_API_KEY || "",
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

export async function POST(req: NextRequest) {
  try {
    const { question, answer } = await req.json();

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ score: 85, feedback: "AI 評分目前處於預覽模式（未偵測到 API Key）。" });
    }
    
    const prompt = `
      你是一位國中生物老師。請針對以下題目以及學生的回答進行評分，範圍是 0 到 100 分。
      題目：${question}
      學生回答：${answer}
      
      請直接以 JSON 格式回傳，格式如下：
      {
        "score": 數字,
        "feedback": "簡短的鼓勵或建議"
      }
    `;

    const response = await ai.models.generateContent({
      model: "gemini-1.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json"
      }
    });

    const data = JSON.parse(response.text || "{}");

    return NextResponse.json(data);
  } catch (error) {
    console.error("AI Grading Error:", error);
    return NextResponse.json({ score: 0, feedback: "評分時發生錯誤，請稍後再試。" }, { status: 500 });
  }
}
