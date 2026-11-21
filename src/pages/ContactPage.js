import React, { useRef, useState } from 'react';
import styled, { css, keyframes } from 'styled-components';
import emailjs from '@emailjs/browser';
import { useSound } from '../context/SoundContext';
import { profile } from '../data/profile';
import { PageContainer } from '../styles/SharedComponents';
import { contactMessage } from '../utils/contactMessage';
import { 
  FiMail, FiMapPin, FiPhone, 
  FiGithub, FiLinkedin, FiSend, 
  FiTerminal 
} from 'react-icons/fi';

const ContactPage = () => {
  const { playSound } = useSound();
  const sending = useRef(false);
  const [formStatus, setFormStatus] = useState('idle');
  
  const [terminalCommands, setTerminalCommands] = useState([
    { text: 'cd /home/nihar/contact', processed: true },
    { text: 'cat contact_info.json', processed: true },
    { text: '{"email":"nihar4569@gmail.com","phone":"+91 6370332583","location":"Bengaluru, Karnataka, India"}', processed: true },
    { text: 'git status', processed: true },
    { text: '# Contact form ready', processed: true },
    { text: 'npm run connect', processed: false }
  ]);
  
  async function sendEmail(event) {
    event.preventDefault();
    if (sending.current) return;

    const form = event.currentTarget;
    const fields = new FormData(form);
    for (const [name, prompt] of [['user_name', 'Enter your name.'], ['message', 'Enter a message.']]) {
      if (String(fields.get(name) ?? '').trim()) continue;
      const input = form.elements.namedItem(name);
      input.setCustomValidity(prompt);
      input.reportValidity();
      return;
    }

    sending.current = true;
    setFormStatus('sending');
    setTerminalCommands((previous) => [...previous, { text: 'Sending message…', processed: true }]);

    try {
      await emailjs.send(
        process.env.REACT_APP_EMAILJS_SERVICE_ID,
        process.env.REACT_APP_EMAILJS_TEMPLATE_ID,
        contactMessage(fields),
        process.env.REACT_APP_EMAILJS_PUBLIC_KEY,
      );
      setFormStatus('sent');
      playSound('success');
      setTerminalCommands((previous) => [...previous, { text: '✓ Message sent', processed: true }]);
    } catch {
      setFormStatus('failed');
      playSound('error');
      setTerminalCommands((previous) => [...previous, { text: '✗ Message could not be sent', processed: true }]);
    } finally {
      sending.current = false;
    }
  }

  return (
    <PageContainer>
      <HeroSection>
        <HeroContent data-scroll-reveal="rise">
          <PageTitle>Get In Touch</PageTitle>
          <PageSubtitle>Have a question or want to work together? Feel free to contact me!</PageSubtitle>
        </HeroContent>
      </HeroSection>
      
      <ContactSection>
        <SectionContainer>
          <ContactGrid>
            <ContactInfoContainer data-scroll-reveal="rise">
  <Terminal>
    <TerminalHeader>
      <TerminalButton className="red" />
      <TerminalButton className="yellow" />
      <TerminalButton className="green" />
      <TerminalTitle>nihar@portfolio ~ contact</TerminalTitle>
    </TerminalHeader>
    
    <TerminalBody>
      {terminalCommands.map((cmd, index) => (
        <TerminalLine key={index} className={!cmd.processed ? 'current' : ''}>
          {cmd.processed ? (
            <>
              <TerminalPrompt>nihar@portfolio:~$</TerminalPrompt> {cmd.text}
            </>
          ) : (
            <>
              <TerminalPrompt>nihar@portfolio:~$</TerminalPrompt> {cmd.text}
              <TerminalCursor />
            </>
          )}
        </TerminalLine>
      ))}
    </TerminalBody>
  </Terminal>
  
  <ContactInfoList>
    <ContactInfoItem>
      <ContactInfoIcon>
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
      <ContactInfoIcon>
        <FiPhone />
      </ContactInfoIcon>
      <ContactInfoContent>
        <ContactInfoLabel>Phone</ContactInfoLabel>
        <ContactInfoValue>
          <a href="tel:+916370332583">+91 6370332583</a>
        </ContactInfoValue>
      </ContactInfoContent>
    </ContactInfoItem>
    
    <ContactInfoItem>
      <ContactInfoIcon>
        <FiMapPin />
      </ContactInfoIcon>
      <ContactInfoContent>
        <ContactInfoLabel>Location</ContactInfoLabel>
        <ContactInfoValue>Bengaluru, Karnataka, India</ContactInfoValue>
      </ContactInfoContent>
    </ContactInfoItem>
  </ContactInfoList>
  
  <SocialLinks>
    <SocialLink 
      href="https://github.com/Nihar4569" 
      target="_blank" 
      rel="noopener noreferrer"
    >
      <FiGithub />
    </SocialLink>
    
    <SocialLink 
      href="https://linkedin.com/in/nihar4569" 
      target="_blank" 
      rel="noopener noreferrer"
    >
      <FiLinkedin />
    </SocialLink>
    
    <SocialLink 
      href="mailto:nihar4569@gmail.com"
    >
      <FiMail />
    </SocialLink>
  </SocialLinks>
</ContactInfoContainer>
            
            <ContactFormContainer data-scroll-reveal="depth">
              <FormHeading id="contact-form-title">Send Me a Message</FormHeading>

              {formStatus === 'failed' && (
                <FormError role="alert">
                  Your message couldn’t be sent. Try again or <a href={`mailto:${profile.email}`}>email me</a>.
                </FormError>
              )}

              <div role="status">
                {formStatus === 'sent' && <SuccessMessage>
                  <FiTerminal aria-hidden="true" />
                  <span>Message sent. I’ll reply to the email address you provided.</span>
                </SuccessMessage>}
              </div>

              {formStatus !== 'sent' && (
                <Form method="post" aria-labelledby="contact-form-title" aria-busy={formStatus === 'sending'}
                  onSubmit={sendEmail} onInput={(event) => event.target.setCustomValidity('')}>
                  <FormGroup>
                    <FormLabel htmlFor="user_name">Name <RequiredStar aria-hidden="true">*</RequiredStar></FormLabel>
                    <FormInput
                      type="text"
                      id="user_name"
                      name="user_name"
                      autoComplete="name"
                      enterKeyHint="next"
                      required
                    />
                  </FormGroup>
                  
                  <FormGroup>
                    <FormLabel htmlFor="user_email">Email <RequiredStar aria-hidden="true">*</RequiredStar></FormLabel>
                    <FormInput
                      type="email"
                      id="user_email"
                      name="user_email"
                      autoComplete="email"
                      autoCapitalize="none"
                      spellCheck={false}
                      enterKeyHint="next"
                      required
                    />
                  </FormGroup>
                  
                  <FormGroup>
                    <FormLabel htmlFor="subject">Subject <OptionalField>Optional</OptionalField></FormLabel>
                    <FormInput
                      type="text"
                      id="subject"
                      name="subject"
                      placeholder="Project collaboration"
                      enterKeyHint="next"
                    />
                  </FormGroup>
                  
                  <FormGroup>
                    <FormLabel htmlFor="message">Message <RequiredStar aria-hidden="true">*</RequiredStar></FormLabel>
                    <MessageHint id="contact-message-hint">Share what you’re working on and how I can help.</MessageHint>
                    <FormTextarea
                      id="message"
                      name="message"
                      aria-describedby="contact-message-hint"
                      rows={5}
                      required
                    />
                  </FormGroup>
                  
                  <SubmitButton type="submit" disabled={formStatus === 'sending'}>
                    {formStatus === 'sending' ? (
                      <>
                        <LoadingSpinner />
                        Sending…
                      </>
                    ) : (
                      <>
                        <FiSend aria-hidden="true" />
                        Send message
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

// Styled Components
const HeroSection = styled.section`
  background-color: ${props => props.theme.surface};
  padding: 8rem 0 4rem;
  text-align: center;
  
  @media (max-width: 768px) {
    padding: 6rem 0 3rem;
  }
  
  @media (max-width: 480px) {
    padding: 3rem 0 2rem;
  }
`;

const HeroContent = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 0 2rem;
  
  @media (max-width: 480px) {
    padding: 0 1rem;
  }
`;

const PageTitle = styled.h1`
  font-size: 3rem;
  margin-bottom: 1.5rem;
  color: ${props => props.theme.text};
  letter-spacing: -0.06em;
  line-height: 1.08;
  
  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
  
  @media (max-width: 480px) {
    font-size: 2rem;
    margin-bottom: 1rem;
  }
`;

const PageSubtitle = styled.p`
  font-size: 1.2rem;
  color: ${props => props.theme.textSecondary};
  max-width: 600px;
  margin: 0 auto;
  
  @media (max-width: 480px) {
    font-size: 1rem;
  }
`;

const ContactSection = styled.section`
  padding: 5rem 0;
  background-color: ${props => props.theme.background};
  
  @media (max-width: 768px) {
    padding: 2rem 0;
  }
`;

const SectionContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  
  @media (max-width: 480px) {
    padding: 0 1rem;
  }
`;

const ContactGrid = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1.5fr);
  gap: 3rem;
  
  @media (max-width: 992px) {
    grid-template-columns: minmax(0, 1fr);
    gap: 2rem;
  }
`;

const ContactInfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`;

const Terminal = styled.div`
  background-color: ${props => props.theme.codeBackground};
  border: 1px solid ${props => props.theme.borderColor};
  border-radius: 10px;
  overflow: hidden;
  font-family: 'Fira Code', monospace;
  margin-bottom: 2rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  
  @media (max-width: 480px) {
    border-radius: 8px;
  }
`;

const TerminalHeader = styled.div`
  background-color: ${props => props.theme.cardBackground};
  border-bottom: 1px solid ${props => props.theme.borderColor};
  padding: 8px 15px;
  display: flex;
  align-items: center;
  
  @media (max-width: 480px) {
    padding: 6px 12px;
  }
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
  color: ${props => props.theme.textSecondary};
  font-size: 0.8rem;
  margin-left: 8px;
`;

const TerminalBody = styled.div`
  padding: 15px;
  color: ${props => props.theme.text};
  font-size: 0.9rem;
  line-height: 1.6;
  max-height: 300px;
  overflow-y: auto;
  
  @media (max-width: 480px) {
    padding: 12px;
    font-size: 0.8rem;
    max-height: 200px;
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
  
  @media (max-width: 480px) {
    padding: 0.8rem;
    margin-bottom: 1rem;
    
    &:hover {
      transform: none;
    }
  }
`;

const ContactInfoIcon = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 10px;
  background: ${props => props.theme.buttonBackground};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  color: ${props => props.theme.buttonText};
  margin-right: 1rem;
  flex-shrink: 0;
  
  @media (max-width: 480px) {
    width: 40px;
    height: 40px;
    font-size: 1.2rem;
    margin-right: 0.8rem;
  }
`;

const ContactInfoContent = styled.div`
  flex-grow: 1;
  min-width: 0;
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
  overflow-wrap: anywhere;
  
  a {
    color: ${props => props.theme.text};
    text-decoration: none;
    transition: color 0.3s ease;
    
    &:hover {
      color: ${props => props.theme.primary};
    }
  }
  
  @media (max-width: 480px) {
    font-size: 0.95rem;
  }
`;

const SocialLinks = styled.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  
  @media (max-width: 480px) {
    justify-content: center;
    gap: 0.8rem;
  }
`;

const SocialLink = styled.a`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: ${props => props.theme.buttonBackground};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  color: ${props => props.theme.buttonText};
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
  }
  
  @media (max-width: 480px) {
    width: 44px;
    height: 44px;
    font-size: 1.3rem;
    
    &:hover {
      transform: none;
    }
  }
`;

const ContactFormContainer = styled.div`
  background-color: ${props => props.theme.cardBackground};
  border: 1px solid ${props => props.theme.borderColor};
  border-radius: 14px;
  padding: clamp(1.25rem, 4vw, 2.5rem);
  align-self: start;
`;

const FormHeading = styled.h2`
  font-size: clamp(1.5rem, 1.25rem + 1vw, 2rem);
  line-height: 1.18;
  letter-spacing: -0.045em;
  margin-bottom: clamp(1.25rem, 3vw, 1.75rem);
  color: ${props => props.theme.text};

  &::after { content: none; }
`;

const Form = styled.form`
  display: grid;
  gap: 1rem;
`;

const FormGroup = styled.div`
  display: grid;
  gap: 6px;
  min-width: 0;
`;

const FormLabel = styled.label`
  font-size: 0.9rem;
  color: ${props => props.theme.text};
  font-weight: 600;
`;

const RequiredStar = styled.span`
  color: ${props => props.theme.error};
`;

const OptionalField = styled.span`
  margin-inline-start: 4px;
  font-size: 0.75rem;
  font-weight: 400;
  color: ${props => props.theme.textSecondary};
`;

const MessageHint = styled.p`
  margin: 0;
  color: ${props => props.theme.textSecondary};
  font-size: 0.82rem;
`;

const formControl = css`
  width: 100%;
  min-height: 48px;
  padding: 10px 12px;
  border-radius: 8px;
  border: 1px solid ${props => props.theme.inputBorder};
  background-color: ${props => props.theme.inputBackground};
  color: ${props => props.theme.text};
  font: inherit;
  font-size: max(1rem, 1em);
  line-height: 1.5;

  &:focus-visible {
    border-color: ${props => props.theme.primary};
    outline: 2px solid ${props => props.theme.primary};
    outline-offset: 2px;
  }

  &:user-invalid { border-color: ${props => props.theme.error}; }
  &::placeholder { color: ${props => props.theme.textSecondary}; }
`;

const FormInput = styled.input`
  ${formControl}
`;

const FormTextarea = styled.textarea`
  ${formControl}
  resize: vertical;
`;

const SubmitButton = styled.button`
  justify-self: start;
  min-height: 48px;
  padding: 10px 16px;
  border-radius: 8px;
  background: ${props => props.theme.buttonBackground};
  color: ${props => props.theme.buttonText};
  font: inherit;
  font-weight: 600;
  display: flex;
  gap: 8px;
  align-items: center;
  justify-content: center;

  &:hover:not(:disabled) { filter: brightness(1.08); }
  &:disabled { opacity: 0.7; cursor: wait; }
  @media (max-width: 600px) { width: 100%; }
`;

const spin = keyframes`to { transform: rotate(1turn); }`;

const LoadingSpinner = styled.div`
  width: 16px;
  height: 16px;
  border: 2px solid currentColor;
  border-radius: 50%;
  border-top-color: transparent;
  @media (prefers-reduced-motion: no-preference) { animation: ${spin} 0.8s linear infinite; }
`;

const FormError = styled.div`
  padding: 0.75rem;
  margin-bottom: 1rem;
  background-color: ${props => props.theme.error}20;
  color: ${props => props.theme.error};
  border-radius: 10px;
  font-size: 0.9rem;

  a { color: inherit; text-decoration: underline; }
`;

const SuccessMessage = styled.div`
  padding: clamp(0.75rem, 3vw, 2rem);
  border-radius: 10px;
  background: ${props => props.theme.codeBackground};
  border: 1px solid ${props => props.theme.primary};
  display: flex;
  align-items: center;
  
  svg {
    flex: none;
    width: 50px;
    height: 50px;
    margin-right: 1rem;
    padding: 10px;
    border-radius: 50%;
    background-color: ${props => props.theme.buttonBackground};
    color: ${props => props.theme.buttonText};
  }
  
  span {
    font-size: 1.1rem;
    color: ${props => props.theme.text};
  }
`;

export default ContactPage;
