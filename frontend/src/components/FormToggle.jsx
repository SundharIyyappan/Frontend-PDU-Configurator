import React from 'react';
import '../styles/components/toggle.css';

/**
 * FormToggle - A reusable switch component for form inputs.
 * 
 * @param {string} label - The label to display next to the switch.
 * @param {boolean} value - The current state of the switch (ON/OFF).
 * @param {function} onChange - Callback function triggered when the switch is toggled.
 */
const FormToggle = ({ label, value, onChange }) => {
  const handleToggle = () => {
    if (onChange) {
      onChange(!value);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      handleToggle();
    }
  };

  return (
    <div 
      className="form-toggle-container" 
      onClick={handleToggle}
      role="button"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      aria-pressed={value}
      aria-label={label}
    >
      <div className={`toggle-switch ${value ? 'on' : ''}`}>
        <div className="toggle-knob"></div>
      </div>
      {label && <span className="form-toggle-label">{label}</span>}
    </div>
  );
};

export default FormToggle;
