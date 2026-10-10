
from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from jose import jwt, JWTError
import os

from app.database.database import SessionLocal
from app.models.user import User
from app.models.claim import Claim
from app.schemas.claim_schema import ClaimCreate, ClaimStatusUpdate

router = APIRouter()
security = HTTPBearer()

SECRET_KEY = os.getenv("SECRET_KEY", "change-this-secret-key")
ALGORITHM = "HS256"


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
):
    try:
        payload = jwt.decode(
            credentials.credentials,
            SECRET_KEY,
            algorithms=[ALGORITHM]
        )
        user_id = int(payload.get("sub"))
    except (JWTError, ValueError, TypeError):
        raise HTTPException(status_code=401, detail="Invalid token")

    user = db.query(User).filter(User.id == user_id).first()

    if not user:
        raise HTTPException(status_code=401, detail="User not found")

    return user


@router.post("/claims")
def add_claim(
    data: ClaimCreate,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user)
):
    claim = Claim(
        customer_name=user.full_name,
        product_name=data.product_name,
        serial_number=data.serial_number,
        issue=data.issue,
        status="Pending",
        user_id=user.id
    )

    db.add(claim)
    db.commit()
    db.refresh(claim)
    return claim


@router.get("/claims")
def view_claims(
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user)
):
    query = db.query(Claim)

    if user.role != "Admin":
        query = query.filter(Claim.user_id == user.id)

    return query.order_by(Claim.id.desc()).all()


@router.put("/claims/{claim_id}")
def update_claim(
    claim_id: int,
    data: ClaimStatusUpdate,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user)
):
    if user.role != "Admin":
        raise HTTPException(
            status_code=403,
            detail="Only Admin can approve or reject claims"
        )

    if data.status not in ["Pending", "Approved", "Rejected"]:
        raise HTTPException(status_code=400, detail="Invalid status")

    claim = db.query(Claim).filter(Claim.id == claim_id).first()

    if not claim:
        raise HTTPException(status_code=404, detail="Claim not found")

    claim.status = data.status
    db.commit()
    db.refresh(claim)
    return claim


@router.delete("/claims/{claim_id}")
def remove_claim(
    claim_id: int,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user)
):
    claim = db.query(Claim).filter(Claim.id == claim_id).first()

    if not claim:
        raise HTTPException(status_code=404, detail="Claim not found")

    if user.role != "Admin" and claim.user_id != user.id:
        raise HTTPException(status_code=403, detail="Access denied")

    db.delete(claim)
    db.commit()
    return {"message": "Claim deleted successfully"}
