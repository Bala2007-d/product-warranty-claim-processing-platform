from sqlalchemy.orm import Session
from app.models.user import User


def create_user(db: Session, full_name, email, password, phone):
    user = User(
        full_name=full_name,
        email=email,
        password=password,
        phone=phone
    )

    db.add(user)
    db.commit()
    db.refresh(user)

    return user


def login_user(db: Session, email, password):
    user = db.query(User).filter(
        User.email == email,
        User.password == password
    ).first()

    return user