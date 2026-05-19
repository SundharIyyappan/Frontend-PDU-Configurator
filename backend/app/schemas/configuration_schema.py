from pydantic import BaseModel
from typing import Dict, Any

class ConfigurationUpdate(BaseModel):
    step: int
    config_data: Dict[str, Any]

class ConfigurationResponse(BaseModel):
    message: str
