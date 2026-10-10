from sqlalchemy import Column, Integer, String, ForeignKey
from app.database.base import Base


class Claim(Base):
    __tablename__ = "warranty_claims"

    id = Column(Integer, primary_key=True, index=True)
    customer_name = Column(String(100))
    product_name = Column(String(100))
    serial_number = Column(String(100))
    issue = Column(String(255))
    status = Column(String(50), default="Pending")

    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)