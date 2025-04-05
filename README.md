# CENG495 -- Assignment 1  -- Yahya Alp Akçay
## 
**Deployed URL**: [https://ceng495hw1-azure.vercel.app/]

---

## Overview

This project is a minimal e-commerce application developed for CENG495. It features item browsing, rating, reviewing, user and admin functionalities, all backed by MongoDB Atlas and deployed to the Vercel PaaS platform.

---

## Tech Stack

- **Frontend**: Next.js (React)
- **Backend**: API routes with Next.js serverless functions
- **Database**: MongoDB Atlas (NoSQL)
- **Deployment**: Vercel
- **Authentication**: NextAuth.js
- **State Management**: React Hooks

---

## User Roles & Logins

### Admin
- **Username**: `admin`
- **Password**: `admin`

- **Username**: `user`
- **Password**: `user`

### Regular Users
- **Username**: `First User`  
- **Password**: `1`

- **Username**: `Second User`  
- **Password**: `2`

- **Username**: `Third User`  
- **Password**: `3`

---

## Features & Pages

### Home Page [https://ceng495hw1-azure.vercel.app/]
- Public browsing of items by category: Vinyls, Antique Furniture, GPS Sport Watches, Running Shoes.
- Filters available by category.
- Users can log in or register from this page. 
- They can access their profile page by clicking their username.
- Admins can access admin page by clicking the admin page button.

### Admin Panel [https://ceng495hw1-azure.vercel.app/admin]
Accessible only to admin users:
- Add/Remove Items (removes ratings/reviews accordingly)
- Add/Remove Users (updates associated data)

### Item Detail Page (Can be accesed by clicking the item names)
- View all item attributes
- Users can:
  - Submit and update 1–10 ratings
  - Write and update a review
- Average rating displayed
- Reviews are displayed

### Profile Page (Can be accesed by clicking on the username on the corner of the screen)
Accessible to logged-in users:
- Username and Admin status
- Average rating submitted
- All reviews written (with item names)
- All ratings given (with item names)

---

## Design Decisions

- **Why Next.js**: I wasn't familiar with any specific framework at the beginning, so I chose for Next.js because it's one of the easiest to learn and has an extensive documentation and community support. It also integrates seamlessly with Vercel and supports full-stack development using serverless API routes.

- **Collections Used**: The application uses four main collections:
  - `users`: Stores usernames, passwords, and user-specific rating/review records.
  - `items`: Represents products listed for sale, with all associated attributes like category-specific fields (e.g., battery life, age, size).
  - `ratings`: Separate collection for user-item ratings (1–10 scale), allowing overwrite on repeated ratings.
  - `reviews`: Separate collection for textual reviews, linked to both user and item.

- **Schema Design & Relationships**:
  - `Item` documents reference associated reviews via an array of `Review` ObjectIds. Ratings are stored as aggregate numbers within the item (`ratings` object) and recalculated when needed.
  - `Review` and `Rating` collections include both `userId` and `itemId` as references to allow querying from either direction.
  - `User` documents contain denormalized arrays of reviews and ratings (`itemId`-based), mainly for easier access and display on profile pages.

- **Reason for Separate Rating/Review Collections**:
  Although they could have been combined, separating them simplifies data validation, maintains clarity of purpose.

---

## Test Data

- **Users**: 3 test users + 2 admin
- **Items**: 8 items spanning all 4 required categories
- **Coverage**:
  - Every item has at least one rating and one review from every test user
  - Admin has full control to manipulate the data via UI

---

## Deployment & Access

The application is publicly available at:

🔗 [https://ceng495hw1-azure.vercel.app/]

---

## User Guide

1. **Browse** items on the home page.
2. **Log in** using the credentials above.
3. Navigate to any item to **rate and review**.
4. Visit your **profile** to see your contributions.
5. (If admin) Go to the **Admin Dashboard** to manage users and items.

---