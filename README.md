# MediCare-Hub

MediCare-Hub is a role-based MERN stack clinic management web application that streamlines patient intake, token-based consultation flow, diagnosis, and billing between Receptionist and Doctor users.

## Project Overview

The system is built around a token queue workflow:

1. Receptionist registers a patient and generates a doctor-assigned token.
2. Doctor retrieves patient details by token, reviews historical prescriptions, submits a new prescription, and marks the token as checked.
3. Receptionist completes billing for the consultation.

The application uses JWT-based authentication, MongoDB persistence, and a React SPA frontend.

## Features By Role

### Receptionist

- Log in and log out securely
- Register new patients (name, age, phone, gender, address)
- Generate token numbers for existing patients assigned to specific doctors
- Submit billing (patient, doctor, consultation amount)
- View dashboard of billing records including doctor name, patient name, phone, timestamp, and amount

### Doctor

- Log in and log out securely
- Enter token number to retrieve patient details
- View complete consultation history and previous prescriptions from all doctors
- Submit a new prescription for current visit
- Mark token as checked after consultation
- View live token queue for today (auto-refresh every 30 seconds)
- View profile information
- View dashboard of consulted patients

## Tech Stack

### Frontend

- React (SPA)
- React Router v6
- Axios
- React Hot Toast
- CSS Modules
- Nunito font family

### Backend

- Node.js
- Express.js

### Database

- MongoDB
- Mongoose ODM

### Authentication & Security

- JWT (jsonwebtoken)
- bcrypt password hashing

### Deployment

- Vercel (backend configured through vercel.json for serverless deployment)

## Folder Structure

```text
MediCare-Hub/
|-- client/
|   |-- public/
|   |-- src/
|   |   |-- pages/
|   |   |   |-- Auth/
|   |   |   |-- Doctor/
|   |   |   |-- Receptionist/
|   |   |-- components/
|   |   |   |-- Doctor/
|   |   |-- styles/
|   |   |   |-- components/
|   |   |   |-- page/
|   |   |   |-- utils/
|   |   |-- utils/
|   |   |-- App.js
|   |   |-- index.js
|   |-- package.json
|
|-- server/
|   |-- controllers/
|   |-- middleware/
|   |-- models/
|   |-- routes/
|   |-- db.js
|   |-- index.js
|   |-- vercel.json
|   |-- package.json
|
|-- README.md
```

## Setup And Installation

### Prerequisites

- Node.js v18+
- npm
- MongoDB (local instance or MongoDB Atlas)

### 1. Clone Repository

```bash
git clone <your-repository-url>
cd MediCare-Hub
```

### 2. Install Dependencies

```bash
# Backend dependencies
cd server
npm install

# Frontend dependencies
cd ../client
npm install
```

### 3. Configure Environment Variables

Create .env files in server and client folders as shown in the Environment Variables section below.

### 4. Seed Initial Users (No Admin UI)

Because there is no admin panel, create at least one doctor and one receptionist via API.

Start backend first:

```bash
cd server
npm start
```

Then run seed requests (examples):

```bash
# Create doctor account
curl -X POST http://localhost:3006/api/docs/createdoc \
    -H "Content-Type: application/json" \
    -d "{\"name\":\"Dr. Alex\",\"email\":\"doc@clinic.com\",\"password\":\"Pass@123\",\"age\":35,\"phno\":\"9999999999\",\"gender\":\"Male\",\"exp\":8,\"prevCompany\":\"City Hospital\"}"

# Create receptionist account
curl -X POST http://localhost:3006/api/recept/createrecept \
    -H "Content-Type: application/json" \
    -d "{\"name\":\"Reception User\",\"age\":\"27\",\"email\":\"rec@clinic.com\",\"password\":\"Pass@123\",\"phno\":8888888888,\"gender\":\"Female\",\"exp\":3,\"prevCompany\":\"Care Desk\"}"
```

### 5. Run Application Locally

Open two terminals:

```bash
# Terminal 1 - backend (port 3006)
cd server
npm start

# Terminal 2 - frontend (port 3000)
cd client
npm start
```

Frontend: http://localhost:3000

Backend: http://localhost:3006

## Environment Variables

### Server (.env)

| Variable | Required | Description | Example |
|---|---|---|---|
| MONGO_URI | Yes | MongoDB connection string | mongodb+srv://... |
| PORT | Yes | API server port | 3006 |
| JWT_SECRET | Yes | Secret key for JWT signing/verification | super_secret_key |
| SALT | Yes | bcrypt salt rounds | 10 |

### Client (.env)

| Variable | Required | Description | Example |
|---|---|---|---|
| REACT_APP_API_URL | Yes | Backend base URL | http://localhost:3006 |

## API Reference

### Doctor Routes

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | /api/docs/logdoc | Public | Doctor login (returns JWT + user payload) |
| POST | /api/docs/createdoc | Public | Create doctor account |
| POST | /api/docs/enqpat | JWT | Submit prescription for a patient |
| POST | /api/docs/retdoc | JWT | Get doctor consultation dashboard data |
| POST | /api/docs/retalltoken | JWT | Get today's token queue |
| POST | /api/docs/rettoken | JWT | Get patient and token details by token id |
| POST | /api/docs/marktoken | JWT | Mark token as checked |

### Receptionist Routes

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | /api/recept/logrecept | Public | Receptionist login (returns JWT + user payload) |
| POST | /api/recept/createrecept | Public | Create receptionist account |
| POST | /api/recept/createtoken | JWT | Generate token for patient + doctor |
| POST | /api/recept/receptregister | JWT | Register new patient |
| POST | /api/recept/retrecept | JWT | Receptionist dashboard data |
| POST | /api/recept/retrpat | JWT | Retrieve patient details |
| POST | /api/recept/bill | JWT | Submit billing record |

## Core Workflow

1. Receptionist registers patient (if new) and generates a token assigned to a doctor.
2. Doctor enters token number, reviews history, prescribes treatment, and marks token as checked.
3. Receptionist submits billing for the completed consultation.

## Known Limitations

- No admin panel for user management
- No image upload for patient profiles or documents
- No email/SMS notifications

## Future Improvements

- Admin dashboard with role and account management
- Appointment scheduling and calendar module
- Automated email/SMS notifications
- Mobile application for doctor/receptionist workflows

