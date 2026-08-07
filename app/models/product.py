from sqlalchemy import Column, Integer, String, Float
from app.database.base import Base


class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)
    product_name = Column(String(100), nullable=False)
    brand = Column(String(100), nullable=False)
    model = Column(String(100), nullable=False)
    serial_number = Column(String(100), unique=True, nullable=False)
    purchase_date = Column(String(50), nullable=False)
    warranty_period = Column(Integer, nullable=False)
    customer_email = Column(String(100), nullable=False)