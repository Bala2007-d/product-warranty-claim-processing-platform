from sqlalchemy.orm import Session
from app.models.claim import Claim


def create_claim(
    db: Session,
    customer_name,
    product_name,
    serial_number,
    issue
):
    claim = Claim(
        customer_name=customer_name,
        product_name=product_name,
        serial_number=serial_number,
        issue=issue,
        status="Pending"
    )

    db.add(claim)
    db.commit()
    db.refresh(claim)

    return claim


def get_claims(db: Session):
    return db.query(Claim).all()


def update_claim_status(db: Session, claim_id: int, status: str):
    claim = db.query(Claim).filter(Claim.id == claim_id).first()

    if not claim:
        return None

    claim.status = status
    db.commit()
    db.refresh(claim)

    return claim


def delete_claim(db: Session, claim_id: int):
    claim = db.query(Claim).filter(Claim.id == claim_id).first()

    if not claim:
        return None

    db.delete(claim)
    db.commit()

    return claim