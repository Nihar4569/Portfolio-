import React from 'react';
import { FiAward, FiCode, FiLayers } from 'react-icons/fi';
import projects, { projectTechnologies } from '../data/projects';
import { profile } from '../data/profile';
import { PageContainer } from '../styles/SharedComponents';
import ProjectsGrid from '../components/projects/ProjectsGrid';

const stats = [
  { value: projects.length, label: 'Projects', icon: FiCode },
  { value: projectTechnologies(projects).length, label: 'Technologies', icon: FiLayers },
  { value: profile.hackathonCount, label: 'Hackathons', icon: FiAward },
];

export default function ProjectsPage() {
  return (
    <PageContainer>
      <section className="portfolio-projects-page" aria-labelledby="projects-heading">
        <header className="portfolio-projects-heading">
          <h1 id="projects-heading">Projects</h1>
          <p>Explore my work across various technologies and domains</p>
          <dl className="portfolio-project-stats">
            {stats.map(({ value, label, icon: Icon }) => (
              <div key={label}>
                <dt>{label}</dt>
                <dd><Icon aria-hidden="true" /><span>{value}</span></dd>
              </div>
            ))}
          </dl>
        </header>
        <ProjectsGrid projects={projects} linkToDetails />
      </section>
    </PageContainer>
  );
}
