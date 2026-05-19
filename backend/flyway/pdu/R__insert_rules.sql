-- Repeatable migration for Transformer Configuration Rules
TRUNCATE TABLE rules;

INSERT INTO rules (screen_name, field_name, depends_on, rules)
VALUES 
(
  'transformer_configuration',
  'input_voltage',
  'phase',
  '{
    "conditions": [
      { "if": "1PH", "values": ["120V", "208V"] },
      { "if": "3PH", "values": ["208V"] }
    ]
  }'::jsonb
),
(
  'transformer_configuration',
  'input_current',
  'phase',
  '{
    "conditions": [
      { "if": "1PH", "values": ["20A", "30A"] },
      { "if": "3PH", "values": ["20A", "30A", "50A", "60A"] }
    ]
  }'::jsonb
),
-- Outlet Type → Feature Rules
(
  'subfeed_breaker_configuration',
  'outlet_feature',
  'outlet_type',
  '{
    "conditions": [
      {
        "if": "C13",
        "values": ["STANDARD", "LOCKABLE", "INDIVIDUAL_FUSED"]
      },
      {
        "if": "C19",
        "values": ["STANDARD", "LOCKABLE", "INDIVIDUAL_FUSED"]
      },
      {
        "if": "NEMA_5_20R",
        "values": ["STANDARD"]
      }
    ]
  }'::jsonb
),
-- Outlet Type → Quantity Limits
(
  'subfeed_breaker_configuration',
  'quantity',
  'outlet_type',
  '{
    "conditions": [
      {
        "if": "C13",
        "max": 24
      },
      {
        "if": "C19",
        "max": 16
      },
      {
        "if": "NEMA_5_20R",
        "max": 12
      }
    ]
  }'::jsonb
),
-- PDU Series → Monitoring Feature Availability
(
  'monitoring_configuration',
  'monitoring_feature',
  'pdu_series',
  '{
    "conditions": [
      { "if": "RP3000", "values": ["SWITCH", "SNMP", "OUTLET_MEAS", "CIRCUIT_MEAS"] },
      { "if": "RP2000", "values": ["SWITCH", "SNMP", "CIRCUIT_MEAS"] },
      { "if": "RP1500", "values": ["SNMP", "OUTLET_MEAS", "CIRCUIT_MEAS"] },
      { "if": "RP1000", "values": ["SNMP", "CIRCUIT_MEAS"] },
      { "if": "RP100", "values": ["CIRCUIT_MEAS"] }
    ]
  }'::jsonb
),
-- Services & Warranty Rules
(
  'services_warranty',
  'onSiteSupport',
  'installationRequired',
  '{
    "conditions": [
      { "if": true, "values": [true] },
      { "if": false, "values": [] }
    ]
  }'::jsonb
),
(
  'services_warranty',
  'siteAcceptanceTest',
  'onSiteSupport',
  '{
    "conditions": [
      { "if": true, "values": [true] },
      { "if": false, "values": [] }
    ]
  }'::jsonb
),
(
  'services_warranty',
  'loadBankTesting',
  'factoryAcceptanceTest',
  '{
    "conditions": [
      { "if": true, "values": [true] },
      { "if": false, "values": [] }
    ]
  }'::jsonb
);
