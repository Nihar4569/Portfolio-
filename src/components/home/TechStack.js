import React from 'react';
import { FiCode, FiCpu, FiDatabase, FiLayers } from 'react-icons/fi';
import { crew } from '../../data/profile';
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
              <span className="tech-stack-guide-label"><strong>{crew.pip.name}</strong> {crew.pip.role}</span>
              Nihar’s LangGraph supervisor routes engineering requests to specialist agents based on intent and confidence.
            </CrewNote>
          </div>

          <ul className="tech-stack-board" role="list" aria-label="Technology categories">
            {skills.map(({ id, title, technologies }) => {
              const Icon = categoryIcons[id];

              return (
                <li className="tech-stack-group" key={id}>
                  <h3><Icon aria-hidden="true" /> {title}</h3>
                  <ul className="tech-stack-technologies" role="list" aria-label={title + ' technologies'}>
                    {technologies.map((name) => <li key={name}>{name}</li>)}
                  </ul>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
