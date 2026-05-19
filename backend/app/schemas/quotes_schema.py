from pydantic import BaseModel, EmailStr
from typing import Optional
from uuid import UUID

class QuoteBase(BaseModel):
    customer_name: str
    email: EmailStr
    country: str
    postal_code: str
    product_region: str
    quantity: int

class QuoteCreate(QuoteBase):
    pass

class QuoteUpdate(QuoteBase):
    pass

class QuoteResponse(BaseModel):
    quote_id: UUID
    quote_number: str
    message: str
