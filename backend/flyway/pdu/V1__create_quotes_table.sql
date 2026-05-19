CREATE TABLE quotes (
   id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
   quote_number TEXT UNIQUE,

    -- Contact Info (Step 1)
   customer_name TEXT NOT NULL,
   email TEXT NOT NULL,
   country TEXT NOT NULL,
   postal_code TEXT NOT NULL,
   product_region TEXT NOT NULL,
   quantity INT NOT NULL CHECK (quantity > 0),
 
   -- System Fields
   status TEXT DEFAULT 'DRAFT',
   created_at TIMESTAMP DEFAULT NOW(),
   updated_at TIMESTAMP DEFAULT NOW()
);