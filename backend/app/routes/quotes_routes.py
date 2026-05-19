from fastapi import APIRouter
from uuid import UUID
from app.controllers import quotes_controller
from app.schemas.quotes_schema import QuoteCreate, QuoteUpdate, QuoteResponse

router = APIRouter()

@router.post("/", tags=["quotes"], response_model=QuoteResponse)
async def create_quote(quote: QuoteCreate):
    """Creates a new quote and saves the initial general information."""
    return await quotes_controller.create_new_quote(quote)

@router.put("/{quote_id}", tags=["quotes"], response_model=QuoteResponse)
async def update_quote(quote_id: UUID, quote: QuoteUpdate):
    """Updates an existing quote with new general information."""
    return await quotes_controller.update_existing_quote(quote_id, quote)
