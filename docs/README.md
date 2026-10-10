# Product Warranty Claim Processing Platform

## Project Overview

The Product Warranty Claim Processing Platform is a web application developed using Python FastAPI, React, and MySQL.

It allows customers to register, log in, view products, and submit warranty claims online. Administrators can manage products, view claims, and update claim statuses.

The main objective is to simplify warranty claim processing and reduce manual paperwork.

## Features

### Customer
- Register and log in securely
- View products
- Submit warranty claims
- View personal claim details
- Track claim status

### Admin
- Add and view products
- View warranty claims
- Approve or reject claims
- Manage claim status

## Technologies Used

- **Frontend:** React, JavaScript, CSS
- **Backend:** Python, FastAPI
- **Database:** MySQL
- **ORM:** SQLAlchemy
- **Authentication:** JWT
- **Password Security:** bcrypt
- **Server:** Uvicorn
- **API Documentation:** Swagger UI
- **Testing:** pytest
- **CI:** GitHub Actions

## Project Structure

```text
ProductWarrantyClaimPlatform/
├── backend/
│   ├── app/
│   │   ├── api/
│   │   ├── models/
│   │   ├── schemas/
│   │   └── services/
│   ├── tests/
│   ├── main.py
│   └── requirements.txt
├── frontend/
├── docs/
│   └── diagrams/
├── .github/
│   └── workflows/
├── README.md
└── LICENSE
```

## Main API Endpoints

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/register` | Register a user |
| POST | `/login` | Authenticate a user |
| GET | `/products` | View products |
| POST | `/products` | Add a product |
| GET | `/claims` | View warranty claims |
| POST | `/claims` | Submit a claim |
| PUT | `/claims/{claim_id}` | Update claim status |
| DELETE | `/claims/{claim_id}` | Delete a claim |

Authenticated endpoints require a valid JWT token.

## Database

**Database name:** `product_warranty_db`

Main tables:
- `users`
- `products`
- `warranty_claims`
- `admins`
- `claim_status`

## How to Run the Project

### 1. Start the Backend

Open a terminal in the project root:

```bash
cd backend
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Start FastAPI:

```bash
uvicorn main:app --reload
```

Open Swagger UI:

http://127.0.0.1:8000/docs

### 2. Start the Frontend

Open a second terminal:

```bash
cd frontend
npm install
npm run dev
```

Open the local frontend URL shown in the terminal, usually:

http://localhost:5173

Ensure MySQL is running and the database connection settings are configured correctly before starting the backend.

## Testing

Run backend tests from the project root:

```bash
cd backend
python -m pytest -v
```

GitHub Actions is configured to run backend tests automatically when changes are pushed to the repository.

## Current Progress

- User registration and login implemented
- JWT authentication implemented
- Product module implemented
- Warranty claim submission and viewing implemented
- Admin claim status updates implemented
- MySQL integration implemented
- GitHub repository created
- GitHub Actions workflow configured
- Local backend test passed

## Future Improvements

- Email notifications for claim updates
- Claim attachment and image uploads
- Product warranty expiry validation
- Admin dashboard and analytics
- Deployment to a cloud platform
- Expand automated test coverage
