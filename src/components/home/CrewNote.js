import React from 'react';
import { FiArrowUpRight } from 'react-icons/fi';
import { useTerminal } from '../../context/TerminalContext';
import { crew } from '../../data/profile';
import './crew-note.css';

export default function CrewNote({ guide, children }) {
  const { openTerminal } = useTerminal();
  const { name, question } = crew[guide];

  return (
    <aside className="crew-note" aria-label={`A note from ${name}`}>
      <img src={`/images/crew/${guide}.webp`} width="62" height="62" alt="" loading="lazy" />
      <p>{children}</p>
      <button type="button" aria-haspopup="dialog" aria-controls="crew-chat" data-sound="terminal" onClick={() => openTerminal(guide, question)}>
        Ask {name} <FiArrowUpRight aria-hidden="true" />
      </button>
    </aside>
  );
}
