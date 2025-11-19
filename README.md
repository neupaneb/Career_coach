# AI Career Coach

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Running the Project](#-running-the-project)
- [API Documentation](#-api-documentation)
- [Project Structure](#-project-structure)
- [Key Features Explained](#-key-features-explained)
- [Database Seeding](#-database-seeding)
- [Troubleshooting](#-troubleshooting)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🎯 Overview

AI Career Coach is a full-stack web application that leverages Google's Gemini AI to revolutionize career development. The platform provides:

- **AI-Powered Resume Parsing**: Automatically extract skills, experience, projects, and education from PDF resumes
- **Intelligent Job Matching**: Multi-factor algorithm matching jobs based on skills, experience, projects, education, and career goals
- **Personalized Career Advice**: AI-generated career recommendations, learning paths, and skill development suggestions
- **Comprehensive Dashboard**: Track skills, view job recommendations, manage saved jobs, and monitor career progress

### Problem Statement

The job market is constantly evolving, and individuals often struggle to find personalized and timely career guidance. Traditional advising methods are generic, leaving users without meaningful direction. This platform solves these challenges by providing:

- Real-time, personalized career recommendations
- Automated profile building from resumes
- Data-driven insights for career development
- Accessible career coaching available 24/7

---

## ✨ Features

### Core Features

- 🔐 **Secure Authentication**: JWT-based authentication with password hashing
- 👤 **User Profile Management**: Comprehensive profile with skills, experience, projects, education, and career goals
- 📄 **Resume Upload & Parsing**: AI-powered extraction of information from PDF resumes
- 💼 **Job Recommendations**: Intelligent job matching with match percentage scores
- 📊 **Skill Tracking**: Visual analytics and progress tracking for skill development
- 💾 **Saved Jobs**: Save and manage job opportunities
- 📈 **Trending Skills**: View in-demand skills based on current job market
- 🎯 **Career Goals**: Set and track career objectives

### AI-Powered Features

- 🤖 **AI Career Advisor**: Generate personalized career advice using Google Gemini AI
- 📝 **AI Resume Parser**: Automatically extract structured data from PDF resumes
- 🎯 **Intelligent Job Matching**: Multi-factor algorithm considering:
  - Skills matching (60% weight)
  - Experience level (20% weight)
  - Project keywords (10% weight)
  - Education matching (5% weight)
  - Career goals (5% weight)
- 📚 **Learning Paths**: AI-generated learning paths with resources and timelines

### User Experience

- 📱 **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- 🎨 **Modern UI**: Built with Tailwind CSS and shadcn/ui components
- ⚡ **Fast Performance**: Optimized with Vite and efficient state management
- 🔄 **Real-time Updates**: Instant feedback and state synchronization
- 🛡️ **Error Handling**: Comprehensive error handling with user-friendly messages

---

## 🛠️ Tech Stack

### Frontend

- **React 18** - UI library
- **TypeScript** - Type-safe development
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - Accessible component library
- **React Context API** - State management
- **Recharts** - Data visualization
- **Axios/Fetch** - HTTP client

### Backend

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **TypeScript** - Type-safe backend
- **MongoDB** - NoSQL database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **multer** - File upload handling
- **pdf-parse** - PDF text extraction

### AI Integration

- **Google Gemini AI** (`@google/generative-ai`)
  - Gemini 2.0 Flash
  - Gemini 1.5 Flash (fallback)
  - Structured prompt engineering

### Development Tools

- **nodemon** - Auto-reload for development
- **ts-node** - TypeScript execution
- **ESLint** - Code linting (if configured)

---

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **npm** or **yarn** - Package manager
- **MongoDB Atlas account** or **local MongoDB instance** - [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- **Google Gemini API Key** - [Get API Key](https://makersuite.google.com/app/apikey)

---

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/neupaneb/Career_coach.git
cd Career_coach
```

### 2. Install Backend Dependencies

```bash
cd backend
npm install
```

### 3. Install Frontend Dependencies

```bash
cd ../src  # Frontend code is in the src directory
npm install
```

Or if you have a separate frontend directory:

```bash
cd ../frontend
npm install
```

---

## ⚙️ Configuration

### Backend Configuration

1. Create a `.env` file in the `backend` directory:

```env
# Server Configuration
PORT=5001
NODE_ENV=development

# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/career_coach?retryWrites=true&w=majority

# Authentication
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production_make_it_long_and_random
BCRYPT_ROUNDS=12

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:3001

# AI Configuration
GEMINI_API_KEY=your_google_gemini_api_key_here
```

2. Replace the placeholder values:
   - `MONGODB_URI`: Your MongoDB Atlas connection string or local MongoDB URI
   - `JWT_SECRET`: A long, random string for JWT token signing
   - `GEMINI_API_KEY`: Your Google Gemini API key

### Frontend Configuration

1. Create a `.env` file in the root directory (or frontend directory):

```env
VITE_REACT_APP_API_URL=http://localhost:5001/api
```

---

## 🏃 Running the Project

### Development Mode

#### 1. Start the Backend Server

```bash
cd backend
npm run dev
```

The backend server will start on `http://localhost:5001`

#### 2. Start the Frontend Development Server

```bash
# From root directory
npm run dev

# Or if using Vite directly
cd src
npm run dev
```

The frontend will start on `http://localhost:3001` (or the port specified in your Vite config)
