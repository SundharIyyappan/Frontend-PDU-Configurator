import React, { useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { nextStep, prevStep, setSectionData } from '../redux/slices/configSlice';
import FormButton from '../components/FormButton';
import FormToggleGroup from '../components/FormToggleGroup';
import api from '../services/api';
import { buildCumulativePayload } from '../utils/configHelpers';

const InputBreakerConfig = () => {
  const dispatch = useDispatch();
  const configState = useSelector((state) => state.config);
  const { quoteId, quoteNumber } = configState;
  const stepData = configState.InputBreakerConfig || {};
  const { options } = useSelector((state) => state.metadata);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const initialStepData = useRef(stepData);

  const { breakerOrFuse = '', breakerType = '' } = stepData;

  const breakerOrFuseOptions = options['input_breaker_or_fuse'] || [];
  const breakerTypeOptions = options['input_breaker_type'] || [];

  // No auto-initialization — buttons stay disabled until user makes a selection

  const handleSelection = (name, value) => {
    const updates = { [name]: value };

    // Reset breakerType if switching away from Circuit Breaker
    if (name === 'breakerOrFuse' && value !== 'Circuit Breaker') {
      updates.breakerType = '';
    }
    dispatch(setSectionData({ section: 'InputBreakerConfig', data: updates }));
  };

  const isStepValid = breakerOrFuse && (breakerOrFuse !== 'Circuit Breaker' || breakerType);

  const handleNext = async () => {
    if (isStepValid) {
      // Only call API if data has changed (Mirroring TransformerConfig pattern)
      const hasChanges = JSON.stringify(stepData) !== JSON.stringify(initialStepData.current);

      if (!hasChanges) {
        dispatch(nextStep());
        return;
      }

      setIsSubmitting(true);
      try {
        await api.put(`/configurations/${quoteId}`, {
          step: 4,
          config_data: buildCumulativePayload(configState)
        });
        initialStepData.current = stepData;
        dispatch(nextStep());
      } catch (error) {
        console.error("Failed to save input breaker configuration:", error);
        alert("Failed to save configuration. Please try again.");
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div className="step-container">
      <div className="section-label mb-2" style={{ color: 'var(--text-label)', fontSize: '12px', fontWeight: 'bold', letterSpacing: '1px' }}>
        CIRCUIT BREAKER OR FUSE
      </div>

      <div className="row">
        {/* Card 1 — "Circuit Breaker or Fuse" */}
        <div className="col-md-4">
          <FormToggleGroup
            label="Circuit Breaker or Fuse"
            options={breakerOrFuseOptions}
            value={breakerOrFuse}
            onChange={(e) => handleSelection('breakerOrFuse', e.target.value)}
          />
        </div>

        {/* Conditional Card 2 — "Breaker Type" */}
        {breakerOrFuse === 'Circuit Breaker' && (
          <div className="col-md-4">
            <FormToggleGroup
              label="Breaker Type"
              options={breakerTypeOptions}
              value={breakerType}
              onChange={(e) => handleSelection('breakerType', e.target.value)}
            />
          </div>
        )}
      </div>

      {/* NAVIGATION */}
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

export default InputBreakerConfig;
