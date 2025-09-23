from fastapi import FastAPI , Depends, HTTPException,status
from sqlalchemy.ext.asyncio import AsyncSession
from .routes import routes
from . import database, models, schemas, crud, auth
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173",
                   "http://127.0.0.1:5173" ], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(routes.app)
@app.on_event("startup")
async def startup():
        async with database.engine.begin() as conn:
                await conn.run_sync(models.Base.metadata.create_all)
