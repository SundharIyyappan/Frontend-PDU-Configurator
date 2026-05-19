import os
import asyncpg
from dotenv import load_dotenv

load_dotenv()

_pool = None

async def init_db_pool():
    global _pool
    if _pool is None:
        _pool = await asyncpg.create_pool(dsn=os.getenv("DB_URL"))
    return _pool

async def get_db_pool():
    if _pool is None:
        return await init_db_pool()
    return _pool

async def close_db_pool():
    global _pool
    if _pool:
        await _pool.close()
        _pool = None
