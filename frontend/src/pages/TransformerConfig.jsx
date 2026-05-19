import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { nextStep, prevStep, setSectionData } from '../redux/slices/configSlice';
import FormButton from '../components/FormButton';
import FormToggleGroup from '../components/FormToggleGroup';
import api from '../services/api';

const TransformerConfig = () => {
  const dispatch = useDispatch();
  const stepData = useSelector((state) => state.config.TransformerConfig);
  const { options, rules } = useSelector((state) => state.metadata);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const initialStepData = useRef(stepData);
  const { phase = '', input_voltage = '', input_current = '' } = stepData;

  // Filter options based on rules
  const getFilteredOptions = (fieldName, dependentValue) => {
    const fieldOptions = options[fieldName] || [];
    const rule = rules.find(r => r.field_name === fieldName && r.screen_name === 'transformer_configuration');
    
    if (!rule || !dependentValue) return fieldOptions;

    const condition = rule.rules.conditions.find(c => c.if === dependentValue);
    if (!condition) return [];

    return fieldOptions.filter(opt => condition.values.includes(opt.value));
  };

  const phaseOptions = options['phase'] || [];
  const voltageOptions = getFilteredOptions('input_voltage', phase);
  const currentOptions = getFilteredOptions('input_current', phase);

  const handleSelection = (name, value) => {
    const updates = { [name]: value };

    // When phase changes, clear dependent fields to force user selection
    if (name === 'phase') {
      updates.input_voltage = '';
      updates.input_current = '';
    }

    // When voltage changes, clear current to force user selection
    if (name === 'input_voltage') {
      updates.input_current = '';
    }

    dispatch(setSectionData({ section: 'TransformerConfig', data: updates }));
  };

  const isStepValid = phase && input_voltage && input_current;

  const configState = useSelector((state) => state.config);
  const { quoteId, quoteNumber, GeneralQuoteInfo } = configState;

  const handleNext = async () => {
    if (isStepValid) {
      // Only call API if data has changed
      const hasChanges = JSON.stringify(stepData) !== JSON.stringify(initialStepData.current);
      
      if (!hasChanges) {
        dispatch(nextStep());
        return;
      }

      setIsSubmitting(true);
      try {
        await api.put(`/configurations/${quoteId}`, {
          step: 2,
          config_data: {
            quote_number: quoteNumber,
            GeneralQuoteInfo: GeneralQuoteInfo,
            TransformerConfig: stepData
          }
        });
        initialStepData.current = stepData;
        dispatch(nextStep());
      } catch (error) {
        console.error("Failed to save transformer configuration:", error);
        alert("Failed to save configuration. Please try again.");
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div className="step-container">
      <div className="section-label mb-2" style={{ color: 'var(--text-label)', fontSize: '12px', fontWeight: 'bold', letterSpacing: '1px' }}>PDU-INPUT</div>
      <div className="row">
        <div className="col-md-4">
          <FormToggleGroup
            label="Phase"
            options={phaseOptions}
            value={phase}
            onChange={(e) => handleSelection('phase', e.target.value)}
            required
          />
        </div>
        <div className="col-md-4">
          <FormToggleGroup
            label="Input Voltage"
            options={voltageOptions}
            value={input_voltage}
            onChange={(e) => handleSelection('input_voltage', e.target.value)}
            required
          />
        </div>
        <div className="col-md-4">
          <FormToggleGroup
            label="Input Current"
            options={currentOptions}
            value={input_current}
            onChange={(e) => handleSelection('input_current', e.target.value)}
            required
          />
        </div>
      </div>

      <div className="wizard-actions mt-5">
        <FormButton variant="secondary" onClick={() => dispatch(prevStep())}>
          Previous
        </FormButton>
        <FormButton
          variant="primary"
          onClick={handleNext}
          disabled={!isStepValid || isSubmitting}
        >
          {isSubmitting ? 'Saving...' : 'Next'}
        </FormButton>
      </div>
    </div>
  );
};

export default TransformerConfig;
