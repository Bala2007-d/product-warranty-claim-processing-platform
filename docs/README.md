# Product Warranty Claim Processing Platform

## Project Overview

The Product Warranty Claim Processing Platform is a simple web application developed using Python FastAPI and MySQL.

This project helps customers submit warranty claims online instead of using manual paperwork. It also allows the administrator to manage products and update the status of warranty claims.

The main objective of this project is to make the warranty claim process simple, faster, and easier to manage.

---

## Features

### Customer

- Register a new account
- Login using email and password
- View available products
- Submit a warranty claim
- View claim details

### Admin

- Add new products
- View all products
- View warranty claims
- Update claim status

---

## Technologies Used

- Python
- FastAPI
- SQLAlchemy
- MySQL
- Uvicorn
- Swagger UI

---

## Project Structure

backend/

- app/
  - api/
  - models/
  - schemas/
  - services/
- docs/
- main.py
- requirements.txt

---

## API Endpoints

### User

- POST /register
- POST /login

### Product

- GET /products
- POST /products

### Warranty Claim

- GET /claims
- POST /claims
- PUT /claims/{id}

---

## How to Run the Project

1. Open the project in VS Code.

2. Open Terminal.

3. Move to the backend folder.

```
cd backend
```

4. Start the FastAPI server.

```
uvicorn main:app --reload
```

5. Open your browser.

```
http://127.0.0.1:8000/docs
```

Swagger UI will open and all APIs can be tested.

---

## Database

Database Name

```
product_warranty_db
```

Main Tables

- users
- products
- warranty_claims

---

## Current Progress

- User Registration Completed
- User Login Completed
- Product Module Completed
- Warranty Claim Module Completed
- Claim Status Update Completed

---

## Future Improvements

- JWT Authentication
- Email Notification
- File Upload
- Product Warranty Validation
- Dashboard