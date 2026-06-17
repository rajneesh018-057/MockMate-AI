import { useState, useEffect } from "react"
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { createSession, getSessions,reset,deleteSession } from '../features/sessions/sessionSlice'
import { toast } from 'react-toastify'
import SessionCard from "../components/SessionCard"

const ROLES = [
  "MERN Stack Developer",
  "MEAN Stack Developer",
  "Full Stack Python",
  "Full Stack Java",
  "Frontend Developer",
  "Backend Developer",
  "Data Scientist",
  "Data Analyst",
  "Machine Learning Engineer",
  "DevOps Engineer",
  "Cloud Engineer (AWS/Azure/GCP)",
  "Cybersecurity Engineer",
  "Blockchain Developer",
  "Mobile Developer (iOS/Android)",
  "Game Developer",
  "UI/UX Designer",
  "QA Automation Engineer",
  "Product Manager"
];
const LEVELS = ["Junior", "Mid-Level", "Senior"];
const TYPES = [{ label: 'Oral only', value: 'oral-only' }, { label: 'Coding Mix', value: 'coding-mix' }];
const COUNTS = [5, 10, 15];

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { sessions, isLoading, isGenerating, isError, message } = useSelector((state) => state.sessions);
  const isProcessing = isGenerating;

  const [formData, setFormData] = useState({
    role: user.preferredRole || ROLES[0],
    level: LEVELS[0],
    interviewType: TYPES[1].value,
    count: COUNTS[0],
  });

  useEffect(() => {
    dispatch(getSessions());
  }, [dispatch]);

  useEffect(() => {
    if (isError && message) {
      toast.error(message);
      dispatch(reset());
    }
  }, [isError, message, dispatch]);

  const onChange = (e) => {
    setFormData((prevState) => ({ ...prevState, [e.target.name]: e.target.value }));
  }

  const onSubmit = (e) => {
    e.preventDefault();
    dispatch(createSession(formData));
  }

  const viewSession = (session) => {
    if (session.status === 'completed') {
      navigate(`/review/${session._id}`);
    } else if(session.status === 'in-progress') {
      navigate(`/interview/${session._id}`);
    }else{
      toast.info('Session not ready yet')
    }
  }


  const handleDelete = (e, sessionId) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this session?')) {
      dispatch(deleteSession(sessionId));
      toast.error('Session Deleted')
    }
  }



  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-12 space-y-8 sm:space-y-12 animate-in duration-700 font-sans">

      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-6 sm:pb-8">
        <div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            Welcome, <span className="bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-cyan-400">{user.name.split(' ')[0]}</span>
          </h1>
          <p className="text-slate-400 mt-1 text-sm sm:text-base font-semibold">Ready for your technical prep?</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-teal-500/10 px-3.5 py-1.5 sm:px-4 sm:py-2.5 rounded-xl sm:rounded-2xl border border-teal-500/20 flex sm:block items-center gap-2">
            <p className="text-[10px] text-teal-400 font-black uppercase tracking-widest">Total Sessions</p>
            <p className="text-xl sm:text-2xl font-black text-white leading-none mt-1">{sessions.length}</p>
          </div>
        </div>
      </div>

      {/* New Interview Creation form */}
      <div className="glass-card rounded-3xl overflow-hidden border border-white/5 shadow-2xl">
        <div className="bg-slate-900/50 px-6 py-4.5 sm:px-8 sm:py-5 border-b border-white/5">
          <h2 className="text-base font-extrabold text-white flex items-center tracking-wide">
            <span className="bg-gradient-to-b from-teal-400 to-cyan-500 w-1.5 h-5 rounded-full mr-3"></span>
            NEW INTERVIEW SIMULATION
          </h2>
        </div>
        <form onSubmit={onSubmit} className="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6 items-end">
          <div className="space-y-1.5">
            <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Role</label>
            <select name="role" value={formData.role} onChange={onChange} className="w-full glass-input rounded-xl p-3 text-xs font-semibold text-slate-300">
              {ROLES.map((role) => <option key={role} className="bg-slate-950 text-slate-300" value={role}>{role}</option>)}</select>
          </div>
          <div className="grid grid-cols-2 gap-4 lg:contents">
            <div className="space-y-1.5">
              <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Level</label>
              <select name="level" value={formData.level} onChange={onChange} className="w-full glass-input rounded-xl p-3 text-xs font-semibold text-slate-300">
                {LEVELS.map((level) => <option key={level} className="bg-slate-950 text-slate-300" value={level}>{level}</option>)}</select>
            </div>
            <div className="space-y-1.5">
              <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Length</label>
              <select name="count" value={formData.count} onChange={onChange} className="w-full glass-input rounded-xl p-3 text-xs font-semibold text-slate-300">
                {COUNTS.map((count) => <option key={count} className="bg-slate-950 text-slate-300" value={count}>{count} Qs</option>)}</select>
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Type</label>
            <select name="interviewType" value={formData.interviewType} onChange={onChange} className="w-full glass-input rounded-xl p-3 text-xs font-semibold text-slate-300">
              {TYPES.map((type) => <option key={type.value} className="bg-slate-950 text-slate-300" value={type.value}>{type.label}</option>)}</select>
          </div>
          <button type="submit" disabled={isProcessing} className={`w-full h-[45px] rounded-xl font-bold text-white flex items-center justify-center gap-2 transition-all duration-300 shadow-md ${isProcessing ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-white/5' : 'bg-gradient-to-r from-teal-500 to-cyan-500 hover:shadow-lg hover:shadow-teal-500/10 hover:scale-[1.01]'}`}>
            {isProcessing ? <><span className="animate-spin h-4 w-4 border-2 border-slate-500 border-t-transparent rounded-full"></span> Generating...</> : <span className="text-xs font-extrabold uppercase tracking-wider">Start Interview</span>}
          </button>
        </form>
      </div>

      {/* History section */}
      <div className="space-y-6 pb-20 sm:pb-0">
        <h2 className="text-xl sm:text-2xl font-extrabold text-white flex items-center px-2">
          <span className="w-8 h-8 sm:w-10 sm:h-10 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center mr-3 text-sm sm:text-base">📊</span> 
          INTERVIEW HISTORY
        </h2>
        {isLoading && sessions.length === 0 ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin h-10 w-10 border-2 border-teal-500 border-t-transparent rounded-full"></div>
          </div>
        ) : (
          sessions.length === 0 ? (
            <div className="glass-card border border-white/5 rounded-3xl py-16 sm:py-20 text-center shadow-inner">
              <p className="text-slate-500 font-extrabold text-sm uppercase tracking-wider">No interview sessions found.</p>
              <p className="text-slate-600 text-xs mt-1">Configure options above to generate your first technical review.</p>
            </div>
          ) : (
            <div className="space-y-4.5">
              {sessions.map((session) => (
                <SessionCard key={session._id} session={session} onClick={viewSession} onDelete={handleDelete}/>
              ))}
            </div>
          )
        )}
      </div>

    </div>
  )
}
export default Dashboard
