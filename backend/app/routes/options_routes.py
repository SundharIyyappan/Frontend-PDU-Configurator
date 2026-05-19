from fastapi import APIRouter
from app.controllers import options_controller

router = APIRouter()

@router.get("/", tags=["options"])
async def read_options():
    return options_controller.get_options()
