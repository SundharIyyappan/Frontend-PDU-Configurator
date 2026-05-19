from fastapi import APIRouter
from uuid import UUID
from app.schemas.configuration_schema import ConfigurationUpdate, ConfigurationResponse
from app.controllers import configuration_controller

router = APIRouter()

@router.put("/{quote_id}", response_model=ConfigurationResponse)
async def update_configuration(quote_id: UUID, config: ConfigurationUpdate):
    return await configuration_controller.update_configuration(quote_id, config)
