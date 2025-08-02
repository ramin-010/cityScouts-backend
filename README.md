# CityScouts Backend API

# 🏙 CityScouts Backend API

[![Node.js](https://img.shields.io/badge/Node.js-%3E%3D18.x-green)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-5.1.x-lightgrey)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-6.x-green)](https://www.mongodb.com/)
[![Mongoose](https://img.shields.io/badge/Mongoose-8.16.x-red)](https://mongoosejs.com/)
[![Cloudinary](https://img.shields.io/badge/Cloudinary-2.7.x-blue)](https://cloudinary.com/)
[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](LICENSE)

A robust backend REST API for the CityScouts application, built with Node.js, Express, and MongoDB. This server powers the CityScouts platform in Chandigarh, offering endpoints for managing attractions, dining spots, events, user profiles, and more.

## 🌟 Table of Contents
- [Features](#-features)
- [Project Structure](#-project-structure)
- [Technologies](#-technologies)
- [Environment Setup](#%EF%B8%8F-environment-variables)
- [Getting Started](#-getting-started)
- [API Documentation](#-api-documentation)
- [Deployment](#-deployment)
- [Contributing](#-contributing)
- [License](#-license)

## 🚀 Features

### Core Functionality
- **RESTful API**: Proper HTTP methods, status codes, and structured JSON responses
- **Authentication & Authorization**: JWT-based flows (register, login, logout, password reset)
- **Role-Based Access Control**: Distinct roles (Admin, Contributor, User) with granular permissions
- **File Uploads**: Secure image handling via Cloudinary with `multer` and `streamifier`
- **Data Validation**: Comprehensive request validation using Express Validator
- **Error Handling**: Centralized error responses with consistent formatting
- **Security Hardening**:
  - `helmet` for secure HTTP headers
  - `xss-clean` for XSS prevention
  - `express-mongo-sanitize` against NoSQL injection
  - `hpp` to prevent HTTP Parameter Pollution
  - Rate limiting (coming soon)
- **Search & Filtering**: Advanced search across all resources with filtering options

### Developer Experience
- **API Documentation**: Comprehensive API documentation with examples
- **Development Scripts**: Utility scripts for database management
- **Environment Configuration**: Easy configuration through environment variables
- **Logging**: Request logging with `morgan`
- **CORS**: Configurable cross-origin resource sharing

## 📦 Project Structure

```
server/
├── config/            # Configuration files (DB, environment)
├── controllers/       # Route handler functions
├── middleware/        # Custom middleware (auth, validation, etc.)
│   ├── auth.js        # Authentication middleware
│   ├── errorHandler.js # Error handling middleware
│   ├── multer.js      # File upload configuration
│   └── validate.js    # Request validation
├── models/            # Mongoose schemas and models
│   ├── Attraction.js  # Attraction model
│   ├── Dining.js      # Dining model
│   ├── Event.js       # Event model
│   ├── Review.js      # Review model
│   └── User.js        # User model
├── routes/            # Express route definitions
│   ├── attraction.routes.js
│   ├── auth.routes.js
│   ├── dining.routes.js
│   ├── events.routes.js
│   ├── search.routes.js
│   └── user.routes.js
├── utils/             # Utility functions
│   ├── cloudinary.js  # Cloudinary configuration
│   ├── crudFactory.js # CRUD operations factory
│   ├── errorResponse.js # Error response formatter
│   └── uploadImage.js # Image upload utilities
├── validations/       # Request validation schemas
├── scripts/           # Database scripts
├── app.js             # Express application setup
└── index.js           # Server entry point
```

## 🔧 Technologies

### Core
- **Runtime**: Node.js (v18+)
- **Framework**: Express.js (v5.1.x)
- **Database**: MongoDB (v6.x) with Mongoose (v8.16.x)
- **Authentication**: `jsonwebtoken` (v9.x)
- **File Storage**: `cloudinary` (v2.7.x)
- **Validation**: `express-validator` (v7.x)

### Utilities
- **Email Validation**: `neverbounce` (v5.x, optional)
- **Data Processing**: `slugify`, `streamifier`
- **HTTP Client**: `axios`
- **Logging**: `morgan`
- **Environment**: `dotenv`

## ⚙️ Environment Variables

Create a `.env` file in the project root with the following variables:

```env
# Server Configuration
NODE_ENV=development
PORT=5000

# MongoDB
MONGODB_URI=mongodb://localhost:27017/cityscouts

# JWT
JWT_SECRET=your_jwt_secret_here
JWT_EXPIRE=30d
JWT_COOKIE_EXPIRE=30

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Optional: NeverBounce for email validation
NEVERBOUNCE_API_KEY=your_neverbounce_key

# Frontend URL for CORS
FRONTEND_URL=http://localhost:3000
```

## 🏁 Getting Started

### Prerequisites
- Node.js 18 or higher
- MongoDB 6.0 or higher
- Cloudinary account (for image uploads)

### Steps
1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/cityscouts-backend.git
   cd cityscouts-backend/server
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```
   The API will be available at `http://localhost:5000`

5. Run in production:
   ```bash
   npm start
   ```

## 📖 API Documentation

For detailed API documentation, refer to the [API Documentation](https://documenter.getpostman.com/view/your-doc-link) or import the Postman collection from `/postman`.

### Authentication
Most routes require authentication. Include the JWT token in the Authorization header:
```bash
Authorization: Bearer <your_token>
```
<!-- 
### Rate Limiting
- 100 requests per 15 minutes per IP for public endpoints
- 1000 requests per hour per IP for authenticated users -->

## 🛡 Security

- **Helmet** for setting various HTTP headers for security
- **xss-clean** to prevent XSS attacks
- **hpp** to prevent HTTP Parameter Pollution attacks
- **express-mongo-sanitize** to prevent NoSQL injection
- **cors** to enable secure cross-origin requests


## 🚀 Deployment

### Production Deployment
1. Set `NODE_ENV=production` in your environment variables
2. Ensure all production environment variables are set
3. Use PM2 for process management:
   ```bash
   npm install -g pm2
   pm2 start index.js --name cityscouts-api
   ```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

