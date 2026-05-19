import React, { useState, useEffect } from 'react';
import '../styles/components/button.css';
import { useDispatch, useSelector } from 'react-redux';
import { nextStep, setSectionData, setQuoteId, setQuoteNumber } from '../redux/slices/configSlice';
import FormInput from '../components/FormInput';
import FormSelect from '../components/FormSelect';
import FormToggleGroup from '../components/FormToggleGroup';
import FormButton from '../components/FormButton';
import api from '../services/api';

const GeneralQuoteInfo = () => {
  const dispatch = useDispatch();
  const stepData = useSelector((state) => state.config.GeneralQuoteInfo);
  const quoteId = useSelector((state) => state.config.quoteId);
  const { options, loading } = useSelector((state) => state.metadata);

  const [formData, setFormData] = useState({
    name: stepData.name || '',
    email: stepData.email || '',
    country: stepData.country || '',
    postalCode: stepData.postalCode || '',
    productRegion: stepData.productRegion || '',
    quantity: stepData.quantity || ''
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isValid, setIsValid] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = (data) => {
    let newErrors = {};
    if (!data.name.trim()) newErrors.name = 'Name is required';
    if (!data.email.trim()) {
      newErrors.email = 'E-Mail is required';
    } else if (!/\S+@\S+\.\S+/.test(data.email)) {
      newErrors.email = 'E-Mail is invalid';
    }
    if (!data.country) newErrors.country = 'Country is required';
    
    if (!data.postalCode.trim()) {
      newErrors.postalCode = 'Postal Code is required';
    } else if (!/^\d+$/.test(data.postalCode.trim())) {
      newErrors.postalCode = 'Postal Code must contain only numbers';
    }

    if (!data.productRegion) newErrors.productRegion = 'Product Region is required';
    
    if (!data.quantity || Number(data.quantity) <= 0) {
      newErrors.quantity = 'Valid positive quantity is required';
    }

    setErrors(newErrors);
    setIsValid(Object.keys(newErrors).length === 0);
  };

  useEffect(() => {
    validate(formData);
  }, [formData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleBlur = (e) => {
    setTouched(prev => ({ ...prev, [e.target.name]: true }));
  };

  const handleNext = async () => {
    if (isValid) {
      setIsSubmitting(true);
      try {
        const payload = {
          customer_name: formData.name,
          email: formData.email,
          country: formData.country,
          postal_code: formData.postalCode,
          product_region: formData.productRegion,
          quantity: Number(formData.quantity)
        };

        if (quoteId) {
          // Update existing quote only if data has changed
          const hasChanges = JSON.stringify(formData) !== JSON.stringify(stepData);
          if (hasChanges) {
            const response = await api.put(`/quotes/${quoteId}`, payload);
            dispatch(setQuoteNumber(response.quote_number));
          }
        } else {
          // Create new quote
          const response = await api.post('/quotes', payload);
          dispatch(setQuoteId(response.quote_id));
          dispatch(setQuoteNumber(response.quote_number));
        }

        dispatch(setSectionData({ section: 'GeneralQuoteInfo', data: formData }));
        dispatch(nextStep());
      } catch (error) {
        console.error("Failed to save quote:", error);
        alert("Failed to save quote information. Please try again.");
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  if (loading || !options) return <div className="p-4 text-center">Loading configuration...</div>;

  return (
    <div>
      <div className="row">
        <div className="col-md-6">
          <FormInput
            label="Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="John Doe"
            error={touched.name ? errors.name : null}
            required
          />
        </div>
        <div className="col-md-6">
          <FormInput
            label="E-Mail"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="john@example.com"
            error={touched.email ? errors.email : null}
            required
          />
        </div>
      </div>

      <div className="row">
        <div className="col-md-6">
          <FormSelect
            label="Country"
            name="country"
            value={formData.country}
            onChange={handleChange}
            onBlur={handleBlur}
            options={options.country || []}
            error={touched.country ? errors.country : null}
            required
          />
        </div>
        <div className="col-md-6">
          <FormInput
            label="Postal Code"
            name="postalCode"
            value={formData.postalCode}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="12345"
            error={touched.postalCode ? errors.postalCode : null}
            required
          />
        </div>
      </div>

      <div className="row mt-2">
        <div className="col-md-6">
          <FormToggleGroup
            label="Product Region"
            options={options.product_region || []}
            value={formData.productRegion}
            onChange={(e) => {
              setFormData(prev => ({ ...prev, productRegion: e.target.value }));
              setTouched(prev => ({ ...prev, productRegion: true }));
            }}
            required
          />
          {(touched.productRegion && errors.productRegion) && (
            <div className="invalid-feedback d-block" style={{ marginTop: '-1rem', marginBottom: '1rem' }}>
              {errors.productRegion}
            </div>
          )}
        </div>
        <div className="col-md-6">
          <FormInput
            label="Quantity"
            name="quantity"
            type="number"
            value={formData.quantity}
            onChange={handleChange}
            onBlur={handleBlur}
            onKeyDown={(e) => {
              if (['-', '+', 'e', 'E', '.'].includes(e.key)) {
                e.preventDefault();
              }
            }}
            placeholder="1"
            min="1"
            error={touched.quantity ? errors.quantity : null}
            required
          />
        </div>
      </div>

      <div className="wizard-actions">
        <FormButton variant="secondary" disabled={true}>
          Previous
        </FormButton>
        <FormButton variant="primary" onClick={handleNext} disabled={!isValid || isSubmitting}>
          {isSubmitting ? 'Saving...' : 'Next'}
        </FormButton>
      </div>
    </div>
  );
};

export default GeneralQuoteInfo;
