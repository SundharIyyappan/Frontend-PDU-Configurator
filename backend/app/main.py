from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes.options_routes import router as options_router
from app.routes.metadata_routes import router as metadata_router
from app.routes.quotes_routes import router as quotes_router
from app.routes.configuration_routes import router as configuration_router
from app.db.database import init_db_pool, close_db_pool

app = FastAPI(title="Hyper PDU Configurator API")

# Configure CORS
origins = [
    "http://localhost:5173"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def startup_event():
    await init_db_pool()

@app.on_event("shutdown")
async def shutdown_event():
    await close_db_pool()

app.include_router(options_router, prefix="/options")
app.include_router(metadata_router, prefix="/metadata")
app.include_router(quotes_router, prefix="/quotes")
app.include_router(configuration_router, prefix="/configurations")

@app.get("/health", tags=["health"])
async def health_check():
    return {"status": "OK"}
