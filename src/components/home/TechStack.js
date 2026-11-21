import React, { useId, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowUpRight, FiCode, FiCpu, FiDatabase, FiLayers } from 'react-icons/fi';
import { useTerminal } from '../../context/TerminalContext';
import { projectLink } from '../../data/assistant';
import { crew } from '../../data/profile';
import projects from '../../data/projects';
import skills from '../../data/skills';
import './tech-stack.css';

const categoryIcons = { ai: FiCpu, backend: FiLayers, languages: FiCode, data: FiDatabase };

export default function TechStack() {
  const { openTerminal } = useTerminal();
  const [active, setActive] = useState(0);
  const id = useId();

  function moveTab(event) {
    let next;
    if (event.key === 'ArrowRight') next = (active + 1) % skills.length;
    else if (event.key === 'ArrowLeft') next = (active + skills.length - 1) % skills.length;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = skills.length - 1;
    else return;

    event.preventDefault();
    event.currentTarget.children.item(next).focus();
  }

  return (
    <section className="tech-stack" aria-labelledby="tech-stack-title">
      <div className="tech-stack-inner">
        <header className="tech-stack-header" data-scroll-reveal="rise">
          <h2 id="tech-stack-title">Tech Stack</h2>
          <button className="tech-stack-guide" type="button" aria-haspopup="dialog" aria-controls="crew-chat"
            data-sound="terminal" onClick={() => openTerminal('pip', crew.pip.question)}>
            <img src="/images/crew/pip.webp" alt="" width="32" height="32" loading="lazy" />
            Ask Pip <FiArrowUpRight aria-hidden="true" />
          </button>
        </header>

        <div className="tech-stack-board" data-scroll-reveal="depth">
          <div className="tech-stack-tabs" role="tablist" aria-label="Technology categories" onKeyDown={moveTab}>
            {skills.map(({ id: category, title }, index) => {
              const Icon = categoryIcons[category];
              return (
                <button className="tech-stack-tab" key={category} id={`${id}-${category}`} type="button"
                  role="tab" aria-selected={active === index} tabIndex={active === index ? 0 : -1}
                  onFocus={() => setActive(index)} onClick={() => setActive(index)}>
                  <Icon aria-hidden="true" />
                  {title}
                </button>
              );
            })}
          </div>
          {skills.map(({ id: category, title, summary, projectId, technologies }, index) => {
            const project = projects.find((item) => item.id === projectId);
            const link = project && projectLink(project);
            return (
              <div className="tech-stack-panel" key={category} role="tabpanel"
                aria-labelledby={`${id}-${category}`} hidden={active !== index} tabIndex={link ? undefined : 0}>
                <div className="tech-stack-panel-content">
                  <div>
                    <p className="tech-stack-summary">{summary}</p>
                    {link && <Link className="tech-stack-work" to={link.href}>
                      {link.label} <FiArrowUpRight aria-hidden="true" />
                    </Link>}
                  </div>
                  <ul className="tech-stack-technologies" aria-label={`${title} technologies`}>
                    {technologies.map((name) => <li key={name}>{name}</li>)}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
