import React, { useRef } from 'react';
import { FiArrowUpRight } from 'react-icons/fi';
import { useTerminal } from '../../context/TerminalContext';
import { crew } from '../../data/profile';
import CrewAvatar from '../common/CrewAvatar';
import useMotionVisibility from './useMotionVisibility';
import './crew-note.css';

export default function CrewNote({ guide, children, journey = false, topic, question }) {
  const { openTerminal } = useTerminal();
  const { name, question: defaultQuestion } = crew[guide];
  const note = useRef(null);
  const visible = useMotionVisibility(note, 0.45, journey);
  const avatar = <CrewAvatar guide={guide} size={62} loading="lazy" />;

  return (
    <aside ref={note} className={journey ? 'crew-note crew-note--journey' : 'crew-note'}
      data-scroll-reveal={journey ? undefined : 'rise'} data-journey-in-view={visible ? '' : undefined}
      aria-label={topic ? `A note from ${name} about ${topic}` : `A note from ${name}`}>
      {journey ? (
        <span className="journey-guide-figure" aria-hidden="true">
          {avatar}
          <span className="journey-guide-gesture">
            <img src="/images/crew/pointing-hand.png" alt="" width="244" height="87" loading="lazy" />
          </span>
        </span>
      ) : avatar}
      <p>{children}</p>
      <button type="button" aria-haspopup="dialog" aria-controls="crew-chat" data-sound="terminal"
        aria-label={topic ? `Ask ${name} about ${topic}` : undefined}
        onClick={() => openTerminal(guide, question ?? defaultQuestion)}>
        Ask {name} <FiArrowUpRight aria-hidden="true" />
      </button>
    </aside>
  );
}
