import React, { useState, useRef, useEffect } from 'react';
import '../styles/components/form-dropdown.css';

/**
 * FormDropdown - A custom scrollable dropdown component.
 * 
 * @param {Array} options - List of options to display [0, 1, 2, ...] or [{label, value}, ...]
 * @param {any} value - The currently selected value.
 * @param {function} onChange - Callback function when a selection is made.
 * @param {string} placeholder - Placeholder text if no value is selected.
 */
const FormDropdown = ({ options, value, onChange, placeholder = "Select" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);
  const menuRef = useRef(null);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Scroll to selected item when opened
  useEffect(() => {
    if (isOpen && menuRef.current) {
      const selectedItem = menuRef.current.querySelector('.selected');
      if (selectedItem) {
        selectedItem.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      }
    }
  }, [isOpen]);

  const handleSelect = (option) => {
    // Handle both primitive and object options
    const optionValue = typeof option === 'object' ? option.value : option;
    if (onChange) {
      onChange({ target: { value: optionValue } }); // Mock event object for consistency
    }
    setIsOpen(false);
  };

  const displayValue = typeof value !== 'undefined' ? value : placeholder;

  return (
    <div className="form-dropdown" ref={containerRef}>
      <div 
        className={`form-dropdown-trigger ${isOpen ? 'open' : ''}`} 
        onClick={() => setIsOpen(!isOpen)}
        role="button"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span>{displayValue}</span>
        <svg className="form-dropdown-arrow" viewBox="0 0 16 16">
          <path d="m2 5 6 6 6-6" />
        </svg>
      </div>

      {isOpen && (
        <div className="form-dropdown-menu" ref={menuRef} role="listbox">
          {options.map((option, index) => {
            const optionValue = typeof option === 'object' ? option.value : option;
            const optionLabel = typeof option === 'object' ? option.label : option;
            const isSelected = optionValue === value;

            return (
              <div
                key={index}
                className={`form-dropdown-item ${isSelected ? 'selected' : ''}`}
                onClick={() => handleSelect(option)}
                role="option"
                aria-selected={isSelected}
              >
                {optionLabel}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default FormDropdown;
