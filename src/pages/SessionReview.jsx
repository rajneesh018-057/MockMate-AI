import  { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams, Link } from 'react-router-dom';
import { getSessionById } from '../features/sessions/sessionSlice';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const formatDuration = (start, end) => {
    if (!start || !end) return 'N/A';
    const diff = new Date(end) - new Date(start);
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    return `${minutes}m ${seconds % 60}s`;
};

const sanitizeQuestionText = (text) => {
    return text.replace(/^\d+[\s\.\)]+/, '').trim();
};

const formatIdealAnswer = (text) => {
    try {
        if (!text) return "Pending evaluation.";

        let cleanText = text.trim();

        // 1. Remove Markdown code blocks if the AI added them (e.g., ```json ... ```)
        if (cleanText.startsWith('```')) {
            cleanText = cleanText.replace(/^```(json)?/, '').replace(/```$/, '').trim();
        }

        // 2. Check if it's a JSON object
        if (cleanText.startsWith('{') && cleanText.endsWith('}')) {
            const parsed = JSON.parse(cleanText);

            // Scenario A: The "Merged" Hallucination (Fixes Screenshot 266)
            // The AI put the score object inside the answer. We extract just the answer.
            if (parsed.verbalAnswer || parsed.idealAnswer || parsed.idealanswer) {
                return parsed.verbalAnswer || parsed.idealAnswer || parsed.idealanswer;
            }

            // Scenario B: Structured Explanation (Fixes Screenshot 267/268)
            const explanation = parsed.explanation || parsed.understanding || "";
            const code = parsed.code || parsed.codeExample || parsed.example || "";

            if (explanation || code) {
                return `${explanation}\n\n${code}`.trim();
            }
        }

        // Scenario C: It's just a normal string
        return text;
    } catch (e) {
        // If parsing fails, just show the raw text so nothing crashes
        return text;
    }
};

function SessionReview() {
    const { sessionId } = useParams();
    const dispatch = useDispatch();
    const { activeSession, isLoading } = useSelector(state => state.sessions);

    useEffect(() => {
        dispatch(getSessionById(sessionId));
    }, [dispatch, sessionId]);

    if (isLoading) {
        return (
            <div className="flex flex-col justify-center items-center min-h-[80vh] gap-4 font-sans">
                <div className="animate-spin h-10 w-10 border-2 border-teal-500 border-t-transparent rounded-full" />
                <p className="text-[10px] font-black tracking-[0.2em] text-slate-500 uppercase animate-pulse">Generating AI Analytical Report...</p>
            </div>
        );
    }

    if (!activeSession || activeSession.status !== 'completed') {
        return (
            <div className="max-w-xl mx-auto mt-10 sm:mt-20 p-8 sm:p-10 glass-card rounded-[2rem] shadow-2xl text-center border border-white/5 font-sans">
                <h2 className="text-xl sm:text-2xl font-extrabold text-white mb-4 tracking-wide uppercase">Report Processing</h2>
                <p className="text-slate-400 mb-8 text-xs font-semibold">This interview session is currently being evaluated by our backend AI engine.</p>
                <Link to="/dashboard" className="inline-block bg-gradient-to-r from-teal-500 to-cyan-500 text-white px-8 py-3.5 rounded-xl font-extrabold text-xs uppercase tracking-widest shadow-lg transition hover:scale-[1.02] active:scale-95">Go to Dashboard</Link>
            </div>
        );
    }

    const { overallScore, metrics, role, level, questions, startTime, endTime } = activeSession;
    const finalMetrics = metrics || {};

    const barData = {
        labels: questions.map((_, i) => `Q${i + 1}`),
        datasets: [{
            label: 'Technical Score',
            data: questions.map(q => q.technicalScore || 0),
            backgroundColor: questions.map(q => (q.technicalScore || 0) > 70 ? '#14b8a6' : '#f59e0b'),
            borderRadius: 6,
        }],
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-8 sm:space-y-10 animate-in fade-in duration-700 font-sans">

            {/* --- Header --- */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-white/5 pb-6 sm:pb-8">
                <div>
                    <span className="text-teal-400 font-black uppercase tracking-[0.2em] text-[10px] block">Assessment Complete</span>
                    <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mt-2 uppercase">
                        {role} <span className="text-slate-500 font-medium tracking-wide lowercase text-sm sm:text-base block sm:inline">({level})</span>
                    </h1>
                </div>
            </div>

            {/* --- Summary Stats --- */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 overflow-x-auto pb-4 sm:pb-0 no-scrollbar snap-x">
                {[
                    { label: 'Overall Result', value: `${overallScore}%`, color: 'teal' },
                    { label: 'Avg Technical', value: `${finalMetrics.avgTechnical}%`, color: 'slate' },
                    { label: 'Avg Confidence', value: `${finalMetrics.avgConfidence}%`, color: 'slate' },
                    { label: 'Session Time', value: formatDuration(startTime, endTime), color: 'slate' }
                ].map((stat, i) => (
                    <div key={i} className={`min-w-[160px] snap-center glass-card p-6 sm:p-7 rounded-[2rem] shadow-sm border-l-[6px] ${stat.color === 'teal' ? 'border-teal-500' : 'border-slate-800'}`}>
                        <p className="text-[9px] sm:text-[10px] font-black text-slate-500 uppercase tracking-[0.1em]">{stat.label}</p>
                        <p className={`text-2xl sm:text-3xl font-black mt-2 leading-none ${stat.color === 'teal' ? 'text-teal-400' : 'text-slate-200'}`}>{stat.value}</p>
                    </div>
                ))}
            </div>

            {/* --- Chart --- */}
            <div className="glass-card p-6 sm:p-8 rounded-[2.5rem] border border-white/5 shadow-xl">
                <h3 className="text-[10px] font-black text-slate-500 mb-6 uppercase tracking-[0.2em]">Per-Question Performance</h3>
                <div className="h-64 sm:h-80">
                    <Bar
                        data={barData}
                        options={{
                            maintainAspectRatio: false,
                            plugins: { legend: { display: false } },
                            scales: {
                                y: { 
                                    beginAtZero: true, 
                                    max: 100, 
                                    grid: { color: 'rgba(255, 255, 255, 0.05)' },
                                    ticks: { color: '#64748b', font: { family: 'Inter', size: 10 } }
                                },
                                x: { 
                                    grid: { display: false },
                                    ticks: { color: '#64748b', font: { family: 'Inter', size: 10 } }
                                }
                            }
                        }}
                    />
                </div>
            </div>

            {/* --- Detailed Question Review --- */}
            <div className="space-y-6 sm:space-y-8">
                <h3 className="text-xl sm:text-2xl font-extrabold text-white px-2 flex items-center tracking-wide uppercase">
                    <span className="w-8 h-8 sm:w-10 sm:h-10 bg-white/5 border border-white/10 text-teal-400 rounded-xl flex items-center justify-center mr-3 text-base">✓</span>
                    Answer Intelligence
                </h3>
                <div className="space-y-6 sm:space-y-8">
                    {questions.map((q, index) => (
                        <div key={index} className="glass-card rounded-[2.5rem] border border-white/5 shadow-md overflow-hidden group hover:border-teal-500/20 transition-all duration-300">
                            <div className="p-6 sm:p-8 space-y-6">

                                {/* Header: Question & Scores */}
                                <div className="flex flex-col lg:flex-row justify-between items-start gap-4 sm:gap-6">
                                    <h4 className="text-base sm:text-lg font-bold text-slate-100 flex-1 leading-snug">
                                        <span className="text-teal-400 mr-1.5 font-black italic">Q{index + 1}.</span> {sanitizeQuestionText(q.questionText)}
                                    </h4>
                                    <div className="flex gap-2 shrink-0">
                                        <div className="px-3 py-1.5 rounded-xl border border-emerald-500/20 bg-emerald-500/10 flex items-center gap-2">
                                            <span className="text-[8px] sm:text-[9px] font-black uppercase text-slate-400">Tech</span>
                                            <span className="text-xs font-black text-emerald-400">{q.technicalScore}%</span>
                                        </div>
                                        <div className="px-3 py-1.5 rounded-xl border border-blue-500/20 bg-blue-500/10 flex items-center gap-2">
                                            <span className="text-[8px] sm:text-[9px] font-black uppercase text-slate-400">Conf</span>
                                            <span className="text-xs font-black text-blue-400">{q.confidenceScore}%</span>
                                        </div>
                                    </div>
                                </div>

                                {/* --- User's Submission Display (Corrected) --- */}
                                <div className="space-y-3">
                                    <label className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] block ml-1">Your Submission</label>
                                    <div className="bg-slate-950/60 rounded-2xl border border-white/5 overflow-hidden">

                                        {/* Display Code if available */}
                                        {q.userSubmittedCode && q.userSubmittedCode !== "undefined" && (
                                            <div className="p-4 sm:p-5 border-b border-white/5 last:border-0">
                                                <span className="text-[9px] font-black text-slate-500 uppercase mb-2 block">Code</span>
                                                <pre className="text-xs font-mono text-slate-300 whitespace-pre-wrap overflow-x-auto">
                                                    {q.userSubmittedCode}
                                                </pre>
                                            </div>
                                        )}

                                        {/* Display Transcript if available */}
                                        {q.userAnswerText && (
                                            <div className="p-4 sm:p-5">
                                                <span className="text-[9px] font-black text-slate-500 uppercase mb-2 block">Transcript</span>
                                                <p className="text-xs text-slate-400 italic leading-relaxed">
                                                    "{q.userAnswerText}"
                                                </p>
                                            </div>
                                        )}

                                        {/* Fallback if nothing was recorded */}
                                        {(!q.userSubmittedCode || q.userSubmittedCode === "undefined") && !q.userAnswerText && (
                                            <div className="p-5 text-center text-slate-500 text-xs italic">
                                                No answer recorded.
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Feedback & Ideal Answer Grid */}
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 pt-6 border-t border-white/5">
                                    <div className="space-y-3">
                                        <label className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] block ml-1">AI Analytical Feedback</label>
                                        <div className="bg-teal-500/5 p-4 sm:p-5 rounded-2xl text-xs sm:text-sm italic text-teal-300/95 border-l-[4px] border-teal-500 border border-white/5 leading-relaxed">
                                            "{q.aiFeedback}"
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] block ml-1">Ideal Implementation</label>
                                        <pre className="bg-slate-950 text-slate-300 p-4 sm:p-5 rounded-2xl text-[11px] sm:text-xs overflow-x-auto whitespace-pre-wrap font-mono shadow-inner border border-white/5 leading-relaxed">
                                            {formatIdealAnswer(q.idealAnswer)}
                                        </pre>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default SessionReview;