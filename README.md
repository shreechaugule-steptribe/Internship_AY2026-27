# ZCOER Internship Portal (MERN Stack)

This is a full-stack MERN (MongoDB, Express, React, Node.js) application for managing internships, applications, and student profiles.

## Technologies Used

### Frontend
*   React 18
*   Vite
*   Bootstrap 5 (Customized with CSS Variables for Dark Theme/Glassmorphism)
*   Chart.js (react-chartjs-2)
*   Axios
*   React Router DOM
*   React Toastify

### Backend
*   Node.js & Express.js
*   MongoDB (Mongoose)
*   JWT & bcryptjs (Authentication)
*   Cloudinary (Image Storage via multer-storage-cloudinary)
*   Helmet, CORS, Morgan, express-rate-limit

## Setup Instructions

### Prerequisites
*   Node.js (v18+)
*   MongoDB Atlas Account
*   Cloudinary Account (for image uploads)

### 1. Backend Setup

1.  Navigate to the backend folder:
    ```bash
    cd backend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Create a `.env` file based on `.env.example` and fill in your credentials:
    ```env
    PORT=5000
    MONGO_URI=your_mongodb_uri
    JWT_SECRET=your_jwt_secret
    CLOUDINARY_CLOUD_NAME=your_cloudinary_name
    CLOUDINARY_API_KEY=your_cloudinary_api_key
    CLOUDINARY_API_SECRET=your_cloudinary_api_secret
    CLIENT_URL=http://localhost:5173
    ```
4.  Start the development server:
    ```bash
    npm run dev
    ```

### 2. Frontend Setup

1.  Navigate to the frontend folder:
    ```bash
    cd frontend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Start the development server (Vite):
    ```bash
    npm run dev
    ```

## Deployment (Render)

This project includes a `render.yaml` Blueprint for easy deployment to Render.com.

1.  Push this code to a GitHub repository.
2.  Go to Render dashboard -> Blueprints -> New Blueprint Instance.
3.  Connect your repository. Render will automatically detect the backend as a Web Service and the frontend as a Static Site.
4.  **Important:** Manually configure the environment variables (`MONGO_URI`, `JWT_SECRET`, `CLOUDINARY_*`) for the backend web service in the Render dashboard.

## Features
*   **Authentication:** JWT-based login/registration with bcrypt password hashing.
*   **Student Dashboard:** View application statistics, browse companies, apply for internships, and update profile/avatar.
*   **Admin Dashboard:** Comprehensive dashboard with charts (Chart.js) showing application trends. Manage students (activate/deactivate), companies, and applications.
*   **UI/UX:** Modern dark theme with glassmorphism effects, responsive design using Bootstrap 5, and smooth animations.
