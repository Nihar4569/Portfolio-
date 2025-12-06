import React from 'react';
import styled, { keyframes } from 'styled-components';
import { useSound } from '../../context/SoundContext';
import { FiVolume2, FiVolumeX } from 'react-icons/fi';

const SoundToggle = () => {
  const { soundEnabled, toggleSound, playClick } = useSound();

  const handleToggle = () => {
    toggleSound();
    // Play a sound when enabling (not when disabling)
    if (!soundEnabled) {
      setTimeout(() => {
        playClick();
      }, 50);
    }
  };

  return (
    <ToggleContainer 
      onClick={handleToggle}
      title={soundEnabled ? 'Disable sound effects' : 'Enable sound effects'}
      $isEnabled={soundEnabled}
    >
      <IconWrapper $isEnabled={soundEnabled}>
        {soundEnabled ? <FiVolume2 /> : <FiVolumeX />}
      </IconWrapper>
      {soundEnabled && <SoundWaves />}
    </ToggleContainer>
  );
};

const pulse = keyframes`
  0%, 100% {
    transform: scale(1);
    opacity: 0.5;
  }
  50% {
    transform: scale(1.2);
    opacity: 1;
  }
`;

const soundWave = keyframes`
  0% {
    transform: scale(0.8);
    opacity: 0;
  }
  50% {
    opacity: 0.5;
  }
  100% {
    transform: scale(1.5);
    opacity: 0;
  }
`;

const ToggleContainer = styled.button`
  position: fixed;
  bottom: 30px;
  left: 30px;
  width: 45px;
  height: 45px;
  border-radius: 50%;
  background: ${({ theme, $isEnabled }) => $isEnabled 
    ? theme.background === '#0d1117'
      ? 'linear-gradient(135deg, rgba(0, 230, 118, 0.2), rgba(0, 188, 212, 0.2))'
      : 'linear-gradient(135deg, rgba(52, 152, 219, 0.2), rgba(46, 204, 113, 0.2))'
    : theme.background === '#0d1117'
      ? 'rgba(255, 255, 255, 0.05)'
      : 'rgba(0, 0, 0, 0.05)'
  };
  border: 2px solid ${({ theme, $isEnabled }) => $isEnabled
    ? theme.background === '#0d1117' ? '#00e676' : '#3498db'
    : theme.background === '#0d1117' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)'
  };
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  box-shadow: ${({ theme, $isEnabled }) => $isEnabled
    ? theme.background === '#0d1117'
      ? '0 4px 20px rgba(0, 230, 118, 0.3)'
      : '0 4px 20px rgba(52, 152, 219, 0.3)'
    : '0 4px 15px rgba(0, 0, 0, 0.1)'
  };

  &:hover {
    transform: scale(1.1);
    border-color: ${({ theme }) => theme.background === '#0d1117' ? '#00e676' : '#3498db'};
    box-shadow: ${({ theme }) => theme.background === '#0d1117'
      ? '0 6px 25px rgba(0, 230, 118, 0.4)'
      : '0 6px 25px rgba(52, 152, 219, 0.4)'
    };
  }

  &:active {
    transform: scale(0.95);
  }

  @media (max-width: 768px) {
    bottom: 20px;
    left: 20px;
    width: 40px;
    height: 40px;
  }
`;

const IconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  color: ${({ theme, $isEnabled }) => $isEnabled
    ? theme.background === '#0d1117' ? '#00e676' : '#3498db'
    : theme.background === '#0d1117' ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.4)'
  };
  transition: all 0.3s ease;
  animation: ${({ $isEnabled }) => $isEnabled ? pulse : 'none'} 2s ease-in-out infinite;
`;

const SoundWaves = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  border: 2px solid ${({ theme }) => theme.background === '#0d1117' ? '#00e676' : '#3498db'};
  animation: ${soundWave} 1.5s ease-out infinite;
  pointer-events: none;
`;

export default SoundToggle;
