import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { nextStep, prevStep, setSectionData } from '../redux/slices/configSlice';
import FormButton from '../components/FormButton';
import FormToggleGroup from '../components/FormToggleGroup';
import FormInput from '../components/FormInput';
import FormSelect from '../components/FormSelect';
import api from '../services/api';
import '../styles/components/toggle-group.css';

/**
 * Enclosure Configuration Page
 * Implement three sections: Form Factor, Colored Casing, and Physical Layout.
 * Using existing Redux key: EnclosureConfig
 */
const EnclosureConfig = () => {
  const dispatch = useDispatch();
  const configState = useSelector((state) => state.config);
  const { quoteId, quoteNumber, GeneralQuoteInfo, TransformerConfig, EnclosureConfig: stepData } = configState;
  const { options, loading } = useSelector((state) => state.metadata);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const initialStepData = useRef(stepData);

  // Local state for form data, initialized from Redux
  const [formData, setFormData] = useState({
    formFactor: stepData?.formFactor || '',
    color: stepData?.color || '',
    individual: stepData?.individual || '',
    outletType: stepData?.outletType || '',
    numberOfOutlets: stepData?.numberOfOutlets || '',
    outletArrangement: stepData?.outletArrangement || '',
    inputPosition: stepData?.inputPosition || '',
    mountingType: stepData?.mountingType || '',
    outletSpacing: stepData?.outletSpacing || ''
  });

  const [errors, setErrors] = useState({});

  const handleChange = (name, value) => {
    const updatedData = { ...formData, [name]: value };
    setFormData(updatedData);

    // Step 5.4: Ensure state updates on every user interaction
    dispatch(setSectionData({ section: 'EnclosureConfig', data: { [name]: value } }));

    // Clear error when field is updated
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.formFactor) newErrors.formFactor = 'Form Factor is required';
    if (!formData.color) newErrors.color = 'Color is required';
    if (formData.color === 'Individual' && !formData.individual) {
      newErrors.individual = 'Individual color (RAL) is required';
    }
    if (!formData.outletType) newErrors.outletType = 'Outlet Type is required';
    if (!formData.numberOfOutlets) {
      newErrors.numberOfOutlets = 'Number of Outlets is required';
    } else if (parseInt(formData.numberOfOutlets) <= 0) {
      newErrors.numberOfOutlets = 'Number of Outlets must be greater than 0';
    }
    if (!formData.outletArrangement) newErrors.outletArrangement = 'Outlet Arrangement is required';
    if (!formData.inputPosition) newErrors.inputPosition = 'Input Position is required';
    if (!formData.mountingType) newErrors.mountingType = 'Mounting Type is required';
    if (!formData.outletSpacing) newErrors.outletSpacing = 'Outlet Spacing is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = async () => {
    if (validate()) {
      // Only call API if data has changed
      const hasChanges = JSON.stringify(stepData) !== JSON.stringify(initialStepData.current);

      if (!hasChanges) {
        dispatch(nextStep());
        return;
      }

      setIsSubmitting(true);
      try {
        await api.put(`/configurations/${quoteId}`, {
          step: 3,
          config_data: {
            quote_number: quoteNumber,
            GeneralQuoteInfo: GeneralQuoteInfo,
            TransformerConfig: TransformerConfig,
            EnclosureConfig: stepData
          }
        });

        initialStepData.current = stepData;
        dispatch(nextStep());
      } catch (error) {
        console.error("Failed to save enclosure configuration:", error);
        alert("Failed to save configuration. Please try again.");
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  if (loading || !options) return <div className="p-4 text-center">Loading configuration...</div>;

  return (
    <div className="step-container">
      <div className="row g-4">
        {/* Form Factor Section */}
        <div className="col-md-4">
          <FormToggleGroup
            label="Form Factor"
            options={options.enclosure_form_factor || []}
            value={formData.formFactor}
            onChange={(e) => handleChange('formFactor', e.target.value)}
          />
        </div>

        {/* Colored Casing Section */}
        <div className="col-md-4">
          <FormToggleGroup
            label="Colored Casing"
            options={options.enclosure_color || []}
            value={formData.color}
            onChange={(e) => handleChange('color', e.target.value)}
          />
          {formData.color === 'Individual' && (
            <div className="form-toggle-group-container mt-2">
              <div className="p-3">
                <FormInput
                  label="Individual Color (RAL)"
                  placeholder="233333 or RAL code"
                  value={formData.individual}
                  onChange={(e) => handleChange('individual', e.target.value)}
                  error={errors.individual}
                  required
                />
              </div>
            </div>
          )}
        </div>

        {/* Physical Layout Section */}
        <div className="col-md-4">
          <PhysicalLayoutSection
            formData={formData}
            onChange={handleChange}
            options={options}
            errors={errors}
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
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Saving...' : 'Next'}
        </FormButton>
      </div>
    </div>
  );
};



const PhysicalLayoutSection = ({ formData, onChange, options, errors }) => (
  <div className="form-toggle-group-container">
    <div className="form-toggle-group-header">
      Physical Layout <span className="required-mark">*</span>
    </div>
    <div className="form-toggle-group-body p-3">
      <FormSelect
        label="Outlet Type"
        name="outletType"
        value={formData.outletType}
        onChange={(e) => onChange('outletType', e.target.value)}
        options={options.outlet_type || []}
        error={errors.outletType}
        required
      />

      <FormInput
        label="Number of Outlets"
        name="numberOfOutlets"
        type="number"
        min="1"
        placeholder="e.g., 24"
        value={formData.numberOfOutlets}
        onChange={(e) => onChange('numberOfOutlets', e.target.value)}
        onKeyDown={(e) => {
          if (['-', '+', 'e', 'E', '.'].includes(e.key)) {
            e.preventDefault();
          }
        }}
        error={errors.numberOfOutlets}
        required
      />

      <FormSelect
        label="Outlet Arrangement"
        name="outletArrangement"
        value={formData.outletArrangement}
        onChange={(e) => onChange('outletArrangement', e.target.value)}
        options={options.outlet_arrangement || []}
        error={errors.outletArrangement}
        required
      />

      <FormSelect
        label="Input Position"
        name="inputPosition"
        value={formData.inputPosition}
        onChange={(e) => onChange('inputPosition', e.target.value)}
        options={options.input_position || []}
        error={errors.inputPosition}
        required
      />

      <FormSelect
        label="Mounting Type"
        name="mountingType"
        value={formData.mountingType}
        onChange={(e) => onChange('mountingType', e.target.value)}
        options={options.mounting_type || []}
        error={errors.mountingType}
        required
      />

      <FormSelect
        label="Outlet Spacing"
        name="outletSpacing"
        value={formData.outletSpacing}
        onChange={(e) => onChange('outletSpacing', e.target.value)}
        options={options.outlet_spacing || []}
        error={errors.outletSpacing}
        required
      />
    </div>
  </div>
);

export default EnclosureConfig;
