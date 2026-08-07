from pydantic import BaseModel, EmailStr

class UserCreate(BaseModel):
    full_name: str
    email: EmailStr
    password: str
    phone: str

class UserResponse(BaseModel):
    id: int
    full_name: str
    email: str
    phone: str
    role: str

    class Config:
        from_attributes = True
class UserLogin(BaseModel):
    email: EmailStr
    password: str        