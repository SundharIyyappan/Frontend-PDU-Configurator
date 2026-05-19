import json
import logging
from uuid import UUID
from datetime import datetime
from app.db.database import get_db_pool

logger = logging.getLogger(__name__)

async def upsert_configuration(quote_id: UUID, step: int, config_data: dict) -> bool:
    """Updates an existing configuration by merging JSONB data or inserts a new one if none exists."""
    pool = await get_db_pool()
    
    # Target the existing configuration record for this quote regardless of its current step
    check_query = "SELECT id FROM configurations WHERE quote_id = $1;"
    
    # Use || operator to merge new fields into the existing config_data JSONB object
    update_query = """
        UPDATE configurations 
        SET config_data = config_data || $1::jsonb, 
            step = $2, 
            updated_at = $3 
        WHERE id = $4;
    """
    
    insert_query = """
        INSERT INTO configurations (quote_id, step, config_data, validation_status)
        VALUES ($1, $2, $3, $4);
    """
    
    config_json = json.dumps(config_data)

    async with pool.acquire() as conn:
        existing_id = await conn.fetchval(check_query, quote_id)
        
        if existing_id:
            logger.info(f"Merging configuration for quote_id {quote_id}, moving to step {step}")
            await conn.execute(update_query, config_json, step, datetime.now(), existing_id)
        else:
            logger.info(f"Inserting initial configuration for quote_id {quote_id} at step {step}")
            await conn.execute(insert_query, quote_id, step, config_json, "PENDING")
            
    return True
