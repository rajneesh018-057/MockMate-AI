import React, { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../features/auth/authSlice";

const Header = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  if (!user) return null;

  return (
    <nav className="sticky top-0 z-50 w-full bg-slate-950/80 backdrop-blur-md border-b border-white/5 px-4 py-3.5">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="flex items-center justify-center h-10 w-10 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 shadow-md shadow-teal-500/25 group-hover:scale-105 transition-all duration-300">
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
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6">
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              `text-sm font-semibold tracking-wide transition-all duration-200 px-3.5 py-2 rounded-xl ${
                isActive
                  ? "bg-teal-500/10 text-teal-300 border border-teal-500/20 shadow-sm"
                  : "text-slate-400 hover:text-white hover:bg-white/5 border border-transparent"
              }`
            }
          >
            Dashboard
          </NavLink>
          <NavLink
            to="/profile"
            className={({ isActive }) =>
              `text-sm font-semibold tracking-wide transition-all duration-200 px-3.5 py-2 rounded-xl ${
                isActive
                  ? "bg-teal-500/10 text-teal-300 border border-teal-500/20 shadow-sm"
                  : "text-slate-400 hover:text-white hover:bg-white/5 border border-transparent"
              }`
            }
          >
            Profile
          </NavLink>
        </div>

        {/* Desktop User profile & Logout */}
        <div className="hidden md:flex items-center gap-4">
          <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-2xl pl-3 pr-4 py-1.5">
            <div className="h-7 w-7 rounded-lg bg-teal-500/20 border border-teal-500/30 flex items-center justify-center text-teal-400 font-extrabold text-xs">
              {user.name ? user.name.charAt(0).toUpperCase() : "U"}
            </div>
            <span className="text-xs font-semibold text-slate-300 truncate max-w-[120px]">
              {user.name}
            </span>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-bold text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl border border-transparent hover:border-rose-500/20 transition-all duration-200"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2.5"
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
            Logout
          </button>
        </div>

        {/* Mobile menu button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 text-slate-400 hover:text-white rounded-lg hover:bg-white/5 transition"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {mobileMenuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden mt-3 p-4 bg-slate-900 border border-white/5 rounded-2xl flex flex-col gap-3.5 animate-in fade-in duration-200">
          <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl px-3 py-2.5">
            <div className="h-8 w-8 rounded-lg bg-teal-500/20 border border-teal-500/30 flex items-center justify-center text-teal-400 font-extrabold text-sm">
              {user.name ? user.name.charAt(0).toUpperCase() : "U"}
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-bold text-white leading-none">
                {user.name}
              </span>
              <span className="text-[10px] text-slate-400 mt-1">
                {user.email}
              </span>
            </div>
          </div>

          <NavLink
            to="/dashboard"
            onClick={() => setMobileMenuOpen(false)}
            className={({ isActive }) =>
              `text-sm font-semibold p-2.5 rounded-xl block ${
                isActive
                  ? "bg-teal-500/10 text-teal-300 border border-teal-500/10"
                  : "text-slate-400 hover:text-white"
              }`
            }
          >
            Dashboard
          </NavLink>
          <NavLink
            to="/profile"
            onClick={() => setMobileMenuOpen(false)}
            className={({ isActive }) =>
              `text-sm font-semibold p-2.5 rounded-xl block ${
                isActive
                  ? "bg-teal-500/10 text-teal-300 border border-teal-500/10"
                  : "text-slate-400 hover:text-white"
              }`
            }
          >
            Profile
          </NavLink>

          <div className="border-t border-white/5 pt-2.5 mt-1">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                handleLogout();
              }}
              className="w-full flex items-center gap-2 p-2.5 text-sm font-semibold text-rose-400 hover:bg-rose-500/10 rounded-xl transition"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
              Logout Account
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Header;
