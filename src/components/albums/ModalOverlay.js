// src/components/albums/ModalOverlay.js
import React from 'react';
import styled from 'styled-components';

const ModalOverlayStyled = styled.div`
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

const ModalOverlay = ({ children, onClick }) => {
  return (
    <ModalOverlayStyled onClick={onClick}>
      {children}
    </ModalOverlayStyled>
  );
};

export default ModalOverlay;