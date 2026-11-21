import React, { useId, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaBrain, FaCogs, FaDatabase, FaGitAlt, FaJava, FaJs, FaPython, FaReact, FaServer } from 'react-icons/fa';
import { FiArrowUpRight, FiCode } from 'react-icons/fi';
import { SiDocker, SiElasticsearch, SiFastapi, SiFirebase, SiFlask, SiMongodb, SiMysql, SiRedis, SiSpringboot } from 'react-icons/si';
import { useTerminal } from '../../context/TerminalContext';
import { projectLink } from '../../data/assistant';
import { crew } from '../../data/profile';
import projects from '../../data/projects';
import skills from '../../data/skills';
import './tech-stack.css';

const technologyIcons = {
  Java: FaJava,
  Python: FaPython,
  JavaScript: FaJs,
  SQL: SiMysql,
  'Spring Boot': SiSpringboot,
  FastAPI: SiFastapi,
  Flask: SiFlask,
  React: FaReact,
  MongoDB: SiMongodb,
  Milvus: FaDatabase,
  Redis: SiRedis,
  Elasticsearch: SiElasticsearch,
  LangGraph: FaBrain,
  LangChain: FaBrain,
  ReAct: FaBrain,
  StateGraph: FaBrain,
  Git: FaGitAlt,
  'REST APIs': FaServer,
  'VS Code': FiCode,
  Docker: SiDocker,
  Firebase: SiFirebase,
};

const allTechnologies = [...new Set(skills.flatMap(({ technologies }) => technologies))];

function TechnologyList({ className, technologies }) {
  return (
    <ul className={className} role="list">
      {technologies.map((name) => {
        const Icon = technologyIcons[name] ?? FaCogs;
        return <li key={name}><Icon aria-hidden="true" /> <span>{name}</span></li>;
      })}
    </ul>
  );
}

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

        <div className="tech-stack-tabs" role="tablist" aria-label="Technology categories" onKeyDown={moveTab}>
          {skills.map(({ id: category, title }, index) => (
            <button className="tech-stack-tab" key={category} id={id + '-' + category} type="button"
              role="tab" aria-selected={active === index} tabIndex={active === index ? 0 : -1}
              onFocus={() => setActive(index)} onClick={() => setActive(index)}>
              {title}
            </button>
          ))}
        </div>

        {skills.map(({ id: category, summary, projectId, technologies }, index) => {
          const project = projects.find((item) => item.id === projectId);
          const link = project && projectLink(project);
          return (
            <div className="tech-stack-panel" key={category} role="tabpanel" aria-labelledby={id + '-' + category}
              hidden={active !== index} tabIndex={active === index && !link ? 0 : undefined}>
              <TechnologyList className="tech-stack-cards" technologies={technologies} />
              <div className="tech-stack-example">
                <p>{summary}</p>
                {link && <Link className="tech-stack-work" to={link.href}>
                  {link.label} <FiArrowUpRight aria-hidden="true" />
                </Link>}
              </div>
            </div>
          );
        })}

        <div className="tech-stack-cloud">
          <h3>All Technologies</h3>
          <TechnologyList className="tech-stack-cloud-list" technologies={allTechnologies} />
        </div>
      </div>
    </section>
  );
}
