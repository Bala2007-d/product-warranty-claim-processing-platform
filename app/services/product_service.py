from sqlalchemy.orm import Session
from app.models.product import Product


def create_product(db: Session, product):
    new_product = Product(
        product_name=product.product_name,
        brand=product.brand,
        model=product.model,
        serial_number=product.serial_number,
        purchase_date=product.purchase_date,
        warranty_period=product.warranty_period,
        customer_email=product.customer_email
    )

    db.add(new_product)
    db.commit()
    db.refresh(new_product)

    return new_product


def get_products(db: Session):
    return db.query(Product).all()
