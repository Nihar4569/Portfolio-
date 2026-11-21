import React from 'react';
import { Link } from 'react-router-dom';
import { FiArrowDown, FiArrowRight, FiArrowUpRight, FiCode, FiDownload, FiGithub, FiLinkedin, FiMail } from 'react-icons/fi';
import { useTerminal } from '../../context/TerminalContext';
import { crew, profile } from '../../data/profile';
import './portrait-hero.css';

export default function Hero() {
  const { openTerminal, openShell } = useTerminal();

  function movePortrait(event) {
    if (event.pointerType !== 'mouse' || !window.matchMedia('(prefers-reduced-motion: no-preference)').matches) return;
    const stage = event.currentTarget;
    const box = stage.getBoundingClientRect();
    const x = (event.clientX - box.left) / box.width - 0.5;
    const y = (event.clientY - box.top) / box.height - 0.5;
    stage.style.setProperty('--portrait-x', `${x * 8}px`);
    stage.style.setProperty('--portrait-y', `${y * 5}px`);
    stage.style.setProperty('--portrait-angle', `${x * 2}deg`);
  }

  function settlePortrait(event) {
    const { style } = event.currentTarget;
    style.removeProperty('--portrait-x');
    style.removeProperty('--portrait-y');
    style.removeProperty('--portrait-angle');
  }

  return (
    <section className="portrait-hero" aria-labelledby="portfolio-name">
      <div className="portrait-hero-inner">
        <div className="portrait-hero-intro">
          <p className="portrait-hero-role">{profile.title} <span>at {profile.company}</span></p>
          <h1 id="portfolio-name">{profile.name}</h1>
          <p className="portrait-hero-bio">I build AI workflows and backend systems people can depend on.</p>
        </div>

        <div className="portrait-hero-stage" onPointerMove={movePortrait} onPointerLeave={settlePortrait}>
          <img
            className="portrait-hero-photo"
            src="/images/portrait/nihar-portrait-800.webp"
            srcSet="/images/portrait/nihar-portrait-480.webp 480w, /images/portrait/nihar-portrait-800.webp 800w, /images/portrait/nihar-portrait.webp 1086w"
            sizes="(max-width: 768px) 306px, (min-width: 1200px) and (min-height: 761px) 481px, 437px"
            width="1086"
            height="1448"
            alt={profile.name}
            {...{ fetchpriority: 'high' }}
            decoding="async"
          />
          <div className="portrait-hero-crew" role="group" aria-label="Meet the crew">
            {Object.entries(crew).map(([id, guide]) => (
              <button type="button" key={id} onClick={() => openTerminal(id)} data-sound="terminal"
                aria-label={`Meet ${guide.name}, ${guide.role}`} aria-haspopup="dialog"
                aria-controls="crew-chat" title={guide.name}>
                <img src={`/images/crew/${id}.webp`} alt="" width="60" height="60" />
                <span>{guide.name}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="portrait-hero-actions">
          <div className="portrait-hero-links">
            <Link to="/projects" className="portrait-hero-primary">View projects <FiArrowRight aria-hidden="true" /></Link>
            <a href={profile.resume} target="_blank" rel="noopener noreferrer">Résumé <FiDownload aria-hidden="true" /></a>
          </div>
          <button className="portrait-hero-ask" type="button" onClick={openShell} data-sound="terminal"
            aria-haspopup="dialog" aria-controls="crew-chat">
            <span className="portrait-hero-prompt" aria-hidden="true">&gt;_</span>
            <span><strong>Open terminal</strong><code>nihar@portfolio:~$</code></span>
            <FiArrowUpRight aria-hidden="true" />
          </button>
          <div className="portrait-hero-socials">
            <a href={profile.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub"><FiGithub /></a>
            <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"><FiLinkedin /></a>
            <a href={profile.leetcode} target="_blank" rel="noopener noreferrer" aria-label="LeetCode"><FiCode /></a>
            <a href={`mailto:${profile.email}`} aria-label="Email Nihar"><FiMail /></a>
          </div>
        </div>
      </div>
      <a className="portrait-hero-scroll" href="#featured-work"><FiArrowDown aria-hidden="true" /> Selected work</a>
    </section>
  );
}
