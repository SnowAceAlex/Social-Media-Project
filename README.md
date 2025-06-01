# Instameow

A modern social media platform that combines the best features of Instagram and Facebook, allowing users to share moments, connect with friends, and engage with content in meaningful ways.

## 📝 Project Description

Instameow is a full-stack social media application that provides users with a familiar yet unique social networking experience. The platform combines Instagram's visual-first approach with Facebook's robust sharing capabilities, creating a versatile social media experience.

### Key Features:

- 📸 Photo and video sharing with filters and editing capabilities
- 👥 User profiles and customizable feeds
- 💬 Real-time chat and messaging using Socket.IO
- 🔄 Post sharing functionality
- ❤️ Like, comment, and save posts
- 🔍 Advanced user and content search
- 🌐 Real-time notifications
- 🎨 Modern, responsive UI built with React and Tailwind CSS

### Technologies Used:

#### Frontend:

- React 19 with Vite for fast development and building
- Redux Toolkit for state management
- TailwindCSS for styling
- Framer Motion for animations
- Socket.IO client for real-time features
- React Router for navigation
- Axios for API requests

#### Backend:

- Node.js with Express
- PostgreSQL for primary database
- Redis for caching and session management
- Socket.IO for real-time communication
- Cloudinary for media storage
- JWT for authentication
- Docker for containerization

## 📋 Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Features](#features)
- [API Documentation](#api-documentation)
- [Contributing](#contributing)
- [License](#license)

## 🚀 Installation

### Prerequisites

- Node.js (v18 or higher)
- PostgreSQL
- Redis
- Docker (optional)

### Setup Steps

1. Clone the repository:

```bash
git clone https://github.com/yourusername/social-connect.git
cd social-connect
```

2. Install dependencies:

```bash
# Install root dependencies
npm install

# Install frontend dependencies
cd frontend
npm install

# Install backend dependencies
cd ../backend
npm install
```

3. Set up environment variables:

```bash
# Backend .env
cp backend/.env.example backend/.env

# Frontend .env
cp frontend/.env.example frontend/.env
```

4. Set up the database:

```bash
# Using the provided SQL file
psql -U your_username -d your_database -f backend/db-sql.sql
```

5. Start the development servers:

```bash
# Start Docker
docker-compose down
docker-compose up --build

# Start backend API server
cd backend
npm start

# Start frontend development server (in a new terminal)
cd frontend
npm run dev
```

## 💻 Usage

### User Registration and Login

1. Navigate to the application URL
2. Click "Sign Up" to create a new account
3. Fill in required information
4. Log in with your credentials

### Creating and Posting Posts

1. Click the "+" button in the navigation bar
2. Upload photos or videos
3. Add captions, and tags
4. Post to your feed

### Interacting with Content

- Double-tap or click the heart icon to like posts
- Comment on posts using the comment section
- Share posts using the share button
- Save posts to your collections

## 🌟 Features

### Current Features

- User authentication and authorization
- Post creation and management
- Real-time chat and notifications
- Content sharing and interaction
- User profile customization
- Search functionality
- Responsive design

### Upcoming Features

- Stories feature
- Live streaming
- Advanced content filters
- Group chat
- Business profiles
- Analytics dashboard

## 🔑 API Documentation

API documentation is available at `/api/docs` when running the development server.

## 👥 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

## 📄 License

This project is licensed under the [MIT License](LICENSE) - see the [LICENSE](LICENSE) file for details.

## 🙏 Credits

- UI/UX inspired by modern social media platforms
- Icons provided by React Icons
- Image hosting by Cloudinary
- Real-time features powered by Socket.IO
