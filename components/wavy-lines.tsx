"use client"

import { useHydrated } from "@/lib/use-hydrated"

export default function WavyLines() {
  const mounted = useHydrated()

  if (!mounted) return null

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none max-w-full">
      <svg
        className="absolute inset-0 w-full h-full text-blue-500/15 dark:text-blue-400/15"
        viewBox="0 0 1400 900"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <style>
            {`
              @keyframes wavyDraw {
                0% { stroke-dashoffset: 2000; }
                50% { stroke-dashoffset: 0; }
                100% { stroke-dashoffset: -2000; }
              }
              @keyframes wavyDrawReverse {
                0% { stroke-dashoffset: -2000; }
                50% { stroke-dashoffset: 0; }
                100% { stroke-dashoffset: 2000; }
              }
              .wavy-line {
                stroke-dasharray: 2000;
                will-change: stroke-dashoffset;
              }
              .wavy-line-1 { animation: wavyDraw 20s ease-in-out infinite; }
              .wavy-line-2 { animation: wavyDrawReverse 22s ease-in-out infinite; animation-delay: -2s; }
              .wavy-line-3 { animation: wavyDraw 24s ease-in-out infinite; animation-delay: -4s; }
              .wavy-line-4 { animation: wavyDrawReverse 26s ease-in-out infinite; animation-delay: -6s; }
              .wavy-line-5 { animation: wavyDraw 28s ease-in-out infinite; animation-delay: -8s; }
              .wavy-line-6 { animation: wavyDrawReverse 30s ease-in-out infinite; animation-delay: -10s; }
              .wavy-line-7 { animation: wavyDraw 25s ease-in-out infinite; animation-delay: -3s; }
              .wavy-line-8 { animation: wavyDrawReverse 27s ease-in-out infinite; animation-delay: -5s; }
              .wavy-line-9 { animation: wavyDraw 23s ease-in-out infinite; animation-delay: -7s; }
              .wavy-line-10 { animation: wavyDrawReverse 21s ease-in-out infinite; animation-delay: -9s; }
              @media (prefers-reduced-motion: reduce) {
                .wavy-line { animation: none !important; stroke-dasharray: none; }
              }
            `}
          </style>
        </defs>
        
        {/* Primary wavy lines - reduced from 40 to 10 */}
        <path
          className="wavy-line wavy-line-1"
          d="M-400,800 C200,600 400,700 600,500 C800,300 1000,400 1200,200 C1400,100 1500,50 1600,-50"
          stroke="currentColor"
          strokeWidth={3}
          fill="transparent"
          strokeLinecap="round"
          opacity={0.5}
        />
        <path
          className="wavy-line wavy-line-2"
          d="M-370,820 C225,585 420,675 630,480 C825,270 1020,385 1235,175 C1430,80 1525,40 1640,-65"
          stroke="currentColor"
          strokeWidth={2.8}
          fill="transparent"
          strokeLinecap="round"
          opacity={0.45}
        />
        <path
          className="wavy-line wavy-line-3"
          d="M-340,840 C250,570 440,650 660,460 C850,240 1040,370 1270,150 C1460,60 1550,30 1680,-80"
          stroke="currentColor"
          strokeWidth={2.6}
          fill="transparent"
          strokeLinecap="round"
          opacity={0.4}
        />
        <path
          className="wavy-line wavy-line-4"
          d="M-310,860 C275,555 460,625 690,440 C875,210 1060,355 1305,125 C1490,40 1575,20 1720,-95"
          stroke="currentColor"
          strokeWidth={2.4}
          fill="transparent"
          strokeLinecap="round"
          opacity={0.35}
        />
        <path
          className="wavy-line wavy-line-5"
          d="M-280,880 C300,540 480,600 720,420 C900,180 1080,340 1340,100 C1520,20 1600,10 1760,-110"
          stroke="currentColor"
          strokeWidth={2.2}
          fill="transparent"
          strokeLinecap="round"
          opacity={0.3}
        />
        
        {/* Diagonal accent lines */}
        <path
          className="wavy-line wavy-line-6"
          d="M-300,900 C300,700 500,500 700,300 C900,100 1100,200 1300,-100"
          stroke="currentColor"
          strokeWidth={2.5}
          fill="transparent"
          strokeLinecap="round"
          opacity={0.35}
        />
        <path
          className="wavy-line wavy-line-7"
          d="M-340,870 C260,720 460,520 660,320 C860,120 1060,180 1260,-80"
          stroke="currentColor"
          strokeWidth={2.3}
          fill="transparent"
          strokeLinecap="round"
          opacity={0.3}
        />
        <path
          className="wavy-line wavy-line-8"
          d="M-380,840 C220,740 420,540 620,340 C820,140 1020,160 1220,-60"
          stroke="currentColor"
          strokeWidth={2.1}
          fill="transparent"
          strokeLinecap="round"
          opacity={0.25}
        />
        <path
          className="wavy-line wavy-line-9"
          d="M-420,810 C180,760 380,560 580,360 C780,160 980,140 1180,-40"
          stroke="currentColor"
          strokeWidth={1.9}
          fill="transparent"
          strokeLinecap="round"
          opacity={0.2}
        />
        <path
          className="wavy-line wavy-line-10"
          d="M-460,780 C140,780 340,580 540,380 C740,180 940,120 1140,-20"
          stroke="currentColor"
          strokeWidth={1.7}
          fill="transparent"
          strokeLinecap="round"
          opacity={0.15}
        />
      </svg>
    </div>
  )
}
