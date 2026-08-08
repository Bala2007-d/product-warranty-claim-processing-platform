# Problem Statement

## Project Title
Product Warranty Claim Processing Platform

## Domain
Warranty Management System

## Who Will Use This Project?

There are two types of users.

1. Customer
2. Admin

The customer can register, log in, view available products, and submit a warranty claim if there is any issue with the product.

The admin can add products, view all warranty claims, and update the claim status.

## Problem

Nowadays many customers find it difficult to claim a product warranty because warranty details are managed manually. Bills and warranty cards may get lost, and the claim process becomes slow. Companies also spend more time checking warranty records.

## Proposed Solution

This project provides an online warranty claim system. Customers can create an account, log in, view products, and submit warranty claims. The admin can manage products and approve or reject claims. This makes the warranty process simple, faster, and more organized.

## Database Tables

- Users
- Products
- Warranty Claims

## User Roles

### Customer
- Register
- Login
- View Products
- Submit Warranty Claim
- Check Claim Status

### Admin
- Add Products
- View Products
- View Claims
- Update Claim Status

## Success Criteria

- User registration should work successfully.
- User login should work correctly.
- Products can be added and viewed.
- Customers can submit warranty claims.
- Admin can update the claim status.

## Out of Scope

The following features are not included in this project:

- Online payment
- Email notification
- SMS notification
- Mobile application

## Technology Used

- Python
- FastAPI
- SQLAlchemy
- MySQL
- Swagger UI