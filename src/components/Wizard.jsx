import React from 'react';
import '../styles/components/wizard.css';
import { useSelector, useDispatch } from 'react-redux';
import { Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import { nextStep, prevStep } from '../redux/slices/configSlice';
import GeneralQuoteInfo from '../pages/GeneralQuoteInfo';
import TransformerConfig from '../pages/TransformerConfig';
import EnclosureConfig from '../pages/EnclosureConfig';
import InputBreakerConfig from '../pages/InputBreakerConfig';
import SubfeedBreakerConfig from '../pages/SubfeedBreakerConfig';
import MonitoringFeatures from '../pages/MonitoringFeatures';
import AccessoriesSelection from '../pages/AccessoriesSelection';
import ServicesWarranty from '../pages/ServicesWarranty';
import SubmitConfig from '../pages/SubmitConfig';
import OutputGeneration from '../pages/OutputGeneration';
import StepIndicator from './StepIndicator';

const Wizard = () => {
  const { currentStep, steps } = useSelector((state) => state.config);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const currentStepData = steps.find(s => s.id === currentStep) || steps[0];

  React.useEffect(() => {
    navigate(`/step${currentStep}`);
  }, [currentStep, navigate]);

  return (
    <div className="wizard-container">
      <div className="d-flex justify-content-between align-items-end pb-3 mb-4" style={{ borderBottom: '1px solid var(--border-color)' }}>
        <h4 className="mb-0" style={{ color: 'var(--text-primary)', fontWeight: '600' }}>
          {currentStepData.label}
        </h4>
        <div style={{ paddingBottom: '4px' }}>
          <StepIndicator currentStep={currentStep} totalSteps={steps.length} />
        </div>
      </div>
      <div className="wizard-body">
        <Routes>
          <Route path="/" element={<Navigate to="/step1" replace />} />
          <Route path="/step1" element={<GeneralQuoteInfo />} />
          <Route path="/step2" element={<TransformerConfig />} />
          <Route path="/step3" element={<EnclosureConfig />} />
          <Route path="/step4" element={<InputBreakerConfig />} />
          <Route path="/step5" element={<SubfeedBreakerConfig />} />
          <Route path="/step6" element={<MonitoringFeatures />} />
          <Route path="/step7" element={<AccessoriesSelection />} />
          <Route path="/step8" element={<ServicesWarranty />} />
          <Route path="/step9" element={<SubmitConfig />} />
          <Route path="/step10" element={<OutputGeneration />} />
        </Routes>
      </div>
    </div>
  );
};

export default Wizard;
