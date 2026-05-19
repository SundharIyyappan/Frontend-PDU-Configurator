import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { nextStep, prevStep, setSectionData } from '../redux/slices/configSlice';
import FormButton from '../components/FormButton';
import FormInput from '../components/FormInput';
import api from '../services/api';
import '../styles/components/subfeed-card.css';

/**
 * Metadata for Accessories
 */
const ACCESSORIES_METADATA = {
  sensors: [
    {
      id: 'temp_humidity_sensor',
      label: 'Temperature + Humidity 2-in-1 Sensor + 4m cord'
    },
    {
      id: 'temp_sensor',
      label: 'Temperature sensor + 4m cord'
    }
  ],
  cable_accessories: [
    {
      id: 'sleeve_c14',
      label: 'Sleeve attached to C14 power cord inlet (pack of 10)'
    },
    {
      id: 'sleeve_c20',
      label: 'Sleeve attached to C20 power cord inlet (pack of 10)'
    }
  ]
};

const AccessoriesSelection = () => {
  const dispatch = useDispatch();
  const configState = useSelector((state) => state.config);
  const { quoteId, quoteNumber, GeneralQuoteInfo, TransformerConfig, EnclosureConfig, AccessoriesSelection: stepData } = configState;

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationError, setValidationError] = useState(null);

  const handleUpdate = (category, field, value) => {
    // Ensure value is a non-negative integer
    const numericValue = value === '' ? 0 : parseInt(value, 10);

    if (isNaN(numericValue) || numericValue < 0) return;

    let updatedSectionData;
    if (category === 'external_display') {
      updatedSectionData = { external_display: numericValue };
    } else {
      updatedSectionData = {
        [category]: {
          ...stepData[category],
          [field]: numericValue
        }
      };
    }

    dispatch(setSectionData({
      section: 'AccessoriesSelection',
      data: updatedSectionData
    }));

    // Clear the error when user enters a value
    if (numericValue > 0) {
      setValidationError(null);
    }
  };

  const validate = () => {
    const { sensors, external_display, cable_accessories } = stepData;

    const missing = [];
    const sensorQty = (sensors?.temp_humidity_sensor || 0) + (sensors?.temp_sensor || 0);
    const displayQty = external_display || 0;
    const cableQty = (cable_accessories?.sleeve_c14 || 0) + (cable_accessories?.sleeve_c20 || 0);

    if (sensorQty === 0) missing.push('Sensors');
    if (displayQty === 0) missing.push('External Display');
    if (cableQty === 0) missing.push('Cable Accessories');

    if (missing.length > 0) {
      setValidationError(`Please add a quantity for: ${missing.join(', ')}.`);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return false;
    }
    setValidationError(null);
    return true;
  };

  const handleNext = async () => {
    if (validate()) {
      setIsSubmitting(true);
      try {
        await api.put(`/configurations/${quoteId}`, {
          step: 7,
          config_data: {
            quote_number: quoteNumber,
            GeneralQuoteInfo,
            TransformerConfig,
            EnclosureConfig,
            AccessoriesSelection: stepData
          }
        });
        dispatch(nextStep());
      } catch (error) {
        console.error("Failed to save accessories configuration:", error);
        alert("Failed to save configuration. Please try again.");
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div className="step-container">
      {validationError && (
        <div className="subfeed-error-alert mb-4">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10 18C14.4183 18 18 14.4183 18 10C18 5.58172 14.4183 2 10 2C5.58172 2 2 5.58172 2 10C2 14.4183 5.58172 18 10 18Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M10 6V10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M10 14H10.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          {validationError}
        </div>
      )}
      <div className="row g-4">
        {/* Sensors Section */}
        <div className="col-md-4">
          <SectionWrapper title="Sensors">
            {ACCESSORIES_METADATA.sensors.map((item, index) => (
              <QuantityItem
                key={item.id}
                label={item.label}
                value={stepData.sensors[item.id]}
                onChange={(val) => handleUpdate('sensors', item.id, val)}
                showDivider={index !== ACCESSORIES_METADATA.sensors.length - 1}
              />
            ))}
          </SectionWrapper>
        </div>

        {/* External Display Section */}
        <div className="col-md-4">
          <SectionWrapper title="External Display">
            <QuantityItem
              label="External Display"
              value={stepData.external_display}
              onChange={(val) => handleUpdate('external_display', null, val)}
              showDivider={false}
            />
          </SectionWrapper>
        </div>

        {/* Cable Accessories Section */}
        <div className="col-md-4">
          <SectionWrapper title="Cable Accessories">
            {ACCESSORIES_METADATA.cable_accessories.map((item, index) => (
              <QuantityItem
                key={item.id}
                label={item.label}
                value={stepData.cable_accessories[item.id]}
                onChange={(val) => handleUpdate('cable_accessories', item.id, val)}
                showDivider={index !== ACCESSORIES_METADATA.cable_accessories.length - 1}
              />
            ))}
          </SectionWrapper>
        </div>
      </div>

      {/* NAVIGATION */}
      <div className="wizard-actions mt-5">
        <FormButton variant="secondary" onClick={() => dispatch(prevStep())}>
          Previous
        </FormButton>
        <FormButton
          variant="primary"
          onClick={handleNext}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Saving...' : 'Next'}
        </FormButton>
      </div>
    </div>
  );
};

const SectionWrapper = ({ title, children }) => (
  <div className="form-toggle-group-container h-100">
    <div className="form-toggle-group-header">{title}</div>
    <div className="form-toggle-group-body p-3">
      {children}
    </div>
  </div>
);

const QuantityItem = ({ label, value, onChange, compact = false, showDivider = true }) => (
  <div className={`${compact ? 'w-100 text-center' : 'mb-4'}`}>
    <div className="mb-2" style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
      {label}
    </div>
    <div className={`d-flex align-items-center ${compact ? 'justify-content-center' : ''}`}>
      <span className="me-2" style={{ fontSize: '0.85rem', fontWeight: '500' }}>Quantity</span>
      <div style={{ width: '100px' }}>
        <FormInput
          type="number"
          value={value === 0 ? '' : value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="0"
          min="0"
          onKeyDown={(e) => {
            if (['-', '+', 'e', 'E', '.'].includes(e.key)) {
              e.preventDefault();
            }
          }}
        />
      </div>
    </div>
    {showDivider && <div className="mt-4" style={{ borderBottom: '1px solid var(--border-color)', opacity: '0.5' }}></div>}
  </div>
);

export default AccessoriesSelection;
