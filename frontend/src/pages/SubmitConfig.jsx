import React, { useState, useRef, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { nextStep, prevStep, setSectionData } from '../redux/slices/configSlice';
import FormButton from '../components/FormButton';
import FormToggle from '../components/FormToggle';
import { buildCumulativePayload } from '../utils/configHelpers';
import { PRIVACY_MAPPING, sortPrivacyOptions } from '../constants/privacyMappings';
import api from '../services/api';

const SubmitConfig = () => {
  const dispatch = useDispatch();
  const configState = useSelector((state) => state.config);
  const { options, loading: metadataLoading } = useSelector((state) => state.metadata);
  const { quoteId, SubmitConfig: stepData } = configState;
  
  const [validationError, setValidationError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const initialStepData = useRef(stepData);

  // Filter and sort privacy policy options from metadata
  const privacyOptions = useMemo(() => {
    const rawOptions = options.privacy_policy || [];
    return sortPrivacyOptions(rawOptions);
  }, [options.privacy_policy]);

  const handleFieldChange = (field, value) => {
    setValidationError(null);
    dispatch(setSectionData({
      section: 'SubmitConfig',
      data: { [field]: value }
    }));
  };

  const handleNext = async () => {
    // Validation: Using option.value for logic
    const mandatoryOptions = privacyOptions.filter(opt => PRIVACY_MAPPING[opt.value]?.mandatory);
    const isValid = mandatoryOptions.every(opt => {
      const stateKey = PRIVACY_MAPPING[opt.value]?.stateKey;
      return stepData?.[stateKey] === true;
    });

    if (!isValid) {
      setValidationError("Please accept the privacy policy to continue");
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setIsSubmitting(true);
    try {
      await api.put(`/configurations/${quoteId}`, {
        step: 9,
        config_data: buildCumulativePayload(configState)
      });
      initialStepData.current = stepData;
      dispatch(nextStep());
    } catch (error) {
      console.error("Failed to submit configuration:", error);
      setValidationError(error.response?.data?.message || "Failed to submit configuration. Please try again.");
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Fallback if metadata is missing or loading
  if (metadataLoading) {
    return (
      <div className="step-container text-center py-5">
        <div className="spinner-border text-primary mb-3" role="status" style={{ width: '3rem', height: '3rem', color: 'var(--color-accent)' }}>
          <span className="sr-only">Loading...</span>
        </div>
        <p className="text-muted">Loading submission configuration...</p>
      </div>
    );
  }

  if (privacyOptions.length === 0) {
    return (
      <div className="step-container text-center py-5">
        <div className="subfeed-error-alert mb-4 d-inline-flex align-items-center">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
          Unable to load privacy configuration. Please contact support.
        </div>
        <div className="wizard-actions mt-5">
          <FormButton variant="secondary" onClick={() => dispatch(prevStep())}>
            Back to Previous Step
          </FormButton>
        </div>
      </div>
    );
  }

  return (
    <div className="step-container">
      {validationError && (
        <div className="subfeed-error-alert mb-4">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10 18C14.4183 18 18 14.4183 18 10C18 5.58172 14.4183 2 10 2C5.58172 2 2 5.58172 2 10C2 14.4183 5.58172 18 10 18Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M10 6V10" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M10 14H10.01" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          {validationError}
        </div>
      )}

      {/* SPECIAL REQUIREMENTS */}
      <div
        className="section-label mb-2"
        style={{ color: 'var(--text-label)', fontSize: '12px', fontWeight: 'bold', letterSpacing: '1px' }}
      >
        SPECIAL REQUIREMENTS
      </div>
      <div className="card mb-5 p-4" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
        <textarea
          className="form-input"
          style={{ 
            minHeight: '120px', 
            resize: 'vertical', 
            width: '100%', 
            padding: '12px',
            backgroundColor: 'var(--bg-input)',
            border: '1px solid var(--border-color)',
            color: 'var(--text-primary)',
            borderRadius: '4px'
          }}
          placeholder="Enter any additional requirements or notes here..."
          value={stepData?.specialRequirements || ""}
          maxLength={1000}
          onChange={(e) => handleFieldChange('specialRequirements', e.target.value)}
        />
        <div className="text-right mt-2" style={{ fontSize: '11px', color: 'var(--text-muted)', opacity: 0.7 }}>
          {(stepData?.specialRequirements || "").length} / 1000 characters
        </div>
      </div>

      {/* PRIVACY POLICY */}
      <div
        className="section-label mb-2"
        style={{ color: 'var(--text-label)', fontSize: '12px', fontWeight: 'bold', letterSpacing: '1px' }}
      >
        PRIVACY POLICY
      </div>
      <div className="card" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
        {privacyOptions.map((option, index) => {
          const mapping = PRIVACY_MAPPING[option.value];
          const stateKey = mapping?.stateKey;
          const isLast = index === privacyOptions.length - 1;

          return (
            <div 
              key={option.value} 
              className={`p-3 ${!isLast ? 'border-bottom' : ''}`} 
              style={{ borderColor: 'var(--border-color)' }}
            >
              <FormToggle
                label={option.label}
                value={!!stepData?.[stateKey]}
                onChange={(val) => handleFieldChange(stateKey, val)}
              />
            </div>
          );
        })}
      </div>

      {/* NAVIGATION */}
      <div className="wizard-actions mt-5">
        <FormButton variant="secondary" onClick={() => dispatch(prevStep())} disabled={isSubmitting}>
          Previous
        </FormButton>
        <FormButton
          variant="primary"
          onClick={handleNext}
          disabled={isSubmitting || metadataLoading}
        >
          {isSubmitting ? 'Submitting...' : 'Submit'}
        </FormButton>
      </div>
    </div>
  );
};

export default SubmitConfig;
