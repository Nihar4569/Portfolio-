import React, { useState, useContext } from 'react';
import styled from 'styled-components';
import { ThemeContext } from '../../context/ThemeContext';
import { FiSend, FiUser, FiMail, FiMessageSquare, FiCheck, FiLoader } from 'react-icons/fi';

const ContactForm = () => {
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
  
  const { isDark } = useContext(ThemeContext);
  
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
    
    // Simulate form submission
    setTimeout(() => {
      setFormStatus({
        submitted: true,
        submitting: false,
        error: null
      });
      
      // Reset form after submission
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
      
      // Reset form status after 5 seconds
      setTimeout(() => {
        setFormStatus({
          submitted: false,
          submitting: false,
          error: null
        });
      }, 5000);
    }, 2000);
  };
  
  return (
    <FormContainer>
      <FormHeading>Send Me a Message</FormHeading>
      
      {formStatus.error && (
        <FormError>{formStatus.error}</FormError>
      )}
      
      {formStatus.submitted ? (
        <SuccessMessage isDark={isDark}>
          <FiCheck />
          <span>Thank you for your message! I'll get back to you soon.</span>
        </SuccessMessage>
      ) : (
        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <FormLabel htmlFor="name">Name *</FormLabel>
            <InputWrapper>
              <InputIcon>
                <FiUser />
              </InputIcon>
              <FormInput
                type="text"
                id="name"
                name="name"
                placeholder="Your Name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </InputWrapper>
          </FormGroup>
          
          <FormGroup>
            <FormLabel htmlFor="email">Email *</FormLabel>
            <InputWrapper>
              <InputIcon>
                <FiMail />
              </InputIcon>
              <FormInput
                type="email"
                id="email"
                name="email"
                placeholder="Your Email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </InputWrapper>
          </FormGroup>
          
          <FormGroup>
            <FormLabel htmlFor="subject">Subject</FormLabel>
            <InputWrapper>
              <InputIcon>
                <FiMessageSquare />
              </InputIcon>
              <FormInput
                type="text"
                id="subject"
                name="subject"
                placeholder="Subject"
                value={formData.subject}
                onChange={handleChange}
              />
            </InputWrapper>
          </FormGroup>
          
          <FormGroup>
            <FormLabel htmlFor="message">Message *</FormLabel>
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
                <LoadingIcon>
                  <FiLoader />
                </LoadingIcon>
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
    </FormContainer>
  );
};

// Styled Components
const FormContainer = styled.div`
  width: 100%;
`;

const FormHeading = styled.h2`
  font-size: 1.8rem;
  margin-bottom: 1.5rem;
  color: ${props => props.theme.text};
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
`;

const InputWrapper = styled.div`
  position: relative;
`;

const InputIcon = styled.div`
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: ${props => props.theme.textSecondary};
`;

const FormInput = styled.input`
  width: 100%;
  padding: 1rem 1rem 1rem 3rem;
  border-radius: 10px;
  border: 1px solid ${props => props.theme.borderColor};
  background-color: ${props => props.theme.inputBackground};
  color: ${props => props.theme.text};
  font-size: 1rem;
  transition: all 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.primary};
    box-shadow: 0 0 0 2px ${props => props.theme.primary}30;
  }
  
  &::placeholder {
    color: ${props => props.theme.textSecondary};
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
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.primary};
    box-shadow: 0 0 0 2px ${props => props.theme.primary}30;
  }
  
  &::placeholder {
    color: ${props => props.theme.textSecondary};
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

const LoadingIcon = styled.span`
  display: inline-block;
  margin-right: 8px;
  animation: spin 1s linear infinite;
  
  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
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

export default ContactForm;