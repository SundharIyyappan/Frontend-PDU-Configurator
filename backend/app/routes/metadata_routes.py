from fastapi import APIRouter
from app.controllers import metadata_controller
from app.schemas.metadata_schema import MetadataResponse

router = APIRouter()

@router.get("/", tags=["metadata"], response_model=MetadataResponse)
async def read_metadata():
    """
    Fetches all configuration metadata, including options (grouped by field) 
    and compatibility rules.
    """
    return await metadata_controller.get_metadata()
