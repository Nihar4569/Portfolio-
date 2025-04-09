import React, { useState, useContext } from 'react';
import styled from 'styled-components';
import { ThemeContext } from '../../context/ThemeContext';
import { FiX, FiLock, FiUnlock, FiUser, FiAlertCircle } from 'react-icons/fi';
import AlbumViewer from './AlbumViewer';

const AuthModal = ({ album, onClose }) => {
  const [name, setName] = useState('');
  const [secretCode, setSecretCode] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { isDark } = useContext(ThemeContext);
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!name.trim()) {
      setError('Please enter your name');
      return;
    }
    
    setIsLoading(true);
    
    // Simulate API check with a timeout
    setTimeout(() => {
      if (secretCode === album.secretCode) {
        setIsAuthenticated(true);
        setError('');
      } else {
        setError('Incorrect secret code. Please try again.');
      }
      setIsLoading(false);
    }, 1000);
  };
  
  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()} isDark={isDark}>
        {isAuthenticated ? (
          <AlbumViewer album={album} name={name} onClose={onClose} />
        ) : (
          <>
            <ModalHeader>
              <ModalTitle>Access {album.title}</ModalTitle>
              <CloseButton onClick={onClose}>
                <FiX />
              </CloseButton>
            </ModalHeader>
            
            <ModalBody>
              <LockIcon isDark={isDark}>
                <FiLock />
              </LockIcon>
              
              <AuthText>
                This album is restricted. Please enter your name and the secret code to view.
              </AuthText>
              
              <AuthForm onSubmit={handleSubmit}>
                <FormGroup>
                  <InputIcon>
                    <FiUser />
                  </InputIcon>
                  <AuthInput
                    type="text"
                    placeholder="Your Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </FormGroup>
                
                <FormGroup>
                  <InputIcon>
                    <FiLock />
                  </InputIcon>
                  <AuthInput
                    type="password"
                    placeholder="Secret Code"
                    value={secretCode}
                    onChange={(e) => setSecretCode(e.target.value)}
                  />
                </FormGroup>
                
                {error && (
                  <ErrorMessage>
                    <FiAlertCircle />
                    <span>{error}</span>
                  </ErrorMessage>
                )}
                
                <SubmitButton 
                  type="submit" 
                  disabled={isLoading}
                  isDark={isDark}
                >
                  {isLoading ? (
                    <LoadingSpinner />
                  ) : (
                    <>
                      <FiUnlock />
                      Unlock Album
                    </>
                  )}
                </SubmitButton>
              </AuthForm>
            </ModalBody>
          </>
        )}
      </ModalContent>
    </ModalOverlay>
  );
};

// Keyframes for the spinner
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
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(5px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 2rem;
`;

const ModalContent = styled.div`
  background-color: ${props => props.theme.cardBackground};
  border-radius: 20px;
  max-width: 500px;
  width: 100%;
  overflow: hidden;
  position: relative;
  z-index: 1001;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
`;

const ModalHeader = styled.div`
  padding: 1.5rem 2rem;
  border-bottom: 1px solid ${props => props.theme.borderColor};
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ModalTitle = styled.h2`
  font-size: 1.5rem;
  color: ${props => props.theme.text};
`;

const CloseButton = styled.button`
  background: transparent;
  border: none;
  color: ${props => props.theme.textSecondary};
  font-size: 1.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    color: ${props => props.theme.primary};
    transform: rotate(90deg);
  }
`;

const ModalBody = styled.div`
  padding: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const LockIcon = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: ${props => props.isDark 
    ? 'linear-gradient(135deg, #00bcd4, #00e676)' 
    : 'linear-gradient(135deg, #3498db, #2ecc71)'
  };
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.5rem;
  color: white;
  margin-bottom: 1.5rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
`;

const AuthText = styled.p`
  text-align: center;
  color: ${props => props.theme.textSecondary};
  margin-bottom: 2rem;
  line-height: 1.6;
`;

const AuthForm = styled.form`
  width: 100%;
`;

const FormGroup = styled.div`
  position: relative;
  margin-bottom: 1.5rem;
`;

const InputIcon = styled.div`
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: ${props => props.theme.textSecondary};
`;

const AuthInput = styled.input`
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

const ErrorMessage = styled.div`
  display: flex;
  align-items: center;
  color: ${props => props.theme.error};
  font-size: 0.9rem;
  margin-bottom: 1.5rem;
  
  svg {
    margin-right: 8px;
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
  
  ${rotate}
`;

export default AuthModal;