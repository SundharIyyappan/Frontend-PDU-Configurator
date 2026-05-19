CREATE TABLE rules (
    id SERIAL PRIMARY KEY,
    rule_type TEXT NOT NULL, -- compatibility, restriction, dependency
    condition JSONB NOT NULL,
    action JSONB NOT NULL,
    priority INT DEFAULT 1,
    is_active BOOLEAN DEFAULT TRUE,
    message TEXT,
    severity TEXT DEFAULT 'error', -- error, warning
    created_at TIMESTAMP DEFAULT NOW()
);
