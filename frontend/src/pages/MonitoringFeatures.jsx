import React, { useState, useRef, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { nextStep, prevStep, setSectionData } from '../redux/slices/configSlice';
import FormButton from '../components/FormButton';
import ConfigTable from '../components/ConfigTable';
import { buildCumulativePayload } from '../utils/configHelpers';
import api from '../services/api';

const MonitoringFeatures = () => {
  const dispatch = useDispatch();
  const configState = useSelector((state) => state.config);
  const { options, rules } = useSelector((state) => state.metadata);
  const { quoteId, MonitoringConfig: stepData } = configState;
  
  const [validationError, setValidationError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const initialStepData = useRef(stepData);

  // Derive series and features from metadata options
  const seriesOptions = useMemo(() => options.pdu_series || [], [options.pdu_series]);
  const featureOptions = useMemo(() => options.monitoring_feature || [], [options.monitoring_feature]);

  /**
   * Build an availability lookup (feature -> series -> boolean) from metadata rules.
   * Optimized using useMemo to avoid recalculation on every render.
   */
  const availabilityLookup = useMemo(() => {
    const lookup = {};
    const monitoringRule = rules.find(
      r => r.screen_name === 'monitoring_configuration' && r.field_name === 'monitoring_feature'
    );

    if (!monitoringRule) return lookup;

    featureOptions.forEach(feature => {
      lookup[feature.value] = {};
      seriesOptions.forEach(series => {
        const seriesRule = monitoringRule.rules?.conditions?.find(c => c.if === series.value);
        lookup[feature.value][series.value] = seriesRule?.values?.includes(feature.value) || false;
      });
    });

    return lookup;
  }, [rules, featureOptions, seriesOptions]);

  const selectedSeries = stepData?.selectedSeries || "";
  const isValid = selectedSeries !== "";

  // Prepare data for ConfigTable
  const tableRows = useMemo(() => {
    return featureOptions.map(f => ({
      id: f.value,
      label: f.label,
      availability: availabilityLookup[f.value] || {}
    }));
  }, [featureOptions, availabilityLookup]);

  const handleSelect = (seriesValue) => {
    setValidationError(null);
    dispatch(setSectionData({
      section: 'MonitoringConfig',
      data: { selectedSeries: seriesValue }
    }));
  };

  const handleNext = async () => {
    if (!isValid) {
      setValidationError("Please select a PDU series.");
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    const hasChanges = JSON.stringify(stepData) !== JSON.stringify(initialStepData.current);
    
    if (!hasChanges) {
      dispatch(nextStep());
      return;
    }

    setIsSubmitting(true);
    try {
      await api.put(`/configurations/${quoteId}`, {
        step: 6,
        config_data: buildCumulativePayload(configState)
      });
      initialStepData.current = stepData;
      dispatch(nextStep());
    } catch (error) {
      console.error("Failed to save monitoring configuration:", error);
      setValidationError(error.response?.data?.message || "Failed to save configuration. Please try again.");
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Fallback if metadata is missing
  if (seriesOptions.length === 0 || featureOptions.length === 0) {
    return (
      <div className="step-container text-center py-5">
        <p className="text-muted">Loading monitoring configuration...</p>
        <div className="wizard-actions mt-5">
          <FormButton variant="secondary" onClick={() => dispatch(prevStep())}>Previous</FormButton>
        </div>
      </div>
    );
  }

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

      <ConfigTable
        title="PDU SERIES COMPARISON"
        columns={seriesOptions}
        rows={tableRows}
        selectedValue={selectedSeries}
        onSelect={handleSelect}
      />

      <div className="wizard-actions mt-5">
        <FormButton variant="secondary" onClick={() => dispatch(prevStep())} disabled={isSubmitting}>
          Previous
        </FormButton>
        <FormButton
          variant="primary"
          onClick={handleNext}
          disabled={isSubmitting || !isValid}
        >
          {isSubmitting ? 'Saving...' : 'Next'}
        </FormButton>
      </div>
    </div>
  );
};

export default MonitoringFeatures;
