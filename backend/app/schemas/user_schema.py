
from pydantic import BaseModel, ConfigDict


class UserCreate(BaseModel):
    full_name: str
    email: str
    password: str
    phone: str = ""


class UserLogin(BaseModel):
    email: str
    password: str


class UserResponse(BaseModel):
    id: int
    full_name: str
    email: str
    phone: str = ""
    role: str = "Customer"

    model_config = ConfigDict(from_attributes=True)
