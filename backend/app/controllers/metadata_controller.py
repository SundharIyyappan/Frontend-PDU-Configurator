from app.services import metadata_service

async def get_metadata():
    try:
        return await metadata_service.get_all_metadata()
    except Exception as e:
        # In a real app, we'd log this and return a proper error response
        print(f"Error fetching metadata: {str(e)}")
        raise e
