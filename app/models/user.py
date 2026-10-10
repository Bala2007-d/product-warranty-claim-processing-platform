```python
from sqlalchemy import Column, Integer, String, Enum, TIMESTAMP
from sqlalchemy.sql import func
from app.database.base import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String(100), nullable=False)
    email = Column(String(100), unique=True, nullable=False, index=True)
    password = Column(String(255), nullable=False)
    phone = Column(String(15), nullable=True)

    role = Column(
        Enum("Admin", "Customer"),
        nullable=False,
        default="Customer",
        server_default="Customer"
    )

    created_at = Column(
        TIMESTAMP,
        server_default=func.now()
    )