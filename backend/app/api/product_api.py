from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.database import SessionLocal
from app.schemas.product_schema import ProductCreate
from app.services.product_service import create_product, get_products

router = APIRouter()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.post("/products")
def add_product(product: ProductCreate, db: Session = Depends(get_db)):
    return create_product(db, product)


@router.get("/products")
def view_products(db: Session = Depends(get_db)):
    return get_products(db)