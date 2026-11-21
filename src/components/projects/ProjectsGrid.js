import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FiSearch } from 'react-icons/fi';
import ProjectCard from './ProjectCard';
import ProjectDetails from './ProjectDetails';
import { projectTechnologies, technologyLabel } from '../../data/projects';

export default function ProjectsGrid({ projects, linkToDetails = false }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [technology, setTechnology] = useState('');
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState(null);
  const project = linkToDetails
    ? projects.find((item) => String(item.id) === searchParams.get('project'))
    : selected;
  const technologies = projectTechnologies(projects);
  const words = query.toLowerCase().trim().split(/\s+/).filter(Boolean);
  const results = projects.filter((item) => {
    if (technology && !item.techStack.some((tech) => technologyLabel(tech) === technology)) return false;
    const searchable = [item.title, item.category, item.description, ...item.techStack].join(' ').toLowerCase();
    return words.every((word) => searchable.includes(word));
  });

  function chooseProject(item) {
    if (!linkToDetails) {
      setSelected(item);
      return;
    }
    const params = new URLSearchParams(searchParams);
    if (item) params.set('project', String(item.id));
    else params.delete('project');
    setSearchParams(params, { replace: !item });
  }

  return (
    <>
      <search className="portfolio-filters" aria-label="Find a project">
        <div className="portfolio-search">
          <FiSearch aria-hidden="true" />
          <input type="search" aria-label="Search projects" placeholder="Search projects…" value={query}
            onChange={(event) => setQuery(event.target.value)} />
        </div>
        <select aria-label="Filter by technology" value={technology} onChange={(event) => setTechnology(event.target.value)}>
          <option value="">All technologies</option>
          {technologies.map((item) => <option key={item}>{item}</option>)}
        </select>
      </search>
      {results.length ? (
        <div className="portfolio-projects-grid">
          {results.map((item) => <ProjectCard key={item.id} project={item} onOpen={() => chooseProject(item)} />)}
        </div>
      ) : <p className="portfolio-empty" role="status">No projects match. Try another search or technology.</p>}
      <ProjectDetails project={project} onClose={() => project && chooseProject(null)} />
    </>
  );
}
