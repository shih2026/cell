// --- Types ---
export interface Question {
  id: string;
  question: string;
  options: string[];
  answer: string;
  explanation: string;
}

export interface TabContent {
  id: string;
  title: string;
  type: "learning" | "quiz" | "ai" | "game";
}

export type DropdownOption = {
  answer: string;
  options: string[];
};

