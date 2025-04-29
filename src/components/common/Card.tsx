import React from 'react';
import { Box, BoxProps } from '@chakra-ui/react';
import styles from './Card.module.css';

interface CardProps extends BoxProps {
  children: React.ReactNode;
  variant?: 'default' | 'hoverable';
}

export const Card: React.FC<CardProps> = ({ children, variant = 'default', ...props }) => {
  return (
    <Box
      className={`${styles.card} ${variant === 'hoverable' ? styles.hoverable : ''}`}
      {...props}
    >
      {children}
    </Box>
  );
}; 