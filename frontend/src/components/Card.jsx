// Card.jsx
import React from 'react';
import styled from 'styled-components';

const CardWrapper = styled.div`
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 8px 20px rgba(0,0,0,0.1);
  padding: 20px;
  max-width: 320px;
  transition: transform 0.3s ease;
  cursor: pointer;

  &:hover {
    transform: translateY(-6px);
    box-shadow: 0 12px 32px rgba(0,0,0,0.15);
  }
`;

const IconWrapper = styled.div`
  font-size: 2.4rem;
  color: #1e88e5;
  margin-bottom: 12px;
`;

const Title = styled.h3`
  font-weight: 700;
  font-size: 1.4rem;
  margin-bottom: 8px;
  color: #212121;
`;

const Description = styled.p`
  font-size: 1rem;
  color: #424242;
`;

const Card = ({ icon, title, description, ...props }) => (
  <CardWrapper {...props} role="group" tabIndex="0" aria-label={title}>
    <IconWrapper aria-hidden="true">{icon}</IconWrapper>
    <Title>{title}</Title>
    <Description>{description}</Description>
  </CardWrapper>
);

export default Card;

