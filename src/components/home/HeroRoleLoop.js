import React, { useEffect, useRef, useState } from 'react';
import { profile } from '../../data/profile';
import useMotionVisibility from './useMotionVisibility';
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
  const playing = useMotionVisibility(loop) && ready;
  const [prefix, role] = roles[position % roles.length];

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
