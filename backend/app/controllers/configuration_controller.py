import logging
from fastapi import HTTPException
from uuid import UUID
from app.schemas.configuration_schema import ConfigurationUpdate, ConfigurationResponse
from app.services import configuration_service

logger = logging.getLogger(__name__)

async def update_configuration(quote_id: UUID, config: ConfigurationUpdate) -> ConfigurationResponse:
    try:
        success = await configuration_service.upsert_configuration(
            quote_id, config.step, config.config_data
        )
        
        if not success:
            raise HTTPException(status_code=500, detail="Failed to update configuration")
            
        return ConfigurationResponse(message="Configuration updated successfully")
    except Exception as e:
        logger.error(f"Error updating configuration for quote {quote_id}: {e}")
        raise HTTPException(status_code=500, detail=str(e))
