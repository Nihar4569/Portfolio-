import React, { useId, useState } from 'react';
import styled from 'styled-components';
import { FiX, FiLock, FiUnlock, FiUser, FiAlertCircle } from 'react-icons/fi';
import ModalOverlay from './ModalOverlay';

const AuthModal = ({ album, onClose, onAuthSuccess }) => {
  const [name, setName] = useState('');
  const [secretCode, setSecretCode] = useState('');
  const [error, setError] = useState('');
  const id = useId();
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!name.trim()) {
      setError('Please enter your name');
      return;
    }
    
    if (secretCode !== album.secretCode) {
      setError('Incorrect secret code. Please try again.');
      return;
    }
    e.currentTarget.closest('dialog').close();
    onAuthSuccess(name.trim());
  };
  
  return (
    <ModalOverlay labelledBy={`${id}-title`} onClose={onClose} narrow>
      <ModalHeader>
        <ModalTitle id={`${id}-title`}>Access {album.title}</ModalTitle>
        <form method="dialog">
          <CloseButton type="submit" aria-label="Close album access"><FiX aria-hidden="true" /></CloseButton>
        </form>
      </ModalHeader>

      <ModalBody>
        <LockIcon>
          <FiLock />
        </LockIcon>

        <AuthText>
          This album is restricted. Please enter your name and the secret code to view.
        </AuthText>

        <AuthForm onSubmit={handleSubmit}>
          <FormGroup>
            <label className="portfolio-visually-hidden" htmlFor={`${id}-name`}>Your name</label>
            <InputIcon>
              <FiUser />
            </InputIcon>
            <AuthInput
              id={`${id}-name`}
              type="text"
              placeholder="Your Name"
              autoComplete="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </FormGroup>

          <FormGroup>
            <label className="portfolio-visually-hidden" htmlFor={`${id}-code`}>Secret code</label>
            <InputIcon>
              <FiLock />
            </InputIcon>
            <AuthInput
              id={`${id}-code`}
              type="password"
              placeholder="Secret Code"
              value={secretCode}
              onChange={(e) => setSecretCode(e.target.value)}
            />
          </FormGroup>

          {error && (
            <ErrorMessage role="alert">
              <FiAlertCircle />
              <span>{error}</span>
            </ErrorMessage>
          )}

          <SubmitButton type="submit">
            <FiUnlock aria-hidden="true" /> Unlock Album
          </SubmitButton>
        </AuthForm>
      </ModalBody>
    </ModalOverlay>
  );
};

// Styled Components
const ModalHeader = styled.div`
  position: sticky;
  inset-block-start: 0;
  z-index: 1;
  padding: 0.75rem clamp(1rem, 4vw, 2rem);
  background: ${props => props.theme.cardBackground};
  border-bottom: 1px solid ${props => props.theme.borderColor};
  display: flex;
  gap: 0.5rem;
  justify-content: space-between;
  align-items: center;
`;

const ModalTitle = styled.h2`
  margin: 0;
  font-size: clamp(1.05rem, 3.6vw, 1.5rem);
  color: ${props => props.theme.text};
  overflow-wrap: anywhere;
`;

const CloseButton = styled.button`
  display: grid;
  place-items: center;
  width: 44px;
  height: 44px;
  padding: 0;
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
  padding: clamp(1rem, 4vw, 2rem);
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const LockIcon = styled.div`
  width: clamp(46px, 13vw, 80px);
  aspect-ratio: 1;
  border-radius: 50%;
  background: ${props => props.theme.buttonBackground};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: clamp(1.4rem, 5vw, 2.5rem);
  color: ${props => props.theme.buttonText};
  margin-bottom: 1.5rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);

  @media (max-height: 480px) { display: none; }
`;

const AuthText = styled.p`
  text-align: center;
  color: ${props => props.theme.textSecondary};
  margin-bottom: clamp(1rem, 3vw, 2rem);
  line-height: 1.6;
`;

const AuthForm = styled.form`
  width: 100%;
`;

const FormGroup = styled.div`
  position: relative;
  margin-bottom: clamp(0.75rem, 3vw, 1.5rem);
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
  background: ${props => props.theme.buttonBackground};
  color: ${props => props.theme.buttonText};
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
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
  }
`;

export default AuthModal;
