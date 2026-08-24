import type { Metadata } from 'next';
import { Inter, Space_Grotesk } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-display',
});

export const metadata: Metadata = {
  title: '細胞解密：生命中樞實驗室',
  description: '專為國中七年級設計的細胞自主學習網頁',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-TW" className={`${inter.variable} ${spaceGrotesk.variable}`}>
      <body className="bg-[#f2f7f5] text-[#475d5b] antialiased suppress-hydration-warning">
        <div className="flex flex-col min-h-screen max-w-[1024px] mx-auto shadow-xl ring-1 ring-black/5 bg-white sm:my-4 sm:rounded-3xl overflow-hidden transition-all">
          {children}
        </div>
      </body>
    </html>
  );
}
