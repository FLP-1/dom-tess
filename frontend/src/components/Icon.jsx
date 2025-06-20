// frontend/src/components/Icon.jsx
import React from 'react';
import PropTypes from 'prop-types';

const ICONS = {
  user: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
      <path d="M12 12c2.7 0 5-2.3 5-5s-2.3-5-5-5-5 2.3-5 5 2.3 5 5 5zm0 2c-3.3 0-10 1.7-10 5v3h20v-3c0-3.3-6.7-5-10-5z"/>
    </svg>
  ),
  clock: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
      <path d="M12 1a11 11 0 1011 11A11.012 11.012 0 0012 1zm1 11H7v-2h6V4h2z"/>
    </svg>
  ),
  // Outros ícones podem ser adicionados aqui
};

const Icon = ({ name, size = 24, color = 'currentColor', className = '' }) => {
  const svg = ICONS[name];
  if (!svg) return null;
  return React.cloneElement(svg, {
    width: size,
    height: size,
    fill: color,
    className,
  });
};

Icon.propTypes = {
  name: PropTypes.string.isRequired,
  size: PropTypes.number,
  color: PropTypes.string,
  className: PropTypes.string,
};

export default Icon;
