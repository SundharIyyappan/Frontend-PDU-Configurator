import React from 'react';
import '../styles/components/button.css';
import { useDispatch, useSelector } from 'react-redux';
import { nextStep, prevStep, updateData } from '../redux/configSlice';
import FormButton from '../components/FormButton';
import FormToggleGroup from '../components/FormToggleGroup';

const VoltagePower = () => {
  const dispatch = useDispatch();
  const configData = useSelector((state) => state.config.data);
  const phase = configData.phase || '1PH';

  const handleChange = (e) => {
    const { value } = e.target;
    dispatch(updateData({ phase: value }));
  };

  return (
    <div>
      <p className="text-muted mb-4">Select voltage and power specifications for your PDU configuration.</p>

      <div className="row">
        <div className="col-md-6">
          <FormToggleGroup
            label="Phase"
            options={[
              { label: '1 Phase (1PH)', value: '1PH' },
              { label: '3 Phase (3PH)', value: '3PH' }
            ]}
            value={phase}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      <div className="wizard-actions mt-4">
        <FormButton variant="secondary" onClick={() => dispatch(prevStep())}>
          Previous
        </FormButton>
        <FormButton variant="primary" onClick={() => dispatch(nextStep())}>
          Next
        </FormButton>
      </div>
    </div>
  );
};

export default VoltagePower;
