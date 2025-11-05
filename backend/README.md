# Career Coach AI - Backend API

A comprehensive REST API backend for the Career Coach AI application, built with Node.js, Express, TypeScript, and MongoDB.

## 🚀 Features

- **User Authentication**: JWT-based authentication with secure password hashing
- **User Management**: Complete user profile management with profile pictures
- **Job Management**: Save, apply, and track job applications
- **Career Recommendations**: AI-powered job recommendations based on user skills
- **Skill Tracking**: Add and manage user skills
- **RESTful API**: Well-structured REST endpoints with consistent response format

## 📋 Prerequisites

- Node.js (v18 or higher)
- MongoDB Atlas account or local MongoDB instance
- npm or yarn

## 🛠️ Installation

1. **Install dependencies:**
   ```bash
   cd backend
   npm install
   ```

2. **Set up environment variables:**
   Create a `.env` file in the `backend` directory:
   ```env
   PORT=5000
   NODE_ENV=development
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/career_coach
   FRONTEND_URL=http://localhost:3001
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   BCRYPT_ROUNDS=12
   ```

3. **Build the project:**
   ```bash
   npm run build
   ```

## 🏃 Running the Server

**Development mode (with auto-reload):**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

The server will start on `http://localhost:5000` (or the port specified in your `.env` file).

## 📚 API Endpoints

### Authentication (`/api/auth`)

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/verify` - Verify JWT token
- `GET /api/auth/me` - Get current user profile (protected)

### User Management (`/api/user`)

All user routes require authentication.

- `GET /api/user/me` - Get current user profile
- `PUT /api/user/profile` - Update user profile
- `POST /api/user/skills` - Add a skill
- `DELETE /api/user/skills` - Remove a skill
- `POST /api/user/save-job` - Save a job
- `DELETE /api/user/saved-job` - Remove saved job
- `POST /api/user/apply-job` - Apply to a job
- `GET /api/user/saved-jobs` - Get all saved jobs
- `GET /api/user/applied-jobs` - Get all applied jobs

### Career (`/api/career`)

- `GET /api/career/recommendations` - Get job recommendations (protected)
- `GET /api/career/jobs` - Get all jobs (with pagination and filters)
- `GET /api/career/jobs/:id` - Get job by ID
- `GET /api/career/trending-skills` - Get trending skills

## 📝 Response Format

All API responses follow a consistent format:

**Success Response:**
```json
{
  "success": true,
  "message": "Operation completed successfully.",
  "data": { ... }
}
```

**Error Response:**
```json
{
  "success": false,
  "message": "Error message describing what went wrong."
}
```

## 🔒 Authentication

Most endpoints require authentication. Include the JWT token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

The token is returned when registering or logging in, and expires after 7 days.

## 🗄️ Database Models

### User Model
- Email, password (hashed)
- First name, last name
- Title, bio, profile picture URL
- Skills array
- Career goals array
- Experience level (entry, mid, senior, executive)
- Location
- Saved jobs array
- Applied jobs array

### Job Model
- Title, company, location
- Salary (min, max, currency)
- Skills required
- Experience level
- Job type (full-time, part-time, contract, internship)
- Description, requirements, benefits
- Application URL
- Posted date
- Active status

## 🧪 Testing

Health check endpoint:
```bash
curl http://localhost:5000/api/health
```

## 📦 Project Structure

```
backend/
├── src/
│   ├── config/          # Configuration files
│   ├── controllers/     # Route controllers
│   ├── middleware/       # Custom middleware (auth, validation)
│   ├── models/          # Mongoose models
│   ├── routes/          # API routes
│   └── server.ts        # Express server setup
├── dist/                # Compiled JavaScript (after build)
├── .env                 # Environment variables (not in git)
├── env.example          # Example environment file
├── package.json
├── tsconfig.json
└── README.md
```

## 🔧 Development

- **TypeScript**: Full type safety
- **ESLint**: Code linting (if configured)
- **Nodemon**: Auto-reload during development
- **Mongoose**: MongoDB ODM

## 🚨 Error Handling

The API includes comprehensive error handling:
- Validation errors (400)
- Authentication errors (401)
- Not found errors (404)
- Server errors (500)

All errors return consistent error response format.

## 📄 License

ISC

## 👤 Author

Bibek Neupane

