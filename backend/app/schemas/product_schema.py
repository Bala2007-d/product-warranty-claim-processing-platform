
from pydantic import BaseModel, ConfigDict
from datetime import date
from typing import Optional


class ProductCreate(BaseModel):
    product_name: str
    brand: str
    model: Optional[str] = None
    serial_number: Optional[str] = None
    purchase_date: Optional[date] = None
    warranty_period: int = 12
    customer_email: Optional[str] = None


class ProductResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    product_id: int
    product_name: str
    brand: str
    model: Optional[str] = None
    serial_number: Optional[str] = None
    purchase_date: Optional[date] = None
    warranty_period: int
    warranty_end_date: Optional[date] = None
    customer_email: Optional[str] = None
