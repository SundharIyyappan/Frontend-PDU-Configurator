from pydantic import BaseModel
from typing import List, Dict, Any, Optional

class OptionSchema(BaseModel):
    value: str
    label: str
    metadata: Optional[Dict[str, Any]] = None

class RuleSchema(BaseModel):
    screen_name: str
    field_name: str
    depends_on: Optional[str] = None
    rules: Dict[str, Any]

class MetadataResponse(BaseModel):
    options: Dict[str, List[OptionSchema]]
    rules: List[RuleSchema]
