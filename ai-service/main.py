import uvicorn
import os
import io
import json
import tempfile
import re

# Add FFMPEG path directly to environment PATH to ensure pydub finds it on Windows
ffmpeg_path = r"C:\Users\VIVEK\AppData\Local\Microsoft\WinGet\Packages\Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe\ffmpeg-8.1.1-full_build\bin"
if os.path.exists(ffmpeg_path) and ffmpeg_path not in os.environ["PATH"]:
    os.environ["PATH"] += os.path.pathsep + ffmpeg_path

from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
from typing import Optional

import google.generativeai as genai
import whisper
from pydub import AudioSegment

load_dotenv()

AI_SERVICE_PORT = int(os.getenv("AI_SERVICE_PORT", 8000))

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
GEMINI_MODEL = os.getenv("GEMINI_MODEL", "gemini-2.5-flash")

genai.configure(api_key=GEMINI_API_KEY)

model = genai.GenerativeModel(GEMINI_MODEL)

app = FastAPI(
    title="AI Interviewer Microservice",
    version="1.0"
)

origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

WHISPER_MODEL = None

try:
    print("Loading Whisper Model...")
    WHISPER_MODEL = whisper.load_model("base.en")
    print("Whisper Model Loaded Successfully")
except Exception as e:
    print("Error while loading Whisper Model")
    print(e)


class QuestionResquest(BaseModel):
    role: str = "MERN Stack Developer"
    level: str = "Junior"
    count: int = 5
    interview_type: str = "coding-mix"


class QuestionResponse(BaseModel):
    questions: list[str]
    model_used: str


class EvaluationRequest(BaseModel):
    question: str
    question_type: str
    role: str
    level: str
    user_answer: Optional[str] = None
    user_code: Optional[str] = None


class EvaluationResponse(BaseModel):
    technicalScore: int
    confidenceScore: int
    aiFeedback: str
    idealAnswer: str


@app.get("/")
async def root():
    return {
        "message": "Hello from AI Interviewer Microservice!",
        "model": GEMINI_MODEL
    }


@app.post("/generate-questions", response_model=QuestionResponse)
async def generate_questions(request: QuestionResquest):

    try:

        if request.interview_type == "coding-mix":

            coding_count = int(request.count * 0.2)
            oral_count = request.count - coding_count

            instruction = (
                f"The first {coding_count} questions MUST be coding challenges requiring code implementation. "
                f"The remaining {oral_count} questions MUST be conceptual oral questions."
            )

        else:

            instruction = (
                "All questions MUST be conceptual oral questions. "
                "Do NOT generate coding questions."
            )

        prompt = f"""
You are a professional technical interviewer.

Generate exactly {request.count} interview questions.

Role: {request.role}
Level: {request.level}

{instruction}

Rules:
- One question per line
- No numbering
- No explanations
- No headings
"""

        response = model.generate_content(prompt)

        raw_text = response.text.strip()

        questions = [
            q.strip()
            for q in raw_text.split("\n")
            if q.strip()
        ]

        return QuestionResponse(
            questions=questions[:request.count],
            model_used=GEMINI_MODEL
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/transcribe")
async def transcribe_audio(file: UploadFile = File(...)):

    try:
        audio_bytes = await file.read()

        audio_in_memory = io.BytesIO(audio_bytes)

        audio_segment = AudioSegment.from_file(audio_in_memory)

        with tempfile.NamedTemporaryFile(
            delete=False,
            suffix=".mp3"
        ) as tmp:

            temp_audio_path = tmp.name

            audio_segment.export(
                temp_audio_path,
                format="mp3"
            )

        if not WHISPER_MODEL:
            raise HTTPException(
                status_code=503,
                detail="Whisper model not loaded"
            )

        result = WHISPER_MODEL.transcribe(temp_audio_path)

        os.remove(temp_audio_path)

        return {
            "transcription": result["text"].strip()
        }

    except Exception as e:

        if (
            'temp_audio_path' in locals()
            and os.path.exists(temp_audio_path)
        ):
            os.remove(temp_audio_path)

        raise HTTPException(
            status_code=500,
            detail=str(e)
        )


@app.post("/evaluate", response_model=EvaluationResponse)
async def evaluate(request: EvaluationRequest):

    try:

        if request.question_type == "oral":

            assessment_instruction = (
                "This is a conceptual oral question. "
                "Focus only on the verbal explanation. "
                "If answer is irrelevant, empty, or nonsense, give 0."
            )

        else:

            assessment_instruction = (
                "This is a coding question. "
                "Evaluate correctness, logic, and efficiency. "
                "If code is empty or invalid, give 0."
            )

        prompt = f"""
You are a strict technical interviewer.

{assessment_instruction}

Return ONLY valid JSON.

{{
    "technicalScore": 0,
    "confidenceScore": 0,
    "aiFeedback": "",
    "idealAnswer": ""
}}

Role: {request.role}
Level: {request.level}

Question:
{request.question}

Verbal Answer:
{request.user_answer or "No verbal answer provided"}

Code Answer:
{request.user_code or "No code provided"}
"""

        response = model.generate_content(prompt)

        response_text = response.text.strip()

        response_text = re.sub(
            r"^```json|```$",
            "",
            response_text,
            flags=re.MULTILINE
        ).strip()

        try:

            evaluation_data = json.loads(response_text)

            if (
                "idealAnswer" in evaluation_data
                and not isinstance(
                    evaluation_data["idealAnswer"],
                    str
                )
            ):
                evaluation_data["idealAnswer"] = json.dumps(
                    evaluation_data["idealAnswer"]
                )

            return EvaluationResponse(
                **evaluation_data
            )

        except Exception:

            print("Failed Response:")
            print(response_text)

            return EvaluationResponse(
                technicalScore=0,
                confidenceScore=0,
                aiFeedback="Failed to parse Gemini response",
                idealAnswer="Failed to parse response"
            )

    except Exception as e:

        print(e)

        raise HTTPException(
            status_code=500,
            detail=str(e)
        )


if __name__ == "__main__":
    uvicorn.run(
        app,
        host="0.0.0.0",
        port=AI_SERVICE_PORT
    )