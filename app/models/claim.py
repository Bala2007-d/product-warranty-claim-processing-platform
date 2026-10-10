
from sqlalchemy import Column, Integer, String, ForeignKey
from app.database.base import Base


class Claim(Base):
    __tablename__ = "warranty_claims"

    id = Column(Integer, primary_key=True, index=True)
    customer_name = Column(String(100), nullable=False)
    product_name = Column(String(100), nullable=False)
    serial_number = Column(String(100), nullable=False)
    issue = Column(String(255), nullable=False)
    status = Column(String(50), default="Pending", nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
