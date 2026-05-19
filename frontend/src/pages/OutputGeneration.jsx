import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { prevStep, resetConfig } from '../redux/slices/configSlice';
import FormButton from '../components/FormButton';

const OutputGeneration = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Inputs');
  const [showToast, setShowToast] = useState(true);

  const configState = useSelector((state) => state.config);

  const formatLabel = (key) => {
    // Insert space between lowercase and uppercase letters (camelCase), then replace underscores with spaces.
    // This prevents ALL_CAPS words from being spaced out by every letter.
    const result = key.replace(/([a-z])([A-Z])/g, "$1 $2").replace(/_/g, ' ');
    return result.charAt(0).toUpperCase() + result.slice(1).trim();
  };

  const flattenObject = (obj, prefix = '') => {
    return Object.keys(obj).reduce((acc, k) => {
      const pre = prefix.length ? prefix + '_' : '';
      if (typeof obj[k] === 'object' && obj[k] !== null && !Array.isArray(obj[k])) {
        Object.assign(acc, flattenObject(obj[k], pre + k));
      } else {
        acc[pre + k] = obj[k];
      }
      return acc;
    }, {});
  };

  const formatValue = (value) => {
    if (typeof value === 'boolean') {
      return value ? 'Yes' : 'No';
    }
    return String(value);
  };

  const renderDynamicSections = () => {
    const excludedKeys = ['quoteId', 'quoteNumber', 'currentStep', 'steps'];
    const sections = Object.keys(configState).filter(key => !excludedKeys.includes(key));

    return sections.map(sectionKey => {
      const sectionData = configState[sectionKey];
      if (!sectionData || typeof sectionData !== 'object') return null;

      const flatData = flattenObject(sectionData);
      const validEntries = Object.entries(flatData).filter(([k, v]) => v !== null && v !== undefined && v !== '');

      if (validEntries.length === 0) return null;

      return (
        <div key={sectionKey} className="mb-4" style={{ backgroundColor: 'var(--bg-card)', borderRadius: '8px', border: '1px solid var(--border-color)', overflow: 'hidden' }}>
          <div
            className="fw-bold p-3"
            style={{ backgroundColor: 'var(--bg-header)', color: 'var(--text-primary)', borderBottom: '1px solid var(--border-color)', fontSize: '14px', letterSpacing: '1px', textTransform: 'uppercase' }}
          >
            {formatLabel(sectionKey)}
          </div>
          <table className="mb-0" style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: 'transparent', tableLayout: 'fixed' }}>
            <tbody>
              {validEntries.map(([key, value], index) => {
                return (
                  <tr key={key} style={{ borderBottom: index === validEntries.length - 1 ? 'none' : '1px solid var(--border-color)', backgroundColor: 'transparent' }}>
                    <td style={{ width: '50%', color: 'var(--text-label)', padding: '10px 18px', border: 'none', borderRight: '1px solid var(--border-color)', fontWeight: '500', backgroundColor: 'transparent', verticalAlign: 'top' }}>
                      {formatLabel(key)}
                    </td>
                    <td style={{ width: '50%', color: 'var(--text-primary)', padding: '10px 18px', border: 'none', textAlign: 'left', backgroundColor: 'transparent', verticalAlign: 'top', wordBreak: 'break-word' }}>
                      {formatValue(value)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      );
    });
  };

  return (
    <div className="step-container position-relative">
      {/* Toast Notification */}
      {showToast && (
        <div className="d-flex justify-content-between align-items-center mb-4 p-3" style={{ backgroundColor: 'rgba(34, 197, 94, 0.2)', border: '1px solid #22c55e', color: '#4ade80', borderRadius: '8px' }}>
          <div className="d-flex align-items-center">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="me-2">
              <path d="M10 18C14.4183 18 18 14.4183 18 10C18 5.58172 14.4183 2 10 2C5.58172 2 2 5.58172 2 10C2 14.4183 5.58172 18 10 18Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M7 10L9 12L13 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span>Your configuration has been sent to your e-mail address.</span>
          </div>
          <button
            type="button"
            className="btn-close btn-close-white"
            onClick={() => setShowToast(false)}
            aria-label="Close"
            style={{ fontSize: '0.8rem', filter: 'invert(1) grayscale(100%) brightness(200%)' }}
          ></button>
        </div>
      )}

      {/* Tabs */}
      <ul className="nav nav-tabs mb-4" style={{ borderBottom: '1px solid var(--border-color)' }}>
        {['Inputs', 'Estimation', 'Flow Diagram'].map(tab => (
          <li className="nav-item" key={tab}>
            <button
              className={`nav-link ${activeTab === tab ? 'active' : ''}`}
              onClick={() => setActiveTab(tab)}
              style={{
                color: activeTab === tab ? 'var(--text-primary)' : 'var(--text-muted)',
                fontWeight: activeTab === tab ? '600' : 'normal',
                backgroundColor: 'transparent',
                border: 'none',
                borderBottom: activeTab === tab ? '2px solid var(--action-primary)' : '2px solid transparent',
                borderRadius: 0,
                padding: '10px 16px',
                marginBottom: '-1px'
              }}
            >
              {tab}
            </button>
          </li>
        ))}
      </ul>

      {/* Tab Content */}
      <div className="tab-content" style={{ color: 'var(--text-primary)' }}>
        {activeTab === 'Inputs' && (
          <div>
            {renderDynamicSections()}
          </div>
        )}
        {activeTab === 'Estimation' && (
          <div className="d-flex justify-content-center py-5">
            <div
              className="text-center p-5 w-100"
              style={{
                backgroundColor: 'var(--bg-card)',
                borderRadius: '12px',
                border: '1px solid var(--border-color)',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
                maxWidth: '500px'
              }}
            >
              <div
                className="mb-4 d-inline-flex justify-content-center align-items-center"
                style={{
                  width: '72px',
                  height: '72px',
                  backgroundColor: 'rgba(34, 197, 94, 0.1)',
                  borderRadius: '50%',
                  color: '#22c55e'
                }}
              >
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
              </div>

              <h4 className="mb-3" style={{ color: 'var(--text-primary)', fontWeight: '600' }}>Quote Created Successfully</h4>

              <p className="mb-5" style={{ color: 'var(--text-label)', fontSize: '1.1rem' }}>
                Quote ID: <strong style={{ color: 'var(--text-primary)', letterSpacing: '0.5px' }}>{configState.quoteNumber || configState.quoteId || 'Pending'}</strong>
              </p>

              <div className="d-flex flex-column gap-3">
                <button className="btn w-100 py-2" style={{ backgroundColor: 'var(--action-primary)', color: 'white', border: 'none', fontWeight: '500', borderRadius: '6px' }}>
                  View in NetSuite
                </button>
                <button className="btn w-100 py-2" style={{ backgroundColor: 'transparent', color: 'var(--text-primary)', border: '1px solid var(--border-color)', fontWeight: '500', borderRadius: '6px' }}>
                  Download PDF
                </button>
                <button
                  className="btn w-100 py-2"
                  style={{ backgroundColor: 'transparent', color: 'var(--text-primary)', border: '1px solid var(--border-color)', fontWeight: '500', borderRadius: '6px' }}
                // onClick={() => window.location.reload()} 
                >
                  Create Another
                </button>
              </div>
            </div>
          </div>
        )}
        {activeTab === 'Flow Diagram' && (
          <div className="p-4 text-center">
            <div
              style={{
                backgroundColor: 'var(--bg-card)',
                borderRadius: '12px',
                border: '1px solid var(--border-color)',
                padding: '20px',
                overflow: 'hidden'
              }}
            >
              <img
                src="/FlowDiagram.png"
                alt="Flow Diagram"
                style={{
                  maxWidth: '100%',
                  height: 'auto',
                  borderRadius: '8px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
                }}
              />
            </div>
          </div>
        )}
      </div>

      {/* NAVIGATION */}
      <div className="wizard-actions mt-5">
        <FormButton variant="secondary" onClick={() => dispatch(prevStep())}>
          Previous
        </FormButton>
        <FormButton variant="primary" onClick={() => {
          dispatch(resetConfig());
          navigate('/step1');
        }}>
          Finish
        </FormButton>
      </div>
    </div>
  );
};

export default OutputGeneration;
