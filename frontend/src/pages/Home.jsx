import React from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

const Home = () => {
  const { user } = useSelector((state) => state.auth);

  return (
    <div className="relative min-h-screen bg-slate-950 text-slate-100 overflow-hidden">
      {/* Background radial glow orbs */}
      <div className="absolute top-[-10%] left-[-20%] w-[80%] h-[60%] rounded-full bg-gradient-to-br from-teal-500/10 to-indigo-500/0 blur-[130px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-20%] w-[80%] h-[60%] rounded-full bg-gradient-to-br from-cyan-500/10 to-blue-500/0 blur-[130px] pointer-events-none" />

      {/* Public Navbar */}
      <header className="relative z-10 max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="flex items-center justify-center h-10 w-10 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 shadow-lg shadow-teal-500/30">
            <span className="text-base font-black text-white">MM</span>
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-white tracking-wider text-base uppercase leading-none">
              MockMate
            </span>
            <span className="text-[9px] font-bold text-teal-400 tracking-[0.2em] uppercase mt-0.5">
              AI Interviewer
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {user ? (
            <Link
              to="/dashboard"
              className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-teal-500 to-cyan-500 hover:scale-[1.03] shadow-md shadow-teal-500/20 transition-all duration-300"
            >
              Go to Dashboard
            </Link>
          ) : (
            <>
              <Link
                to="/login"
                className="text-xs font-bold text-slate-400 hover:text-white transition"
              >
                Log In
              </Link>
              <Link
                to="/register"
                className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-white/10 hover:bg-white/15 border border-white/10 transition"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 pt-16 pb-20 text-center">
        <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-300 mb-8 animate-pulse-glow">
          <span className="h-2 w-2 rounded-full bg-teal-400" />
          <span className="text-[10px] font-extrabold uppercase tracking-widest">
            Simulate & Succeed with Gemini AI
          </span>
        </div>

        <h1 className="text-5xl md:text-7xl font-extrabold text-white tracking-tight leading-[1.1] max-w-4xl mx-auto">
          Ace Your Next <br className="hidden md:inline" />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-teal-400 via-cyan-400 to-blue-500">
            Technical Interview
          </span>
        </h1>

        <p className="mt-6 text-slate-400 text-base md:text-lg max-w-2xl mx-auto leading-relaxed font-medium">
          MockMate generates targeted questions, records voice descriptions,
          accepts code submissions via an integrated Monaco editor, and yields deep AI-driven scorecard feedback.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row justify-center items-center gap-4">
          <Link
            to={user ? "/dashboard" : "/register"}
            className="w-full sm:w-auto px-8 py-4 rounded-2xl font-bold text-white bg-gradient-to-r from-teal-500 via-cyan-500 to-blue-500 shadow-xl shadow-teal-500/20 hover:scale-[1.03] transition-all duration-300"
          >
            Start Preparing Free →
          </Link>
          <a
            href="#features"
            className="w-full sm:w-auto px-8 py-4 rounded-2xl font-bold text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition"
          >
            Explore Features
          </a>
        </div>

        {/* Hero Visual Mockup */}
        <div className="mt-16 max-w-5xl mx-auto p-2 bg-gradient-to-b from-white/10 to-transparent border border-white/10 rounded-[2.5rem] shadow-2xl relative">
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 to-transparent z-10" />
          <div className="bg-slate-900 rounded-[2rem] overflow-hidden p-6 md:p-10 text-left border border-white/5 flex flex-col md:flex-row gap-6 relative">
            <div className="flex-1 space-y-4">
              <div className="h-2 w-16 bg-teal-500 rounded-full" />
              <div className="h-6 w-3/4 bg-slate-800 rounded-lg" />
              <div className="space-y-2">
                <div className="h-4 w-full bg-slate-800 rounded-md" />
                <div className="h-4 w-5/6 bg-slate-800 rounded-md" />
                <div className="h-4 w-4/5 bg-slate-800 rounded-md" />
              </div>
              <div className="pt-6 flex gap-4">
                <div className="h-12 w-12 rounded-full bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400">🎤</div>
                <div className="h-12 w-40 bg-slate-800 rounded-xl" />
              </div>
            </div>
            <div className="flex-1 bg-slate-950/80 border border-white/5 rounded-2xl p-4 font-mono text-xs text-slate-500">
              <span className="text-teal-400">const</span> evaluateAnswer = (<span className="text-amber-400">code</span>) =&gt; &#123;<br />
              &nbsp;&nbsp;<span className="text-slate-400">// Processing verbal and text feedback</span><br />
              &nbsp;&nbsp;<span className="text-teal-400">const</span> confidence = analyzeConfidenceAudio();<br />
              &nbsp;&nbsp;<span className="text-teal-400">return</span> Gemini.evaluate(&#123; code, confidence &#125;);<br />
              &#125;;
            </div>
          </div>
        </div>
      </section>

      {/* Stats Counter Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-10 border-y border-white/5 bg-slate-900/40 backdrop-blur-sm">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div>
            <p className="text-4xl font-extrabold text-white">10,000+</p>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-2">Questions Generated</p>
          </div>
          <div>
            <p className="text-4xl font-extrabold text-teal-400">98.5%</p>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-2">Evaluation Accuracy</p>
          </div>
          <div>
            <p className="text-4xl font-extrabold text-white">20+</p>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-2">Prepped Tech Roles</p>
          </div>
        </div>
      </section>

      {/* Features Grid Section */}
      <section id="features" className="relative z-10 max-w-7xl mx-auto px-6 py-24">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-black text-teal-400 uppercase tracking-[0.2em]">Robust Tech Suite</span>
          <h2 className="text-3xl md:text-5xl font-extrabold mt-3">Simulate Under Real Pressure</h2>
          <p className="text-slate-400 mt-4 font-medium">Everything you need to replicate actual enterprise screening processes.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              icon: "🛠️",
              title: "Customizable Roles",
              desc: "Choose between MERN, Java, DevOps, Python, AI/ML, and UI/UX Designer templates customized dynamically for difficulty."
            },
            {
              icon: "🎙️",
              title: "Whisper Voice Transcripts",
              desc: "Record answers verbally. Whisper API transcribes speech to evaluate depth, structure, and verbal confidence levels."
            },
            {
              icon: "💻",
              title: "Monaco Editor Playground",
              desc: "Code solutions directly inside VS Code's editor engine, utilizing multiple support syntaxes and languages."
            },
            {
              icon: "📊",
              title: "Gemini Smart Evaluation",
              desc: "Receive breakdown score feedback, technical accuracy reviews, and ideal response implementations for every single answer."
            }
          ].map((item, index) => (
            <div key={index} className="glass-card glass-card-hover rounded-3xl p-8 flex flex-col transition-all duration-300">
              <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center text-xl mb-6 shadow-sm">
                {item.icon}
              </div>
              <h3 className="text-lg font-bold text-white mb-3">{item.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed font-medium mt-auto">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Process Flow Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-20 bg-gradient-to-b from-slate-900/40 to-transparent border-t border-white/5 rounded-[3rem] my-10">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-black text-teal-400 uppercase tracking-[0.2em]">Step-By-Step Workflow</span>
          <h2 className="text-3xl md:text-5xl font-extrabold mt-3">How MockMate Works</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-5xl mx-auto relative">
          <div className="hidden md:block absolute top-[40px] left-[15%] right-[15%] h-0.5 bg-gradient-to-r from-teal-500/20 via-cyan-500/20 to-transparent z-0" />
          {[
            { step: "01", title: "Select Configuration", desc: "Set target tech role, difficulty level, answer length, and oral vs coding balance." },
            { step: "02", title: "Answer the Questions", desc: "Interact dynamically, coding solutions and recording explanations under real simulation." },
            { step: "03", title: "Review Performance", desc: "Get comprehensive dashboard score stats, visual chart feedback, and ideal implementation examples." }
          ].map((flow, idx) => (
            <div key={idx} className="relative z-10 flex flex-col items-center text-center px-4">
              <div className="h-16 w-16 bg-slate-900 border border-white/10 rounded-2xl flex items-center justify-center font-extrabold text-teal-400 shadow-xl mb-6 text-xl">
                {flow.step}
              </div>
              <h3 className="text-lg font-bold text-white mb-2">{flow.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed font-medium">{flow.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Footer Banner */}
      <section className="relative z-10 max-w-5xl mx-auto px-6 py-20 text-center">
        <div className="glass-card rounded-[2.5rem] p-10 md:p-16 border border-white/10 relative overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-teal-500/5 blur-[120px]" />
          <h2 className="text-3xl md:text-5xl font-extrabold text-white">
            Ready to Land Your Dream Job?
          </h2>
          <p className="mt-4 text-slate-400 max-w-md mx-auto text-sm md:text-base font-medium">
            Join thousands of developers using MockMate to confidently clear their engineering rounds.
          </p>
          <div className="mt-8">
            <Link
              to={user ? "/dashboard" : "/register"}
              className="inline-block px-8 py-4 rounded-2xl font-bold text-white bg-gradient-to-r from-teal-500 to-cyan-500 shadow-xl shadow-teal-500/20 hover:scale-[1.03] transition-all"
            >
              Start Your First Session
            </Link>
          </div>
        </div>
      </section>

      {/* Footer copyright */}
      <footer className="relative z-10 border-t border-white/5 py-8 text-center text-xs text-slate-500">
        <p>© {new Date().getFullYear()} MockMate AI. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Home;
