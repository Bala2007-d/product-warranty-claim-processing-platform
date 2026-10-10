
from sqlalchemy import Column, Integer, String, Date, DateTime
from sqlalchemy.sql import func
from app.database.base import Base


class Product(Base):
    __tablename__ = "products"

    product_id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    product_name = Column(String(100), nullable=False)
    brand = Column(String(100), nullable=False)
    model = Column(String(100), nullable=True)
    serial_number = Column(String(100), unique=True, nullable=True)
    purchase_date = Column(Date, nullable=True)
    warranty_period = Column(Integer, nullable=False, default=12)
    customer_email = Column(String(255), nullable=True)
    warranty_end_date = Column(Date, nullable=True)
    created_at = Column(DateTime, server_default=func.current_timestamp())
