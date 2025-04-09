import React, { useContext, useState } from 'react';
import styled from 'styled-components';
import { ThemeContext } from '../context/ThemeContext';
import { FiMail, FiMapPin, FiPhone, FiGithub, FiLinkedin, FiSend, FiTerminal } from 'react-icons/fi';


const ContactPage = () => {
  const { isDark } = useContext(ThemeContext);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  
  const [formStatus, setFormStatus] = useState({
    submitted: false,
    submitting: false,
    error: null
  });
  
  // Command line typing animation for the terminal
  const [terminalCommands, setTerminalCommands] = useState([
    { text: 'cd /home/nihar/contact', processed: true },
    { text: 'cat contact_info.json', processed: true },
    { text: '{"email":"nihar4569@gmail.com","phone":"+91 6370332583","location":"Bhubaneswar, Odisha, India"}', processed: true },
    { text: 'git status', processed: true },
    { text: '# On branch main - Your contact form is ready to be filled', processed: true },
    { text: 'npm run connect', processed: false }
  ]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.name || !formData.email || !formData.message) {
      setFormStatus({
        submitted: false,
        submitting: false,
        error: 'Please fill out all required fields.'
      });
      return;
    }
    
    setFormStatus({
      submitted: false,
      submitting: true,
      error: null
    });
    
    // Add terminal command
    setTerminalCommands([
      ...terminalCommands,
      { text: `git commit -m "Message from ${formData.name}"`, processed: true },
      { text: 'Sending message...', processed: true }
    ]);
    
    // Simulate form submission with a delay
    setTimeout(() => {
      setFormStatus({
        submitted: true,
        submitting: false,
        error: null
      });
      
      // Add a success message to terminal
      setTerminalCommands(prev => [
        ...prev,
        { text: '✓ Message sent successfully!', processed: true }
      ]);
      
      // Reset form after submission
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
    }, 2000);
  };
  
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
              <Terminal isDark={isDark}>
                <TerminalHeader>
                  <TerminalButton className="red" />
                  <TerminalButton className="yellow" />
                  <TerminalButton className="green" />
                  <TerminalTitle>nihar@portfolio ~ contact</TerminalTitle>
                </TerminalHeader>
                <TerminalBody>
                  {terminalCommands.map((command, index) => (
                    <TerminalLine key={index} className={command.processed ? '' : 'current'}>
                      {command.processed ? (
                        <>
                          <TerminalPrompt>nihar@portfolio:~$</TerminalPrompt> {command.text}
                        </>
                      ) : (
                        <>
                          <TerminalPrompt>nihar@portfolio:~$</TerminalPrompt> {command.text}
                          <TerminalCursor />
                        </>
                      )}
                    </TerminalLine>
                  ))}
                </TerminalBody>
              </Terminal>
              
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
              <FormHeading>Send Me a Message</FormHeading>
              
              {formStatus.error && (
                <FormError>{formStatus.error}</FormError>
              )}
              
              {formStatus.submitted ? (
                <SuccessMessage isDark={isDark}>
                  <FiTerminal />
                  <span>Thank you for your message! I'll get back to you soon.</span>
                </SuccessMessage>
              ) : (
                <Form onSubmit={handleSubmit}>
                  <FormGroup>
                    <FormLabel htmlFor="name">Name <RequiredStar>*</RequiredStar></FormLabel>
                    <FormInput
                      type="text"
                      id="name"
                      name="name"
                      placeholder="Your Name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </FormGroup>
                  
                  <FormGroup>
                    <FormLabel htmlFor="email">Email <RequiredStar>*</RequiredStar></FormLabel>
                    <FormInput
                      type="email"
                      id="email"
                      name="email"
                      placeholder="Your Email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </FormGroup>
                  
                  <FormGroup>
                    <FormLabel htmlFor="subject">Subject</FormLabel>
                    <FormInput
                      type="text"
                      id="subject"
                      name="subject"
                      placeholder="Subject"
                      value={formData.subject}
                      onChange={handleChange}
                    />
                  </FormGroup>
                  
                  <FormGroup>
                    <FormLabel htmlFor="message">Message <RequiredStar>*</RequiredStar></FormLabel>
                    <FormTextarea
                      id="message"
                      name="message"
                      placeholder="Your Message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                    />
                  </FormGroup>
                  
                  <SubmitButton type="submit" disabled={formStatus.submitting} isDark={isDark}>
                    {formStatus.submitting ? (
                      <>
                        <LoadingSpinner />
                        Sending...
                      </>
                    ) : (
                      <>
                        <FiSend />
                        Send Message
                      </>
                    )}
                  </SubmitButton>
                </Form>
              )}
            </ContactFormContainer>
          </ContactGrid>
        </SectionContainer>
      </ContactSection>
    </PageContainer>
  );
};

// Keyframes
const blink = `
  @keyframes blink {
    0%, 100% { opacity: 1; }
    50% { opacity: 0; }
  }
`;

const rotate = `
  @keyframes rotate {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
`;

// Styled Components
// In AlbumsPage.js, update the existing PageContainer
const PageContainer = styled.div`
  min-height: 100vh;
  padding-top: 80px; // Added this line
  
  @media (max-width: 768px) {
    padding-top: 70px; // Added this line
  }
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
  display: flex;
  flex-direction: column;
  height: 100%;
`;

const Terminal = styled.div`
  background-color: ${props => props.isDark ? '#1e1e1e' : '#f1f1f1'};
  border-radius: 10px;
  overflow: hidden;
  font-family: 'Fira Code', monospace;
  margin-bottom: 2rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
`;

const TerminalHeader = styled.div`
  background-color: ${props => props.theme.isDark ? '#323232' : '#e0e0e0'};
  padding: 8px 15px;
  display: flex;
  align-items: center;
`;

const TerminalButton = styled.div`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  margin-right: 8px;
  
  &.red {
    background-color: #ff5f56;
  }
  
  &.yellow {
    background-color: #ffbd2e;
  }
  
  &.green {
    background-color: #27c93f;
  }
`;

const TerminalTitle = styled.div`
  color: ${props => props.theme.isDark ? '#cccccc' : '#555555'};
  font-size: 0.8rem;
  margin-left: 8px;
`;

const TerminalBody = styled.div`
  padding: 15px;
  color: ${props => props.theme.isDark ? '#f0f0f0' : '#333333'};
  font-size: 0.9rem;
  line-height: 1.6;
  max-height: 300px;
  overflow-y: auto;
  
  &::-webkit-scrollbar {
    width: 8px;
  }
  
  &::-webkit-scrollbar-track {
    background: ${props => props.theme.isDark ? '#1e1e1e' : '#f1f1f1'};
  }
  
  &::-webkit-scrollbar-thumb {
    background: ${props => props.theme.isDark ? '#555555' : '#cccccc'};
    border-radius: 4px;
  }
`;

const TerminalLine = styled.div`
  margin-bottom: 8px;
  white-space: pre-wrap;
  word-break: break-word;
  
  &.current {
    color: ${props => props.theme.primary};
  }
`;

const TerminalPrompt = styled.span`
  color: ${props => props.theme.primary};
  margin-right: 10px;
`;

const TerminalCursor = styled.span`
  display: inline-block;
  width: 8px;
  height: 15px;
  background-color: ${props => props.theme.primary};
  animation: blink 1s infinite;
  vertical-align: middle;
  margin-left: 5px;
`;

const ContactInfoList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0 0 2rem 0;
`;

const ContactInfoItem = styled.li`
  display: flex;
  align-items: center;
  margin-bottom: 1.5rem;
  padding: 1rem;
  background-color: ${props => props.theme.cardBackground};
  border-radius: 10px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
  transition: transform 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
  }
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
  margin: 0 0 0.3rem 0;
`;

const ContactInfoValue = styled.p`
  font-size: 1.1rem;
  color: ${props => props.theme.text};
  margin: 0;
  
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
  padding: 3rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  
  @media (max-width: 768px) {
    padding: 2rem;
  }
`;

const FormHeading = styled.h2`
  font-size: 2rem;
  margin-bottom: 2rem;
  color: ${props => props.theme.text};
  position: relative;
  
  &:after {
    content: '';
    position: absolute;
    bottom: -10px;
    left: 0;
    width: 60px;
    height: 4px;
    background: linear-gradient(90deg, ${props => props.theme.primary}, ${props => props.theme.secondary});
    border-radius: 2px;
  }
`;

const Form = styled.form`
  width: 100%;
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const FormLabel = styled.label`
  display: block;
  font-size: 1rem;
  margin-bottom: 0.5rem;
  color: ${props => props.theme.text};
  font-weight: 500;
`;

const RequiredStar = styled.span`
  color: ${props => props.theme.error};
  margin-left: 4px;
`;

const FormInput = styled.input`
  width: 100%;
  padding: 1rem;
  border-radius: 10px;
  border: 1px solid ${props => props.theme.borderColor};
  background-color: ${props => props.theme.inputBackground};
  color: ${props => props.theme.text};
  font-size: 1rem;
  transition: all 0.3s ease;
  font-family: 'Fira Code', monospace;
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.primary};
    box-shadow: 0 0 0 2px ${props => props.theme.primary}30;
  }
  
  &::placeholder {
    color: ${props => props.theme.textSecondary};
    opacity: 0.7;
  }
`;

const FormTextarea = styled.textarea`
  width: 100%;
  padding: 1rem;
  border-radius: 10px;
  border: 1px solid ${props => props.theme.borderColor};
  background-color: ${props => props.theme.inputBackground};
  color: ${props => props.theme.text};
  font-size: 1rem;
  min-height: 150px;
  resize: vertical;
  transition: all 0.3s ease;
  font-family: 'Fira Code', monospace;
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.primary};
    box-shadow: 0 0 0 2px ${props => props.theme.primary}30;
  }
  
  &::placeholder {
    color: ${props => props.theme.textSecondary};
    opacity: 0.7;
  }
`;

const SubmitButton = styled.button`
  width: 100%;
  padding: 1rem;
  border-radius: 10px;
  border: none;
  background: ${props => props.isDark 
    ? 'linear-gradient(135deg, #00bcd4, #00e676)' 
    : 'linear-gradient(135deg, #3498db, #2ecc71)'
  };
  color: white;
  font-size: 1rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  
  svg {
    margin-right: 8px;
  }
  
  &:hover:not(:disabled) {
    transform: translateY(-3px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
  }
  
  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

const LoadingSpinner = styled.div`
  width: 20px;
  height: 20px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: white;
  animation: rotate 1s linear infinite;
  margin-right: 10px;
`;

const FormError = styled.div`
  padding: 1rem;
  margin-bottom: 1.5rem;
  background-color: ${props => props.theme.error}20;
  color: ${props => props.theme.error};
  border-radius: 10px;
  font-size: 0.9rem;
`;

const SuccessMessage = styled.div`
  padding: 2rem;
  border-radius: 10px;
  background: ${props => props.isDark 
    ? 'linear-gradient(135deg, rgba(0, 188, 212, 0.1), rgba(0, 230, 118, 0.1))' 
    : 'linear-gradient(135deg, rgba(52, 152, 219, 0.1), rgba(46, 204, 113, 0.1))'
  };
  border: 1px solid ${props => props.isDark ? '#00bcd4' : '#3498db'};
  display: flex;
  align-items: center;
  
  svg {
    width: 50px;
    height: 50px;
    margin-right: 1rem;
    padding: 10px;
    border-radius: 50%;
    background-color: ${props => props.isDark ? '#00e676' : '#2ecc71'};
    color: white;
  }
  
  span {
    font-size: 1.1rem;
    color: ${props => props.theme.text};
  }
`;

export default ContactPage;