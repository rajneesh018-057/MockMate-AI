# 🧠 AI-Powered Technical Interview Prepper

A full-stack AI-powered interview preparation platform that simulates real-world technical interviews. Users can practice both conceptual and coding questions through voice and code submissions, receive AI-generated feedback, and track their progress through detailed analytics.

The platform combines modern web technologies, AI evaluation, speech recognition, and a microservices architecture to create an interactive interview preparation experience.

---

# 🚀 Features

## 🎯 Customizable Interview Experience

Users can create personalized interview sessions by selecting:

* Job Role (MERN Stack, Python, Data Science, etc.)
* Difficulty Level (Easy, Medium, Hard)
* Interview Type (Conceptual, Coding, or Mixed)

---

## 🎙️ Voice-Based Responses

For conceptual questions, users can answer verbally.

Features:

* Audio recording directly from the browser
* Speech-to-text conversion using OpenAI Whisper
* AI evaluation of verbal responses
* Confidence and communication assessment

---

## 💻 Integrated Coding Environment

Coding challenges can be solved directly inside the application using Monaco Editor.

Features:

* Professional coding environment
* Syntax highlighting
* Real-time code editing
* AI-powered code evaluation

---

## 🤖 AI-Powered Interview Engine

### Question Generation

The AI service dynamically generates interview questions based on:

* Selected role
* Difficulty level
* Interview type

This ensures every interview session feels unique.

### Smart Evaluation

The AI evaluates:

* Technical correctness
* Problem-solving approach
* Code quality
* Communication skills
* Confidence level

Users receive detailed feedback instead of just a score.

---

## 📊 Analytics Dashboard

Track interview performance over time.

Features:

* Overall performance score
* Technical score
* Confidence score
* Session history
* Question-wise analysis
* Performance trends
* Interactive charts

---

## 🔐 Secure Authentication

Authentication system built with:

* JWT Authentication
* Password Hashing using bcryptjs
* Protected Routes
* Persistent Login Sessions

---

# 🛠️ Tech Stack

## Frontend

* React (Vite)
* Redux Toolkit
* React Router DOM
* Tailwind CSS
* Axios
* Chart.js
* React Chartjs 2
* Monaco Editor (`@monaco-editor/react`)
* React Toastify

---

## Backend API Gateway

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT Authentication
* bcryptjs

---

## AI Microservice

* Python 3.9+
* FastAPI
* Gemini 2.5 Flash
* OpenAI Whisper
* PyDub
* FFmpeg

---

## DevOps & Deployment

* Docker
* Docker Compose
* Multi-Container Architecture
* Container Networking

---

# 📐 System Architecture

The application follows a microservices-inspired architecture where AI processing is separated from the main backend service.

```text
┌────────────────────┐
│   React Frontend   │
└─────────┬──────────┘
          │
          ▼
┌────────────────────┐
│ Node.js API Gateway│
└───────┬─────┬──────┘
        │     │
        ▼     ▼
┌──────────┐ ┌───────────────┐
│ MongoDB  │ │ FastAPI AI    │
│ Database │ │ Microservice  │
└──────────┘ └───────┬───────┘
                     │
                     ▼
             ┌──────────────┐
             │ Gemini AI    │
             │ OpenAI       │
             │ Whisper      │
             └──────────────┘
```

---

# ⚙️ Application Workflow

### 1. User Authentication

* User registers or logs in
* JWT token is generated
* Protected routes become accessible

### 2. Interview Creation

User selects:

* Role
* Difficulty
* Interview Type

The request is sent to the AI service.

### 3. Question Generation

The AI service:

* Receives interview configuration
* Generates tailored interview questions
* Sends questions back to the frontend

### 4. User Response

#### Conceptual Questions

* User records voice response
* Audio is uploaded to AI service
* Whisper transcribes speech into text

#### Coding Questions

* User writes code in Monaco Editor
* Code is submitted for evaluation

### 5. AI Evaluation

The AI evaluates:

* Technical accuracy
* Communication quality
* Confidence level
* Coding logic
* Problem-solving approach

### 6. Analytics Generation

Results are:

* Stored in MongoDB
* Displayed in analytics dashboard
* Added to interview history

---

# 🐳 Dockerized Deployment

The project is fully containerized using Docker.

## Container Architecture

The application consists of multiple services:

| Service    | Technology        | Purpose        |
| ---------- | ----------------- | -------------- |
| Frontend   | React + Vite      | User Interface |
| Backend    | Node.js + Express | API Gateway    |
| AI Service | FastAPI           | AI Processing  |
| Database   | MongoDB           | Data Storage   |

---

## Running the Application

### Build and Start Containers

```bash
docker-compose up --build
```

### Run in Detached Mode

```bash
docker-compose up -d
```

### Stop Containers

```bash
docker-compose down
```

### View Logs

```bash
docker-compose logs -f
```

---



---

# 📂 Project Structure

```text
project-root/
│
├── client/
│   ├── src/
│   ├── public/
│   └── Dockerfile
│
├── server/
│   ├── controllers/
│   ├── routes/
│   ├── models/
│   ├── middleware/
│   └── Dockerfile
│
├── ai-service/
│   ├── main.py
│   ├── services/
│   ├── requirements.txt
│   └── Dockerfile
│
├── docker-compose.yml
│
└── README.md
```

---

# 🔑 Environment Variables

## Frontend

```env
VITE_API_URL=http://localhost:5000
VITE_GOOGLE_CLIENT_ID=YOUR_GOOGLE_CLIENT_ID
```

## Backend

```env
PORT=5000
MONGO_URI=YOUR_MONGO_URI
JWT_SECRET=YOUR_SECRET
GOOGLE_CLIENT_ID=YOUR_GOOGLE_CLIENT_ID
```

## AI Service

```env
GOOGLE_API_KEY=YOUR_GEMINI_API_KEY
```

---



---



---

# 📄 License

This project is developed for educational, learning, and portfolio purposes.

---

# 👨‍💻 Author

**Rajneesh Kumar**

If you found this project helpful, consider giving it a ⭐ on GitHub.
