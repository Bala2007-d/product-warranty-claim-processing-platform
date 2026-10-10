
import bcrypt
from sqlalchemy.orm import Session
from app.models.user import User


def create_user(db: Session, full_name, email, password, phone):
    email = email.strip().lower()

    existing_user = db.query(User).filter(User.email == email).first()
    if existing_user:
        raise ValueError("Email already registered")

    hashed_password = bcrypt.hashpw(
        password.encode("utf-8"),
        bcrypt.gensalt()
    ).decode("utf-8")

    user = User(
        full_name=full_name,
        email=email,
        password=hashed_password,
        phone=phone or "",
        role="Customer"
    )

    db.add(user)
    db.commit()
    db.refresh(user)
    return user


def login_user(db: Session, email, password):
    user = db.query(User).filter(
        User.email == email.strip().lower()
    ).first()

    if not user:
        return None

    try:
        valid = bcrypt.checkpw(
            password.encode("utf-8"),
            user.password.encode("utf-8")
        )
    except (ValueError, TypeError):
        return None

    return user if valid else None
