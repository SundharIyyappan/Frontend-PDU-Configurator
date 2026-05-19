import React from 'react';
import '../styles/components/button.css';

const FormButton = ({ onClick, children, variant = 'primary', disabled = false, type = 'button' }) => {
  const btnClass = variant === 'primary' ? 'btn-wizard-primary' : 'btn-wizard-secondary';
  return (
    <button type={type} className={btnClass} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  );
};

export default FormButton;
