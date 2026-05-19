CREATE TABLE bom (
    id SERIAL PRIMARY KEY,
    configuration_id UUID REFERENCES configurations(id) ON DELETE CASCADE,
    product_id INT REFERENCES products(id),
    quantity INT DEFAULT 1,
    price NUMERIC,
    created_at TIMESTAMP DEFAULT NOW()
);
