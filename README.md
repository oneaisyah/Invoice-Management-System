# Invoice Management System

A full-stack web application designed for a business to efficiently manage and process invoices. The system allows users to create, view, edit, and delete invoices, with added features such as invoice data extraction using Google Document AI and secure user authentication.

## Features

- **User Authentication**: Secure login and registration system.
- **Invoice Management**: Create, view, update, and delete invoices and statement of accounts.
- **Data Extraction (OCR)**: Integration with Google Document AI to extract invoice data automatically.
- **Secure Data Storage**: User data and invoices are stored securely in MongoDB.

## Tech Stack

### **Frontend**
![React](https://img.shields.io/badge/-React.js-61DAFB?style=for-the-badge&logo=react&logoColor=white)
![React Router](https://img.shields.io/badge/-React%20Router-CA4245?style=for-the-badge&logo=react-router&logoColor=white)
![Material-UI](https://img.shields.io/badge/-MUI-007FFF?style=for-the-badge&logo=mui&logoColor=white)
![Axios](https://img.shields.io/badge/-Axios-5A29E4?style=for-the-badge&logo=axios&logoColor=white)

### **Backend**  
![Node.js](https://img.shields.io/badge/-Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/-Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/-MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![Google Document AI](https://img.shields.io/badge/-Google%20Document%20AI-4285F4?style=for-the-badge&logo=google&logoColor=white)
![JWT](https://img.shields.io/badge/-JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)

## Installation

### Prerequisites

Before getting started, make sure you have the following installed:
- **Node.js** (v14 or higher)
- **npm** (or **yarn** if preferred)

### Frontend Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/oneaisyah/invoice-management-system.git
   cd invoice-management-system
    ```

2. Install the frontend dependencies:
   ```bash
   cd frontend
   npm install
   ```

3. Start the frontend development server:
   ```bash
   npm start
   ```
   
   The frontend will be accessible at `http://localhost:3000`.

### Backend Setup

1. Install the backend dependencies:
   ```bash
   cd backend
   npm install
   ```

2. Set up the backend environment variables:
   - Create a `.env` file in the `backend` directory.
   - Add the following environment variables to connect to MongoDB and configure authentication:
     ```env
     NODE_ENV=production
     mongodb_uri="your_mongodb_connection_string"
     dbName_production="your_production_db_name"
     dbName_testing="your_testing_db_name"
     dbUsername="your_db_username"
     dbPassword="your_db_password"
     TOKEN_KEY="your_secret_key"
     ```

3. Start the backend server:
   ```bash
   npm start
   ```
   
   The backend will be accessible at `http://localhost:8888`.

## Usage

- **Frontend**: View and manage invoices, authenticate users, and interact with the backend to fetch or modify data.
- **Backend**: RESTful API to handle requests, manage user authentication, interact with MongoDB, and integrate with Google Document AI.