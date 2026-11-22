import React, { useCallback, useEffect, useState } from 'react';
import { FiCode } from 'react-icons/fi';
import { profile } from '../../data/profile';
import './home-entrance.css';

const fullMotion = '(prefers-reduced-motion: no-preference)';
const duration = 3000;
const frameDepths = [-330, -220, -110, 0];

export function useHomeEntrance() {
  const [opening, setOpening] = useState(() =>
    window.location.pathname === '/' && !window.location.hash && window.matchMedia(fullMotion).matches
  );
  const finish = useCallback(() => setOpening(false), []);

  useEffect(() => {
    if (!opening) return;

    const listeners = new AbortController();
    const options = { capture: true, passive: true, signal: listeners.signal };
    const motion = window.matchMedia(fullMotion);
    const timeout = window.setTimeout(finish, duration + 100);

    for (const event of ['pointerdown', 'wheel', 'keydown', 'focusin', 'popstate', 'hashchange', 'pagehide']) {
      window.addEventListener(event, finish, options);
    }
    motion.addEventListener('change', finish, { signal: listeners.signal });
    if (!motion.matches) finish();

    return () => {
      window.clearTimeout(timeout);
      listeners.abort();
    };
  }, [opening, finish]);

  return [opening, finish];
}

export default function HomeEntrance({ onFinish }) {
  function finishHandoff(event) {
    if (event.target === event.currentTarget) onFinish();
  }

  return (
    <div className="home-entrance" aria-hidden="true" onAnimationEnd={finishHandoff}
      style={{ '--home-entrance-duration': `${duration}ms` }}>
      <div className="home-entrance-space">
        <div className="home-entrance-floor" />
        <div className="home-entrance-rig">
          {frameDepths.map((depth) => (
            <div className="home-entrance-frame" key={depth} style={{ '--frame-depth': `${depth}px` }} />
          ))}
        </div>
        <div className="home-entrance-beam" />
      </div>
      <div className="home-entrance-identity">
        <FiCode />
        <p className="home-entrance-name">{profile.name}</p>
        <p className="home-entrance-role">{profile.title}</p>
      </div>
    </div>
  );
}
