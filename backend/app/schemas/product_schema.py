from pydantic import BaseModel


class ProductCreate(BaseModel):
    product_name: str
    brand: str
    model: str
    serial_number: str
    purchase_date: str
    warranty_period: int
    customer_email: str


class ProductResponse(BaseModel):
    id: int
    product_name: str
    brand: str
    model: str
    serial_number: str
    purchase_date: str
    warranty_period: int
    customer_email: str

    class Config:
        from_attributes = True