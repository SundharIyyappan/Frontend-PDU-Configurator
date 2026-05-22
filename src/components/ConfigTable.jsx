import React from 'react';
import FormToggle from './FormToggle';
import '../styles/components/config-table.css';

/**
 * Reusable ConfigTable component for matrix-style configuration steps.
 * 
 * @param {Array} columns - Array of column objects { value, label }
 * @param {Array} rows - Array of row objects { id, label, availability }
 * @param {string} selectedValue - Currently selected column value
 * @param {Function} onSelect - Callback when a column is selected
 * @param {string} title - Optional table title
 */
const ConfigTable = ({ columns, rows, selectedValue, onSelect, title }) => {
  return (
    <div className="config-table-container">
      {title && (
        <div
          className="section-label mb-2"
          style={{ color: 'var(--text-label)', fontSize: '13px', fontWeight: 'bold', letterSpacing: '1px', textTransform: 'uppercase' }}
        >
          {title}
        </div>
      )}
      <div className="config-table-wrapper">
        <table className="config-table">
          <thead>
            <tr>
              <th className="feature-column"></th>
              {columns.map((col) => (
                <th key={col.value} className="series-column text-center header-text-prominent">
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id}>
                <td className="feature-label">{row.label}</td>
                {columns.map((col) => {
                  const isAvailable = row.availability[col.value];
                  return (
                    <td key={`${row.id}-${col.value}`} className="text-center">
                      <div className={`status-dot ${isAvailable ? 'available' : 'unavailable'}`} />
                    </td>
                  );
                })}
              </tr>
            ))}
            <tr className="selection-row">
              <td className="feature-label">Selection</td>
              {columns.map((col) => (
                <td key={`select-${col.value}`} className="text-center">
                  <div className="d-flex justify-content-center">
                    <FormToggle
                      value={selectedValue === col.value}
                      onChange={() => onSelect(col.value)}
                    />
                  </div>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ConfigTable;
