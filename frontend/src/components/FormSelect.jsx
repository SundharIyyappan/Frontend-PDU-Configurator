import React from 'react';
import '../styles/components/input.css';
import '../styles/components/form.css';

const FormSelect = ({ label, name, value, onChange, onBlur, options, error, required }) => (
  <div className="mb-4">
    <label className="form-label">{label} {required && '*'}</label>
    <select
      name={name}
      className={`form-select ${error ? 'is-invalid' : ''}`}
      value={value}
      onChange={onChange}
      onBlur={onBlur}
    >
      <option value="" disabled>Select {label}</option>
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>{opt.label}</option>
      ))}
    </select>
    {error && <div className="invalid-feedback">{error}</div>}
  </div>
);

export default FormSelect;
