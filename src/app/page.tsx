"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { DemoProvider } from "@/hooks/useDemoState";
import { Presentation, SLIDE_COUNT } from "@/components/presentation/Presentation";
import { DemoExperience } from "@/components/demo/DemoExperience";

type Mode = "presentation" | "demo";

export default function Home() {
  const [mode, setMode] = useState<Mode>("presentation");
  const [slide, setSlide] = useState(0);
  const [dir, setDir] = useState(1);
  const [fullscreen, setFullscreen] = useState(false);

  const goTo = useCallback(
    (i: number) => {
      const n = Math.max(0, Math.min(SLIDE_COUNT - 1, i));
      setDir(n >= slide ? 1 : -1);
      setSlide(n);
    },
    [slide],
  );

  const toggleFullscreen = useCallback(() => {
    if (typeof document === "undefined") return;
    if (document.fullscreenElement) document.exitFullscreen?.().catch(() => {});
    else document.documentElement.requestFullscreen?.().catch(() => {});
  }, []);

  useEffect(() => {
    const onFs = () => setFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener("fullscreenchange", onFs);
    return () => document.removeEventListener("fullscreenchange", onFs);
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable)) return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;

      if (e.key === "f" || e.key === "F") {
        e.preventDefault();
        toggleFullscreen();
        return;
      }
      if (mode !== "presentation") return;
      // Let Space/Enter activate a focused button normally
      const onButton = t?.tagName === "BUTTON";

      if (e.key === "ArrowRight" || e.key === "PageDown" || (e.key === " " && !onButton)) {
        e.preventDefault();
        if (slide < SLIDE_COUNT - 1) goTo(slide + 1);
        else setMode("demo");
      } else if (e.key === "ArrowLeft" || e.key === "PageUp") {
        e.preventDefault();
        goTo(slide - 1);
      } else if (e.key === "Home") {
        e.preventDefault();
        goTo(0);
      } else if (e.key === "End") {
        e.preventDefault();
        goTo(SLIDE_COUNT - 1);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mode, slide, goTo, toggleFullscreen]);

  return (
    <DemoProvider>
      <AnimatePresence mode="wait">
        {mode === "presentation" ? (
          <motion.div
            key="presentation"
            initial={{ opacity: 0, scale: 1.03 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96, filter: "blur(10px)" }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <Presentation
              index={slide}
              direction={dir}
              onGo={goTo}
              onLaunch={() => setMode("demo")}
              fullscreen={fullscreen}
              onToggleFullscreen={toggleFullscreen}
            />
          </motion.div>
        ) : (
          <motion.div
            key="demo"
            initial={{ opacity: 0, y: 40, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <DemoExperience onBack={() => setMode("presentation")} fullscreen={fullscreen} onToggleFullscreen={toggleFullscreen} />
          </motion.div>
        )}
      </AnimatePresence>
    </DemoProvider>
  );
}
