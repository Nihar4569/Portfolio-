import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';

const SoundContext = createContext();

// Web Audio API based sound generator for professional, synthesized sounds
class SoundGenerator {
  constructor() {
    this.audioContext = null;
    this.masterGain = null;
    this.initialized = false;
  }

  init() {
    if (this.initialized) return;
    
    try {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
      this.masterGain = this.audioContext.createGain();
      this.masterGain.connect(this.audioContext.destination);
      this.masterGain.gain.value = 0.3; // Master volume
      this.initialized = true;
    } catch (e) {
      console.warn('Web Audio API not supported');
    }
  }

  resume() {
    if (this.audioContext && this.audioContext.state === 'suspended') {
      this.audioContext.resume();
    }
  }

  // Soft click sound - for buttons and interactions
  playClick() {
    if (!this.initialized) return;
    this.resume();

    const osc = this.audioContext.createOscillator();
    const gain = this.audioContext.createGain();
    
    osc.connect(gain);
    gain.connect(this.masterGain);
    
    osc.frequency.setValueAtTime(800, this.audioContext.currentTime);
    osc.frequency.exponentialRampToValueAtTime(400, this.audioContext.currentTime + 0.05);
    
    gain.gain.setValueAtTime(0.2, this.audioContext.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.05);
    
    osc.start(this.audioContext.currentTime);
    osc.stop(this.audioContext.currentTime + 0.05);
  }

  // Soft hover sound - very subtle
  playHover() {
    if (!this.initialized) return;
    this.resume();

    const osc = this.audioContext.createOscillator();
    const gain = this.audioContext.createGain();
    
    osc.connect(gain);
    gain.connect(this.masterGain);
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(600, this.audioContext.currentTime);
    
    gain.gain.setValueAtTime(0.05, this.audioContext.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.03);
    
    osc.start(this.audioContext.currentTime);
    osc.stop(this.audioContext.currentTime + 0.03);
  }

  // Navigation/page transition sound
  playNavigation() {
    if (!this.initialized) return;
    this.resume();

    const osc = this.audioContext.createOscillator();
    const osc2 = this.audioContext.createOscillator();
    const gain = this.audioContext.createGain();
    
    osc.connect(gain);
    osc2.connect(gain);
    gain.connect(this.masterGain);
    
    osc.type = 'sine';
    osc2.type = 'sine';
    
    osc.frequency.setValueAtTime(400, this.audioContext.currentTime);
    osc.frequency.exponentialRampToValueAtTime(600, this.audioContext.currentTime + 0.1);
    
    osc2.frequency.setValueAtTime(600, this.audioContext.currentTime);
    osc2.frequency.exponentialRampToValueAtTime(800, this.audioContext.currentTime + 0.1);
    
    gain.gain.setValueAtTime(0.1, this.audioContext.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.15);
    
    osc.start(this.audioContext.currentTime);
    osc2.start(this.audioContext.currentTime);
    osc.stop(this.audioContext.currentTime + 0.15);
    osc2.stop(this.audioContext.currentTime + 0.15);
  }

  // Theme toggle - smooth switching/transition sound
  playThemeSwitch() {
    if (!this.initialized) return;
    this.resume();

    const now = this.audioContext.currentTime;
    
    // First tone - "click" start
    const osc1 = this.audioContext.createOscillator();
    const gain1 = this.audioContext.createGain();
    osc1.connect(gain1);
    gain1.connect(this.masterGain);
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(1200, now);
    osc1.frequency.exponentialRampToValueAtTime(800, now + 0.08);
    gain1.gain.setValueAtTime(0.15, now);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
    osc1.start(now);
    osc1.stop(now + 0.1);
    
    // Second tone - "whoosh" transition
    const osc2 = this.audioContext.createOscillator();
    const gain2 = this.audioContext.createGain();
    const filter = this.audioContext.createBiquadFilter();
    osc2.connect(filter);
    filter.connect(gain2);
    gain2.connect(this.masterGain);
    osc2.type = 'sine';
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(2000, now + 0.05);
    filter.frequency.exponentialRampToValueAtTime(500, now + 0.25);
    osc2.frequency.setValueAtTime(600, now + 0.05);
    osc2.frequency.exponentialRampToValueAtTime(400, now + 0.2);
    gain2.gain.setValueAtTime(0, now);
    gain2.gain.linearRampToValueAtTime(0.12, now + 0.08);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
    osc2.start(now + 0.05);
    osc2.stop(now + 0.3);
    
    // Third tone - "settle" end
    const osc3 = this.audioContext.createOscillator();
    const gain3 = this.audioContext.createGain();
    osc3.connect(gain3);
    gain3.connect(this.masterGain);
    osc3.type = 'sine';
    osc3.frequency.setValueAtTime(500, now + 0.15);
    osc3.frequency.exponentialRampToValueAtTime(600, now + 0.25);
    gain3.gain.setValueAtTime(0, now + 0.15);
    gain3.gain.linearRampToValueAtTime(0.1, now + 0.2);
    gain3.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
    osc3.start(now + 0.15);
    osc3.stop(now + 0.35);
  }

  // Success sound - for form submissions, completions
  playSuccess() {
    if (!this.initialized) return;
    this.resume();

    const now = this.audioContext.currentTime;
    const notes = [523.25, 659.25, 783.99]; // C5, E5, G5 - major chord arpeggio
    
    notes.forEach((freq, i) => {
      const osc = this.audioContext.createOscillator();
      const gain = this.audioContext.createGain();
      
      osc.connect(gain);
      gain.connect(this.masterGain);
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + i * 0.08);
      
      gain.gain.setValueAtTime(0, now + i * 0.08);
      gain.gain.linearRampToValueAtTime(0.15, now + i * 0.08 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.08 + 0.3);
      
      osc.start(now + i * 0.08);
      osc.stop(now + i * 0.08 + 0.3);
    });
  }

  // Error sound - subtle notification
  playError() {
    if (!this.initialized) return;
    this.resume();

    const now = this.audioContext.currentTime;
    
    const osc = this.audioContext.createOscillator();
    const gain = this.audioContext.createGain();
    
    osc.connect(gain);
    gain.connect(this.masterGain);
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(200, now);
    osc.frequency.setValueAtTime(150, now + 0.1);
    
    gain.gain.setValueAtTime(0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
    
    osc.start(now);
    osc.stop(now + 0.2);
  }

  // Terminal/Chat open sound
  playTerminalOpen() {
    if (!this.initialized) return;
    this.resume();

    const now = this.audioContext.currentTime;
    
    // Boot-up style sound
    const osc = this.audioContext.createOscillator();
    const gain = this.audioContext.createGain();
    
    osc.connect(gain);
    gain.connect(this.masterGain);
    
    osc.type = 'square';
    osc.frequency.setValueAtTime(200, now);
    osc.frequency.exponentialRampToValueAtTime(800, now + 0.1);
    osc.frequency.setValueAtTime(600, now + 0.12);
    
    gain.gain.setValueAtTime(0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
    
    osc.start(now);
    osc.stop(now + 0.2);
  }

  // Terminal/Chat close sound
  playTerminalClose() {
    if (!this.initialized) return;
    this.resume();

    const now = this.audioContext.currentTime;
    
    const osc = this.audioContext.createOscillator();
    const gain = this.audioContext.createGain();
    
    osc.connect(gain);
    gain.connect(this.masterGain);
    
    osc.type = 'square';
    osc.frequency.setValueAtTime(600, now);
    osc.frequency.exponentialRampToValueAtTime(200, now + 0.15);
    
    gain.gain.setValueAtTime(0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
    
    osc.start(now);
    osc.stop(now + 0.15);
  }

  // Message send/receive in chat
  playMessage() {
    if (!this.initialized) return;
    this.resume();

    const now = this.audioContext.currentTime;
    
    const osc = this.audioContext.createOscillator();
    const gain = this.audioContext.createGain();
    
    osc.connect(gain);
    gain.connect(this.masterGain);
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, now);
    osc.frequency.exponentialRampToValueAtTime(1100, now + 0.05);
    
    gain.gain.setValueAtTime(0.1, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
    
    osc.start(now);
    osc.stop(now + 0.08);
  }

  // Typing sound - for keyboard interactions
  playType() {
    if (!this.initialized) return;
    this.resume();

    const noise = this.createNoiseBuffer(0.02);
    
    // White noise component for key click
    const noiseSource = this.audioContext.createBufferSource();
    noiseSource.buffer = noise;
    const noiseGain = this.audioContext.createGain();
    noiseSource.connect(noiseGain);
    noiseGain.connect(this.masterGain);
    noiseGain.gain.setValueAtTime(0.03, this.audioContext.currentTime);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.02);
    
    noiseSource.start(this.audioContext.currentTime);
    noiseSource.stop(this.audioContext.currentTime + 0.02);
  }

  createNoiseBuffer(duration) {
    const sampleRate = this.audioContext.sampleRate;
    const length = sampleRate * duration;
    const buffer = this.audioContext.createBuffer(1, length, sampleRate);
    const data = buffer.getChannelData(0);
    
    for (let i = 0; i < length; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    
    return buffer;
  }

  // Scroll milestone sound - when reaching sections
  playScrollMilestone() {
    if (!this.initialized) return;
    this.resume();

    const now = this.audioContext.currentTime;
    
    const osc = this.audioContext.createOscillator();
    const gain = this.audioContext.createGain();
    
    osc.connect(gain);
    gain.connect(this.masterGain);
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(440, now);
    osc.frequency.exponentialRampToValueAtTime(550, now + 0.1);
    
    gain.gain.setValueAtTime(0.05, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
    
    osc.start(now);
    osc.stop(now + 0.15);
  }

  // Single keyboard key press sound - mechanical keyboard style
  playKeyPress() {
    if (!this.initialized) return;
    this.resume();

    const now = this.audioContext.currentTime;
    
    // Mechanical key click - has both a "down" and slight "up" sound
    const osc = this.audioContext.createOscillator();
    const gain = this.audioContext.createGain();
    const filter = this.audioContext.createBiquadFilter();
    
    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);
    
    // Random frequency variation for realistic typing
    const baseFreq = 1800 + Math.random() * 400;
    
    osc.type = 'square';
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(2000, now);
    filter.Q.setValueAtTime(2, now);
    
    osc.frequency.setValueAtTime(baseFreq, now);
    osc.frequency.exponentialRampToValueAtTime(baseFreq * 0.5, now + 0.02);
    
    gain.gain.setValueAtTime(0.06, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
    
    osc.start(now);
    osc.stop(now + 0.04);
    
    // Add noise component for click texture
    const noise = this.createNoiseBuffer(0.025);
    const noiseSource = this.audioContext.createBufferSource();
    noiseSource.buffer = noise;
    const noiseGain = this.audioContext.createGain();
    const noiseFilter = this.audioContext.createBiquadFilter();
    
    noiseSource.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(this.masterGain);
    
    noiseFilter.type = 'highpass';
    noiseFilter.frequency.setValueAtTime(3000, now);
    
    noiseGain.gain.setValueAtTime(0.04, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.025);
    
    noiseSource.start(now);
    noiseSource.stop(now + 0.025);
  }

  // Coding typing sequence - plays multiple key sounds for theme transition
  playCodeTypingSequence(duration = 800, keysPerSecond = 12) {
    if (!this.initialized) return;
    this.resume();

    const totalKeys = Math.floor((duration / 1000) * keysPerSecond);
    const interval = duration / totalKeys;
    
    // Schedule key presses with slight randomization for realistic typing
    for (let i = 0; i < totalKeys; i++) {
      const delay = i * interval + (Math.random() * 20 - 10); // ±10ms variation
      setTimeout(() => {
        this.playKeyPress();
      }, Math.max(0, delay));
    }
    
    // Play "Enter" key sound at the end (execution)
    setTimeout(() => {
      this.playEnterKey();
    }, duration - 50);
  }

  // Enter key sound - slightly different, more pronounced
  playEnterKey() {
    if (!this.initialized) return;
    this.resume();

    const now = this.audioContext.currentTime;
    
    // Deeper, more resonant sound for Enter
    const osc = this.audioContext.createOscillator();
    const gain = this.audioContext.createGain();
    
    osc.connect(gain);
    gain.connect(this.masterGain);
    
    osc.type = 'square';
    osc.frequency.setValueAtTime(800, now);
    osc.frequency.exponentialRampToValueAtTime(400, now + 0.08);
    
    gain.gain.setValueAtTime(0.1, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
    
    osc.start(now);
    osc.stop(now + 0.1);
    
    // Add noise for mechanical feel
    const noise = this.createNoiseBuffer(0.06);
    const noiseSource = this.audioContext.createBufferSource();
    noiseSource.buffer = noise;
    const noiseGain = this.audioContext.createGain();
    
    noiseSource.connect(noiseGain);
    noiseGain.connect(this.masterGain);
    
    noiseGain.gain.setValueAtTime(0.05, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);
    
    noiseSource.start(now);
    noiseSource.stop(now + 0.06);
  }
}

export const SoundProvider = ({ children }) => {
  const [soundEnabled, setSoundEnabled] = useState(() => {
    // Check localStorage for saved preference
    const saved = localStorage.getItem('portfolio-sound-enabled');
    return saved !== null ? JSON.parse(saved) : true; // Default to true (sound on)
  });
  
  const soundGenerator = useRef(new SoundGenerator());

  // Initialize audio context on first user interaction
  useEffect(() => {
    const initAudio = () => {
      soundGenerator.current.init();
      document.removeEventListener('click', initAudio);
      document.removeEventListener('keydown', initAudio);
    };

    document.addEventListener('click', initAudio);
    document.addEventListener('keydown', initAudio);

    return () => {
      document.removeEventListener('click', initAudio);
      document.removeEventListener('keydown', initAudio);
    };
  }, []);

  // Save preference to localStorage
  useEffect(() => {
    localStorage.setItem('portfolio-sound-enabled', JSON.stringify(soundEnabled));
  }, [soundEnabled]);

  const toggleSound = useCallback(() => {
    setSoundEnabled(prev => !prev);
  }, []);

  // Sound playing functions - only play if sound is enabled
  const playClick = useCallback(() => {
    if (soundEnabled) soundGenerator.current.playClick();
  }, [soundEnabled]);

  const playHover = useCallback(() => {
    if (soundEnabled) soundGenerator.current.playHover();
  }, [soundEnabled]);

  const playNavigation = useCallback(() => {
    if (soundEnabled) soundGenerator.current.playNavigation();
  }, [soundEnabled]);

  const playThemeSwitch = useCallback(() => {
    if (soundEnabled) soundGenerator.current.playThemeSwitch();
  }, [soundEnabled]);

  const playSuccess = useCallback(() => {
    if (soundEnabled) soundGenerator.current.playSuccess();
  }, [soundEnabled]);

  const playError = useCallback(() => {
    if (soundEnabled) soundGenerator.current.playError();
  }, [soundEnabled]);

  const playTerminalOpen = useCallback(() => {
    if (soundEnabled) soundGenerator.current.playTerminalOpen();
  }, [soundEnabled]);

  const playTerminalClose = useCallback(() => {
    if (soundEnabled) soundGenerator.current.playTerminalClose();
  }, [soundEnabled]);

  const playMessage = useCallback(() => {
    if (soundEnabled) soundGenerator.current.playMessage();
  }, [soundEnabled]);

  const playType = useCallback(() => {
    if (soundEnabled) soundGenerator.current.playType();
  }, [soundEnabled]);

  const playScrollMilestone = useCallback(() => {
    if (soundEnabled) soundGenerator.current.playScrollMilestone();
  }, [soundEnabled]);

  const playCodeTyping = useCallback((duration = 800) => {
    if (soundEnabled) soundGenerator.current.playCodeTypingSequence(duration, 12);
  }, [soundEnabled]);

  const playKeyPress = useCallback(() => {
    if (soundEnabled) soundGenerator.current.playKeyPress();
  }, [soundEnabled]);

  const value = {
    soundEnabled,
    toggleSound,
    playClick,
    playHover,
    playNavigation,
    playThemeSwitch,
    playSuccess,
    playError,
    playTerminalOpen,
    playTerminalClose,
    playMessage,
    playType,
    playScrollMilestone,
    playCodeTyping,
    playKeyPress
  };

  return (
    <SoundContext.Provider value={value}>
      {children}
    </SoundContext.Provider>
  );
};

export const useSound = () => {
  const context = useContext(SoundContext);
  if (!context) {
    throw new Error('useSound must be used within a SoundProvider');
  }
  return context;
};

export default SoundContext;
