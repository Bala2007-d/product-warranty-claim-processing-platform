from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.user_api import router as user_router
from app.api.product_api import router as product_router
from app.api.claim_api import router as claim_router

app = FastAPI()

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5174",
        "http://127.0.0.1:5174",
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routers
app.include_router(user_router)
app.include_router(product_router)
app.include_router(claim_router)


@app.get("/")
def root():
    return {
        "message": "Welcome to Product Warranty Claim Processing Platform"
    }