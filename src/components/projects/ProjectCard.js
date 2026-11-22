import React from 'react';
import { FiArrowUpRight, FiExternalLink, FiGithub } from 'react-icons/fi';
import CrewAvatar from '../common/CrewAvatar';
import './project-card.css';

export default function ProjectCard({ project, onOpen }) {
  return (
    <article className="portfolio-project" data-scroll-reveal="depth">
      <div className="portfolio-project-art" data-art={project.image ? 'screenshot' : 'crew'}>
        {project.image ? (
          <img src={project.image} alt="" loading="lazy" decoding="async" />
        ) : (
          <>
            <span>{project.category}</span>
            <CrewAvatar guide={project.guide} size={116} loading="lazy" />
          </>
        )}
      </div>
      <div className="portfolio-project-body">
        <h3>{project.title}</h3>
        <p>{project.description}</p>
        <ul className="portfolio-project-tags" aria-label="Technologies">
          {project.techStack.map((item) => <li key={item}>{item}</li>)}
        </ul>
        <div className="portfolio-project-actions">
          <button className="portfolio-project-open" type="button" onClick={onOpen}
            aria-haspopup="dialog" aria-label={`View details for ${project.title}`}>
            View details <FiArrowUpRight aria-hidden="true" />
          </button>
          {project.links.github && <a href={project.links.github} target="_blank" rel="noopener noreferrer"
            aria-label={`Source code for ${project.title}`}><FiGithub aria-hidden="true" /></a>}
          {project.links.live && <a href={project.links.live} target="_blank" rel="noopener noreferrer"
            aria-label={`Live demo for ${project.title}`}><FiExternalLink aria-hidden="true" /></a>}
        </div>
      </div>
    </article>
  );
}
