/**
 * Centralized mapping for Privacy Policy metadata.
 * Maps backend option values to Redux state keys and defines display order.
 */
export const PRIVACY_MAPPING = {
  'AGREE_PRIVACY': {
    stateKey: 'agreePrivacy',
    order: 1,
    mandatory: true
  },
  'MARKETING_CONSENT': {
    stateKey: 'marketingConsent',
    order: 2,
    mandatory: false
  },
  'EMAIL_COPY': {
    stateKey: 'emailCopy',
    order: 3,
    mandatory: false
  }
};

/**
 * Helper to sort privacy options based on the defined order.
 */
export const sortPrivacyOptions = (options) => {
  return [...options].sort((a, b) => {
    const orderA = PRIVACY_MAPPING[a.value]?.order || 99;
    const orderB = PRIVACY_MAPPING[b.value]?.order || 99;
    return orderA - orderB;
  });
};
