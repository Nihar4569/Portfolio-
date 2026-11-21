import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';

const SoundContext = createContext();
const preference = 'portfolio-sound-enabled';

// Frequency, end frequency, duration, volume, and offset for each tone.
const cues = {
  click: [[800, 400, 0.05, 0.18]],
  navigation: [[400, 600, 0.12, 0.11], [600, 800, 0.13, 0.08, 0.05]],
  theme: [[1050, 650, 0.09, 0.12], [420, 620, 0.14, 0.09, 0.06]],
  terminal: [[260, 720, 0.14, 0.13], [780, 880, 0.09, 0.07, 0.07]],
  message: [[780, 1030, 0.08, 0.14]],
  success: [[523, 523, 0.15, 0.13], [659, 659, 0.18, 0.11, 0.07], [784, 784, 0.22, 0.11, 0.14]],
  error: [[240, 165, 0.15, 0.15]],
};

function readPreference() {
  try {
    return localStorage.getItem(preference) === 'true';
  } catch {
    return false;
  }
}

export function SoundProvider({ children }) {
  const [soundEnabled, setSoundEnabled] = useState(readPreference);
  const enabled = useRef(soundEnabled);
  const audio = useRef(null);

  const armSound = useCallback(() => {
    if (!enabled.current) return null;
    try {
      if (!audio.current) {
        const Audio = window.AudioContext || window.webkitAudioContext;
        if (!Audio) return null;
        const context = new Audio();
        const output = context.createGain();
        output.connect(context.destination);
        audio.current = { context, output };
      }
      const { context, output } = audio.current;
      output.gain.value = 0.28;
      if (context.state !== 'running') void context.resume().catch(() => {});
      return audio.current;
    } catch {
      return null;
    }
  }, []);

  const playSound = useCallback((name) => {
    if (!Object.hasOwn(cues, name)) return;
    const engine = armSound();
    if (!engine) return;
    const { context, output } = engine;
    for (const [frequency, end, duration, volume, delay = 0] of cues[name]) {
      const start = context.currentTime + delay;
      const oscillator = context.createOscillator();
      const gain = context.createGain();
      oscillator.connect(gain);
      gain.connect(output);
      oscillator.frequency.setValueAtTime(frequency, start);
      oscillator.frequency.exponentialRampToValueAtTime(end, start + duration);
      gain.gain.setValueAtTime(0.001, start);
      gain.gain.linearRampToValueAtTime(volume, start + 0.008);
      gain.gain.exponentialRampToValueAtTime(0.001, start + duration);
      oscillator.onended = () => {
        oscillator.disconnect();
        gain.disconnect();
      };
      oscillator.start(start);
      oscillator.stop(start + duration);
    }
  }, [armSound]);

  function toggleSound() {
    const next = !enabled.current;
    enabled.current = next;
    setSoundEnabled(next);
    if (next) playSound('click');
    else if (audio.current) audio.current.output.gain.value = 0;
    try {
      localStorage.setItem(preference, String(next));
    } catch {
      // Sound can still be changed for the current page.
    }
  }

  useEffect(() => () => {
    if (audio.current) void audio.current.context.close().catch(() => {});
    audio.current = null;
  }, []);

  return (
    <SoundContext.Provider value={{ soundEnabled, toggleSound, playSound, armSound }}>
      {children}
    </SoundContext.Provider>
  );
}

export function useSound() {
  const context = useContext(SoundContext);
  if (!context) throw new Error('useSound must be used within a SoundProvider');
  return context;
}
