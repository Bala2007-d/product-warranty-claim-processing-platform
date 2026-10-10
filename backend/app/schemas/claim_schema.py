
from pydantic import BaseModel, ConfigDict


class ClaimCreate(BaseModel):
    customer_name: str
    product_name: str
    serial_number: str
    issue: str


class ClaimStatusUpdate(BaseModel):
    status: str


class ClaimResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    customer_name: str
    product_name: str
    serial_number: str
    issue: str
    status: str
    user_id: int | None = None
