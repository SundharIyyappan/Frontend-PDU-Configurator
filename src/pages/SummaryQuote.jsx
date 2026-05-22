import React from 'react';
import '../styles/components/button.css';
import { useDispatch, useSelector } from 'react-redux';
import { prevStep, resetConfig } from '../redux/slices/configSlice';
import FormButton from '../components/FormButton';

const SummaryQuote = () => {
  const dispatch = useDispatch();
  const { GeneralQuoteInfo, TransformerConfig } = useSelector((state) => state.config);

  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset all configuration data?')) {
      dispatch(resetConfig());
    }
  };

  return (
    <div>
      <div className="mb-4">
        <h5 className="mb-3" style={{ color: 'var(--text-primary)' }}>Customer & Region</h5>
        <div className="card p-3 mb-3" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)' }}>
          <div className="row">
            <div className="col-6 mb-2"><strong>Name:</strong> {GeneralQuoteInfo.name}</div>
            <div className="col-6 mb-2"><strong>Email:</strong> {GeneralQuoteInfo.email}</div>
            <div className="col-6 mb-2"><strong>Country:</strong> {GeneralQuoteInfo.country}</div>
            <div className="col-6 mb-2"><strong>Region:</strong> {GeneralQuoteInfo.productRegion}</div>
            <div className="col-6"><strong>Quantity:</strong> {GeneralQuoteInfo.quantity}</div>
          </div>
        </div>

        <h5 className="mb-3" style={{ color: 'var(--text-primary)' }}>Transformer Details</h5>
        <div className="card p-3" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)' }}>
          <div className="row">
            <div className="col-6 mb-2"><strong>Phase:</strong> {TransformerConfig.phase}</div>
            <div className="col-6 mb-2"><strong>Voltage:</strong> {TransformerConfig.input_voltage}</div>
            <div className="col-6"><strong>Current:</strong> {TransformerConfig.input_current}</div>
          </div>
        </div>
      </div>

      <div className="wizard-actions mt-4">
        <div>
          <FormButton variant="secondary" onClick={() => dispatch(prevStep())}>
            Previous
          </FormButton>
          <FormButton variant="danger" onClick={handleReset} className="ms-2">
            Reset
          </FormButton>
        </div>
        <FormButton variant="primary" onClick={() => alert('Configuration Submitted!')}>
          Submit Configuration
        </FormButton>
      </div>
    </div>
  );
};

export default SummaryQuote;
