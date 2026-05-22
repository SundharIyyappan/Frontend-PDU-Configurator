import React from 'react';
import '../styles/components/form.css';

const FormRadioGroup = ({ label, name, value, onChange, options, error, required }) => (
  <div className="mb-4">
    <label className="form-label d-block">{label} {required && '*'}</label>
    <div className={`d-flex gap-4 ${error ? 'is-invalid' : ''}`}>
      {options.map((opt) => (
        <div className="form-check" key={opt.value}>
          <input
            className="form-check-input"
            type="radio"
            name={name}
            id={`${name}-${opt.value}`}
            value={opt.value}
            checked={value === opt.value}
            onChange={onChange}
          />
          <label className="form-check-label" htmlFor={`${name}-${opt.value}`}>
            {opt.label}
          </label>
        </div>
      ))}
    </div>
    {error && <div className="invalid-feedback d-block">{error}</div>}
  </div>
);

export default FormRadioGroup;
