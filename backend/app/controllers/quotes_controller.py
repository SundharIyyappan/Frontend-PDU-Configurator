import logging
from fastapi import HTTPException
from uuid import UUID
from app.schemas.quotes_schema import QuoteCreate, QuoteUpdate, QuoteResponse
from app.services import quotes_service

logger = logging.getLogger(__name__)

async def create_new_quote(quote: QuoteCreate) -> QuoteResponse:
    try:
        quote_id, quote_number = await quotes_service.create_quote(quote.dict())
        if not quote_id:
             raise HTTPException(status_code=500, detail="Failed to generate quote")
        
        return QuoteResponse(
            quote_id=quote_id,
            quote_number=quote_number,
            message="Quote and configuration created successfully"
        )
    except Exception as e:
        logger.error(f"Error creating quote: {e}")
        raise HTTPException(status_code=500, detail=str(e))

async def update_existing_quote(quote_id: UUID, quote: QuoteUpdate) -> QuoteResponse:
    try:
        updated_id, quote_number = await quotes_service.update_quote(quote_id, quote.dict())
        if not updated_id:
             raise HTTPException(status_code=404, detail="Quote not found or update failed")
             
        return QuoteResponse(
            quote_id=updated_id,
            quote_number=quote_number,
            message="Quote updated successfully"
        )
    except HTTPException as e:
         raise e
    except Exception as e:
        logger.error(f"Error updating quote {quote_id}: {e}")
        raise HTTPException(status_code=500, detail=str(e))
