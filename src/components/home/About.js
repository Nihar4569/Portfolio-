import React, { useContext } from 'react';
import styled from 'styled-components';
import { ThemeContext } from '../../context/ThemeContext';
import { FiAward, FiCode, FiServer, FiDatabase, FiLayout } from 'react-icons/fi';

const About = () => {
  const { isDark } = useContext(ThemeContext);

  return (
    <AboutSection id="about">
      <AboutContainer>
        <SectionTitle>About Me</SectionTitle>
        <AboutContent>
          <AboutImageContainer>
            <AboutImageWrapper>
              <AboutImage src="/images/placeholder/profile.png" alt="Nihar Ranjan Sahu" />
              <ImageBorder isDark={isDark} />
            </AboutImageWrapper>
            <Trophy>
              <FiAward />
              <TrophyText>Smart India Hackathon 2022 Winner</TrophyText>
            </Trophy>
          </AboutImageContainer>
          
          <AboutInfo>
            <AboutText>
              I'm a passionate Software Engineer specializing in Full Stack Development with a strong 
              foundation in Java and web technologies. Currently pursuing my B.Tech in Computer Science
              from Siksha 'O' Anusandhan University, I'm focused on building impactful applications that
              solve real-world problems.
            </AboutText>
            
            <AboutText>
              As a winner of the Smart India Hackathon 2022, I thrive in challenging environments and 
              am constantly looking to expand my knowledge and skills. I'm particularly interested in 
              building scalable web applications and services that provide exceptional user experiences.
            </AboutText>
            
            <SkillBoxes>
              <SkillBox>
                <SkillIcon>
                  <FiCode />
                </SkillIcon>
                <SkillTitle>Frontend</SkillTitle>
                <SkillList>React, HTML, CSS, JavaScript</SkillList>
              </SkillBox>
              
              <SkillBox>
                <SkillIcon>
                  <FiServer />
                </SkillIcon>
                <SkillTitle>Backend</SkillTitle>
                <SkillList>Java, Spring Boot, Node.js, Express</SkillList>
              </SkillBox>
              
              <SkillBox>
                <SkillIcon>
                  <FiDatabase />
                </SkillIcon>
                <SkillTitle>Database</SkillTitle>
                <SkillList>MongoDB, MySQL, Oracle SQL</SkillList>
              </SkillBox>
              
              <SkillBox>
                <SkillIcon>
                  <FiLayout />
                </SkillIcon>
                <SkillTitle>Others</SkillTitle>
                <SkillList>Git, Firebase, Socket.io, TCP/IP</SkillList>
              </SkillBox>
            </SkillBoxes>
            
            <AboutStats>
              <StatItem>
                <StatNumber>7+</StatNumber>
                <StatText>Projects Completed</StatText>
              </StatItem>
              
              <StatDivider />
              
              <StatItem>
                <StatNumber>3+</StatNumber>
                <StatText>Years Coding</StatText>
              </StatItem>
              
              <StatDivider />
              
              <StatItem>
                <StatNumber>5+</StatNumber>
                <StatText>Technologies</StatText>
              </StatItem>
            </AboutStats>
          </AboutInfo>
        </AboutContent>
      </AboutContainer>
    </AboutSection>
  );
};

// Styled Components
const AboutSection = styled.section`
  padding: 8rem 0 5rem;
  background-color: ${props => props.theme.surface};
`;

const AboutContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
`;

const SectionTitle = styled.h2`
  font-size: 2.5rem;
  text-align: center;
  margin-bottom: 3rem;
  position: relative;
  display: inline-block;
  left: 50%;
  transform: translateX(-50%);
  
  &:after {
    content: '';
    position: absolute;
    bottom: -10px;
    left: 50%;
    transform: translateX(-50%);
    width: 80px;
    height: 4px;
    background: linear-gradient(90deg, ${props => props.theme.primary}, ${props => props.theme.secondary});
    border-radius: 2px;
  }
`;

const AboutContent = styled.div`
  display: grid;
  grid-template-columns: 1fr 1.5fr;
  gap: 3rem;
  
  @media (max-width: 992px) {
    grid-template-columns: 1fr;
  }
`;

const AboutImageContainer = styled.div`
  position: relative;
  height: fit-content;
`;

const AboutImageWrapper = styled.div`
  position: relative;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
`;

const AboutImage = styled.img`
  width: 100%;
  height: auto;
  display: block;
  transition: transform 0.5s ease;
  
  &:hover {
    transform: scale(1.05);
  }
`;

const ImageBorder = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border: 4px solid transparent;
  border-radius: 20px;
  background: ${props => props.isDark
    ? 'linear-gradient(45deg, #00bcd4, #00e676) border-box'
    : 'linear-gradient(45deg, #3498db, #2ecc71) border-box'
  };
  -webkit-mask: 
    linear-gradient(#fff 0 0) padding-box, 
    linear-gradient(#fff 0 0);
  -webkit-mask-composite: destination-out;
  mask-composite: exclude;
`;

const Trophy = styled.div`
  position: absolute;
  bottom: -20px;
  right: 20px;
  background: linear-gradient(135deg, ${props => props.theme.primary}, ${props => props.theme.secondary});
  color: white;
  padding: 0.7rem 1.5rem;
  border-radius: 10px;
  display: flex;
  align-items: center;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  
  svg {
    font-size: 1.5rem;
    margin-right: 8px;
  }
`;

const TrophyText = styled.span`
  font-weight: 600;
`;

const AboutInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

const AboutText = styled.p`
  font-size: 1.1rem;
  line-height: 1.8;
  color: ${props => props.theme.text};
  margin-bottom: 1.5rem;
`;

const SkillBoxes = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
  margin: 2rem 0;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const SkillBox = styled.div`
  background-color: ${props => props.theme.cardBackground};
  border-radius: 10px;
  padding: 1.5rem;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  }
`;

const SkillIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 8px;
  background: linear-gradient(135deg, ${props => props.theme.primary}, ${props => props.theme.secondary});
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1rem;
  color: white;
  font-size: 1.5rem;
`;

const SkillTitle = styled.h3`
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
  color: ${props => props.theme.text};
`;

const SkillList = styled.p`
  color: ${props => props.theme.textSecondary};
  font-size: 0.95rem;
`;

const AboutStats = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: ${props => props.theme.cardBackground};
  border-radius: 10px;
  padding: 1.5rem;
  margin-top: 1rem;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1.5rem;
  }
`;

const StatItem = styled.div`
  text-align: center;
  flex: 1;
`;

const StatNumber = styled.h3`
  font-size: 2rem;
  font-weight: 700;
  color: ${props => props.theme.primary};
  margin-bottom: 0.5rem;
`;

const StatText = styled.p`
  color: ${props => props.theme.textSecondary};
  font-size: 0.9rem;
`;

const StatDivider = styled.div`
  width: 1px;
  height: 50px;
  background-color: ${props => props.theme.borderColor};
  
  @media (max-width: 768px) {
    width: 80%;
    height: 1px;
  }
`;

export default About;