import logging
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from sqlalchemy import text
import database
from routers import (
    profile_router,
    menu_router,
    wallet_router,
    payments_router,
    cart_router,
    orders_router,
    support_router,
    vendor_business_router,
    legacy_vendor_router,
)
from database import init_db
from config import settings

logging.basicConfig(level=logging.INFO, format="%(levelname)s: %(message)s")
log = logging.getLogger(__name__)

@asynccontextmanager
async def lifespan(app: FastAPI):
    log.info("Starting Fast Bites API")
    init_db()
    yield
    log.info("Shutting down")

app = FastAPI(title="Fast Bites API", lifespan=lifespan)

# CORS - allow configured origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(profile_router)
app.include_router(menu_router)
app.include_router(wallet_router)
app.include_router(payments_router)
app.include_router(cart_router)
app.include_router(orders_router)
app.include_router(support_router)
app.include_router(vendor_business_router)
app.include_router(legacy_vendor_router)

@app.get("/")
async def root():
    return {"message": "Fast Bites API"}

@app.get("/health")
async def health():
    session_factory = database.AsyncSessionLocal
    if session_factory is None:
        log.error("Health check failed: database is not initialized")
        raise HTTPException(status_code=503, detail="Database unavailable")

    try:
        async with session_factory() as session:
            await session.execute(text("SELECT 1"))
    except Exception:
        log.exception("Health check failed: database query failed")
        raise HTTPException(status_code=503, detail="Database unavailable")

    return {"status": "ok", "database": "ok"}

