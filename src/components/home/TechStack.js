import React, { useState } from 'react';
import styled from 'styled-components';
import skills from '../../data/skills';

// Import tech logos
import { 
  FaJava, FaJs, FaPython, FaReact, FaNodeJs, 
  FaDatabase, FaServer, FaGitAlt, FaBrain, FaCogs
} from 'react-icons/fa';
import { SiSpringboot, SiMongodb, SiMysql, SiExpress, SiSocketdotio, SiFirebase, SiRedis, SiFlask, SiFastapi } from 'react-icons/si';

const TechStack = () => {
  const [activeCategory, setActiveCategory] = useState('programming');
  const categoryLabels = {
    programming: 'Languages',
    frameworks: 'Frameworks',
    databases: 'Databases',
    aiLlm: 'AI & LLM',
    tools: 'Tools',
    other: 'Other'
  };
  
  const getIcon = (iconName, size = '2.5rem') => {
    const iconProps = { size, style: { marginBottom: '10px' } };
    
    switch(iconName.toLowerCase()) {
      case 'java': return <FaJava {...iconProps} />;
      case 'javascript': return <FaJs {...iconProps} />;
      case 'python': return <FaPython {...iconProps} />;
      case 'c': return <span style={{ ...iconProps.style, fontSize: size, fontWeight: 'bold' }}>C/C++</span>;
      case 'react': return <FaReact {...iconProps} />;
      case 'node': return <FaNodeJs {...iconProps} />;
      case 'express': return <SiExpress {...iconProps} />;
      case 'spring': return <SiSpringboot {...iconProps} />;
      case 'mongodb': return <SiMongodb {...iconProps} />;
      case 'mysql': return <SiMysql {...iconProps} />;
      case 'oracle': return <FaDatabase {...iconProps} />;
      case 'git': return <FaGitAlt {...iconProps} />;
      case 'firebase': return <SiFirebase {...iconProps} />;
      case 'socketio': return <SiSocketdotio {...iconProps} />;
      case 'api': return <FaServer {...iconProps} />;
      case 'network': return <span style={{ ...iconProps.style, fontSize: size, fontWeight: 'bold' }}>TCP/IP</span>;
      case 'redis': return <SiRedis {...iconProps} />;
      case 'flask': return <SiFlask {...iconProps} />;
      case 'fastapi': return <SiFastapi {...iconProps} />;
      case 'ai': return <FaBrain {...iconProps} />;
      case 'database': return <FaDatabase {...iconProps} />;
      case 'thread': return <FaCogs {...iconProps} />;
      case 'design': return <FaCogs {...iconProps} />;
      default: return <FaDatabase {...iconProps} />;
    }
  };

  return (
    <TechStackContainer>
      <Categories>
        {Object.keys(skills).map(category => (
          <CategoryButton 
            key={category}
            $active={activeCategory === category}
            aria-pressed={activeCategory === category}
            onClick={() => setActiveCategory(category)}

          >
            {categoryLabels[category] || category.charAt(0).toUpperCase() + category.slice(1)}
          </CategoryButton>
        ))}
      </Categories>
      
      <SkillsContainer>
        {skills[activeCategory].map((skill, index) => (
          <SkillCard key={index}>
            <SkillIcon>{getIcon(skill.icon)}</SkillIcon>
            <SkillName>{skill.name}</SkillName>
          </SkillCard>
        ))}
      </SkillsContainer>
      
      <SkillsCloud>
        <CloudTitle>All Technologies</CloudTitle>
        <CloudContainer>
          {Object.values(skills).flat().map((skill, index) => (
            <CloudItem key={index} level={skill.level}>
              {getIcon(skill.icon, '1.8rem')}
              <CloudItemName>{skill.name}</CloudItemName>
            </CloudItem>
          ))}
        </CloudContainer>
      </SkillsCloud>
    </TechStackContainer>
  );
};

// Styled Components
const TechStackContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding-inline: clamp(0rem, 5vw - 1.75rem, 2rem);
`;

const Categories = styled.div`
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: clamp(0.5rem, 2vw, 1rem);
  margin-bottom: clamp(1.5rem, 4vw, 3rem);
`;

const CategoryButton = styled.button`
  padding: 0.7rem 1.35rem;
  min-height: 44px;
  background-color: ${props => props.$active ? props.theme.buttonBackground : props.theme.cardBackground};
  color: ${props => props.$active ? props.theme.buttonText : props.theme.text};
  border: 1px solid ${props => props.$active ? props.theme.primary : props.theme.inputBorder};
  border-radius: 24px;
  font: 500 0.87rem 'Poppins', sans-serif;
  &:hover { border-color: ${props => props.theme.primary}; }
`;

const SkillsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(min(100%, 220px), 1fr));
  gap: clamp(0.85rem, 3vw, 2rem);
`;

const SkillCard = styled.div`
  border: 1px solid ${props => props.theme.borderColor};
  background-color: ${props => props.theme.cardBackground};
  border-radius: 10px;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  
  &:hover {
    transform: translateY(-10px);
    box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
    
    svg, span {
      color: ${props => props.theme.primary};
    }
  }
`;

const SkillIcon = styled.div`
  font-size: 2.5rem;
  color: ${props => props.theme.primary};
  margin-bottom: 1rem;
  transition: color 0.3s ease;
`;

const SkillName = styled.h3`
  font-size: 1.2rem;
  margin-bottom: 1.5rem;
  text-align: center;
`;

const SkillsCloud = styled.div`
  margin-top: clamp(2rem, 5vw, 4rem);
  text-align: center;
`;

const CloudTitle = styled.h3`
  font-size: 1.5rem;
  margin-bottom: 2rem;
  display: inline-block;
  position: relative;
  
  &:after {
    content: '';
    position: absolute;
    bottom: -8px;
    left: 0;
    width: 100%;
    height: 3px;
    background: linear-gradient(90deg, ${props => props.theme.primary}, ${props => props.theme.secondary});
    border-radius: 1.5px;
  }
`;

const CloudContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: clamp(0.35rem, 2vw, 1.5rem);
  padding: clamp(0.75rem, 4vw, 2rem);
  background-color: ${props => props.theme.cardBackground};
  border-radius: 15px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.05);
`;

const CloudItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: ${props => 0.8 + props.level / 100 * 0.5}rem;
  color: ${props => props.theme.textSecondary};
  transition: all 0.3s ease;
  padding: 0.8rem;
  opacity: ${props => 0.7 + props.level / 100 * 0.3};
  
  &:hover {
    transform: scale(1.2);
    color: ${props => props.theme.primary};
    opacity: 1;
  }
  
  svg {
    margin-bottom: 8px;
  }
`;

const CloudItemName = styled.span`
  font-size: 0.85em;
  text-align: center;
`;

export default TechStack;
