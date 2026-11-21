import React from 'react';
import { Link } from 'react-router-dom';
import { FiArrowUpRight, FiCode, FiCpu, FiDatabase, FiLayers } from 'react-icons/fi';
import { projectLink } from '../../data/assistant';
import projects from '../../data/projects';
import skills from '../../data/skills';
import CrewNote from './CrewNote';
import './tech-stack.css';

const categoryIcons = { ai: FiCpu, backend: FiLayers, languages: FiCode, data: FiDatabase };

export default function TechStack() {
  return (
    <section className="tech-stack" aria-labelledby="tech-stack-title">
      <div className="tech-stack-inner">
        <div className="tech-stack-layout">
          <div className="tech-stack-intro">
            <h2 id="tech-stack-title" data-scroll-reveal="rise">Tech Stack</h2>
            <CrewNote guide="pip">
              Nihar’s LangGraph supervisor routes engineering requests to specialist agents based on intent and confidence.
            </CrewNote>
          </div>

          <ul className="tech-stack-board" role="list" aria-label="Technology categories">
            {skills.map(({ id, title, summary, projectId, technologies }) => {
              const Icon = categoryIcons[id];
              const project = projects.find((item) => item.id === projectId);
              const link = project && projectLink(project);

              return (
                <li className="tech-stack-group" key={id}>
                  <h3><Icon aria-hidden="true" /> {title}</h3>
                  <ul className="tech-stack-technologies" role="list" aria-label={title + ' technologies'}>
                    {technologies.map((name) => <li key={name}>{name}</li>)}
                  </ul>
                  <div className="tech-stack-example">
                    {link ? (
                      <Link className="tech-stack-work" to={link.href}>
                        <span className="tech-stack-work-name">
                          {link.label} <FiArrowUpRight aria-hidden="true" />
                          <span className="portfolio-visually-hidden"> case study</span>
                        </span>
                        <span className="tech-stack-work-summary">{summary}</span>
                      </Link>
                    ) : (
                      <p className="tech-stack-work-summary">{summary}</p>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
