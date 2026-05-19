CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    category TEXT NOT NULL, -- transformer, breaker, enclosure
    name TEXT NOT NULL,
    code TEXT UNIQUE,
    attributes JSONB,
    base_price NUMERIC,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW()
);