import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { nextStep, prevStep, setSectionData } from '../redux/slices/configSlice';
import FormButton from '../components/FormButton';
import SubfeedCard from '../components/SubfeedCard';
import { buildCumulativePayload } from '../utils/configHelpers';
import api from '../services/api';

const SubfeedBreakerConfig = () => {
  const dispatch = useDispatch();
  const configState = useSelector((state) => state.config);
  const { SubfeedBreakerConfig: stepData } = configState;
  const { options, rules } = useSelector((state) => state.metadata);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationError, setValidationError] = useState(null);
  const initialStepData = useRef(stepData);

  const outlets = stepData.outlets || {};

  // --- Derive data from metadata ---
  const allFeatures = options.outlet_feature || [];
  
  // Find the single rule that maps outlet_type → allowed outlet_features
  const featureRule = rules.find(
    r => r.screen_name === 'subfeed_breaker_configuration' && r.field_name === 'outlet_feature'
  );

  // Find the rule that maps outlet_type → max quantity
  const quantityRule = rules.find(
    r => r.screen_name === 'subfeed_breaker_configuration' && r.field_name === 'quantity'
  );

  // Filter outletTypes to only show those that are explicitly configured for this screen
  const outletTypes = useMemo(() => {
    let types = options.outlet_type || [];
    if (featureRule || quantityRule) {
      const configuredTypes = new Set([
        ...(featureRule?.rules?.conditions?.map(c => c.if) || []),
        ...(quantityRule?.rules?.conditions?.map(c => c.if) || [])
      ]);
      return types.filter(ot => configuredTypes.has(ot.value));
    }
    return types;
  }, [options.outlet_type, featureRule, quantityRule]);

  // Initialize outlets map if it doesn't exist
  useEffect(() => {
    if (!stepData.outlets || Object.keys(stepData.outlets).length === 0) {
      const initialOutlets = {};
      outletTypes.forEach(ot => {
        initialOutlets[ot.value] = {
          type: ot.value,
          quantity: 0,
          features: {}
        };
      });
      dispatch(setSectionData({
        section: 'SubfeedBreakerConfig',
        data: { outlets: initialOutlets }
      }));
    }
  }, [stepData.outlets, outletTypes, dispatch]);

  const getAllowedFeatures = (outletTypeValue) => {
    if (!featureRule) return allFeatures;
    const condition = featureRule.rules?.conditions?.find(c => c.if === outletTypeValue);
    if (!condition) return allFeatures;
    return allFeatures.filter(f => condition.values.includes(f.value));
  };

  const getMaxQuantity = (outletTypeValue) => {
    if (!quantityRule) return 24;
    const condition = quantityRule.rules?.conditions?.find(c => c.if === outletTypeValue);
    return condition?.max ?? 24;
  };

  const handleCardChange = (updatedOutlet) => {
    dispatch(setSectionData({
      section: 'SubfeedBreakerConfig',
      data: {
        outlets: {
          ...outlets,
          [updatedOutlet.type]: updatedOutlet
        }
      }
    }));
  };

  const handleNext = async () => {
    // Validation: Ensure at least one outlet has quantity > 0
    const hasSelection = Object.values(outlets).some(o => (Number(o.quantity) || 0) > 0);
    
    if (!hasSelection) {
      setValidationError("Please select at least one outlet type");
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setValidationError(null);

    // Change Detection: Deep comparison
    const hasChanged = JSON.stringify(stepData) !== JSON.stringify(initialStepData.current);

    if (hasChanged) {
      setIsSubmitting(true);
      try {
        await api.put(`/configurations/${configState.quoteId}`, {
          step: 5,
          config_data: buildCumulativePayload(configState)
        });
        initialStepData.current = stepData;
        dispatch(nextStep());
      } catch (error) {
        console.error("Failed to save subfeed breaker configuration:", error);
        setValidationError(error.response?.data?.message || "Failed to save configuration. Please try again.");
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } finally {
        setIsSubmitting(false);
      }
    } else {
      dispatch(nextStep());
    }
  };

  return (
    <div className="step-container">
      {validationError && (
        <div className="subfeed-error-alert mb-4">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10 18C14.4183 18 18 14.4183 18 10C18 5.58172 14.4183 2 10 2C5.58172 2 2 5.58172 2 10C2 14.4183 5.58172 18 10 18Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M10 6V10" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M10 14H10.01" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          {validationError}
        </div>
      )}

      <div
        className="section-label mb-2"
        style={{ color: 'var(--text-label)', fontSize: '12px', fontWeight: 'bold', letterSpacing: '1px' }}
      >
        OUTLET TYPE &amp; FEATURES
      </div>

      <div className="subfeed-grid">
        {outletTypes.map(outletType => {
          const allowedFeatures = getAllowedFeatures(outletType.value);
          const maxQty = getMaxQuantity(outletType.value);
          const currentValue = outlets[outletType.value] || null;

          return (
            <SubfeedCard
              key={outletType.value}
              outletType={outletType}
              outletFeatures={allowedFeatures}
              maxQuantity={maxQty}
              value={currentValue}
              onChange={handleCardChange}
            />
          );
        })}
      </div>

      {/* Show a fallback if metadata isn't loaded yet */}
      {outletTypes.length === 0 && (
        <p style={{ color: 'var(--text-muted)', textAlign: 'center', marginTop: '2rem' }}>
          Loading outlet options...
        </p>
      )}

      {/* NAVIGATION */}
      <div className="wizard-actions mt-5">
        <FormButton variant="secondary" onClick={() => dispatch(prevStep())} disabled={isSubmitting}>
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

export default SubfeedBreakerConfig;
