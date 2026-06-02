import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";


const REVEAL_START = 0.1;
const REVEAL_END = 0.88;

function RevealLine({ children, progress, range, skipReveal }) {
  const revealOpacity = useTransform(progress, (p) => {
    if (skipReveal || p >= REVEAL_END) return 1;
    if (p < REVEAL_START) return 0;
    const [start, end] = range;
    if (p >= end) return 1;
    if (p <= start) return 0;
    return (p - start) / (end - start);
  });
  const isBlank = !children?.trim();

  return (
    <div className={isBlank ? "h-8" : "relative leading-snug"}>
      {!isBlank && (
        <>
          <span className="absolute inset-x-0 text-white/25">{children}</span>
          <motion.span style={{ opacity: revealOpacity }} className="relative text-white">
            {children}
          </motion.span>
        </>
      )}
    </div>
  );
}

function Storyani({ lines, className = "" }) {
  const targetRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start end", "end end"],
  });

  const contentIndices = lines
    .map((line, i) => (line.trim() ? i : -1))
    .filter((i) => i >= 0);
  const contentCount = contentIndices.length;
  const scrollVh = Math.max(180, contentCount * 14);

  const rangeForIndex = (index) => {
    const contentIndex = contentIndices.indexOf(index);
    if (contentIndex < 0) return [0, 0];
    const span = REVEAL_END - REVEAL_START;
    const segment = span / contentCount;
    const start = REVEAL_START + contentIndex * segment;
    return [start, start + segment];
  };

  return (
    <div
      ref={targetRef}
      className={`relative z-0 w-full ${className}`}
      style={{ height: `${scrollVh}vh` }}
    >
      <div className="sticky top-0 flex h-screen w-full items-center justify-center px-6 pb-3">
        <div className="flex max-w-4xl flex-col items-center text-center">
          {lines.map((line, i) => (
            <RevealLine
              key={i}
              progress={scrollYProgress}
              range={rangeForIndex(i)}
              skipReveal={!line.trim()}
            >
              {line}
            </RevealLine>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Storyani;
