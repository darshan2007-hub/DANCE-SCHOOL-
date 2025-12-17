# Dance School Backend API

Complete backend API for the Dance School application with user authentication, class management, and admin panel.

## Features

- User authentication (signup/login)
- Admin authentication and dashboard
- Dance class management
- Contact form queries
- User enrollment in classes
- Protected routes with JWT

## Setup Instructions

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Environment Setup**
   - Update `.env` file with your MongoDB URI and JWT secret
   - Current settings are already configured

3. **Initialize Database**
   ```bash
   npm run init-db
   ```
   This creates:
   - Default admin (username: `admin`, password: `admin123`)
   - Sample dance classes

4. **Start Development Server**
   ```bash
   npm run dev
   ```

5. **Start Both Frontend and Backend**
   ```bash
   npm run dev-full
   ```

## API Endpoints

### Authentication Routes (`/api/auth`)
- `POST /signup` - User registration
- `POST /login` - User login
- `GET /profile` - Get user profile (protected)

### Admin Routes (`/api/admin`)
- `POST /login` - Admin login
- `GET /dashboard` - Admin dashboard stats (protected)
- `GET /users` - Get all users (protected)
- `DELETE /users/:id` - Delete user (protected)

### Class Routes (`/api/classes`)
- `GET /` - Get all classes
- `GET /:id` - Get class by ID
- `POST /` - Create class (admin only)
- `PUT /:id` - Update class (admin only)
- `DELETE /:id` - Delete class (admin only)
- `POST /:classId/enroll` - Enroll in class (user only)

### Query Routes (`/api/queries`)
- `POST /` - Submit contact form
- `GET /` - Get all queries (admin only)
- `GET /:id` - Get query by ID (admin only)
- `PUT /:id/respond` - Respond to query (admin only)
- `DELETE /:id` - Delete query (admin only)

## Default Admin Credentials
- Username: `admin`
- Password: `admin123`

## Database Models

- **User**: User accounts with enrollment tracking
- **Admin**: Admin accounts with role-based access
- **Class**: Dance classes with scheduling and capacity
- **Query**: Contact form submissions with response tracking

## Production Deployment

1. **Build Frontend**
   ```bash
   npm run build
   ```

2. **Start Production Server**
   ```bash
   npm start
   ```

The server will serve the React frontend from the `/dance/dist` directory in production mode.