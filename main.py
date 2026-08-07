from fastapi import FastAPI

from app.api.user_api import router as user_router
from app.api.product_api import router as product_router
from app.api.claim_api import router as claim_router

app = FastAPI(
    title="Product Warranty Claim Processing Platform"
)

app.include_router(user_router)
app.include_router(product_router)
app.include_router(claim_router)


@app.get("/")
def home():
    return {
        "message": "Welcome to Product Warranty Claim Processing Platform"
    }