import React, { useEffect, useRef, useState } from 'react';
import { profile } from '../../data/profile';
import './hero-role-loop.css';

const roles = [
  ['I am an ', 'AI Engineer'],
  ['I am a ', profile.title],
  ['I am a ', 'Software Developer'],
  ['I am a ', 'Backend Developer'],
];
const lineColumns = Math.max(...roles.map(([prefix, role]) => prefix.length + role.length)) + 3;

export default function HeroRoleLoop({ ready }) {
  const loop = useRef(null);
  const [position, setPosition] = useState(0);
  const [started, setStarted] = useState(false);
  const [visible, setVisible] = useState(() => !document.hidden);
  const playing = ready && visible;
  const [prefix, role] = roles[position % roles.length];

  useEffect(() => {
    let inView = true;
    const updateVisibility = () => setVisible(inView && !document.hidden);
    const observer = typeof IntersectionObserver === 'function'
      ? new IntersectionObserver(([entry]) => {
        inView = entry.isIntersecting;
        updateVisibility();
      })
      : null;

    observer?.observe(loop.current);
    document.addEventListener('visibilitychange', updateVisibility);
    updateVisibility();
    return () => {
      observer?.disconnect();
      document.removeEventListener('visibilitychange', updateVisibility);
    };
  }, []);

  useEffect(() => {
    if (playing) setStarted(true);
  }, [playing]);

  return (
    <div className="hero-role-loop" ref={loop} aria-hidden="true" style={{ '--hero-role-columns': lineColumns }}
      data-role-started={started ? '' : undefined} data-role-paused={playing ? undefined : ''}>
      <span>&gt;</span>
      <span key={position} className="hero-role-word" data-first-role={position === 0 ? '' : undefined}
        style={{ '--hero-role-characters': prefix.length + role.length }}>
        <span className="hero-role-phrase" onAnimationEnd={() => setPosition(current => current + 1)}>
          {prefix}<span className="hero-role-name">{role}</span>
        </span>
      </span>
    </div>
  );
}
