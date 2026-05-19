/**
 * Consolidates the current Redux configuration state into a single cumulative payload object.
 * This object represent a full snapshot of the configuration to be sent to the backend.
 * 
 * @param {Object} configState - The 'config' slice from Redux state
 * @returns {Object} The consolidated config_data object
 */
export const buildCumulativePayload = (configState) => {
  return {
    quote_number: configState.quoteNumber || null,
    GeneralQuoteInfo: configState.GeneralQuoteInfo || {},
    TransformerConfig: configState.TransformerConfig || {},
    EnclosureConfig: configState.EnclosureConfig || {},
    InputBreakerConfig: configState.InputBreakerConfig || {},
    SubfeedBreakerConfig: configState.SubfeedBreakerConfig || {},
    MonitoringConfig: configState.MonitoringConfig || {},
    AccessoriesSelection: configState.AccessoriesSelection || {},
    ServicesWarranty: configState.ServicesWarranty || {},
    SubmitConfig: configState.SubmitConfig || {}
  };
};
