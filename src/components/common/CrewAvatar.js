import React, { useId, useRef } from 'react';
import useMotionVisibility from '../home/useMotionVisibility';
import './crew-avatar.css';

export default function CrewAvatar({ guide, size, className = '', loading }) {
  const avatar = useRef(null);
  const visible = useMotionVisibility(avatar, 0.4);
  const id = useId();
  const offset = [...id].reduce((total, character) => (total * 31 + character.charCodeAt(0)) % 480, 0);
  const src = `/images/crew/${guide}.webp`;

  return (
    <span ref={avatar} className={`crew-avatar ${className}`} data-crew-guide={guide}
      data-crew-in-view={visible ? '' : undefined} aria-hidden="true"
      style={{ '--crew-avatar-size': `${size}px`, '--crew-blink-offset': `${offset}ms` }}>
      <img className="crew-avatar-face" src={src} alt="" width={size} height={size} loading={loading} />
      <img className="crew-avatar-blink" src={src} alt="" width={size} height={size} loading={loading} />
    </span>
  );
}
