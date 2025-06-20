// Button.jsx
// src/components/common/Button.jsx
import React from 'react';
import styled from 'styled-components';

const StyledButton = styled.button`
  background: ${({ theme }) => theme.primary};
  color: #fff;
  padding: 10px 24px;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.2s;
  margin: 4px 0;

  &:hover, &:focus {
    background: ${({ theme }) => theme.primaryDark};
    outline: none;
  }

  &:disabled {
    background: ${({ theme }) => theme.border};
    color: ${({ theme }) => theme.muted};
    cursor: not-allowed;
  }
`;

const Button = ({ children, ...props }) => (
  <StyledButton {...props}>{children}</StyledButton>
);

export default Button;

