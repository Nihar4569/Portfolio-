import React, { useState, useContext } from 'react';
import styled from 'styled-components';
import { ThemeContext } from '../../context/ThemeContext';
import skills from '../../data/skills';

// Import tech logos
import { 
  FaJava, FaJs, FaPython, FaReact, FaNodeJs, 
  FaDatabase, FaServer, FaGitAlt, FaHtml5, FaCss3Alt, 
  FaDocker
} from 'react-icons/fa';
import { SiSpringboot, SiMongodb, SiMysql, SiExpress, SiSocketdotio, SiFirebase } from 'react-icons/si';

const TechStack = () => {
  const [activeCategory, setActiveCategory] = useState('programming');
  const { isDark } = useContext(ThemeContext);
  
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
      default: return null;
    }
  };

  return (
    <TechStackContainer>
      <Categories>
        {Object.keys(skills).map(category => (
          <CategoryButton 
            key={category}
            active={activeCategory === category}
            onClick={() => setActiveCategory(category)}
            isDark={isDark}
          >
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </CategoryButton>
        ))}
      </Categories>
      
      <SkillsContainer>
        {skills[activeCategory].map((skill, index) => (
          <SkillCard key={index} isDark={isDark}>
            <SkillIcon>{getIcon(skill.icon)}</SkillIcon>
            <SkillName>{skill.name}</SkillName>
            <SkillLevel>
              <LevelBar>
                <FilledLevel level={skill.level} isDark={isDark} />
              </LevelBar>
              <LevelPercentage>{skill.level}%</LevelPercentage>
            </SkillLevel>
          </SkillCard>
        ))}
      </SkillsContainer>
      
      <SkillsCloud>
        <CloudTitle>All Technologies</CloudTitle>
        <CloudContainer>
          {Object.values(skills).flat().map((skill, index) => (
            <CloudItem key={index} level={skill.level} isDark={isDark}>
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
  padding: 0 2rem;
`;

const Categories = styled.div`
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 3rem;
`;

const CategoryButton = styled.button`
  padding: 0.7rem 1.5rem;
  background-color: ${props => props.active 
    ? props.isDark
      ? 'linear-gradient(135deg, #00bcd4, #00e676)'
      : 'linear-gradient(135deg, #3498db, #2ecc71)'
    : props.theme.cardBackground
  };
  color: ${props => props.active ? 'white' : props.theme.text};
  border: none;
  border-radius: 30px;
  font-weight: ${props => props.active ? '600' : '400'};
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: ${props => props.active 
    ? '0 10px 20px rgba(0, 0, 0, 0.1)' 
    : '0 5px 15px rgba(0, 0, 0, 0.05)'
  };
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
  }
  
  ${props => props.active && `
    background: ${props.isDark 
      ? 'linear-gradient(135deg, #00bcd4, #00e676)' 
      : 'linear-gradient(135deg, #3498db, #2ecc71)'
    };
  `}
`;

const SkillsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 2rem;
  margin-bottom: 4rem;
`;

const SkillCard = styled.div`
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
      color: ${props => props.isDark ? '#00bcd4' : '#3498db'};
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

const SkillLevel = styled.div`
  width: 100%;
`;

const LevelBar = styled.div`
  height: 10px;
  background-color: ${props => props.theme.borderColor};
  border-radius: 5px;
  overflow: hidden;
  margin-bottom: 0.5rem;
`;

const FilledLevel = styled.div`
  height: 100%;
  width: ${props => props.level}%;
  background: ${props => props.isDark 
    ? 'linear-gradient(90deg, #00bcd4, #00e676)' 
    : 'linear-gradient(90deg, #3498db, #2ecc71)'
  };
  border-radius: 5px;
  transition: width 1s ease;
`;

const LevelPercentage = styled.div`
  font-size: 0.9rem;
  text-align: right;
  color: ${props => props.theme.textSecondary};
`;

const SkillsCloud = styled.div`
  margin-top: 4rem;
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
  gap: 1.5rem;
  padding: 2rem;
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
    color: ${props => props.isDark ? '#00bcd4' : '#3498db'};
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