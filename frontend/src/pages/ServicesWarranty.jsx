import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { nextStep, prevStep, setSectionData } from '../redux/slices/configSlice';
import FormButton from '../components/FormButton';
import FormToggle from '../components/FormToggle';
import api from '../services/api';
import { buildCumulativePayload } from '../utils/configHelpers';
import '../styles/components/toggle-group.css';

const ServicesWarranty = () => {
  const dispatch = useDispatch();
  const configState = useSelector((state) => state.config);
  const { options, rules, loading } = useSelector((state) => state.metadata);
  const { quoteId } = configState;
  const stepData = configState.ServicesWarranty || {};

  const [isSubmitting, setIsSubmitting] = useState(false);
  const initialStepData = useRef(stepData);

  const {
    installationRequired,
    warrantyPeriod = ""
  } = stepData;


  // Memoize options and rules
  const installationOptions = useMemo(() => options.service_installation || [], [options.service_installation]);
  const testingOptions = useMemo(() => options.service_testing || [], [options.service_testing]);
  const warrantyOptions = useMemo(() => options.warranty_period || [], [options.warranty_period]);

  const servicesRules = useMemo(() => {
    return (rules || []).filter(r => r.screen_name === 'services_warranty');
  }, [rules]);

  /**
   * Helper to check if a feature is enabled based on metadata rules
   */
  const isFeatureEnabled = (featureKey, currentData) => {
    const fieldRule = servicesRules.find(r => r.field_name === featureKey);
    if (!fieldRule) return true;

    const triggerValue = currentData[fieldRule.depends_on];
    const condition = fieldRule.rules?.conditions?.find(c => c.if === triggerValue);

    // Check if 'true' (enabled state) is in the allowed values list
    return condition?.values?.includes(true) || false;
  };

  const handleUpdate = (field, value) => {
    let nextData = { ...stepData, [field]: value };

    // Apply rules to automatically reset dependent fields if they become disabled
    servicesRules.forEach(rule => {
      const triggerField = rule.depends_on;
      const targetField = rule.field_name;

      const triggerValue = nextData[triggerField];
      const condition = rule.rules?.conditions?.find(c => c.if === triggerValue);
      const isAllowed = condition?.values?.includes(true) || false;

      if (!isAllowed) {
        nextData[targetField] = false;
      }
    });

    dispatch(setSectionData({ section: 'ServicesWarranty', data: nextData }));
  };

  const handleNext = async () => {
    const hasChanges = JSON.stringify(stepData) !== JSON.stringify(initialStepData.current);

    if (!hasChanges) {
      dispatch(nextStep());
      return;
    }

    setIsSubmitting(true);
    try {
      await api.put(`/configurations/${quoteId}`, {
        step: 8,
        config_data: buildCumulativePayload(configState)
      });
      initialStepData.current = stepData;
      dispatch(nextStep());
    } catch (error) {
      console.error("Failed to save services & warranty configuration:", error);
      alert("Failed to save configuration. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading || installationOptions.length === 0 || testingOptions.length === 0 || warrantyOptions.length === 0) {
    return (
      <div className="step-container text-center py-5">
        <p className="text-muted">Loading services & warranty configuration...</p>
        <div className="wizard-actions mt-5">
          <FormButton variant="secondary" onClick={() => dispatch(prevStep())}>Previous</FormButton>
        </div>
      </div>
    );
  }

  return (
    <div className="step-container">
      <div className="row g-4">
        {/* Panel 1 — Installation */}
        <div className="col-md-4">
          <div className="form-toggle-group-container">
            <div className="form-toggle-group-header">Installation <span className="required-mark">*</span></div>
            <div className="form-toggle-group-body">
              {installationOptions.map((opt) => {
                const isSelected = stepData[opt.value];
                const isEnabled = isFeatureEnabled(opt.value, stepData);

                return (
                  <div
                    key={opt.value}
                    className={`form-toggle-group-row ${isSelected ? 'selected' : ''} ${!isEnabled ? 'disabled' : ''}`}
                    onClick={() => isEnabled && handleUpdate(opt.value, !isSelected)}
                    style={{ opacity: !isEnabled ? 0.5 : 1, pointerEvents: !isEnabled ? 'none' : 'auto' }}
                  >
                    <span className="form-toggle-group-label">{opt.label}</span>
                    <FormToggle value={isSelected} onChange={() => { }} />
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Panel 2 — Testing Services */}
        <div className="col-md-4">
          <div className="form-toggle-group-container">
            <div className="form-toggle-group-header">Testing Services</div>
            <div className="form-toggle-group-body">
              {testingOptions.map((opt) => {
                const isSelected = stepData[opt.value];
                const isEnabled = isFeatureEnabled(opt.value, stepData);

                return (
                  <div
                    key={opt.value}
                    className={`form-toggle-group-row ${isSelected ? 'selected' : ''} ${!isEnabled ? 'disabled' : ''}`}
                    onClick={() => isEnabled && handleUpdate(opt.value, !isSelected)}
                    style={{ opacity: !isEnabled ? 0.5 : 1, pointerEvents: !isEnabled ? 'none' : 'auto' }}
                  >
                    <span className="form-toggle-group-label">{opt.label}</span>
                    <FormToggle value={isSelected} onChange={() => { }} />
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Panel 3 — Warranty Period */}
        <div className="col-md-4">
          <div className="form-toggle-group-container">
            <div className="form-toggle-group-header">Warranty Period</div>
            <div className="form-toggle-group-body">
              {warrantyOptions.map((opt) => (
                <div
                  key={opt.value}
                  className={`form-toggle-group-row ${warrantyPeriod === opt.value ? 'selected' : ''}`}
                  onClick={() => handleUpdate('warrantyPeriod', opt.value)}
                >
                  <span className="form-toggle-group-label">{opt.label}</span>
                  <FormToggle value={warrantyPeriod === opt.value} onChange={() => { }} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="wizard-actions mt-5">
        <FormButton variant="secondary" onClick={() => dispatch(prevStep())}>
          Previous
        </FormButton>
        <FormButton
          variant="primary"
          onClick={handleNext}
          disabled={isSubmitting || !installationRequired}
        >
          {isSubmitting ? 'Saving...' : 'Next'}
        </FormButton>
      </div>
    </div>
  );
};

export default ServicesWarranty;
