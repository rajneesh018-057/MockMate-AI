// frontend/src/pages/InterviewRunner.jsx
import React, { useEffect, useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { getSessionById, submitAnswer, endSession } from '../features/sessions/sessionSlice';
import MonacoEditor from '@monaco-editor/react';
import { toast } from 'react-toastify';

const SUPPORTED_LANGUAGES = [
  { label: 'JavaScript', value: 'javascript' },
  { label: 'TypeScript', value: 'typescript' },
  { label: 'Python', value: 'python' },
  { label: 'Java', value: 'java' },
  { label: 'C++', value: 'cpp' },
  { label: 'C#', value: 'csharp' },
  { label: 'Go', value: 'go' },
  { label: 'Swift', value: 'swift' },
  { label: 'Kotlin', value: 'kotlin' },
  { label: 'R Language', value: 'r' },
  { label: 'SQL', value: 'sql' },
  { label: 'HTML', value: 'html' },
  { label: 'CSS', value: 'css' },
  { label: 'Solidity', value: 'solidity' },
  { label: 'Shell', value: 'shell' },
  { label: 'YAML', value: 'yaml' },
  { label: 'Markdown', value: 'markdown' },
  { label: 'Plain Text', value: 'plaintext' },
];

const ROLE_LANGUAGE_MAP = {
  "MERN Stack Developer": "javascript",
  "MEAN Stack Developer": "typescript",
  "Full Stack Python": "python",
  "Full Stack Java": "java",
  "Frontend Developer": "javascript",
  "Backend Developer": "javascript",
  "Data Scientist": "python",
  "Data Analyst": "python",
  "Machine Learning Engineer": "python",
  "DevOps Engineer": "shell",
  "Cloud Engineer (AWS/Azure/GCP)": "yaml",
  "Cybersecurity Engineer": "python",
  "Blockchain Developer": "solidity",
  "Mobile Developer (iOS/Android)": "swift",
  "Game Developer": "csharp",
  "QA Automation Engineer": "python",
  "UI/UX Designer": "css",
  "Product Manager": "markdown"
};
function InterviewRunner() {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { activeSession, isLoading, message } = useSelector(state => state.sessions);

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedLanguage, setSelectedLanguage] = useState('javascript');


  // If submittedLocal[0] is true, we lock Question 0 immediately.
  const [submittedLocal, setSubmittedLocal] = useState({});

  const [drafts, setDrafts] = useState(() => {
    const saved = localStorage.getItem(`drafts_${sessionId}`);
    return saved ? JSON.parse(saved) : {};
  });

  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const streamRef = useRef(null);
  const timerIntervalRef = useRef(null);

  useEffect(() => {
    if (activeSession?.role) {
      const detectedLang =
        ROLE_LANGUAGE_MAP[activeSession.role] || "plaintext";

      setSelectedLanguage(detectedLang);
    }
  }, [activeSession?.role]);


  useEffect(() => {
    localStorage.setItem(`drafts_${sessionId}`, JSON.stringify(drafts));
  }, [drafts, sessionId]);

  useEffect(() => {
    dispatch(getSessionById(sessionId));
  }, [dispatch, sessionId]);

  const currentQuestion = activeSession?.questions?.[currentQuestionIndex];


  // 1. Is it submitted in Redux? (Backend confirmed)
  const isReduxSubmitted = currentQuestion?.isSubmitted === true;

  // 2. Did I just click submit locally? (Optimistic update)
  const isLocallySubmitted = submittedLocal[currentQuestionIndex] === true;

  // 3. Lock if EITHER is true
  const isQuestionLocked = isReduxSubmitted || isLocallySubmitted;

  // 4. Show "Analyzing..." status if Locked AND not yet evaluated
  const isProcessing = isQuestionLocked && !currentQuestion?.isEvaluated;


  const handleNavigation = (index) => {
    if (index >= 0 && index < activeSession?.questions.length) {
      if (isRecording) stopRecording();
      setCurrentQuestionIndex(index);
      setRecordingTime(0);
    }
  };

  const updateDraftCode = (newCode) => {
    if (isQuestionLocked) return;
    setDrafts(prev => ({
      ...prev,
      [currentQuestionIndex]: { ...prev[currentQuestionIndex], code: newCode }
    }));
  };

  const startRecording = async () => {
    if (isQuestionLocked) return;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };

      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        setDrafts(prev => ({
          ...prev,
          [currentQuestionIndex]: { ...prev[currentQuestionIndex], audioBlob: blob }
        }));
      };

      mediaRecorderRef.current.start(1000);
      setIsRecording(true);
      setRecordingTime(0);
      timerIntervalRef.current = setInterval(() => setRecordingTime(p => p + 1), 1000);
    } catch (err) {
      toast.error("Microphone denied.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current?.state !== 'inactive') {
      mediaRecorderRef.current.stop();
      streamRef.current?.getTracks().forEach(track => track.stop());
      clearInterval(timerIntervalRef.current);
      setIsRecording(false);
    }
  };

  const handleSubmitAnswer = async () => {
    if (isQuestionLocked) return;
    if (isRecording) stopRecording();

    const draft = drafts[currentQuestionIndex];
    const code = draft?.code || '';
    const audio = draft?.audioBlob;

    if (!code && !audio) {
      toast.warning("Please provide code or an audio answer.");
      return;
    }

    // ✅ 1. OPTIMISTIC UPDATE: Lock UI instantly
    setSubmittedLocal(prev => ({ ...prev, [currentQuestionIndex]: true }));

    const formData = new FormData();
    formData.append('questionIndex', currentQuestionIndex);
    if (code) formData.append('code', code);
    if (audio) formData.append('audioFile', audio, 'answer.webm');

    // ✅ 2. Send Request
    dispatch(submitAnswer({ sessionId, formData }))
      .unwrap()
      .catch((err) => {
        // If backend fails, UNLOCK so user can try again
        setSubmittedLocal(prev => ({ ...prev, [currentQuestionIndex]: false }));
        toast.error("Submission failed. Please try again.");
      });
  };

  const handleFinishInterview = () => {
    if (!window.confirm("Are you sure you want to finish?")) return;

    dispatch(endSession(sessionId))
      .unwrap()
      .then(() => {
        localStorage.removeItem(`drafts_${sessionId}`);
        navigate(`/review/${sessionId}`);
      })
      .catch(err => toast.error("Could not finish session. Ai is working on it."));
  };

  if (!activeSession) return <div className="text-center py-20 text-slate-400">Loading...</div>;

  const currentDraft = drafts[currentQuestionIndex] || {};

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 sm:py-10 pb-36 font-sans">
      
      {/* Top Session HUD */}
      <div className="flex justify-between items-center glass-card p-5 sm:p-6 rounded-[2rem] shadow-xl mb-6">
        <div>
          <h1 className="text-lg sm:text-xl font-extrabold text-white tracking-wide uppercase">{activeSession.role}</h1>
          <div className="flex gap-2.5 mt-2.5">
            {activeSession?.questions?.map((q, i) => (
              <div
                key={i}
                onClick={() => handleNavigation(i)}
                className={`w-3 h-3 rounded-full cursor-pointer transition-all duration-300 ${
                  i === currentQuestionIndex 
                    ? 'bg-teal-400 scale-125 shadow-[0_0_10px_rgba(20,184,166,0.6)]' 
                    : q.isEvaluated 
                    ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]' 
                    : (q.isSubmitted || submittedLocal[i]) 
                    ? 'bg-amber-400 animate-pulse shadow-[0_0_8px_rgba(245,158,11,0.4)]' 
                    : 'bg-slate-800 border border-white/5'
                }`}
                title={`Question ${i + 1}`}
              />
            ))}
          </div>
        </div>
        <button
          onClick={handleFinishInterview}
          disabled={isLoading}
          className="bg-rose-500/15 border border-rose-500/20 text-rose-300 px-5 py-2 sm:px-6 sm:py-2.5 rounded-xl text-xs font-extrabold uppercase tracking-wider hover:bg-rose-600 hover:text-white disabled:opacity-50 transition-all duration-300"
        >
          {isLoading ? "Finalizing..." : "Finish Interview"}
        </button>
      </div>

      {/* Main Question Display */}
      <div className="bg-gradient-to-r from-teal-950/20 via-slate-900/60 to-cyan-950/20 border border-white/5 p-6 sm:p-8 rounded-[2rem] shadow-2xl mb-6">
        <span className="text-teal-400 text-[9px] font-black uppercase tracking-[0.25em]">Question {currentQuestionIndex + 1} of {activeSession.questions.length}</span>
        <h2 className="text-xl sm:text-2xl mt-2.5 font-semibold leading-relaxed text-slate-100">{currentQuestion?.questionText}</h2>
      </div>

      {/* Inputs Panels Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Side: Audio Recording Component */}
        <div className="glass-card p-6 sm:p-8 rounded-[2rem] shadow-xl flex flex-col items-center justify-center min-h-[350px] relative overflow-hidden">
          <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest absolute top-6">Verbal Explanation</h3>

          {!isRecording && !currentDraft.audioBlob ? (
            <div className="flex flex-col items-center gap-5">
              <button
                onClick={startRecording}
                disabled={isQuestionLocked}
                className="w-18 h-18 bg-teal-500 text-white rounded-full flex items-center justify-center text-2xl shadow-lg shadow-teal-500/20 hover:scale-105 active:scale-95 transition-all disabled:opacity-30 disabled:bg-slate-800 disabled:shadow-none disabled:cursor-not-allowed"
              >
                🎤
              </button>
              <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Tap microphone to answer verbally</p>
            </div>
          ) : isRecording ? (
            <div className="text-center flex flex-col items-center gap-4">
              <div className="relative flex items-center justify-center">
                {/* Wave animation circles */}
                <div className="absolute w-24 h-24 rounded-full bg-rose-500/20 animate-ping" />
                <div className="absolute w-20 h-20 rounded-full bg-rose-500/30 animate-pulse" />
                
                <button
                  onClick={stopRecording}
                  className="relative z-10 w-16 h-16 bg-rose-500 rounded-full flex items-center justify-center text-white text-xl shadow-lg shadow-rose-500/20 hover:scale-95 transition-transform"
                >
                  ⏹
                </button>
              </div>
              <p className="mt-2 font-mono text-rose-400 font-black tracking-widest text-sm">{recordingTime}s</p>
              <p className="text-xs text-rose-500 font-bold uppercase tracking-wider animate-pulse">Recording explanation...</p>
            </div>
          ) : (
            <div className="text-center flex flex-col items-center gap-3">
              <div className="h-14 w-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 text-2xl shadow-md">
                ✓
              </div>
              <div className="text-emerald-400 font-extrabold text-sm uppercase tracking-wide">Audio Answer Captured</div>
              {!isQuestionLocked && (
                <button onClick={() => setDrafts(prev => ({ ...prev, [currentQuestionIndex]: { ...prev[currentQuestionIndex], audioBlob: null } }))} className="text-xs text-slate-500 underline font-semibold hover:text-rose-400 transition-colors">
                  Delete & Re-record Answer
                </button>
              )}
            </div>
          )}
        </div>

        {/* Right Side: Code Editor Component */}
        <div className="glass-card p-1 rounded-[2rem] shadow-xl overflow-hidden h-[400px] flex flex-col">
          <div className="flex justify-between items-center px-4.5 py-3 bg-slate-900/50 border-b border-white/5">
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Code Implementation</span>
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              disabled={isQuestionLocked}
              className="text-xs bg-slate-950 border border-white/10 rounded-lg px-2.5 py-1 text-slate-300 focus:outline-none focus:border-teal-500 transition-colors"
            >
              {SUPPORTED_LANGUAGES.map(l => <option key={l.value} className="bg-slate-950 text-slate-300" value={l.value}>{l.label}</option>)}
            </select>
          </div>
          <div className="flex-1 w-full overflow-hidden rounded-b-[1.75rem]">
            <MonacoEditor
              height="100%"
              language={selectedLanguage}
              theme="vs-dark"
              value={currentDraft.code || ''}
              onChange={updateDraftCode}
              options={{
                minimap: { enabled: false },
                fontSize: 13,
                fontFamily: "Fira Code, Source Code Pro, Courier New, monospace",
                scrollBeyondLastLine: false,
                readOnly: isQuestionLocked,
                domReadOnly: isQuestionLocked,
                padding: { top: 12 }
              }}
            />
          </div>
        </div>
      </div>

      {/* AI Dynamic Evaluated Feedback (If available) */}
      {currentQuestion?.isEvaluated && (
        <div className="mt-8 bg-emerald-500/5 border border-emerald-500/20 p-6 rounded-[2rem] animate-in fade-in">
          <h3 className="text-emerald-400 font-extrabold text-xs uppercase tracking-widest mb-2 flex items-center">
            <span className="h-2 w-2 rounded-full bg-emerald-400 mr-2.5" />
            Instant AI Evaluation Feedback
          </h3>
          <p className="text-emerald-300/80 text-sm leading-relaxed font-medium">{currentQuestion.aiFeedback}</p>
          <div className="mt-5 flex gap-4">
            <span className="bg-white/5 border border-white/10 px-3.5 py-1.5 rounded-xl text-xs font-black text-emerald-400 shadow-sm">
              SCORE: {currentQuestion.technicalScore}/100
            </span>
          </div>
        </div>
      )}

      {/* Floating Bottom Navigator bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-slate-950/80 backdrop-blur-md border-t border-white/5 p-4 px-6 md:px-12 flex justify-between items-center z-50">
        <button
          onClick={() => handleNavigation(currentQuestionIndex - 1)}
          disabled={currentQuestionIndex === 0}
          className="text-slate-400 font-extrabold text-xs uppercase tracking-wider hover:text-white disabled:opacity-20 transition-colors"
        >
          ← Previous
        </button>

        <div className="flex flex-col items-center">
          {/* Status Processing Indicator */}
          {isProcessing && message && (
            <div className="mb-2 text-[10px] font-mono text-teal-400 bg-teal-500/10 px-3 py-1 rounded-full animate-pulse border border-teal-500/20">
              🤖 {message}...
            </div>
          )}

          <button
            onClick={handleSubmitAnswer}
            disabled={isQuestionLocked}
            className={`px-8 py-3 rounded-xl font-extrabold text-xs uppercase tracking-widest text-white shadow-lg transition-all active:scale-[0.98] ${
              isProcessing 
                ? 'bg-slate-800 text-slate-500 border border-white/5 cursor-wait' 
                : currentQuestion?.isEvaluated 
                ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-500/10' 
                : isQuestionLocked 
                ? 'bg-slate-800 text-slate-400 border border-white/5' 
                : 'bg-gradient-to-r from-teal-500 to-cyan-500 hover:shadow-teal-500/15'
            }`}
          >
            {isProcessing ? "Analyzing..." : currentQuestion?.isEvaluated ? "Answer Submitted" : isQuestionLocked ? "Submitted" : "Submit Answer"}
          </button>
        </div>

        <button
          onClick={() => handleNavigation(currentQuestionIndex + 1)}
          disabled={currentQuestionIndex === activeSession.questions.length - 1}
          className="text-slate-400 font-extrabold text-xs uppercase tracking-wider hover:text-white disabled:opacity-20 transition-colors"
        >
          Next →
        </button>
      </div>
    </div>
  );
}

export default InterviewRunner;