from pydantic import BaseModel


class ClaimCreate(BaseModel):
    customer_name: str
    product_name: str
    serial_number: str
    issue: str


class ClaimResponse(BaseModel):
    id: int
    customer_name: str
    product_name: str
    serial_number: str
    issue: str
    status: str

    class Config:
        from_attributes = True
class ClaimStatusUpdate(BaseModel):
    status: str             