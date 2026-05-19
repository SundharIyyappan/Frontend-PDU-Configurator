import React from 'react';
import '../styles/components/input.css';
import '../styles/components/form.css';

const FormInput = ({ label, type = 'text', name, value, onChange, onBlur, onKeyDown, placeholder, error, required, min, max }) => (
  <div className="mb-4">
    <label className="form-label">{label} {required && '*'}</label>
    <input
      type={type}
      name={name}
      className={`form-control ${error ? 'is-invalid' : ''}`}
      value={value}
      onChange={onChange}
      onBlur={onBlur}
      onKeyDown={onKeyDown}
      placeholder={placeholder}
      min={min}
      max={max}
    />
    {error && <div className="invalid-feedback">{error}</div>}
  </div>
);

export default FormInput;
