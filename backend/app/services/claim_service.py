
from sqlalchemy.orm import Session
from app.models.claim import Claim


def create_claim(db: Session, data, user):
    claim = Claim(
        customer_name=data.customer_name,
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


def get_claims(db: Session, user):
    query = db.query(Claim)

    if user.role != "Admin":
        query = query.filter(Claim.user_id == user.id)

    return query.order_by(Claim.id.desc()).all()


def update_claim_status(db: Session, claim_id: int, status: str):
    claim = db.query(Claim).filter(Claim.id == claim_id).first()

    if not claim:
        return None

    claim.status = status
    db.commit()
    db.refresh(claim)
    return claim


def delete_claim(db: Session, claim_id: int, user):
    claim = db.query(Claim).filter(Claim.id == claim_id).first()

    if not claim:
        return None

    if user.role != "Admin" and claim.user_id != user.id:
        return None

    db.delete(claim)
    db.commit()
    return claim
