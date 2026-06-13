
# 🧠 AI-Powered Technical Interview Prepper

A full-stack application designed to simulate real-world technical interviews. It allows users to practice answering conceptual and coding questions verbally and programmatically, receiving instant, AI-driven feedback on their performance.

## ✨ Key Features

* **Customizable Interviews**: Select Role (MERN, Python, Data Science), Difficulty Level, and Interview Type (Oral vs. Coding Mix).
* **Hybrid Input System**:
* **🎙️ Voice Response**: Uses **OpenAI Whisper** to transcribe verbal answers for conceptual questions.
* **💻 Code Editor**: Integrated **Monaco Editor** for solving coding challenges directly in the browser.


* **AI Microservice Architecture**:
* **Question Generation**: dynamically creates unique interview questions using Gemini.
* **Smart Evaluation**: Analyzes both code logic and verbal transcription to provide a **Technical Score** and **Confidence Score**.


* **Detailed Analytics**:
* Session history with global scores.
* Per-question breakdown showing user submission vs. ideal implementation.
* Performance charts using **Chart.js**.


* **Secure Authentication**: JWT-based user login and registration.

---

## 🛠️ Tech Stack

### **Frontend**

* **Framework**: React (Vite)
* **State Management**: Redux Toolkit
* **Styling**: Tailwind CSS
* **Editor**: `@monaco-editor/react`
* **Visualization**: Chart.js / React-Chartjs-2
* **Routing**: React Router Dom

### **Backend (API Gateway)**

* **Runtime**: Node.js
* **Framework**: Express.js
* **Database**: MongoDB (Mongoose)
* **Authentication**: JSON Web Tokens (JWT) & bcryptjs

### **AI Microservice**

* **Runtime**: Python 3.9+
* **Framework**: FastAPI
* **LLM Engine**:  GEMINI (gemini-2.5-flash - model)
* **Speech-to-Text**: OpenAI Whisper (`base.en` model)
* **Audio Processing**: PyDub / FFMPEG






## 📐 Architecture Overview

The application follows a microservices-inspired architecture to separate heavy AI processing from the main application logic.

1. **Client (React)**: Handles UI, Audio Recording, and Code Editing. Sends data to Node.js.
2. **Node.js Server**: Acts as the API Gateway. Handles Auth, Database storage, and forwards AI tasks to the Python service.
3. **Python Service**:
* Receives `POST /generate-questions`.
* Receives `POST /transcribe` (Audio -> Text).
* Receives `POST /evaluate` (Text/Code -> Score/Feedback JSON).



