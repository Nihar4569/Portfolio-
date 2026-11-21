import React, { useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FiSearch } from 'react-icons/fi';
import ProjectCard from './ProjectCard';
import ProjectDetails from './ProjectDetails';
import { filterProjects, projectTechnologies } from '../../data/projects';

export default function ProjectsGrid({ projects, linkToDetails = false }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [technology, setTechnology] = useState('');
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState(null);
  const searchField = useRef(null);
  const project = linkToDetails
    ? projects.find((item) => String(item.id) === searchParams.get('project'))
    : selected;
  const technologies = projectTechnologies(projects);
  const results = filterProjects(projects, query, technology);
  const isFiltered = Boolean(query.trim() || technology);

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
            ref={searchField} onChange={(event) => setQuery(event.target.value)} />
        </div>
        <select aria-label="Filter by technology" value={technology} onChange={(event) => setTechnology(event.target.value)}>
          <option value="">All technologies</option>
          {technologies.map((item) => <option key={item}>{item}</option>)}
        </select>
      </search>
      {isFiltered && <div className="portfolio-filter-summary">
        <p role="status">{results.length} of {projects.length} projects</p>
        <button type="button" onClick={() => {
          setQuery('');
          setTechnology('');
          searchField.current.focus();
        }}>Clear filters</button>
      </div>}
      {results.length ? (
        <div className="portfolio-projects-grid">
          {results.map((item) => <ProjectCard key={item.id} project={item} onOpen={() => chooseProject(item)} />)}
        </div>
      ) : <p className="portfolio-empty" role="status">No projects match. Try another search or technology.</p>}
      <ProjectDetails project={project} onClose={() => project && chooseProject(null)} />
    </>
  );
}
