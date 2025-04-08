import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import ProjectCard from './ProjectCard';

const ProjectsGrid = ({ projects }) => {
  const [filteredProjects, setFilteredProjects] = useState(projects);
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Get unique tech categories from projects
  const techCategories = ['all', ...new Set(
    projects.flatMap(project => project.techStack.map(tech => tech.toLowerCase()))
  )].sort();
  
  useEffect(() => {
    filterProjects(activeFilter, searchQuery);
  }, [activeFilter, searchQuery, projects]);
  
  const filterProjects = (filter, query) => {
    let filtered = [...projects];
    
    // Apply tech filter
    if (filter !== 'all') {
      filtered = filtered.filter(project => 
        project.techStack.some(tech => tech.toLowerCase() === filter.toLowerCase())
      );
    }
    
    // Apply search filter
    if (query.trim() !== '') {
      const searchTerms = query.toLowerCase().trim().split(' ');
      filtered = filtered.filter(project => {
        const projectText = `${project.title} ${project.description} ${project.techStack.join(' ')}`.toLowerCase();
        return searchTerms.every(term => projectText.includes(term));
      });
    }
    
    setFilteredProjects(filtered);
  };
  
  const handleFilterClick = (filter) => {
    setActiveFilter(filter);
  };
  
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };
  
  return (
    <ProjectsContainer>
      <ProjectsFilter>
        <SearchContainer>
          <SearchInput 
            type="text" 
            placeholder="Search projects..." 
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </SearchContainer>
        
        <FilterButtons>
          {techCategories.map((category, index) => (
            <FilterButton 
              key={index} 
              active={activeFilter === category}
              onClick={() => handleFilterClick(category)}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </FilterButton>
          ))}
        </FilterButtons>
      </ProjectsFilter>
      
      {filteredProjects.length > 0 ? (
        <ProjectsGridContainer>
          {filteredProjects.map(project => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </ProjectsGridContainer>
      ) : (
        <NoProjectsFound>
          <h3>No projects found</h3>
          <p>Try changing your search terms or filters</p>
        </NoProjectsFound>
      )}
    </ProjectsContainer>
  );
};

// Styled Components
const ProjectsContainer = styled.div`
  width: 100%;
`;

const ProjectsFilter = styled.div`
  margin-bottom: 3rem;
`;

const SearchContainer = styled.div`
  margin-bottom: 1.5rem;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 1rem 1.5rem;
  border-radius: 50px;
  border: none;
  background-color: ${props => props.theme.cardBackground};
  color: ${props => props.theme.text};
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
  font-size: 1rem;
  transition: all 0.3s ease;
  
  &:focus {
    outline: none;
    box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
    transform: translateY(-2px);
  }
  
  &::placeholder {
    color: ${props => props.theme.textSecondary};
  }
`;

const FilterButtons = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.8rem;
  justify-content: center;
`;

const FilterButton = styled.button`
  padding: 0.6rem 1.2rem;
  border-radius: 20px;
  border: none;
  background-color: ${props => props.active ? props.theme.primary : props.theme.cardBackground};
  color: ${props => props.active ? 'white' : props.theme.text};
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  }
`;

const ProjectsGridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 2rem;
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  }
`;

const NoProjectsFound = styled.div`
  text-align: center;
  padding: 3rem;
  background-color: ${props => props.theme.cardBackground};
  border-radius: 10px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
  
  h3 {
    font-size: 1.5rem;
    margin-bottom: 1rem;
    color: ${props => props.theme.text};
  }
  
  p {
    color: ${props => props.theme.textSecondary};
  }
`;

export default ProjectsGrid;