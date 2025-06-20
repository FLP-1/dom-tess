// src/components/common/Modal.jsx
import React from 'react';
import styled from 'styled-components';

const Overlay = styled.div`
  position: fixed; left: 0; top: 0; width: 100vw; height: 100vh;
  background: rgba(30, 136, 229, 0.08);
  z-index: 1000;
  display: flex; align-items: center; justify-content: center;
`;

const Content = styled.div`
  background: ${({ theme }) => theme.surface};
  padding: 32px 28px;
  border-radius: 16px;
  box-shadow: 0 6px 32px rgba(30,136,229,0.18);
  max-width: 90vw; min-width: 320px;
`;

const Modal = ({ open, children, onClose }) =>
  !open ? null : (
    <Overlay onClick={onClose}>
      <Content onClick={(e) => e.stopPropagation()}>{children}</Content>
    </Overlay>
  );

export default Modal;
