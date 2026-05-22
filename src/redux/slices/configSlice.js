import { createSlice } from '@reduxjs/toolkit';

const STORAGE_KEY = 'pdu_config_state';

// Static steps configuration
const DEFAULT_STEPS = [
  { id: 1, key: "GeneralQuoteInfo", label: "General Quote Information" },
  { id: 2, key: "TransformerConfig", label: "Transformer Configuration" },
  { id: 3, key: "EnclosureConfig", label: "Enclosure Configuration" },
  { id: 4, key: "InputBreakerConfig", label: "Input Breaker Configuration" },
  { id: 5, key: "SubfeedBreakerConfig", label: "Subfeed Breaker Configuration" },
  { id: 6, key: "MonitoringConfig", label: "Monitoring Configuration" },
  { id: 7, key: "AccessoriesSelection", label: "Accessories Selection" },
  { id: 8, key: "ServicesWarranty", label: "Services & Warranty" },
  { id: 9, key: "SubmitConfig", label: "Submit for Automation Processing" },
  { id: 10, key: "OutputGeneration", label: "Output Generation" }
];


const DEFAULT_FORM_DATA = {
  quoteId: null,
  quoteNumber: null,
  GeneralQuoteInfo: {
    name: "",
    email: "",
    country: "",
    postalCode: "",
    productRegion: "",
    quantity: ""
  },
  TransformerConfig: {
    phase: "",
    input_voltage: "",
    input_current: ""
  },
  EnclosureConfig: {
    formFactor: '',
    color: '',
    individual: '',
    outletType: '',
    numberOfOutlets: '',
    outletArrangement: '',
    inputPosition: '',
    mountingType: '',
    outletSpacing: ''
  },
  InputBreakerConfig: {
    breakerOrFuse: "",
    breakerType: ""
  },
  SubfeedBreakerConfig: {},
  MonitoringConfig: {
    selectedSeries: ""
  },
  AccessoriesSelection: {
    sensors: {
      temp_humidity_sensor: 0,
      temp_sensor: 0
    },
    external_display: 0,
    cable_accessories: {
      sleeve_c14: 0,
      sleeve_c20: 0
    }
  },
  ServicesWarranty: {
    installationRequired: false,
    onSiteSupport: false,
    factoryAcceptanceTest: false,
    siteAcceptanceTest: false,
    loadBankTesting: false,
    warrantyPeriod: ""
  },
  SubmitConfig: {
    specialRequirements: "",
    agreePrivacy: false,
    marketingConsent: false,
    emailCopy: false
  },
  OutputGeneration: {}
};

// Persistence helper: Load from localStorage
const loadPersistedState = () => {
  try {
    const serializedState = localStorage.getItem(STORAGE_KEY);
    if (serializedState === null) {
      return {
        currentStep: 1,
        ...DEFAULT_FORM_DATA
      };
    }
    const persistedState = JSON.parse(serializedState);
    return {
      ...DEFAULT_FORM_DATA,
      ...persistedState,
      currentStep: persistedState.currentStep || 1
    };
  } catch (err) {
    console.error("Could not load state from localStorage:", err);
    return {
      currentStep: 1,
      ...DEFAULT_FORM_DATA
    };
  }
};

// Persistence helper: Save to localStorage
const saveState = (state) => {
  try {
    // Only persist currentStep and form data sections
    const { steps, ...persistableState } = state;
    const serializedState = JSON.stringify(persistableState);
    localStorage.setItem(STORAGE_KEY, serializedState);
  } catch (err) {
    console.error("Could not save state to localStorage:", err);
  }
};

const initialState = {
  ...loadPersistedState(),
  steps: DEFAULT_STEPS
};

export const configSlice = createSlice({
  name: 'config',
  initialState,
  reducers: {
    setCurrentStep: (state, action) => {
      state.currentStep = action.payload;
      saveState(state);
    },
    nextStep: (state) => {
      if (state.currentStep < state.steps.length) {
        state.currentStep += 1;
        saveState(state);
      }
    },
    prevStep: (state) => {
      if (state.currentStep > 1) {
        state.currentStep -= 1;
        saveState(state);
      }
    },
    updateField: (state, action) => {
      const { section, field, value } = action.payload;
      if (state[section]) {
        state[section][field] = value;
        saveState(state);
      }
    },
    setSectionData: (state, action) => {
      const { section, data } = action.payload;
      if (state[section]) {
        state[section] = { ...state[section], ...data };
        saveState(state);
      }
    },
    setQuoteId: (state, action) => {
      state.quoteId = action.payload;
      saveState(state);
    },
    setQuoteNumber: (state, action) => {
      state.quoteNumber = action.payload;
      saveState(state);
    },
    initializeSubfeed: (state, action) => {
      const outletTypes = action.payload; // expect array of {value, label}
      if (!state.SubfeedBreakerConfig.outlets || Object.keys(state.SubfeedBreakerConfig.outlets).length === 0) {
        const outlets = {};
        outletTypes.forEach(ot => {
          outlets[ot.value] = {
            type: ot.value,
            quantity: 0,
            features: {} // Default empty features = All OFF
          };
        });
        state.SubfeedBreakerConfig.outlets = outlets;
        saveState(state);
      }
    },
    resetConfig: (state) => {
      // Clear localStorage
      localStorage.removeItem(STORAGE_KEY);
      // Reset to defaults
      return {
        ...DEFAULT_FORM_DATA,
        currentStep: 1,
        steps: DEFAULT_STEPS
      };
    }
  },
});

export const {
  setCurrentStep,
  nextStep,
  prevStep,
  updateField,
  setSectionData,
  setQuoteId,
  setQuoteNumber,
  initializeSubfeed,
  resetConfig
} = configSlice.actions;

export default configSlice.reducer;
