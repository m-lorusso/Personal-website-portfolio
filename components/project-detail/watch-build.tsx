"use client"

import type React from "react"
import { useEffect, useRef, useState } from "react"
import dynamic from "next/dynamic"
import Link from "next/link"
import { RESUME_URL, SITE_NAME } from "@/lib/site"
import { useScrollLock } from "@/lib/use-scroll-lock"

// Real interactive 3D watch (three / r3f / drei). Client-only — the Canvas can't
// server-render — with a light placeholder that matches the viewer card.
const ProjectSixWatchViewer = dynamic(() => import("@/components/watch/ProjectSixWatchViewer"), {
  ssr: false,
  loading: () => (
    <div
      style={{
        height: "clamp(360px, 56vh, 560px)",
        borderRadius: 14,
        border: "1px solid rgba(0,0,0,0.1)",
        background: "linear-gradient(180deg,#f4f6f8,#e7eaed)",
      }}
    />
  ),
})

// ─────────────────────────────────────────────────────────────────────────────
// Custom Watch Build — project 6.
// Ported from a Claude Design export: a scroll-driven exploded-watch hero with a
// hover-highlight parts legend, plus bench-notes / parts / film sections.
// All styles are scoped under `.wb` and keyframes are prefixed `wb*` so nothing
// leaks into (or is clobbered by) the rest of the site (e.g. Tailwind's `spin`).
// ─────────────────────────────────────────────────────────────────────────────

const PARTS = [
  { n: "01", name: "Caseback", desc: "The steel back, sealed on once the movement is seated." },
  { n: "02", name: "Case", desc: "The polished steel body that holds everything together." },
  { n: "03", name: "Movement", desc: "The Seiko NH35A. Self-winding, no battery, the heart of it." },
  { n: "04", name: "Dial", desc: "The blue textured face the hands sweep across." },
  { n: "05", name: "Hands", desc: "Hour, minute and seconds, set on one at a time by hand." },
  { n: "06", name: "Crystal", desc: "The sapphire glass, pressed in as the final seal." },
]

// ── Interactive NH35 movement explorer ──────────────────────────────────────
// Clicking the movement in the exploded view opens a hands-on look at the Seiko
// NH35 calibre. The oscillating weight (rotor) is modelled as a real pendulum:
// bearing friction drags it along when you spin the watch, then gravity pulls it
// back down to rest — the same "gravity factor" that auto-winds the mainspring,
// echoing the first interactive figure on Bartosz Ciechanowski's watch article.

function gearPath(cx: number, cy: number, rOut: number, rIn: number, teeth: number) {
  const t = (Math.PI * 2) / teeth
  const p = (a: number, r: number) =>
    `${(cx + r * Math.cos(a)).toFixed(2)},${(cy + r * Math.sin(a)).toFixed(2)}`
  let d = ""
  for (let i = 0; i < teeth; i++) {
    const a = i * t
    d += (i === 0 ? "M" : "L") + p(a, rIn)
    d += "L" + p(a + t * 0.25, rOut) + "L" + p(a + t * 0.5, rOut) + "L" + p(a + t * 0.75, rIn)
  }
  return d + "Z"
}

function spiralPath(cx: number, cy: number, turns: number, r0: number, r1: number) {
  const steps = Math.round(turns * 30)
  let d = ""
  for (let i = 0; i <= steps; i++) {
    const f = i / steps
    const a = f * turns * Math.PI * 2
    const r = r0 + (r1 - r0) * f
    d += (i === 0 ? "M" : "L") + `${(cx + r * Math.cos(a)).toFixed(2)},${(cy + r * Math.sin(a)).toFixed(2)}`
  }
  return d
}

const BARREL = gearPath(148, 254, 50, 42, 42)
const CENTERW = gearPath(248, 232, 33, 26, 30)
const THIRDW = gearPath(240, 156, 22, 16, 22)
const ESCAPE = gearPath(190, 170, 16, 9, 15)
const HAIRSPRING = spiralPath(134, 128, 4.4, 4, 25)
// Bottom half-annulus rim = the heavy side of the rotor (points down at angle 0)
const ROTOR_RIM = "M60,200 A140,140 0 0 1 340,200 L304,200 A104,104 0 0 0 96,200 Z"
const MIN_TICKS = Array.from({ length: 60 }, (_, i) => i)
const HOUR_IDX = Array.from({ length: 12 }, (_, i) => i)

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');
.wb{margin:0;background:#0b0b0d;color:#e9e6df;font-family:'Helvetica Neue',Arial,sans-serif;min-height:100vh;--ink:#0b0b0d;--panel:#141417;--line:rgba(255,255,255,.09);--line2:rgba(255,255,255,.16);--tx:#e9e6df;--mut:#8c887f;--gold:#c4a368;--gold2:#e6cd95;--steel:#b3b6bd;-webkit-font-smoothing:antialiased;text-rendering:optimizeLegibility}
.wb *{box-sizing:border-box}
.wb .serif{font-family:'Cormorant Garamond',Georgia,serif}
.wb .mono{font-family:'JetBrains Mono',ui-monospace,monospace}
.wb .mut{color:var(--mut)}.wb .gold{color:var(--gold)}
.wb .wrap{max-width:1180px;margin:0 auto;padding:0 36px}
.wb .ey{font-family:'JetBrains Mono',monospace;font-size:11.5px;letter-spacing:.3em;text-transform:uppercase;color:var(--gold)}
.wb .h1{font-family:'Cormorant Garamond',Georgia,serif;font-weight:600;font-size:clamp(44px,7.4vw,92px);line-height:.96;letter-spacing:-.012em;margin:0}
.wb .h2{font-family:'Cormorant Garamond',Georgia,serif;font-weight:600;font-size:clamp(30px,4.4vw,50px);line-height:1.02;letter-spacing:-.01em;margin:0}
.wb .lead{font-size:17px;line-height:1.7;color:#c9c5bc;max-width:560px}
.wb .topbar{position:sticky;top:0;z-index:40;backdrop-filter:blur(14px);background:rgba(11,11,13,.72);border-bottom:1px solid var(--line)}
.wb .topin{height:62px;display:flex;align-items:center;justify-content:space-between}
.wb .tlink{font-family:'JetBrains Mono',monospace;font-size:12px;letter-spacing:.12em;color:var(--mut);text-decoration:none;text-transform:uppercase}
.wb .tlink:hover{color:var(--tx)}
.wb .secno{font-family:'JetBrains Mono',monospace;font-size:12px;letter-spacing:.22em;color:var(--gold);text-transform:uppercase}
.wb .rule{height:1px;background:var(--line);width:100%}
.wb .divlbl{display:flex;align-items:center;gap:18px;padding:0 0 30px}
.wb .divlbl .rule{flex:1}
.wb .hero{padding:78px 0 30px;position:relative}
.wb .stageglow{position:absolute;left:50%;top:50%;width:540px;height:540px;transform:translate(-50%,-50%);background:radial-gradient(circle,rgba(196,163,104,.22),rgba(196,163,104,0) 60%);pointer-events:none;filter:blur(10px)}
.wb .scrollscene{position:relative;height:113vh;margin:42px auto 0}
.wb .stagepin{position:sticky;top:0;height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:flex-end;padding-bottom:9vh}
.wb .scrollcue{position:absolute;bottom:6vh;left:50%;transform:translateX(-50%);display:flex;flex-direction:column;align-items:center;gap:6px;font-family:'JetBrains Mono',monospace;font-size:10.5px;letter-spacing:.22em;text-transform:uppercase;color:var(--mut);transition:opacity .3s}
.wb .cuearrow{font-size:14px;animation:wbcuebob 1.8s ease-in-out infinite}
@keyframes wbcuebob{0%,100%{transform:translateY(0);opacity:.5}50%{transform:translateY(5px);opacity:1}}
.wb .lug{position:absolute;width:38px;height:36px;background:linear-gradient(180deg,#e9ecf1,#9a9ea6 52%,#3a3c42);border-radius:11px;box-shadow:0 3px 8px rgba(0,0,0,.55),inset 0 1px 0 rgba(255,255,255,.45)}
.wb .ll1{left:71px;top:-14px;transform:rotate(-15deg)}
.wb .ll2{left:191px;top:-14px;transform:rotate(15deg)}
.wb .ll3{left:71px;bottom:-14px;transform:rotate(15deg)}
.wb .ll4{left:191px;bottom:-14px;transform:rotate(-15deg)}
.wb .crown{position:absolute;right:-15px;top:131px;width:18px;height:32px;border-radius:3px;background:repeating-linear-gradient(90deg,#d6dae1 0 2px,#878b93 2px 4px);box-shadow:0 2px 5px rgba(0,0,0,.55),inset 0 0 0 1px rgba(0,0,0,.25)}
.wb .grain{position:absolute;inset:0;border-radius:50%;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='90' height='90'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");background-size:90px 90px;mix-blend-mode:overlay;opacity:.13;pointer-events:none}
.wb .stage{position:relative;height:480px;display:flex;align-items:center;justify-content:center;perspective:900px;perspective-origin:50% 32%}
.wb .ground{position:absolute;left:50%;bottom:50px;width:360px;height:98px;transform:translateX(-50%);background:radial-gradient(ellipse at center,rgba(0,0,0,.74),rgba(0,0,0,0) 70%);filter:blur(9px)}
.wb .stack{position:relative;width:300px;height:300px;transform-style:preserve-3d;transform:rotateX(60deg) scale(calc(1 + .15 * var(--explode,0)));--explode:0}
.wb .spinner{position:absolute;inset:0;transform-style:preserve-3d;animation:wbhover 7s ease-in-out infinite}
.wb .stack.paused .spinner,.wb .stack.paused .rotor,.wb .stack.paused .shand{animation-play-state:paused}
.wb .stack[data-hl] .spinner,.wb .stack[data-hl] .rotor{animation-play-state:paused}
.wb .layer{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;transform:translateZ(calc(var(--order,0) * 62px * var(--explode,0)));transform-style:preserve-3d;transition:opacity .35s ease,filter .35s ease}
.wb .puck{position:relative;display:flex;align-items:center;justify-content:center;transform-style:preserve-3d}
.wb .disc{border-radius:50%;position:relative}
.wb .side{position:absolute;left:50%;top:50%;border-radius:50%;transform:translate(-50%,-50%) translateZ(-15px)}
.wb .L-back{--order:-2.5}.wb .L-case{--order:-1.35}.wb .L-move{--order:-.15}.wb .L-dial{--order:1}.wb .L-hands{--order:1.75}.wb .L-crystal{--order:2.9}
/* Case + strap (case ring, lugs, crown) start solid and fade out as the watch explodes */
.wb .L-case{opacity:calc(1 - var(--explode) / 0.55)}
.wb .s-back{width:256px;height:256px;background:linear-gradient(180deg,#c4c8cf,#7e828b 45%,#3a3c42 100%)}
.wb .s-case{width:306px;height:306px;background:linear-gradient(180deg,#dfe2e8,#9a9ea6 42%,#34363c 100%);transform:translate(-50%,-50%) translateZ(-24px)}
.wb .s-move{width:240px;height:240px;background:linear-gradient(180deg,#d6b478,#9c7434 58%,#5a4220 100%)}
.wb .s-dial{width:254px;height:254px;background:linear-gradient(180deg,#2a4870,#0c1d38 60%,#06122a 100%)}
.wb .s-crys{width:276px;height:276px;background:linear-gradient(180deg,rgba(205,225,255,.22),rgba(130,160,210,.1) 60%,rgba(70,100,150,.06) 100%);transform:translate(-50%,-50%) translateZ(-8px)}
.wb .d-back{width:252px;height:252px;background:radial-gradient(circle at 38% 30%,#d3d7de,#8d9098 52%,#46484e 100%);box-shadow:inset 0 0 0 5px rgba(255,255,255,.12),inset 0 0 26px rgba(0,0,0,.5)}
.wb .d-back .ring{position:absolute;inset:0;border-radius:50%;background:repeating-radial-gradient(circle,rgba(0,0,0,.06) 0 1px,transparent 1px 7px);mask:radial-gradient(circle,transparent 30%,#000 31%);-webkit-mask:radial-gradient(circle,transparent 30%,#000 31%)}
.wb .d-back .eng{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-family:'JetBrains Mono',monospace;font-size:8px;letter-spacing:.18em;color:rgba(30,30,34,.5)}
.wb .d-case{width:300px;height:300px;background:conic-gradient(from -48deg,#a9adb5,#f5f7fa 11%,#83878f 26%,#d0d4db 40%,#6b6f77 54%,#f0f2f6 72%,#90949d 86%,#dadee4);box-shadow:inset 0 0 0 2px rgba(255,255,255,.45),inset 0 0 30px rgba(0,0,0,.22),0 20px 48px rgba(0,0,0,.62)}
.wb .d-case .bezel{position:absolute;inset:14px;border-radius:50%;background:conic-gradient(from -48deg,#c2c6cd,#f8fafc 11%,#8d9199 30%,#e8ebf0 50%,#797d85 68%,#f1f3f7 86%,#b4b8c0);mask:radial-gradient(circle,transparent 0 79%,#000 81%);-webkit-mask:radial-gradient(circle,transparent 0 79%,#000 81%);box-shadow:inset 0 0 0 1px rgba(255,255,255,.4)}
.wb .d-case .bore{position:absolute;inset:30px;border-radius:50%;background:radial-gradient(circle at 50% 42%,#10182e,#070b18);box-shadow:inset 0 0 28px rgba(0,0,0,.85),inset 0 0 0 2px rgba(0,0,0,.55)}
.wb .d-move{width:236px;height:236px;background:radial-gradient(circle at 40% 34%,#cdb583,#a3884f 52%,#6f5630 100%);box-shadow:inset 0 0 0 3px rgba(0,0,0,.22),0 8px 22px rgba(0,0,0,.5);overflow:hidden}
.wb .d-move .perl{position:absolute;inset:0;border-radius:50%;background:repeating-radial-gradient(circle at 50% 50%,rgba(0,0,0,.12) 0 2px,rgba(255,255,255,.05) 2px 5px);opacity:.5}
.wb .rotor{position:absolute;left:50%;top:50%;width:206px;height:206px;transform:translate(-50%,-50%);border-radius:50%;background:conic-gradient(from 0deg,#5a4422 0 14deg,rgba(0,0,0,0) 14deg 166deg,#5a4422 166deg 180deg,rgba(0,0,0,0) 180deg);animation:wbspin 4.6s linear infinite}
.wb .rotor .weight{position:absolute;left:0;top:0;width:100%;height:50%;border-radius:206px 206px 0 0;background:linear-gradient(180deg,#3a2c14,#6b5126);box-shadow:inset 0 4px 10px rgba(0,0,0,.5)}
.wb .pivot{position:absolute;left:50%;top:50%;width:16px;height:16px;transform:translate(-50%,-50%);border-radius:50%;background:radial-gradient(circle,#2a2118,#0e0b07);box-shadow:0 0 0 3px rgba(0,0,0,.25)}
.wb .jewel{position:absolute;width:9px;height:9px;border-radius:50%;background:radial-gradient(circle at 35% 30%,#ff8d8d,#b3261f);box-shadow:0 0 6px rgba(220,40,40,.7)}
.wb .screw{position:absolute;width:8px;height:8px;border-radius:50%;background:radial-gradient(circle at 35% 30%,#cfd2d8,#5a5c61)}
.wb .d-dial{width:250px;height:250px;background:radial-gradient(circle at 50% 44%,#3f5f94 0%,#1d3458 52%,#0a1a36 88%);box-shadow:inset 0 0 30px rgba(0,0,0,.5),inset 0 2px 9px rgba(255,255,255,.14);overflow:hidden}
.wb .d-dial .sunray{position:absolute;inset:0;border-radius:50%;background:repeating-conic-gradient(from 0deg,rgba(255,255,255,.07) 0 .35deg,rgba(0,0,0,.06) .35deg .8deg,rgba(255,255,255,0) .8deg 1.5deg);opacity:.55;mix-blend-mode:soft-light}
.wb .d-dial .sheen{position:absolute;inset:0;border-radius:50%;background:conic-gradient(from 200deg,rgba(255,255,255,.22),rgba(255,255,255,0) 30%,rgba(255,255,255,.12) 62%,rgba(255,255,255,0) 92%);opacity:.6;mix-blend-mode:screen}
.wb .d-dial .mintrack{position:absolute;inset:0;border-radius:50%;background:repeating-conic-gradient(from -.5deg,rgba(220,228,240,.85) 0 1deg,transparent 1deg 6deg);mask:radial-gradient(circle,transparent 0 88%,#000 89% 95%,transparent 96%);-webkit-mask:radial-gradient(circle,transparent 0 88%,#000 89% 95%,transparent 96%)}
.wb .indices{position:absolute;inset:0;border-radius:50%;background:repeating-conic-gradient(from -2.6deg,#f1f5fc 0 5.2deg,transparent 5.2deg 30deg);mask:radial-gradient(circle,transparent 70%,#000 71% 86%,transparent 87%);-webkit-mask:radial-gradient(circle,transparent 70%,#000 71% 86%,transparent 87%);filter:drop-shadow(0 1px 1px rgba(0,0,0,.6))}
.wb .dlogo{position:absolute;left:50%;top:20%;transform:translateX(-50%);text-align:center;line-height:1.15}
.wb .dlogo b{display:block;font-family:'Cormorant Garamond',serif;font-size:13px;font-weight:700;letter-spacing:.04em;background:linear-gradient(180deg,#f0d49a,#b6883f);-webkit-background-clip:text;background-clip:text;color:transparent}
.wb .dlogo small{display:block;font-size:5px;letter-spacing:.22em;color:#d8b66a;margin-top:1.5px;font-weight:600}
.wb .dauto{position:absolute;left:50%;top:70%;transform:translateX(-50%);font-family:'JetBrains Mono',monospace;font-size:4.6px;letter-spacing:.1em;color:#cdb589;text-align:center;line-height:1.5}
.wb .date{position:absolute;right:11%;top:50%;transform:translateY(-50%);min-width:16px;height:14px;padding:0 2px;border-radius:1px;background:linear-gradient(180deg,#fbfcfe,#dfe3e9);color:#16203a;font-family:'JetBrains Mono',monospace;font-size:8px;font-weight:500;display:flex;align-items:center;justify-content:center;box-shadow:inset 0 0 0 1px rgba(0,0,0,.45),0 0 0 1px rgba(255,255,255,.15)}
.wb .d-hands{width:236px;height:236px}
.wb .hub{position:absolute;left:50%;top:50%;width:11px;height:11px;transform:translate(-50%,-50%);border-radius:50%;background:radial-gradient(circle at 40% 35%,#fafdff,#aeb6c4);z-index:6;box-shadow:0 0 4px rgba(0,0,0,.5)}
.wb .hand{position:absolute;left:50%;bottom:50%;transform-origin:50% 100%}
.wb .hr{width:9px;height:54px;margin-left:-4.5px;background:linear-gradient(90deg,#f6f9fe 0 47%,#a7afbd 53% 100%);clip-path:polygon(50% 0,100% 20%,60% 100%,40% 100%,0 20%);transform:rotate(310deg);box-shadow:0 0 2px rgba(0,0,0,.4)}
.wb .min{width:7px;height:84px;margin-left:-3.5px;background:linear-gradient(90deg,#f6f9fe 0 47%,#a7afbd 53% 100%);clip-path:polygon(50% 0,100% 14%,60% 100%,40% 100%,0 14%);transform:rotate(74deg);box-shadow:0 0 2px rgba(0,0,0,.4)}
.wb .shand{width:2.4px;height:106px;margin-left:-1.2px;background:linear-gradient(180deg,#f5dca0 0%,#cf9f50 68%,#a9803a 100%);transform:rotate(0deg);animation:wbsweep 60s steps(60) infinite;box-shadow:0 0 2px rgba(0,0,0,.35)}
.wb .shand::after{content:"";position:absolute;left:50%;bottom:-14px;width:6px;height:14px;margin-left:-3px;border-radius:3px;background:linear-gradient(180deg,#cf9f50,#a9803a)}
.wb .d-crystal{width:272px;height:272px;background:radial-gradient(circle at 36% 26%,rgba(222,236,255,.5),rgba(180,205,240,.08) 40%,rgba(120,150,200,.03) 70%,rgba(120,150,200,0) 100%);box-shadow:inset 0 0 0 1px rgba(255,255,255,.25),0 0 30px rgba(150,180,230,.06)}
.wb .d-crystal .glint{position:absolute;left:16%;top:13%;width:120px;height:38px;border-radius:50%;background:linear-gradient(120deg,rgba(255,255,255,.6),rgba(255,255,255,0));transform:rotate(-28deg);filter:blur(2px)}
.wb .stack[data-hl] .layer{opacity:.22}
.wb .stack[data-hl="0"] .L-back,.wb .stack[data-hl="1"] .L-case,.wb .stack[data-hl="2"] .L-move,.wb .stack[data-hl="3"] .L-dial,.wb .stack[data-hl="4"] .L-hands,.wb .stack[data-hl="5"] .L-crystal{opacity:1;filter:drop-shadow(0 0 16px rgba(196,163,104,.6))}
.wb .legend{display:grid;grid-template-columns:repeat(2,1fr);gap:0;border-top:1px solid var(--line);margin-top:20px}
.wb .lrow{display:flex;gap:16px;align-items:flex-start;padding:18px 22px;border-bottom:1px solid var(--line);cursor:default;transition:background .2s}
.wb .lrow:hover{background:rgba(196,163,104,.05)}
.wb .lrow .ln{font-family:'JetBrains Mono',monospace;font-size:12px;color:var(--gold);padding-top:2px}
.wb .lrow .lname{font-size:15px;font-weight:600;letter-spacing:.01em}
.wb .lrow .ldesc{font-size:13px;color:var(--mut);line-height:1.5;margin-top:3px}
.wb .sec{padding:96px 0}
.wb .partsgrid{display:grid;grid-template-columns:1.05fr .95fr;gap:56px;align-items:start}
.wb .benchgrid{grid-template-columns:.9fr 1.1fr;align-items:center}
.wb .photo{position:relative;border-radius:6px;overflow:hidden;border:1px solid var(--line);background:#111}
.wb .photo img{display:block;width:100%;height:100%;object-fit:cover}
.wb .photocap{position:absolute;left:16px;bottom:14px;font-family:'JetBrains Mono',monospace;font-size:10.5px;letter-spacing:.16em;text-transform:uppercase;color:rgba(255,255,255,.86);background:rgba(0,0,0,.4);backdrop-filter:blur(4px);padding:6px 11px;border-radius:4px}
.wb .notes{display:grid;grid-template-columns:repeat(3,1fr);gap:20px;margin-top:42px}
.wb .note{border:1px solid var(--line);border-radius:6px;padding:28px;background:linear-gradient(180deg,rgba(255,255,255,.025),rgba(255,255,255,0))}
.wb .note .nk{font-family:'JetBrains Mono',monospace;font-size:10.5px;letter-spacing:.2em;text-transform:uppercase;color:var(--gold)}
.wb .note .nh{font-family:'Cormorant Garamond',serif;font-size:25px;font-weight:600;margin:14px 0 10px}
.wb .note .np{font-size:14px;line-height:1.65;color:var(--mut)}
.wb .specchip{display:inline-flex;align-items:center;gap:12px;border:1px solid var(--line2);border-radius:999px;padding:11px 20px;font-family:'JetBrains Mono',monospace;font-size:12px;letter-spacing:.12em;color:var(--tx);margin-top:38px}
.wb .specchip .dot{width:7px;height:7px;border-radius:50%;background:#5fbf8a;box-shadow:0 0 8px rgba(95,191,138,.7)}
.wb .film{position:relative;border-radius:8px;overflow:hidden;border:1px solid var(--line);background:#000;aspect-ratio:16/9;margin-top:42px}
.wb .film iframe{position:absolute;inset:0;width:100%;height:100%;border:0}
.wb .foot{display:grid;grid-template-columns:1fr 1fr;gap:1px;border-top:1px solid var(--line);margin-top:90px}
.wb .fcol{padding:46px 36px}
.wb .fcol.r{text-align:right;border-left:1px solid var(--line)}
.wb .fcol a{text-decoration:none;color:inherit;display:block}
.wb .fk{font-family:'JetBrains Mono',monospace;font-size:11px;letter-spacing:.18em;text-transform:uppercase;color:var(--mut)}
.wb .fn{font-family:'Cormorant Garamond',serif;font-size:26px;font-weight:600;margin-top:10px;color:var(--tx)}
.wb .fcol a:hover .fn{color:var(--gold)}
.wb .endbar{padding:30px 0 50px;display:flex;justify-content:space-between;align-items:center;color:var(--mut);font-family:'JetBrains Mono',monospace;font-size:11px;letter-spacing:.14em;text-transform:uppercase}
@keyframes wbspin{to{transform:translate(-50%,-50%) rotate(360deg)}}
@keyframes wbsweep{to{transform:rotate(360deg)}}
@keyframes wbhover{0%,100%{transform:translateZ(-7px)}50%{transform:translateZ(12px)}}
/* ── Movement explorer (gravity rotor) ── */
.wb .L-move .puck,.wb .lrow.clickable{cursor:pointer}
.wb .lrow.clickable:hover{background:rgba(196,163,104,.08)}
.wb .ltag{display:inline-block;margin-top:6px;font-family:'JetBrains Mono',monospace;font-size:10px;letter-spacing:.14em;text-transform:uppercase;color:var(--gold)}
.wb .explorebtn{display:inline-flex;align-items:center;gap:10px;margin-top:30px;padding:13px 22px;border-radius:999px;border:1px solid var(--line2);background:linear-gradient(180deg,rgba(196,163,104,.16),rgba(196,163,104,.04));color:var(--gold2);font-family:'JetBrains Mono',monospace;font-size:12px;letter-spacing:.12em;text-transform:uppercase;cursor:pointer;transition:border-color .2s,transform .2s}
.wb .explorebtn:hover{border-color:var(--gold);transform:translateY(-1px)}
.wb .explorebtn .pulse{width:8px;height:8px;border-radius:50%;background:var(--gold);box-shadow:0 0 0 0 rgba(196,163,104,.6);animation:wbpulse 2s infinite}
@keyframes wbpulse{0%{box-shadow:0 0 0 0 rgba(196,163,104,.55)}70%{box-shadow:0 0 0 9px rgba(196,163,104,0)}100%{box-shadow:0 0 0 0 rgba(196,163,104,0)}}
.wb .ovl{position:fixed;inset:0;z-index:60;background:rgba(6,6,8,.88);backdrop-filter:blur(7px);display:flex;align-items:center;justify-content:center;padding:24px;animation:wbfade .25s ease}
@keyframes wbfade{from{opacity:0}to{opacity:1}}
.wb .ovlcard{position:relative;width:min(640px,100%);max-height:94vh;overflow:auto;border-radius:16px;border:1px solid var(--line2);background:radial-gradient(120% 80% at 50% -10%,rgba(196,163,104,.1),transparent 60%),linear-gradient(180deg,#161618,#0c0c0f);box-shadow:0 30px 90px rgba(0,0,0,.65);padding:24px 24px 20px}
.wb .ovlhead{display:flex;align-items:baseline;justify-content:space-between;gap:14px}
.wb .ovlk{font-family:'JetBrains Mono',monospace;font-size:11px;letter-spacing:.24em;text-transform:uppercase;color:var(--gold)}
.wb .ovlt{font-family:'Cormorant Garamond',serif;font-size:30px;font-weight:600;margin:2px 0 0;line-height:1}
.wb .ovlclose{position:absolute;right:14px;top:13px;width:34px;height:34px;border-radius:50%;border:1px solid var(--line2);background:rgba(255,255,255,.04);color:var(--mut);font-size:17px;line-height:1;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:color .2s,border-color .2s}
.wb .ovlclose:hover{color:var(--tx);border-color:var(--gold)}
.wb .mvstage{position:relative;width:100%;max-width:430px;aspect-ratio:1/1;margin:14px auto 0;touch-action:none;cursor:grab;perspective:1100px}
.wb .mvstage:active{cursor:grabbing}
.wb .mvflip{position:relative;width:100%;height:100%;transform-style:preserve-3d;transition:transform .75s cubic-bezier(.66,.02,.3,1)}
.wb .mvflip[data-side="dial"]{transform:rotateY(180deg)}
.wb .mvface{position:absolute;inset:0;backface-visibility:hidden;-webkit-backface-visibility:hidden}
.wb .mvface svg{width:100%;height:100%;display:block;overflow:visible}
.wb .mvface.back{transform:rotateY(180deg)}
.wb .mvctrls{display:flex;gap:10px;justify-content:center;margin-top:6px}
.wb .mvbtn{padding:9px 16px;border-radius:999px;border:1px solid var(--line2);background:rgba(255,255,255,.03);color:var(--tx);font-family:'JetBrains Mono',monospace;font-size:11px;letter-spacing:.08em;text-transform:uppercase;cursor:pointer;transition:border-color .2s,color .2s}
.wb .mvbtn:hover{border-color:var(--gold)}
.wb .mvbtn.on{border-color:var(--gold);color:var(--gold2);background:rgba(196,163,104,.08)}
.wb .mvhint{text-align:center;color:var(--mut);font-size:12.5px;margin-top:14px;line-height:1.55;max-width:460px;margin-left:auto;margin-right:auto}
.wb .mvhint b{color:var(--gold2);font-weight:500}
@media(max-width:860px){.wb .wrap{padding:0 22px}.wb .h1{font-size:clamp(33px,8.6vw,52px)}.wb .lead{font-size:15.5px}.wb .partsgrid{grid-template-columns:1fr;gap:34px}.wb .legend{grid-template-columns:1fr}.wb .notes{grid-template-columns:1fr}.wb .foot{grid-template-columns:1fr}.wb .fcol{padding:34px 22px}.wb .fcol.r{text-align:left;border-left:none;border-top:1px solid var(--line)}.wb .tlink-mid{display:none}.wb .stageglow{width:340px;height:340px}.wb .scrollscene{height:116vh}.wb .stack{transform:rotateX(58deg) scale(calc(.78 + .13 * var(--explode,0)))}.wb .ovlt{font-size:25px}}
`

function NH35Explorer({ onClose }: { onClose: () => void }) {
  const [side, setSide] = useState<"move" | "dial">("move")
  const stageRef = useRef<HTMLDivElement>(null)
  const watchRef = useRef<SVGGElement>(null)
  const rotorRef = useRef<SVGGElement>(null)
  const balanceRef = useRef<SVGGElement>(null)
  const palletRef = useRef<SVGGElement>(null)
  const barrelRef = useRef<SVGGElement>(null)
  const centerWRef = useRef<SVGGElement>(null)
  const thirdWRef = useRef<SVGGElement>(null)
  const escapeRef = useRef<SVGGElement>(null)
  const secRef = useRef<SVGGElement>(null)
  const minRef = useRef<SVGGElement>(null)
  const hrRef = useRef<SVGGElement>(null)

  // Physics state lives in a ref so the animation loop never triggers a re-render.
  const sim = useRef({
    theta: 0, // watch rotation (rad)
    thetaVel: 0, // watch angular velocity (rad/s)
    phi: 0, // rotor absolute angle (rad), 0 = heavy side pointing down
    omega: 0, // rotor angular velocity (rad/s)
    dragging: false,
    interacted: false,
    pointerAngle: 0,
    lastMove: 0,
  })
  const sideRef = useRef(side)
  sideRef.current = side

  useEffect(() => {
    let raf = 0
    let last = performance.now()
    const start = last
    const loop = (now: number) => {
      const s = sim.current
      let dt = (now - last) / 1000
      last = now
      if (dt > 0.05) dt = 0.05 // clamp after tab switches
      const t = (now - start) / 1000

      // Watch rotation: idle gentle rock until the user grabs it, then inertial spin-down.
      if (!s.dragging) {
        if (!s.interacted) {
          const target = 0.4 * Math.sin(t * 1.15)
          s.thetaVel = (target - s.theta) / dt
          s.theta = target
        } else {
          s.theta += s.thetaVel * dt
          s.thetaVel *= Math.pow(0.92, dt * 60)
        }
      }

      // Rotor as a pendulum: gravity restores it to "down", bearing friction drags
      // it toward the watch's spin, plus a little self-damping.
      const aGrav = -30 * Math.sin(s.phi)
      const aFric = 7.5 * (s.thetaVel - s.omega)
      s.omega += (aGrav + aFric - 0.9 * s.omega) * dt
      s.phi += s.omega * dt

      const deg = (r: number) => (r * 180) / Math.PI
      if (watchRef.current) watchRef.current.setAttribute("transform", `rotate(${deg(s.theta).toFixed(2)} 200 200)`)
      if (rotorRef.current) rotorRef.current.setAttribute("transform", `rotate(${deg(s.phi).toFixed(2)} 200 200)`)

      // Mechanical heartbeat — the balance buzzes, the pallet fork tocks, gears turn.
      const beat = Math.sin(t * 2 * Math.PI * 3) // NH35 = 21,600 bph ≈ 3 Hz
      if (balanceRef.current) balanceRef.current.setAttribute("transform", `rotate(${(beat * 135).toFixed(1)} 134 128)`)
      if (palletRef.current) palletRef.current.setAttribute("transform", `rotate(${(beat * 8).toFixed(1)} 172 152)`)
      if (barrelRef.current) barrelRef.current.setAttribute("transform", `rotate(${(t * 7).toFixed(1)} 148 254)`)
      if (centerWRef.current) centerWRef.current.setAttribute("transform", `rotate(${(-t * 12).toFixed(1)} 248 232)`)
      if (thirdWRef.current) thirdWRef.current.setAttribute("transform", `rotate(${(t * 22).toFixed(1)} 240 156)`)
      if (escapeRef.current) escapeRef.current.setAttribute("transform", `rotate(${(-t * 46).toFixed(1)} 190 170)`)

      // Dial hands track real time (seconds sweep with a mechanical-style beat).
      const d = new Date()
      const ms = d.getMilliseconds() / 1000
      const secBeat = (Math.floor((d.getSeconds() + ms) * 6) / 6) * 6
      if (secRef.current) secRef.current.setAttribute("transform", `rotate(${secBeat.toFixed(2)} 200 200)`)
      if (minRef.current) minRef.current.setAttribute("transform", `rotate(${((d.getMinutes() + d.getSeconds() / 60) * 6).toFixed(2)} 200 200)`)
      if (hrRef.current) hrRef.current.setAttribute("transform", `rotate(${(((d.getHours() % 12) + d.getMinutes() / 60) * 30).toFixed(2)} 200 200)`)

      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [])

  // Close on Escape.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [onClose])

  // The explorer is mounted only while open, so lock page scroll for its lifetime.
  useScrollLock(true)

  const pointerAngle = (e: React.PointerEvent) => {
    const el = stageRef.current
    if (!el) return 0
    const r = el.getBoundingClientRect()
    return Math.atan2(e.clientY - (r.top + r.height / 2), e.clientX - (r.left + r.width / 2))
  }
  const onDown = (e: React.PointerEvent) => {
    if (sideRef.current !== "move") return
    const s = sim.current
    s.dragging = true
    s.interacted = true
    s.pointerAngle = pointerAngle(e)
    s.lastMove = performance.now()
    s.thetaVel = 0
    ;(e.target as Element).setPointerCapture?.(e.pointerId)
  }
  const onMove = (e: React.PointerEvent) => {
    const s = sim.current
    if (!s.dragging) return
    const a = pointerAngle(e)
    let da = a - s.pointerAngle
    while (da > Math.PI) da -= Math.PI * 2
    while (da < -Math.PI) da += Math.PI * 2
    const now = performance.now()
    const dt = Math.max(0.001, (now - s.lastMove) / 1000)
    s.theta += da
    s.thetaVel = da / dt
    s.pointerAngle = a
    s.lastMove = now
  }
  const onUp = () => {
    sim.current.dragging = false
  }

  return (
    <div className="ovl" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className="ovlcard" role="dialog" aria-modal="true" aria-label="Seiko NH35 movement explorer">
        <button className="ovlclose" onClick={onClose} aria-label="Close">✕</button>
        <div className="ovlhead">
          <div>
            <div className="ovlk">Calibre · Seiko NH35</div>
            <h3 className="ovlt">The movement, running.</h3>
          </div>
        </div>

        <div
          className="mvstage"
          ref={stageRef}
          onPointerDown={onDown}
          onPointerMove={onMove}
          onPointerUp={onUp}
          onPointerCancel={onUp}
        >
          <div className="mvflip" data-side={side}>
            {/* ── Movement (back) ── */}
            <div className="mvface front">
              <svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <radialGradient id="nhPlate" cx="42%" cy="34%" r="75%">
                    <stop offset="0%" stopColor="#cfd3d9" />
                    <stop offset="55%" stopColor="#9aa0a8" />
                    <stop offset="100%" stopColor="#5d626a" />
                  </radialGradient>
                  <linearGradient id="nhRotor" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#eef1f5" />
                    <stop offset="45%" stopColor="#b9bfc7" />
                    <stop offset="100%" stopColor="#54585f" />
                  </linearGradient>
                  <radialGradient id="nhGear" cx="40%" cy="35%" r="70%">
                    <stop offset="0%" stopColor="#e7c984" />
                    <stop offset="60%" stopColor="#b8923f" />
                    <stop offset="100%" stopColor="#7e6228" />
                  </radialGradient>
                  <radialGradient id="nhJewel" cx="38%" cy="32%" r="70%">
                    <stop offset="0%" stopColor="#ff9c9c" />
                    <stop offset="100%" stopColor="#a81f1a" />
                  </radialGradient>
                  <radialGradient id="nhBal" cx="40%" cy="35%" r="70%">
                    <stop offset="0%" stopColor="#b6a4ff" />
                    <stop offset="60%" stopColor="#7b5cf0" />
                    <stop offset="100%" stopColor="#4a32a8" />
                  </radialGradient>
                </defs>

                <g ref={watchRef}>
                  {/* Caseback ring + main plate */}
                  <circle cx="200" cy="200" r="156" fill="#2b2d31" />
                  <circle cx="200" cy="200" r="150" fill="url(#nhPlate)" stroke="#3c3f45" strokeWidth="2" />
                  <circle cx="200" cy="200" r="150" fill="none" stroke="rgba(255,255,255,.18)" strokeWidth="1" />

                  {/* Gear train */}
                  <g ref={barrelRef}>
                    <path d={BARREL} fill="url(#nhGear)" stroke="#5a4422" strokeWidth="1" />
                    <circle cx="148" cy="254" r="30" fill="#a98a44" stroke="#6b521f" strokeWidth="1.5" />
                    <circle cx="148" cy="254" r="6" fill="#3a2c14" />
                  </g>
                  <g ref={centerWRef}>
                    <path d={CENTERW} fill="url(#nhGear)" stroke="#5a4422" strokeWidth="1" />
                    <circle cx="248" cy="232" r="18" fill="#b8933f" stroke="#6b521f" strokeWidth="1" />
                  </g>
                  <g ref={thirdWRef}>
                    <path d={THIRDW} fill="url(#nhGear)" stroke="#5a4422" strokeWidth="1" />
                    <circle cx="240" cy="156" r="11" fill="#b8933f" stroke="#6b521f" strokeWidth="1" />
                  </g>

                  {/* Escapement: escape wheel + pallet fork */}
                  <g ref={escapeRef}>
                    <path d={ESCAPE} fill="#d7dbe1" stroke="#71757c" strokeWidth="1" />
                    <circle cx="190" cy="170" r="4.5" fill="#7c8089" />
                  </g>
                  <g ref={palletRef}>
                    <path d="M172,118 L177,150 L168,176 L176,176 L184,150 L179,118 Z" fill="#c3c7cd" stroke="#777b82" strokeWidth="1" />
                    <circle cx="172" cy="152" r="4" fill="url(#nhJewel)" />
                  </g>

                  {/* Balance bridge + jewel */}
                  <path d="M96,118 Q134,86 172,118 L168,134 Q134,108 100,134 Z" fill="#b7bcc4" stroke="#777b82" strokeWidth="1" opacity="0.92" />
                  {/* Balance wheel (oscillating) with hairspring */}
                  <g ref={balanceRef}>
                    <path d={HAIRSPRING} fill="none" stroke="#d9b25f" strokeWidth="1" opacity="0.85" />
                    <circle cx="134" cy="128" r="38" fill="none" stroke="url(#nhBal)" strokeWidth="9" />
                    <rect x="131" y="90" width="6" height="76" rx="3" fill="#6a4fd0" />
                    <rect x="96" y="125" width="76" height="6" rx="3" fill="#6a4fd0" transform="rotate(60 134 128)" />
                    <rect x="96" y="125" width="76" height="6" rx="3" fill="#6a4fd0" transform="rotate(-60 134 128)" />
                    <circle cx="134" cy="128" r="7" fill="url(#nhJewel)" />
                  </g>

                  {/* Decorative jewels + screws */}
                  <circle cx="262" cy="120" r="5" fill="url(#nhJewel)" />
                  <circle cx="288" cy="248" r="5" fill="url(#nhJewel)" />
                  <circle cx="206" cy="296" r="5" fill="url(#nhJewel)" />
                  <circle cx="300" cy="180" r="5.5" fill="#cfd3d9" stroke="#71757c" strokeWidth="1" />
                  <path d="M296,180 h8 M300,176 v8" stroke="#5d626a" strokeWidth="1.2" />
                  <circle cx="118" cy="262" r="5.5" fill="#cfd3d9" stroke="#71757c" strokeWidth="1" />
                  <path d="M114,262 h8 M118,258 v8" stroke="#5d626a" strokeWidth="1.2" />

                  {/* Crown + stem at 3 o'clock */}
                  <rect x="348" y="194" width="22" height="12" rx="2" fill="#9aa0a8" stroke="#5d626a" strokeWidth="1" />
                  <rect x="366" y="186" width="16" height="28" rx="3" fill="#c2c6cd" stroke="#5d626a" strokeWidth="1" />
                  <path d="M368,189 v22 M372,188 v24 M376,188 v24 M380,189 v22" stroke="#73777e" strokeWidth="1.4" />

                  {/* Engraving */}
                  <text x="200" y="150" textAnchor="middle" fontFamily="monospace" fontSize="9" letterSpacing="1.5" fill="rgba(40,42,46,.55)">SEIKO NH35A</text>
                </g>

                {/* Rotor — drawn in world frame, only rotates by gravity (phi) */}
                <g ref={rotorRef}>
                  <path d={ROTOR_RIM} fill="url(#nhRotor)" stroke="#3c3f45" strokeWidth="1.5" />
                  <line x1="200" y1="200" x2="200" y2="302" stroke="#9aa0a8" strokeWidth="7" strokeLinecap="round" />
                  <line x1="200" y1="200" x2="260" y2="284" stroke="#9aa0a8" strokeWidth="6" strokeLinecap="round" />
                  <line x1="200" y1="200" x2="140" y2="284" stroke="#9aa0a8" strokeWidth="6" strokeLinecap="round" />
                  <text x="200" y="276" textAnchor="middle" fontFamily="monospace" fontSize="11" letterSpacing="2" fill="rgba(40,42,46,.6)">NH35</text>
                  <circle cx="200" cy="200" r="17" fill="#b9bfc7" stroke="#5d626a" strokeWidth="1.5" />
                  <circle cx="200" cy="200" r="6" fill="url(#nhJewel)" />
                </g>
              </svg>
            </div>

            {/* ── Dial (front) ── */}
            <div className="mvface back">
              <svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <radialGradient id="nhDial" cx="50%" cy="42%" r="62%">
                    <stop offset="0%" stopColor="#f4f5f7" />
                    <stop offset="70%" stopColor="#e3e5e9" />
                    <stop offset="100%" stopColor="#c7cace" />
                  </radialGradient>
                  <linearGradient id="nhCase2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#e9ecf1" />
                    <stop offset="50%" stopColor="#a7abb3" />
                    <stop offset="100%" stopColor="#5d626a" />
                  </linearGradient>
                </defs>
                {/* Crown */}
                <rect x="348" y="194" width="22" height="12" rx="2" fill="#9aa0a8" stroke="#5d626a" strokeWidth="1" />
                <rect x="366" y="186" width="16" height="28" rx="3" fill="#c2c6cd" stroke="#5d626a" strokeWidth="1" />
                {/* Case + dial */}
                <circle cx="200" cy="200" r="158" fill="url(#nhCase2)" stroke="#3c3f45" strokeWidth="2" />
                <circle cx="200" cy="200" r="146" fill="url(#nhDial)" stroke="#b4b8be" strokeWidth="2" />
                {/* Minute + hour ticks */}
                {MIN_TICKS.map((i) => {
                  const a = (i * 6 * Math.PI) / 180
                  const isH = i % 5 === 0
                  const r1 = 134
                  const r2 = isH ? 120 : 128
                  return (
                    <line
                      key={i}
                      x1={(200 + r1 * Math.sin(a)).toFixed(2)}
                      y1={(200 - r1 * Math.cos(a)).toFixed(2)}
                      x2={(200 + r2 * Math.sin(a)).toFixed(2)}
                      y2={(200 - r2 * Math.cos(a)).toFixed(2)}
                      stroke={isH ? "#1c2230" : "#5c616b"}
                      strokeWidth={isH ? 4 : 1.6}
                      strokeLinecap="round"
                    />
                  )
                })}
                {/* Hour pip markers */}
                {HOUR_IDX.map((i) => {
                  if (i === 3) return null
                  const a = (i * 30 * Math.PI) / 180
                  return (
                    <circle
                      key={i}
                      cx={(200 + 104 * Math.sin(a)).toFixed(2)}
                      cy={(200 - 104 * Math.cos(a)).toFixed(2)}
                      r="6"
                      fill="#11151d"
                    />
                  )
                })}
                {/* Branding */}
                <text x="200" y="120" textAnchor="middle" fontFamily="'Cormorant Garamond',serif" fontSize="18" fontWeight="600" letterSpacing="3" fill="#1c2230">SEIKO</text>
                <text x="200" y="286" textAnchor="middle" fontFamily="monospace" fontSize="8" letterSpacing="2" fill="#3a4150">NH35 · AUTOMATIC</text>
                <text x="200" y="298" textAnchor="middle" fontFamily="monospace" fontSize="7" letterSpacing="2" fill="#5c616b">24 JEWELS</text>
                {/* Date window at 3 o'clock */}
                <rect x="286" y="190" width="26" height="20" rx="2" fill="#fff" stroke="#1c2230" strokeWidth="1.5" />
                <text x="299" y="205" textAnchor="middle" fontFamily="monospace" fontSize="13" fontWeight="600" fill="#11151d">27</text>
                {/* Hands */}
                <g ref={hrRef}>
                  <rect x="195.5" y="118" width="9" height="92" rx="4" fill="#1c2230" />
                </g>
                <g ref={minRef}>
                  <rect x="197" y="74" width="6" height="136" rx="3" fill="#1c2230" />
                </g>
                <g ref={secRef}>
                  <rect x="198.6" y="64" width="2.8" height="158" rx="1.4" fill="#0f7d63" />
                  <circle cx="200" cy="200" r="6" fill="#0f7d63" />
                </g>
                <circle cx="200" cy="200" r="5" fill="#11151d" />
              </svg>
            </div>
          </div>
        </div>

        <div className="mvctrls">
          <button className={`mvbtn${side === "move" ? " on" : ""}`} onClick={() => setSide("move")}>Movement</button>
          <button className={`mvbtn${side === "dial" ? " on" : ""}`} onClick={() => setSide("dial")}>Dial</button>
        </div>

        <p className="mvhint">
          {side === "move" ? (
            <>
              <b>Drag to spin the watch.</b> The oscillating weight stays pointing down under
              gravity, exactly how it harvests motion to wind the mainspring. Let go and watch it settle.
            </>
          ) : (
            <>The dial side, keeping live time. Flip back to <b>Movement</b> to play with the rotor.</>
          )}
        </p>
      </div>
    </div>
  )
}

export default function WatchBuild() {
  const sceneRef = useRef<HTMLDivElement>(null)
  const stackRef = useRef<HTMLDivElement>(null)
  const cueRef = useRef<HTMLDivElement>(null)
  const [explorerOpen, setExplorerOpen] = useState(false)

  // Scroll-drives the exploded view: 0 = assembled, 1 = fully exploded.
  useEffect(() => {
    let queued = false
    const tick = () => {
      queued = false
      const scene = sceneRef.current
      if (!scene) return
      const r = scene.getBoundingClientRect()
      const denom = r.height - window.innerHeight
      let p = denom > 0 ? -r.top / denom : 0
      p = Math.max(0, Math.min(1, p / 0.85))
      if (stackRef.current) stackRef.current.style.setProperty("--explode", p.toFixed(3))
      if (cueRef.current) cueRef.current.style.opacity = Math.max(0, 1 - p * 5).toFixed(2)
    }
    const onScroll = () => {
      if (!queued) {
        queued = true
        requestAnimationFrame(tick)
      }
    }
    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", onScroll)
    tick()
    return () => {
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", onScroll)
    }
  }, [])

  const enter = (i: number) => () => {
    if (stackRef.current) stackRef.current.dataset.hl = String(i)
  }
  const leave = () => {
    if (stackRef.current) stackRef.current.removeAttribute("data-hl")
  }

  return (
    <div className="wb">
      <style dangerouslySetInnerHTML={{ __html: CSS }} />

      <div className="topbar">
        <div className="wrap topin">
          <Link className="tlink" href="/#projects">← Projects</Link>
          <div className="tlink tlink-mid" style={{ color: "var(--gold)" }}>VI · Custom Watch Build</div>
          <a className="tlink" href={RESUME_URL} target="_blank" rel="noopener noreferrer">Resume</a>
        </div>
      </div>

      <section className="sec" style={{ paddingTop: 74 }}>
        <div className="wrap">
          <div className="divlbl"><span className="secno">I</span><div className="rule" /><span className="secno">Bench notes</span></div>
          <div className="partsgrid benchgrid">
            <div className="photo" style={{ aspectRatio: "1/1" }}>
              <img src="/images/watch/cover.png" alt="Custom watch, crystal, dial and hands" />
              <div className="photocap">Crystal · dial · hands</div>
            </div>
            <div>
              <h2 className="h2">Small tolerances<br />reward slow hands.</h2>
              <div className="notes" style={{ gridTemplateColumns: "1fr", gap: 14, marginTop: 30 }}>
                <div className="note"><div className="nk">Challenge</div><div className="nh">Sourcing</div><div className="np">Verifying every part against the real NH35 footprint before it shipped, not the marketing copy.</div></div>
                <div className="note"><div className="nk">Challenge</div><div className="nh">Hand setting</div><div className="np">Press too hard and you scratch the dial; too soft and the hand slips at six.</div></div>
                <div className="note"><div className="nk">Learnt</div><div className="nh">Patience pays</div><div className="np">Rushing always meant starting over. Slow, deliberate hands every time.</div></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="hero">
        <div className="wrap" style={{ position: "relative" }}>
          <div className="ey">Custom Build · Seiko NH35A</div>
          <h1 className="h1" style={{ marginTop: 22 }}>A mechanical watch,<br />assembled by hand.</h1>
          <p className="lead" style={{ marginTop: 24 }}>Seven parts, sourced separately and checked one at a time, then built up around a single Seiko NH35A movement. Hover a part to highlight it, and scroll to take the watch from fully assembled to exploded.</p>
          <button className="explorebtn" onClick={() => setExplorerOpen(true)}>
            <span className="pulse" />Select the movement, see it run
          </button>

          <div className="scrollscene" ref={sceneRef}>
            <div className="stagepin">
              <div className="stage">
                <div className="stageglow" />
                <div className="ground" />
                <div className="stack" ref={stackRef}>
                  <div className="spinner">
                    <div className="layer L-back"><div className="puck"><div className="side s-back" /><div className="disc d-back"><div className="grain" /><div className="ring" /><div className="eng">NH35A · ML · SYD</div></div></div></div>
                    <div className="layer L-case"><div className="puck"><div className="side s-case" /><div className="lug ll1" /><div className="lug ll2" /><div className="lug ll3" /><div className="lug ll4" /><div className="crown" /><div className="disc d-case"><div className="grain" /><div className="bezel" /><div className="bore" /></div></div></div>
                    <div className="layer L-move"><div className="puck" role="button" tabIndex={0} title="Explore the NH35 movement" onClick={() => setExplorerOpen(true)} onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && setExplorerOpen(true)}><div className="side s-move" /><div className="disc d-move"><div className="grain" /><div className="perl" /><div className="rotor"><div className="weight" /></div><div className="jewel" style={{ left: "50%", top: "16%", marginLeft: -4 }} /><div className="jewel" style={{ left: "78%", top: "54%" }} /><div className="jewel" style={{ left: "20%", top: "60%" }} /><div className="screw" style={{ left: "50%", top: "80%", marginLeft: -4 }} /><div className="screw" style={{ left: "30%", top: "28%" }} /><div className="pivot" /></div></div></div>
                    <div className="layer L-dial"><div className="puck"><div className="side s-dial" /><div className="disc d-dial"><div className="sunray" /><div className="grain" /><div className="sheen" /><div className="mintrack" /><div className="indices" /><div className="dlogo"><b>GS</b><small>GRAND SEIKO</small></div><div className="dauto">AUTOMATIC<br />24 JEWELS</div><div className="date">26</div></div></div></div>
                    <div className="layer L-hands"><div className="puck"><div className="disc d-hands"><div className="hand hr" /><div className="hand min" /><div className="hand shand" /><div className="hub" /></div></div></div>
                    <div className="layer L-crystal"><div className="puck"><div className="side s-crys" /><div className="disc d-crystal"><div className="glint" /></div></div></div>
                  </div>
                </div>
                <div className="scrollcue" ref={cueRef}><span>Scroll to build</span><span className="cuearrow">↓</span></div>
              </div>
            </div>
          </div>

          <div className="legend">
            {PARTS.map((part, i) => {
              const isMove = part.name === "Movement"
              return (
                <div
                  className={`lrow${isMove ? " clickable" : ""}`}
                  key={part.n}
                  onMouseEnter={enter(i)}
                  onMouseLeave={leave}
                  onClick={isMove ? () => setExplorerOpen(true) : undefined}
                >
                  <div className="ln">{part.n}</div>
                  <div>
                    <div className="lname">{part.name}</div>
                    <div className="ldesc">{part.desc}</div>
                    {isMove && <span className="ltag">Click to explore the running movement →</span>}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      <section className="sec" style={{ paddingTop: 30 }}>
        <div className="wrap">
          <div className="divlbl"><span className="secno">II</span><div className="rule" /><span className="secno">In three dimensions</span></div>
          <h2 className="h2">Take it apart,<br />layer by layer.</h2>
          <p className="lead" style={{ marginTop: 18 }}>A real-time 3D render of the build, not a video. Orbit around it, zoom in, and drag the slider to separate the case, dial, hands, movement, gears and rotor. Hover a label to pick out a part.</p>
          <div style={{ marginTop: 30 }}>
            <ProjectSixWatchViewer />
          </div>
        </div>
      </section>

      <section className="sec" style={{ paddingTop: 30 }}>
        <div className="wrap">
          <div className="divlbl"><span className="secno">III</span><div className="rule" /><span className="secno">Nothing arrived assembled</span></div>
          <div className="partsgrid">
            <div>
              <h2 className="h2">Seven parts,<br />sourced separately.</h2>
              <p className="lead" style={{ marginTop: 20 }}>Most parts marketed for the NH35 actually aren&apos;t. Stem lengths, dial feet and hand-hole sizes all had to match before anything shipped. Each was checked against the movement, then assembled under a loupe in a sealed, dust-free room.</p>
              <div className="specchip"><span className="dot" />Keeps good time, well within the factory&apos;s spec</div>
            </div>
            <div className="photo" style={{ aspectRatio: "4/5" }}>
              <img src="/images/watch/grand-seiko.jpg" alt="The finished custom watch build" />
              <div className="photocap">The finished build · on the wrist</div>
            </div>
          </div>
        </div>
      </section>

      <section className="sec" style={{ paddingTop: 30 }}>
        <div className="wrap">
          <div className="divlbl"><span className="secno">IV</span><div className="rule" /><span className="secno">On film</span></div>
          <h2 className="h2">The full build,<br />start to finish.</h2>
          <p className="lead" style={{ marginTop: 18 }}>The complete assembly session, from sourcing and seating to pressing and verifying, in one sitting.</p>
          <div className="film">
            <iframe
              src="https://www.youtube-nocookie.com/embed/nR-1D8_llwg?rel=0&modestbranding=1"
              title="Custom watch build, full session"
              loading="lazy"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      </section>

      <div className="wrap">
        <div className="foot">
          <Link href="/projects/5"><div className="fcol"><div className="fk">← Previous</div><div className="fn">Cat Door Monitoring System</div></div></Link>
          <Link href="/projects/7"><div className="fcol r"><div className="fk">Next →</div><div className="fn">Robotic Rubik&apos;s Cube Solver</div></div></Link>
        </div>
        <div className="endbar"><span>Seiko NH35A · Assembled by hand · Sydney</span><span>© {new Date().getFullYear()} {SITE_NAME}</span></div>
      </div>

      {explorerOpen && <NH35Explorer onClose={() => setExplorerOpen(false)} />}
    </div>
  )
}
