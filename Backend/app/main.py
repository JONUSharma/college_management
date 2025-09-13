from fastapi import FastAPI , Depends, HTTPException,status
from sqlalchemy.ext.asyncio import AsyncSession
from . import database, models, schemas, crud, auth
from fastapi.middleware.cors import CORSMiddleware
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def startup():
        async with database.engine.begin() as conn:
                await conn.run_sync(models.Base.metadata.create_all)

@app.post("/register", response_model=schemas.UserOut)
async def register(user: schemas.UserCreate, db:AsyncSession = Depends(database.get_db)):
        existing = await crud.get_user_by_username(db,user.username)
        if existing:
                raise HTTPException(status_code=400, detail="user already exist")
        new_user = await crud.create_user(db,user.username, user.email,user.password)
        return new_user

@app.post("/login", response_model=schemas.Token)
async def login(form_data : schemas.UserLogin, db:AsyncSession = Depends(database.get_db)):
        user = await crud.get_user_by_username(db,form_data.username)
        if not user or not auth.verify_password(form_data.password, user.hashed_password):
                raise HTTPException(status_code= status.HTTP_401_UNAUTHORIZED, detail= "Invalid credentials")
        
        token = auth.create_access_token({"sub": user.username})
        return {"access_token": token, "token_type" : "bearer" }