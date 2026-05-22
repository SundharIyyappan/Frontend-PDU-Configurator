import React from 'react';
import '../styles/components/step-indicator.css';

const StepIndicator = ({ currentStep, totalSteps }) => {
  return (
    <div className="step-indicator-container">
      {Array.from({ length: totalSteps }).map((_, index) => {
        const stepNum = index + 1;
        let stateClass = 'upcoming';
        
        if (stepNum === currentStep) {
          stateClass = 'active';
        } else if (stepNum < currentStep) {
          stateClass = 'completed';
        }

        return (
          <div key={index} className={`step-dot ${stateClass}`} />
        );
      })}
    </div>
  );
};

export default StepIndicator;
