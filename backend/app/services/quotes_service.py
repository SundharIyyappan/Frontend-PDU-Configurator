import asyncpg
import logging
from uuid import UUID
from app.db.database import get_db_pool

logger = logging.getLogger(__name__)

import json

async def create_quote(quote_data: dict) -> tuple:
    """Inserts a new quote with a sequential quote_number and its step 1 configuration securely utilizing a database transaction."""
    pool = await get_db_pool()
    
    quote_query = """
        INSERT INTO quotes (
            quote_number, customer_name, email, country, postal_code, product_region, quantity
        ) VALUES (
            'Q-' || LPAD(nextval('quote_number_seq')::text, 5, '0'),
            $1, $2, $3, $4, $5, $6
        ) RETURNING id, quote_number;
    """
    
    config_query = """
        INSERT INTO configurations (
            quote_id, step, config_data, validation_status
        ) VALUES (
            $1, $2, $3, $4
        );
    """
    
    async with pool.acquire() as conn:
        # Use an atomic transaction block (Commit on success, Rollback on exception)
        async with conn.transaction():
            row = await conn.fetchrow(
                quote_query, 
                quote_data["customer_name"],
                quote_data["email"],
                quote_data["country"],
                quote_data["postal_code"],
                quote_data["product_region"],
                quote_data["quantity"]
            )
            
            quote_id = row['id']
            quote_number = row['quote_number']

            # Restructure Python dict exactly to the Frontend's Redux state format
            # Now includes the human-readable quote_number at the root
            config_dict = {
                "quote_number": quote_number,
                "GeneralQuoteInfo": {
                    "name": quote_data.get("customer_name", ""),
                    "email": quote_data.get("email", ""),
                    "country": quote_data.get("country", ""),
                    "postalCode": quote_data.get("postal_code", ""),
                    "productRegion": quote_data.get("product_region", ""),
                    "quantity": str(quote_data.get("quantity", ""))
                }
            }
            
            await conn.execute(
                config_query,
                quote_id,      # Linked key generated from the line above
                1,             # step = 1
                json.dumps(config_dict),
                "PENDING"      # validation_status
            )
            
            return quote_id, quote_number

async def update_quote(quote_id: UUID, quote_data: dict) -> UUID:
    """Updates an existing quote and its configuration in a single transaction."""
    pool = await get_db_pool()
    
    quote_query = """
        UPDATE quotes 
        SET 
            customer_name = $1, 
            email = $2, 
            country = $3, 
            postal_code = $4, 
            product_region = $5, 
            quantity = $6,
            updated_at = NOW()
        WHERE id = $7
        RETURNING id, quote_number;
    """

    config_query = """
        UPDATE configurations 
        SET config_data = config_data || $1, updated_at = NOW()
        WHERE quote_id = $2;
    """

    async with pool.acquire() as conn:
        async with conn.transaction():
            row = await conn.fetchrow(
                quote_query,
                quote_data["customer_name"],
                quote_data["email"],
                quote_data["country"],
                quote_data["postal_code"],
                quote_data["product_region"],
                quote_data["quantity"],
                quote_id
            )

            if not row:
                return None, None

            updated_id = row['id']
            quote_number = row['quote_number']

            # Ensure Step 1 data is consistent with the initial configuration row
            # Including quote_number in the merge to ensure it's always present
            config_dict = {
                "quote_number": quote_number,
                "GeneralQuoteInfo": {
                    "name": quote_data.get("customer_name", ""),
                    "email": quote_data.get("email", ""),
                    "country": quote_data.get("country", ""),
                    "postalCode": quote_data.get("postal_code", ""),
                    "productRegion": quote_data.get("product_region", ""),
                    "quantity": str(quote_data.get("quantity", ""))
                }
            }

            # Sync with configurations table
            await conn.execute(config_query, json.dumps(config_dict), quote_id)
            
            return updated_id, quote_number
