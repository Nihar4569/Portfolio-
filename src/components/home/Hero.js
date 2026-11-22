import React, { useContext, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowDown, FiArrowRight, FiArrowUpRight, FiCode, FiDownload, FiGithub, FiLinkedin, FiMail } from 'react-icons/fi';
import { useTerminal } from '../../context/TerminalContext';
import { crew, profile } from '../../data/profile';
import { PageTransitionContext } from '../common/PageTransition';
import HeroRoleLoop from './HeroRoleLoop';
import './portrait-hero.css';

const fullMotion = '(prefers-reduced-motion: no-preference)';
const introStorageKey = 'portfolio-home-intro';

function shouldPlayIntro() {
  if (window.location.hash || !window.matchMedia(fullMotion).matches) return false;
  try {
    return !window.sessionStorage.getItem(introStorageKey);
  } catch {
    return true;
  }
}

function useHeroCue(target, enabled, openingLength, inViewLength) {
  const [cue, setCue] = useState();

  useLayoutEffect(() => {
    if (!enabled) return;
    const element = target.current;
    let timeout;
    let observer;
    let cancelled = false;

    function play(mode, length) {
      setCue(mode);
      timeout = window.setTimeout(() => setCue(undefined), length);
    }

    function watchForVisibility() {
      if (cancelled) return;
      const { top, bottom } = element.getBoundingClientRect();
      if (typeof IntersectionObserver !== 'function' || (top >= 0 && bottom <= window.innerHeight)) {
        if (window.scrollY > 0) play('in-view', inViewLength);
        else play('opening', openingLength);
        return;
      }

      // Let offscreen details begin when a visitor can see them on a shorter screen.
      observer = new IntersectionObserver(([entry]) => {
        if (cancelled || entry.intersectionRatio < 0.9) return;
        observer.disconnect();
        play('in-view', inViewLength);
      }, { threshold: 0.9 });
      observer.observe(element);
    }

    const { bottom, height } = element.getBoundingClientRect();
    if (bottom > window.innerHeight - height && document.fonts?.status === 'loading') {
      // Wait for font metrics before deciding if a cue near the fold is visible.
      document.fonts.ready.then(watchForVisibility);
    } else {
      watchForVisibility();
    }

    return () => {
      cancelled = true;
      observer?.disconnect();
      window.clearTimeout(timeout);
    };
  }, [target, enabled, openingLength, inViewLength]);

  return enabled ? cue : undefined;
}

export default function Hero() {
  const { openTerminal, openShell, isTerminalOpen } = useTerminal();
  const changingPage = useContext(PageTransitionContext);
  const [playIntro, setPlayIntro] = useState(() => !changingPage && shouldPlayIntro());
  const [sweepPortrait, setSweepPortrait] = useState(playIntro);
  const crewRow = useRef(null);
  const terminalButton = useRef(null);
  const showingIntro = playIntro && !changingPage;
  const terminalCue = useHeroCue(terminalButton, showingIntro, 1800, 1110);
  const crewCue = useHeroCue(crewRow, showingIntro, 2900, 1330);
  const entrancePlaying = showingIntro && (sweepPortrait || terminalCue || crewCue);

  useEffect(() => {
    if (!playIntro) return;
    if (changingPage) {
      setPlayIntro(false);
      return;
    }

    try {
      window.sessionStorage.setItem(introStorageKey, 'seen');
    } catch {
      // The entrance can still play when session storage is unavailable.
    }

    const motion = window.matchMedia(fullMotion);
    const finish = () => setPlayIntro(false);
    const timeout = window.setTimeout(() => setSweepPortrait(false), 1450);
    motion.addEventListener('change', finish);
    return () => {
      window.clearTimeout(timeout);
      motion.removeEventListener('change', finish);
    };
  }, [playIntro, changingPage]);

  function movePortrait(event) {
    if (event.pointerType !== 'mouse' || !window.matchMedia(fullMotion).matches) return;
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
    <section className="portrait-hero" aria-labelledby="portfolio-name" data-hero-intro={showingIntro && sweepPortrait ? '' : undefined}>
      <div className="portrait-hero-inner">
        <div className="portrait-hero-intro">
          <p className="portrait-hero-role">{profile.title} <span>at {profile.company}</span></p>
          <h1 id="portfolio-name">{profile.name}</h1>
          <HeroRoleLoop ready={!entrancePlaying && !changingPage && !isTerminalOpen} />
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
          <div className="portrait-hero-crew" ref={crewRow} data-hero-cue={crewCue} role="group" aria-label="Meet the crew">
            {Object.entries(crew).map(([id, guide], index) => (
              <button type="button" key={id} onClick={() => openTerminal(id)} data-sound="terminal"
                style={crewCue ? { '--crew-order': index } : undefined}
                aria-label={`Meet ${guide.name}, ${guide.role}`} aria-haspopup="dialog"
                aria-controls="crew-chat" title={guide.name}>
                <span className="portrait-hero-avatar" aria-hidden="true">
                  {crewCue && (
                    <img className="portrait-hero-sleeping" src={`/images/crew/${id}.webp`} alt="" width="60" height="60" />
                  )}
                  <img className="portrait-hero-awake" src={`/images/crew/${id}.webp`} alt="" width="60" height="60" />
                </span>
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
          <button className="portrait-hero-ask" ref={terminalButton} data-hero-cue={terminalCue}
            type="button" onClick={openShell} data-sound="terminal"
            aria-haspopup="dialog" aria-controls="crew-chat">
            <span className="portrait-hero-prompt" aria-hidden="true">&gt;_</span>
            <span>
              <strong>Open terminal</strong>
              <code>
                nihar@portfolio:~$
                {terminalCue && <span className="portrait-hero-typing" aria-hidden="true"><span>{' whoami'}</span></span>}
              </code>
            </span>
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
