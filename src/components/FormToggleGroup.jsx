import React from 'react';
import FormToggle from './FormToggle';
import '../styles/components/toggle-group.css';

/**
 * FormToggleGroup - A reusable group of toggle switches styled as a card.
 * 
 * @param {string} label - The header label for the group.
 * @param {Array} options - List of options to display, can be strings or objects {label, value}.
 * @param {string|Array} value - The current selected value(s).
 * @param {function} onChange - Callback triggered when an option is toggled.
 * @param {boolean} multiSelect - Whether to allow multiple selections (default: false).
 * @param {boolean} required - Whether the field is required.
 */
const FormToggleGroup = ({ label, options, value, onChange, multiSelect = false, required = false }) => {
  
  const handleToggle = (optionValue) => {
    if (!onChange) return;

    if (multiSelect) {
      const newValue = Array.isArray(value) ? [...value] : [];
      const index = newValue.indexOf(optionValue);
      if (index > -1) {
        newValue.splice(index, 1);
      } else {
        newValue.push(optionValue);
      }
      onChange({ target: { name: label, value: newValue } });
    } else {
      // Single selection behavior
      onChange({ target: { name: label, value: optionValue } });
    }
  };

  const isSelected = (optionValue) => {
    if (multiSelect) {
      return Array.isArray(value) && value.includes(optionValue);
    }
    return value === optionValue;
  };

  return (
    <div className="form-toggle-group-container">
      {label && (
        <div className="form-toggle-group-header">
          {label} {required && <span className="required-mark">*</span>}
        </div>
      )}
      <div className="form-toggle-group-body">
        {options.map((option) => {
          const optLabel = typeof option === 'string' ? option : option.label;
          const optValue = typeof option === 'string' ? option : option.value;
          const selected = isSelected(optValue);

          return (
            <div 
              key={optValue} 
              className={`form-toggle-group-row ${selected ? 'selected' : ''}`}
              onClick={() => handleToggle(optValue)}
            >
              <span className="form-toggle-group-label">{optLabel}</span>
              <FormToggle 
                value={selected} 
                onChange={() => {}} // Controlled by row click
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FormToggleGroup;
