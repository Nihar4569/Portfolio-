import React, { useContext } from 'react';
import styled from 'styled-components';
import { ThemeContext } from '../context/ThemeContext';
import ContactForm from '../components/contact/ContactForm';
import { FiMail, FiMapPin, FiPhone, FiGithub, FiLinkedin } from 'react-icons/fi';

const ContactPage = () => {
  const { isDark } = useContext(ThemeContext);
  
  return (
    <PageContainer>
      <HeroSection>
        <HeroContent>
          <PageTitle>Get In Touch</PageTitle>
          <PageSubtitle>Have a question or want to work together? Feel free to contact me!</PageSubtitle>
        </HeroContent>
      </HeroSection>
      
      <ContactSection>
        <SectionContainer>
          <ContactGrid>
            <ContactInfoContainer>
              <ContactHeading>Contact Information</ContactHeading>
              <ContactDescription>
                Feel free to reach out to me through any of these channels.
                I'm always open to discussing new projects, creative ideas, or opportunities to be part of your visions.
              </ContactDescription>
              
              <ContactInfoList>
                <ContactInfoItem>
                  <ContactInfoIcon isDark={isDark}>
                    <FiMail />
                  </ContactInfoIcon>
                  <ContactInfoContent>
                    <ContactInfoLabel>Email</ContactInfoLabel>
                    <ContactInfoValue>
                      <a href="mailto:nihar4569@gmail.com">nihar4569@gmail.com</a>
                    </ContactInfoValue>
                  </ContactInfoContent>
                </ContactInfoItem>
                
                <ContactInfoItem>
                  <ContactInfoIcon isDark={isDark}>
                    <FiMapPin />
                  </ContactInfoIcon>
                  <ContactInfoContent>
                    <ContactInfoLabel>Location</ContactInfoLabel>
                    <ContactInfoValue>Bhubaneswar, Odisha, India</ContactInfoValue>
                  </ContactInfoContent>
                </ContactInfoItem>
                
                <ContactInfoItem>
                  <ContactInfoIcon isDark={isDark}>
                    <FiPhone />
                  </ContactInfoIcon>
                  <ContactInfoContent>
                    <ContactInfoLabel>Phone</ContactInfoLabel>
                    <ContactInfoValue>
                      <a href="tel:+916370332583">+91 6370332583</a>
                    </ContactInfoValue>
                  </ContactInfoContent>
                </ContactInfoItem>
              </ContactInfoList>
              
              <SocialLinks>
                <SocialLink href="https://github.com/Nihar4569" target="_blank" rel="noopener noreferrer" isDark={isDark}>
                  <FiGithub />
                </SocialLink>
                
                <SocialLink href="https://linkedin.com/in/nihar4569" target="_blank" rel="noopener noreferrer" isDark={isDark}>
                  <FiLinkedin />
                </SocialLink>
              </SocialLinks>
            </ContactInfoContainer>
            
            <ContactFormContainer>
              <ContactForm />
            </ContactFormContainer>
          </ContactGrid>
        </SectionContainer>
      </ContactSection>
    </PageContainer>
  );
};

// Styled Components
const PageContainer = styled.div`
  min-height: 100vh;
`;

const HeroSection = styled.section`
  background-color: ${props => props.theme.surface};
  padding: 8rem 0 4rem;
  text-align: center;
`;

const HeroContent = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 0 2rem;
`;

const PageTitle = styled.h1`
  font-size: 3rem;
  margin-bottom: 1.5rem;
  background: linear-gradient(135deg, ${props => props.theme.primary} 0%, ${props => props.theme.secondary} 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-fill-color: transparent;
  
  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

const PageSubtitle = styled.p`
  font-size: 1.2rem;
  color: ${props => props.theme.textSecondary};
  max-width: 600px;
  margin: 0 auto;
`;

const ContactSection = styled.section`
  padding: 5rem 0;
  background-color: ${props => props.theme.background};
`;

const SectionContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
`;

const ContactGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1.5fr;
  gap: 3rem;
  
  @media (max-width: 992px) {
    grid-template-columns: 1fr;
  }
`;

const ContactInfoContainer = styled.div`
  background-color: ${props => props.theme.cardBackground};
  border-radius: 20px;
  padding: 3rem 2rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
`;

const ContactHeading = styled.h2`
  font-size: 1.8rem;
  margin-bottom: 1.5rem;
  color: ${props => props.theme.text};
`;

const ContactDescription = styled.p`
  color: ${props => props.theme.textSecondary};
  margin-bottom: 2.5rem;
  line-height: 1.7;
`;

const ContactInfoList = styled.ul`
  list-style: none;
  padding: 0;
  margin-bottom: 2.5rem;
`;

const ContactInfoItem = styled.li`
  display: flex;
  align-items: flex-start;
  margin-bottom: 1.5rem;
`;

const ContactInfoIcon = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 10px;
  background: ${props => props.isDark 
    ? 'linear-gradient(135deg, #00bcd4, #00e676)' 
    : 'linear-gradient(135deg, #3498db, #2ecc71)'
  };
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  color: white;
  margin-right: 1rem;
  flex-shrink: 0;
`;

const ContactInfoContent = styled.div`
  flex-grow: 1;
`;

const ContactInfoLabel = styled.h4`
  font-size: 1rem;
  color: ${props => props.theme.textSecondary};
  margin-bottom: 0.3rem;
`;

const ContactInfoValue = styled.p`
  font-size: 1.1rem;
  color: ${props => props.theme.text};
  
  a {
    color: ${props => props.theme.text};
    text-decoration: none;
    transition: color 0.3s ease;
    
    &:hover {
      color: ${props => props.theme.primary};
    }
  }
`;

const SocialLinks = styled.div`
  display: flex;
  gap: 1rem;
`;

const SocialLink = styled.a`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: ${props => props.isDark 
    ? 'linear-gradient(135deg, #00bcd4, #00e676)' 
    : 'linear-gradient(135deg, #3498db, #2ecc71)'
  };
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  color: white;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
  }
`;

const ContactFormContainer = styled.div`
  background-color: ${props => props.theme.cardBackground};
  border-radius: 20px;
  padding: 3rem 2rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
`;

export default ContactPage;