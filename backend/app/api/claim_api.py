from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.database import SessionLocal
from app.schemas.claim_schema import ClaimCreate, ClaimStatusUpdate
from app.services.claim_service import (
    create_claim,
    get_claims,
    update_claim_status,
    delete_claim
)


router = APIRouter()


def get_db():
    db = SessionLocal()

    try:
        yield db
    finally:
        db.close()


@router.post("/claims")
def add_claim(
    claim: ClaimCreate,
    db: Session = Depends(get_db)
):
    return create_claim(
        db,
        claim.customer_name,
        claim.product_name,
        claim.serial_number,
        claim.issue
    )


@router.get("/claims")
def view_claims(db: Session = Depends(get_db)):
    return get_claims(db)


@router.put("/claims/{claim_id}")
def update_status(
    claim_id: int,
    data: ClaimStatusUpdate,
    db: Session = Depends(get_db)
):
    claim = update_claim_status(
        db,
        claim_id,
        data.status
    )

    if not claim:
        return {
            "message": "Claim not found"
        }

    return {
        "message": "Status Updated Successfully",
        "claim": claim
    }


@router.delete("/claims/{claim_id}")
def remove_claim(
    claim_id: int,
    db: Session = Depends(get_db)
):
    claim = delete_claim(db, claim_id)

    if not claim:
        return {
            "message": "Claim not found"
        }

    return {
        "message": "Claim Deleted Successfully",
        "claim_id": claim_id
    }