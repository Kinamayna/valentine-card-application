"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform, animate } from "framer-motion";

// ─── Types ───────────────────────────────────────────────────────────────────
type Stage = "envelope" | "opening" | "card" | "yes" | "no";

// ─── Confetti Particle ────────────────────────────────────────────────────────
function ConfettiPiece({ delay }: { delay: number }) {
  const colors = ["#f9a8d4", "#fbbf24", "#c084fc", "#f87171", "#34d399", "#60a5fa", "#fff"];
  const color = colors[Math.floor(Math.random() * colors.length)];
  const left = `${Math.random() * 100}%`;
  const size = Math.random() * 10 + 6;
  const rotation = Math.random() * 720 - 360;
  const shape = Math.random() > 0.5 ? "circle" : "rect";

  return (
    <motion.div
      className="absolute top-0 pointer-events-none"
      style={{ left, width: size, height: shape === "circle" ? size : size * 0.6, borderRadius: shape === "circle" ? "50%" : "2px", backgroundColor: color, zIndex: 100 }}
      initial={{ y: -20, opacity: 1, rotate: 0, x: 0 }}
      animate={{ y: typeof window !== "undefined" ? window.innerHeight + 50 : 900, opacity: [1, 1, 0], rotate: rotation, x: (Math.random() - 0.5) * 200 }}
      transition={{ duration: Math.random() * 2 + 1.5, delay, ease: "easeIn" }}
    />
  );
}

// ─── Floating Heart ───────────────────────────────────────────────────────────
function FloatingHeart({ index }: { index: number }) {
  const size = Math.random() * 24 + 14;
  const left = `${Math.random() * 90 + 5}%`;
  const dur = Math.random() * 3 + 2;
  const delay = index * 0.15;
  const opacity = Math.random() * 0.5 + 0.4;

  return (
    <motion.div
      className="absolute pointer-events-none select-none"
      style={{ left, bottom: -50, fontSize: size, opacity: 0, zIndex: 50 }}
      animate={{ y: [-50, -600], opacity: [0, opacity, 0] }}
      transition={{ duration: dur, delay, ease: "easeOut", repeat: Infinity, repeatDelay: Math.random() * 2 }}
    >
      ❤️
    </motion.div>
  );
}

// ─── Wilting Petal ────────────────────────────────────────────────────────────
function WiltingPetal({ index }: { index: number }) {
  const angle = (index / 8) * 360;
  return (
    <motion.div
      className="absolute w-6 h-10 rounded-full origin-bottom"
      style={{
        background: "linear-gradient(135deg, #fda4af, #fb7185)",
        left: "50%", top: "50%", marginLeft: -12, marginTop: -40,
        rotate: angle,
        transformOrigin: "50% 100%",
        boxShadow: "inset 0 2px 6px rgba(0,0,0,0.15)",
      }}
      animate={{ scaleY: [1, 0.4], rotate: angle + 20, opacity: [1, 0.3], y: [0, 30] }}
      transition={{ duration: 2.5, delay: index * 0.1, ease: "easeInOut" }}
    />
  );
}

// ─── Envelope SVG Component ───────────────────────────────────────────────────
export function EnvelopeIllustration({ isOpening }: { isOpening: boolean }) {
  return (
    <div className="relative w-80 h-56 md:w-96 md:h-64 select-none">
      {/* Envelope body */}
      <motion.div
        className="absolute inset-0 rounded-xl overflow-hidden z-10"
        style={{
          background:
            "linear-gradient(145deg, #ffe0eb, #ffc2d4, #ffb3c6)",
          boxShadow:
            "0 20px 60px rgba(251,113,133,0.4), 0 4px 20px rgba(0,0,0,0.1)",
        }}
      >
        {/* Bottom shading */}
        <div
          className="absolute bottom-0 left-0 right-0 h-24 opacity-20"
          style={{
            background: "linear-gradient(to top, #fb7185, transparent)",
          }}
        />

      </motion.div>

      {/* Top flap */}
      <motion.div
        className="absolute top-0 left-0 right-0 z-20 origin-top"
        style={{ height: "50%", perspective: "900px" }}
        animate={
          isOpening
            ? { rotateX: -180, opacity: 0 }
            : { rotateX: 0, opacity: 1 }
        }
        transition={{
          duration: 0.9,
          delay: isOpening ? 0.12 : 0,
          ease: [0.4, 0, 0.2, 1],
        }}
      >
        <div
          className="w-full h-full rounded-t-xl overflow-hidden"
          style={{
            background: "linear-gradient(135deg, #fecdd3, #fda4af)",
            clipPath: "polygon(0 0, 100% 0, 50% 100%)",
            boxShadow: "0 4px 20px rgba(251,113,133,0.3)",
          }}
        />
      </motion.div>

      {/* Wax seal – ABOVE everything */}
      <motion.div
        className="absolute left-1/2 top-1/2 z-40 -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full flex items-center justify-center text-xl"
        style={{
          background:
            "radial-gradient(circle at 35% 35%, #dc2626, #7f1d1d)",
          boxShadow:
            "0 6px 18px rgba(127,29,29,0.6), inset 0 1px 3px rgba(255,255,255,0.3)",
        }}
        animate={
          isOpening
            ? { scale: 0, opacity: 0 }
            : { scale: [1, 1.06, 1] }
        }
        transition={
          isOpening
            ? { duration: 0.25, ease: "easeIn" }
            : {
                duration: 2.5,
                repeat: Infinity,
                ease: "easeInOut",
              }
        }
      >
        ❤️
      </motion.div>

      {/* Decorative borders */}
      <div className="absolute inset-4 border border-rose-200 rounded-lg opacity-40 pointer-events-none z-30" />
      <div className="absolute inset-7 border border-rose-100 rounded-lg opacity-20 pointer-events-none z-30" />

      {/* Paper – fully hidden until opening */}
      <motion.div
        className="absolute left-4 right-4 z-15 rounded-t-lg overflow-hidden pointer-events-none"
        style={{
          bottom: "30%",
          background: "linear-gradient(180deg, #fff5f7, #fff)",
          boxShadow: "0 -4px 20px rgba(0,0,0,0.08)",
        }}
        initial={{ height: 0, opacity: 0 }}
        animate={
          isOpening
            ? { bottom: "60%", height: "80%", opacity: 1 }
            : { height: 0, opacity: 0 }
        }
        transition={{
          duration: 0.8,
          delay: 0.25,
          ease: "backOut",
        }}
      >
        <div className="p-3 text-center text-rose-300 text-xs font-light tracking-widest opacity-60">
          ✦ ✦ ✦
        </div>
      </motion.div>
    </div>
  );
}

// ─── Burst Hearts ─────────────────────────────────────────────────────────────
function BurstHearts() {
  const hearts = Array.from({ length: 12 }, (_, i) => i);
  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      {hearts.map((i) => {
        const angle = (i / 12) * 2 * Math.PI;
        const dist = Math.random() * 120 + 80;
        return (
          <motion.div key={i}
            className="absolute text-2xl"
            initial={{ x: 0, y: 0, opacity: 0, scale: 0 }}
            animate={{ x: Math.cos(angle) * dist, y: Math.sin(angle) * dist, opacity: [0, 1, 0], scale: [0, 1.3, 0.8, 0] }}
            transition={{ duration: 1.2, delay: i * 0.06, ease: "easeOut" }}
          >
            {["❤️", "💕", "💗", "🌹", "✨"][i % 5]}
          </motion.div>
        );
      })}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function ValentinePage() {
  const [stage, setStage] = useState<Stage>("envelope");
  const [showBurst, setShowBurst] = useState(false);
  const [confetti, setConfetti] = useState<number[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);


  const handleEnvelopeClick = () => {
    if (stage !== "envelope") return;
    setStage("opening");
    setShowBurst(true);
    setTimeout(() => {
      setShowBurst(false);
      setStage("card");
    }, 1400);
  };

  const handleResponse = async (response: "YES" | "NO") => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    setStage(response === "YES" ? "yes" : "no");

    if (response === "YES") {
      setConfetti(Array.from({ length: 120 }, (_, i) => i));
    }

    try {
      await fetch("/api/submit-response", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ response }),
      });
    } catch (err) {
      console.error("Notification failed:", err);
    }
  };



  return (
    <main className="relative min-h-screen overflow-hidden flex items-center justify-center"
      style={{ background: "radial-gradient(ellipse at 20% 50%, #2d0a1a 0%, #1a0510 40%, #0d020a 100%)" }}>

      {/* Ambient glow orbs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div className="absolute w-96 h-96 rounded-full opacity-20"
          style={{ background: "radial-gradient(circle, #f43f5e, transparent)", top: "10%", left: "5%", filter: "blur(60px)" }}
          animate={{ scale: [1, 1.2, 1], opacity: [0.15, 0.25, 0.15] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }} />
        <motion.div className="absolute w-80 h-80 rounded-full opacity-15"
          style={{ background: "radial-gradient(circle, #9f1239, transparent)", bottom: "10%", right: "5%", filter: "blur(60px)" }}
          animate={{ scale: [1.2, 1, 1.2], opacity: [0.1, 0.2, 0.1] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }} />
        <motion.div className="absolute w-64 h-64 rounded-full opacity-10"
          style={{ background: "radial-gradient(circle, #fbbf24, transparent)", top: "60%", left: "60%", filter: "blur(40px)" }}
          animate={{ scale: [1, 1.4, 1] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }} />
      </div>

      {/* Stars */}
      {Array.from({ length: 40 }, (_, i) => (
        <motion.div key={i} className="absolute w-1 h-1 rounded-full bg-rose-100 pointer-events-none"
          style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%`, opacity: Math.random() * 0.5 + 0.1 }}
          animate={{ opacity: [0.1, 0.7, 0.1], scale: [0.8, 1.3, 0.8] }}
          transition={{ duration: Math.random() * 3 + 2, repeat: Infinity, delay: Math.random() * 3 }} />
      ))}

      {/* Confetti layer */}
      {confetti.map((i) => <ConfettiPiece key={i} delay={i * 0.015} />)}

      {/* YES Stage — Floating hearts background */}
      {stage === "yes" && Array.from({ length: 18 }, (_, i) => <FloatingHeart key={i} index={i} />)}

      {/* ── ENVELOPE STAGE ── */}
      <AnimatePresence>
        {(stage === "envelope" || stage === "opening") && (
          <motion.div key="envelope-stage"
            className="flex flex-col items-center gap-8 cursor-pointer select-none"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, filter: "blur(8px)" }}
            transition={{ duration: 0.8, ease: "backOut" }}
            onClick={handleEnvelopeClick}
          >
            {/* Top label */}
            <motion.p
              className="text-rose-300 text-sm tracking-[0.35em] uppercase font-light"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              A message awaits you
            </motion.p>

            {/* Envelope + burst container */}
            <motion.div className="relative"
              animate={stage === "envelope" ? { y: [0, -8, 0] } : {}}
              transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
            >
              <EnvelopeIllustration isOpening={stage === "opening"} />
              {showBurst && <BurstHearts />}

              {/* Click ripple hint */}
              {stage === "envelope" && (
                <motion.div className="absolute inset-0 rounded-xl border border-rose-400 opacity-0"
                  animate={{ opacity: [0, 0.4, 0], scale: [0.95, 1.08, 1.15] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 1.5 }} />
              )}
            </motion.div>

            {stage === "envelope" && (
              <motion.p className="text-rose-400/70 text-xs tracking-widest font-light"
                animate={{ opacity: [0.3, 0.8, 0.3] }}
                transition={{ duration: 2, repeat: Infinity }}>
                ✦ tap to open ✦
              </motion.p>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── CARD STAGE ── */}
      <AnimatePresence>
        {stage === "card" && (
          <motion.div key="card-stage"
            className="flex flex-col items-center gap-10 px-6 w-full max-w-lg mx-auto"
            style={{ position: "absolute", left: "50%", x: "-50%" }}
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.9, ease: [0.34, 1.56, 0.64, 1] }}
          >
            {/* Card */}
            <motion.div className="relative w-full rounded-3xl p-8 md:p-12 text-center overflow-hidden"
              style={{
                background: "linear-gradient(145deg, rgba(255,240,245,0.08), rgba(255,180,200,0.06))",
                backdropFilter: "blur(20px)",
                border: "1px solid rgba(255,150,180,0.25)",
                boxShadow: "0 25px 80px rgba(244,63,94,0.2), inset 0 1px 0 rgba(255,255,255,0.1)",
              }}
            >
              {/* Corner roses */}
              {["top-4 left-4", "top-4 right-4", "bottom-4 left-4", "bottom-4 right-4"].map((pos, i) => (
                <div key={i} className={`absolute ${pos} text-2xl opacity-40`}>🌹</div>
              ))}

              {/* Inner glow */}
              <div className="absolute inset-0 rounded-3xl opacity-20 pointer-events-none"
                style={{ background: "radial-gradient(ellipse at 50% 0%, #fda4af, transparent 70%)" }} />

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.7 }}
              >
                <p className="text-rose-300/70 text-xs tracking-[0.4em] uppercase mb-6 font-light">
                  For someone special
                </p>

                <motion.h1
                  className="font-serif mb-4 leading-tight"
                  style={{
                    fontSize: "clamp(2rem, 6vw, 3.2rem)",
                    background: "linear-gradient(135deg, #fff5f7, #fda4af, #fb7185, #f43f5e)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                    fontFamily: "'Playfair Display', 'Georgia', serif",
                    textShadow: "none",
                  }}
                  animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
                  transition={{ duration: 4, repeat: Infinity }}
                >
                  Will you be my Valentine?
                </motion.h1>

                <p className="text-rose-200/50 text-sm font-light tracking-wider mb-8">
                  Every moment with you feels like a dream worth keeping.
                </p>

                {/* Divider */}
                <div className="flex items-center gap-3 mb-8 justify-center">
                  <div className="h-px w-16 bg-gradient-to-r from-transparent to-rose-400/40" />
                  <span className="text-rose-400/60 text-sm">❤</span>
                  <div className="h-px w-16 bg-gradient-to-l from-transparent to-rose-400/40" />
                </div>
              </motion.div>

              {/* Buttons */}
              <motion.div
                className="flex flex-col sm:flex-row gap-4 justify-center items-center"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.6 }}
              >
                {/* YES button */}
                <motion.button
                  onClick={() => handleResponse("YES")}
                  disabled={isSubmitting}
                  className="relative px-8 py-4 rounded-full text-white font-medium tracking-wide text-sm overflow-hidden group"
                  style={{
                    background: "linear-gradient(135deg, #f43f5e, #e11d48, #9f1239)",
                    boxShadow: "0 8px 30px rgba(244,63,94,0.5), 0 2px 8px rgba(0,0,0,0.2)",
                    minWidth: 180,
                  }}
                  whileHover={{ scale: 1.05, boxShadow: "0 12px 40px rgba(244,63,94,0.7)" }}
                  whileTap={{ scale: 0.97 }}
                >
                  <span className="relative z-10">Yes, absolutely! ❤️</span>
                  <motion.div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{ background: "linear-gradient(135deg, #fb7185, #f43f5e)" }} />
                </motion.button>

                {/* NO button — honest and stationary */}
                <motion.button
                  onClick={() => handleResponse("NO")}
                  disabled={isSubmitting}
                  className="px-8 py-4 rounded-full text-rose-400/60 font-light tracking-wide text-sm"
                  style={{
                    border: "1px solid rgba(251,113,133,0.2)",
                    background: "rgba(255,255,255,0.03)",
                    minWidth: 180,
                  }}
                  whileHover={{ borderColor: "rgba(251,113,133,0.4)", color: "rgba(251,113,133,0.8)" }}
                  whileTap={{ scale: 0.97 }}
                >
                  No, thank you
                </motion.button>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── YES STAGE ── */}
      <AnimatePresence>
        {stage === "yes" && (
          <motion.div key="yes-stage"
            className="flex flex-col items-center gap-8 text-center px-6 max-w-md"
            style={{ position: "absolute", left: "50%", x: "-50%" }}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: [0.34, 1.56, 0.64, 1] }}
          >
            <motion.div
              animate={{ rotate: [0, -5, 5, -5, 5, 0], scale: [1, 1.1, 1] }}
              transition={{ duration: 1.5, delay: 0.5 }}
              className="text-8xl"
            >
              💝
            </motion.div>

            <motion.h2
              className="font-serif leading-tight"
              style={{
                fontSize: "clamp(2.2rem, 7vw, 3.5rem)",
                background: "linear-gradient(135deg, #fff, #fda4af, #fb7185)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                fontFamily: "'Playfair Display', 'Georgia', serif",
              }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              See you then! 🥂
            </motion.h2>

            <motion.p className="text-rose-300/70 text-base font-light tracking-wide leading-relaxed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}>
              You've made this heart flutter. Get ready for a magical evening — I'll be counting every second until I see you. 💕
            </motion.p>

            <motion.div className="flex gap-2 text-2xl"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}>
              {["🌹", "💫", "🥂", "💫", "🌹"].map((e, i) => (
                <motion.span key={i} animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 1.5, delay: i * 0.2, repeat: Infinity }}>
                  {e}
                </motion.span>
              ))}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── NO STAGE ── */}
      <AnimatePresence>
        {stage === "no" && (
          <motion.div key="no-stage"
            className="flex flex-col items-center gap-8 text-center px-6 max-w-md"
            style={{ position: "absolute", left: "50%", x: "-50%" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
            {/* Wilting flower */}
            <div className="relative w-24 h-24 flex items-center justify-center">
              {Array.from({ length: 8 }, (_, i) => <WiltingPetal key={i} index={i} />)}
              <motion.div className="relative z-10 text-3xl"
                animate={{ rotate: [0, -15], y: [0, 10] }}
                transition={{ duration: 2.5, ease: "easeInOut" }}>
                🌸
              </motion.div>
            </div>

            <motion.h2
              className="font-serif"
              style={{
                fontSize: "clamp(1.8rem, 6vw, 2.8rem)",
                color: "#fda4af",
                fontFamily: "'Playfair Display', 'Georgia', serif",
              }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              Maybe next time...
            </motion.h2>

            <motion.p className="text-rose-300/50 text-sm font-light tracking-wide leading-relaxed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9 }}>
              It's alright. Some flowers bloom in their own time. The offer stands whenever you're ready. 🌸
            </motion.p>

            <motion.button
              onClick={() => { setStage("envelope"); }}
              className="text-rose-400/40 text-xs tracking-widest hover:text-rose-400/70 transition-colors"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5 }}
            >
              ↩ start over
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Font import */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;1,400&display=swap');
        * { box-sizing: border-box; }
      `}</style>
    </main>
  );
}