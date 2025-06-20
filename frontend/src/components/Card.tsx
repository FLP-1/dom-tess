// frontend/src/components/Card.jsx
import React from 'react';
import PropTypes from 'prop-types';
import './Card.css';

const Card = ({ header, children, footer, onClick, className = '' }) => (
  <div className={`card ${className}`} onClick={onClick}>
    {header && <div className="card__header">{header}</div>}
    <div className="card__body">{children}</div>
    {footer && <div className="card__footer">{footer}</div>}
  </div>
);

Card.propTypes = {
  header: PropTypes.node,
  children: PropTypes.node.isRequired,
  footer: PropTypes.node,
  onClick: PropTypes.func,
  className: PropTypes.string,
};

export default Card;
