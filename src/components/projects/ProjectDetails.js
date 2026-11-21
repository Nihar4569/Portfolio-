import React, { useContext, useEffect, useRef, useState } from 'react';
import { FiArrowUpRight, FiExternalLink, FiGithub, FiX } from 'react-icons/fi';
import { useTerminal } from '../../context/TerminalContext';
import { crew, profile } from '../../data/profile';
import { PageTransitionContext } from '../common/PageTransition';

const workflow = [
  { guide: 'scout', title: 'Route the request', text: 'The LangGraph supervisor classifies the request and uses its confidence to route it to a specialist.' },
  { guide: 'pip', title: 'Use a tool', text: 'A specialist agent uses ReAct to reason about the request and choose from the tools it is allowed to use.' },
  { guide: 'atlas', title: 'Review a change', text: 'For actions that change system state, an engineer reviews the proposed change through a Webex Adaptive Card.' },
];

function WorkflowWalkthrough() {
  const [index, setIndex] = useState(0);
  const step = workflow[index];

  return (
    <section className="portfolio-workflow" aria-labelledby="workflow-heading">
      <h3 id="workflow-heading">Follow an engineering request</h3>
      <div className="portfolio-workflow-steps" role="group" aria-label="Workflow steps">
        {workflow.map((item, stepIndex) => (
          <button type="button" key={item.title} aria-pressed={stepIndex === index}
            onClick={() => setIndex(stepIndex)}>{item.title}</button>
        ))}
      </div>
      <div className="portfolio-workflow-step" aria-live="polite">
        <img src={`/images/crew/${step.guide}.webp`} alt="" width="52" height="52" />
        <p key={step.title}>{step.text}</p>
      </div>
    </section>
  );
}

export default function ProjectDetails({ project, onClose }) {
  const modal = useRef(null);
  const moving = useContext(PageTransitionContext);
  const { openTerminal } = useTerminal();

  useEffect(() => {
    const dialog = modal.current;
    const shouldOpen = project && !moving;
    if (shouldOpen && !dialog.open) dialog.showModal();
    if (!shouldOpen && dialog.open) dialog.close();
  }, [moving, project]);

  const guide = project?.guide ?? 'atlas';

  return (
    <dialog className="portfolio-case" ref={modal} onClose={() => !moving && onClose()} aria-labelledby="portfolio-case-title">
      {project && <>
        <header className="portfolio-case-header">
          <div>
            {project.category && <p>{project.category}</p>}
            <h2 id="portfolio-case-title">{project.title}</h2>
          </div>
          <form method="dialog">
            <button type="submit" className="crew-icon-button" aria-label="Close project details">
              <FiX aria-hidden="true" />
            </button>
          </form>
        </header>
        <div className="portfolio-case-body">
          <p className="portfolio-case-description">{project.description}</p>
          <ul className="portfolio-project-tags" aria-label="Technologies">
            {project.techStack.map((tech) => <li key={tech}>{tech}</li>)}
          </ul>
          {project.image && <img className="portfolio-case-image" src={project.image} alt={`Screenshot of ${project.title}`} loading="lazy" decoding="async" />}
          {project.id === 9 && <WorkflowWalkthrough />}
          <h3>Engineering details</h3>
          <ul className="portfolio-case-features">
            {project.features.map((feature) => <li key={feature}>{feature}</li>)}
          </ul>
          {project.outcome && <section className="portfolio-case-outcome">
            <h3>Result</h3>
            <p>{project.outcome}</p>
          </section>}
          <div className="portfolio-case-actions">
            <button type="button" aria-haspopup="dialog" aria-controls="crew-chat" data-sound="terminal" onClick={() => {
              modal.current.close();
              openTerminal(guide, `How does ${project.shortTitle ?? project.title} work?`);
            }}>Ask {crew[guide].name} <FiArrowUpRight aria-hidden="true" /></button>
            {project.links.github && <a href={project.links.github} rel="noopener noreferrer" target="_blank">
              <FiGithub aria-hidden="true" /> Source code
            </a>}
            {project.links.live && <a href={project.links.live} rel="noopener noreferrer" target="_blank">
              <FiExternalLink aria-hidden="true" /> Live demo
            </a>}
            {project.id === 9 && <a href={profile.resume} rel="noopener noreferrer" target="_blank">
              Résumé <FiArrowUpRight aria-hidden="true" />
            </a>}
          </div>
        </div>
      </>}
    </dialog>
  );
}
