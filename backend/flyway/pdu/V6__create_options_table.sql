CREATE TABLE options (
    id SERIAL PRIMARY KEY,
    field_name TEXT, -- phase, voltage, plug
    value TEXT,
    label TEXT,
    metadata JSONB,
    is_active BOOLEAN DEFAULT TRUE
);