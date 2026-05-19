DROP TABLE IF EXISTS rules;

CREATE TABLE rules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    screen_name TEXT NOT NULL,
    field_name TEXT NOT NULL,
    depends_on TEXT,
    rules JSONB NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
