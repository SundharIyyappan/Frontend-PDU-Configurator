from pydantic import BaseModel

class OptionBase(BaseModel):
    name: str
    description: str | None = None

class OptionCreate(OptionBase):
    pass

class OptionResponse(OptionBase):
    id: int
