import React from 'react';
import { FiArrowUpRight } from 'react-icons/fi';
import { useTerminal } from '../../context/TerminalContext';
import { crew } from '../../data/profile';
import './crew-note.css';

export default function CrewNote({ guide, prompt, children }) {
  const { openTerminal } = useTerminal();
  const { name, role, question } = crew[guide];

  return (
    <aside className="crew-note" data-guide={guide} aria-label={`A note from ${name}`}>
      <div className="crew-note-stage" aria-hidden="true">
        <span className="crew-note-platform" />
        <img className="crew-note-avatar" data-scroll-reveal="crew" src={`/images/crew/${guide}.webp`}
          width="96" height="96" alt="" loading="lazy" decoding="async" />
      </div>
      <div className="crew-note-copy">
        <p className="crew-note-speaker"><strong>{name}</strong> {role}</p>
        <p className="crew-note-line">{children}</p>
        <button type="button" aria-haspopup="dialog" aria-controls="crew-chat" data-sound="terminal"
          onClick={() => openTerminal(guide, prompt ?? question)}>
          Ask {name} <FiArrowUpRight aria-hidden="true" />
        </button>
      </div>
    </aside>
  );
}
