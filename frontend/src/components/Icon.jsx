// src/components/common/Icon.jsx
import React from 'react';

const Icon = ({ name, size = 24, color = "#1e88e5", ...props }) => {
  // Usa qualquer lib de ícones (exemplo: react-icons)
  // Exemplo de uso: <Icon name="MdHome" />
  const { [name]: IconComp } = require('react-icons/md');
  return IconComp ? <IconComp size={size} color={color} {...props} /> : null;
};

export default Icon;
