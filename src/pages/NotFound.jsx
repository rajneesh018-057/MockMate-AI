import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
     <div className="text-center py-16 sm:py-20 glass-card rounded-[2rem] shadow-2xl max-w-xl mx-auto mt-12 sm:mt-24 border border-white/5 px-6 font-sans page-enter">
       <h1 className="text-8xl sm:text-9xl font-black text-slate-800 tracking-tighter">404</h1>
       <h2 className="text-xl sm:text-2xl font-extrabold text-white mt-4 uppercase tracking-wide">Page Not Found</h2>
       <p className="text-slate-400 mt-2.5 mb-8 text-xs font-semibold">The interview module you're looking for doesn't exist.</p>
       <Link to="/" className="inline-block bg-gradient-to-r from-teal-500 to-cyan-500 text-white px-8 py-3.5 rounded-xl text-xs font-extrabold uppercase tracking-widest shadow-lg hover:scale-[1.02] active:scale-95 transition-all">
         Back to Home
       </Link>
     </div>
  );
};

export default NotFound;
