import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';

const ModalOverlayStyled = styled.dialog`
  --album-gutter: ${props => props.$fullscreen ? '0px' : 'clamp(12px, 3vw, 32px)'};
  --album-top: max(var(--album-gutter), env(safe-area-inset-top));
  --album-bottom: max(var(--album-gutter), env(safe-area-inset-bottom));
  --album-left: max(var(--album-gutter), env(safe-area-inset-left));
  --album-right: max(var(--album-gutter), env(safe-area-inset-right));
  --album-height: calc(100vh - var(--album-top) - var(--album-bottom));
  @supports (height: 100dvh) {
    --album-height: calc(100dvh - var(--album-top) - var(--album-bottom));
  }
  position: fixed;
  inset: var(--album-top) var(--album-right) var(--album-bottom) var(--album-left);
  margin: auto;
  padding: 0;
  width: min(${props => props.$fullscreen ? '100%' : props.$narrow ? '500px' : '900px'}, calc(100% - var(--album-left) - var(--album-right)));
  max-width: none;
  max-height: var(--album-height);
  border: 0;
  border-radius: ${props => props.$fullscreen ? '0' : 'clamp(12px, 3vw, 20px)'};
  background: ${props => props.theme.cardBackground};
  color: ${props => props.theme.text};
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
  overflow: auto;
  overscroll-behavior: contain;

  &::backdrop {
    background: ${props => props.theme.backdrop};
    backdrop-filter: blur(5px);
    overflow: hidden;
    overscroll-behavior: contain;
  }
`;

const ModalOverlay = ({ children, onClose, labelledBy, fullscreen = false, narrow = false }) => {
  const dialog = useRef(null);

  useEffect(() => {
    if (!dialog.current.open) dialog.current.showModal();
  }, []);

  function dismissOnBackdrop(event) {
    const modal = event.currentTarget;
    if ('closedBy' in modal || event.target !== modal) return;
    const { left, right, top, bottom } = modal.getBoundingClientRect();
    if (event.clientX < left || event.clientX > right || event.clientY < top || event.clientY > bottom) modal.close();
  }

  return (
    <ModalOverlayStyled ref={dialog} aria-labelledby={labelledBy} closedby="any" $fullscreen={fullscreen} $narrow={narrow}
      onClose={onClose} onClick={dismissOnBackdrop}>
      {children}
    </ModalOverlayStyled>
  );
};

export default ModalOverlay;
