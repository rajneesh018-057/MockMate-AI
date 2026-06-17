const SessionCard = ({ session, onClick, onDelete }) => {

    const isDeletable = session.status !== 'pending';
    const getIcon = () => {
        const r = session.role;

        if (r.includes('Python')) return '🐍';
        if (r.includes('MERN') || r.includes('MEAN') || r.includes('React') || r.includes('Frontend')) return '⚛️';
        if (r.includes('Data') || r.includes('Machine') || r.includes('AI')) return '📊';
        if (r.includes('DevOps') || r.includes('Cloud') || r.includes('SRE')) return '☁️';
        if (r.includes('Security') || r.includes('Cyber')) return '🛡️';
        if (r.includes('Blockchain') || r.includes('Web3')) return '⛓️';
        if (r.includes('Mobile') || r.includes('iOS') || r.includes('Android')) return '📱';
        if (r.includes('Game')) return '🎮';
        if (r.includes('UI') || r.includes('UX') || r.includes('Designer')) return '🎨';
        if (r.includes('QA') || r.includes('Test')) return '🧪';
        if (r.includes('Product') || r.includes('Manager')) return '📝';
        if (r.includes('Java') || r.includes('Backend')) return '☕';

        return '💻'; // Default
    };
    const statusColor =
      session.status === "completed"
        ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
        : session.status === "in-progress"
        ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
        : "bg-teal-500/10 text-teal-400 border border-teal-500/20";

    const iconBg =
      session.status === "completed"
        ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
        : "bg-teal-500/10 text-teal-400 border border-teal-500/20";

    const scoreColor =
      session.status === "completed"
        ? session.overallScore > 75
          ? "text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.3)]"
          : "text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.3)]"
        : "text-slate-500";

    return (
        <div onClick={() => onClick(session)} className="group glass-card rounded-[2rem] p-5 sm:p-6 flex flex-col md:flex-row items-center gap-4 transition-all duration-300 hover:border-teal-500/30 hover:shadow-[0_10px_35px_-10px_rgba(20,184,166,0.15)] active:scale-[0.99] cursor-pointer">
            <div className="flex items-center gap-4 sm:gap-6 w-full md:w-auto flex-grow">
                <div className={`w-12 h-12 sm:w-14 sm:h-14 shrink-0 rounded-xl sm:rounded-2xl flex items-center justify-center text-xl sm:text-2xl shadow-sm ${iconBg}`}>{getIcon()}</div>
                <div className="overflow-hidden">
                    <h3 className="font-extrabold text-white text-base sm:text-lg truncate group-hover:text-teal-400 transition-colors">{session.role}</h3>
                    <div className="flex items-center gap-2.5 text-[9px] font-bold text-slate-500 mt-1 uppercase tracking-wider">
                        <span>{new Date(session.createdAt).toLocaleDateString()}</span>
                        <span className="h-1 w-1 rounded-full bg-slate-700" />
                        <span className="text-slate-300 bg-white/5 border border-white/10 px-2 py-0.5 rounded-md">{session.level}</span>
                    </div>
                </div>
            </div>

            <div className="flex items-center justify-between md:justify-end gap-6 w-full md:w-auto border-t md:border-t-0 border-white/5 pt-3 md:pt-0">
                <div className="text-left md:text-center">
                    <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Global Score</p>
                    <p className={`text-xl sm:text-2xl font-black mt-0.5 ${scoreColor}`}>
                        {session.status === "completed" ? `${session.overallScore}%` : "--"}
                    </p>
                </div>

                <div className="flex flex-col items-end gap-1.5">
                    <span className={`px-2.5 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest ${statusColor}`}>{session.status}</span>
                    <span className="text-teal-400 font-bold text-xs flex items-center transition-transform group-hover:translate-x-0.5">
                      {session.status === "completed" ? "Results" : "Resume"}
                        <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 5l7 7-7 7"></path>
                        </svg>
                    </span>
                </div>
            </div>

            <div className="hidden md:block w-px h-10 bg-white/5 mx-2"></div>

            <button onClick={(e) => { e.stopPropagation(); if (isDeletable) onDelete(e, session._id) }} className="p-2.5 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl transition-all" title="Delete Session">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
            </button>
        </div>
    )
}

export default SessionCard
