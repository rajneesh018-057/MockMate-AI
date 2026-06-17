import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { login, googleLogin, reset } from "../features/auth/authSlice";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { GoogleLogin } from "@react-oauth/google";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const { email, password } = formData;

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    if (isError) {
      toast.error(message);
      dispatch(reset());
    }

    if (isSuccess || user) {
      navigate("/");
      dispatch(reset());
    }
  }, [user, isError, isSuccess, message, navigate, dispatch]);

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const onSubmit = (e) => {
    e.preventDefault();

    dispatch(
      login({
        email,
        password,
      })
    );
  };

  const handleGoogleSuccess = (credentialResponse) => {
    if (credentialResponse.credential) {
      dispatch(googleLogin(credentialResponse.credential));
    } else {
      toast.error("Something went wrong. Please try again.");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-slate-950">
        <div className="h-14 w-14 rounded-full border-4 border-teal-500 border-t-transparent animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 py-10 overflow-hidden bg-slate-950 font-sans">
      {/* Background Glow Orbs */}
      <div className="absolute top-[20%] left-[10%] h-[400px] w-[400px] rounded-full bg-teal-500/10 blur-[130px] pointer-events-none" />
      <div className="absolute bottom-[20%] right-[10%] h-[400px] w-[400px] rounded-full bg-cyan-500/10 blur-[130px] pointer-events-none" />

      {/* Card */}
      <div className="relative z-10 w-full max-w-md page-enter">
        <div className="glass-card rounded-[2rem] p-8 md:p-10 shadow-2xl">
          {/* Logo & Header */}
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center justify-center h-14 w-14 rounded-2xl bg-gradient-to-r from-teal-500 to-cyan-500 mb-5 shadow-lg shadow-teal-500/35 hover:scale-105 transition duration-300">
              <span className="text-xl font-black text-white">MM</span>
            </Link>

            <h2 className="text-[10px] font-black tracking-[0.3em] uppercase text-teal-400 mb-2">
              MOCKMATE AI
            </h2>

            <h1 className="text-3xl font-extrabold text-white">
              Welcome <span className="bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-cyan-400">Back</span>
            </h1>

            <p className="text-slate-400 mt-2 text-xs font-semibold">
              Practice interviews, get graded by AI, clear your rounds.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={onSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-[10px] uppercase tracking-wider font-extrabold text-slate-400 mb-2 ml-1">
                Email Address
              </label>

              <input
                type="email"
                name="email"
                value={email}
                placeholder="name@company.com"
                onChange={onChange}
                required
                className="w-full px-4 py-3 rounded-xl glass-input text-sm text-white placeholder:text-slate-500"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-[10px] uppercase tracking-wider font-extrabold text-slate-400 mb-2 ml-1">
                Password
              </label>

              <input
                type="password"
                name="password"
                value={password}
                placeholder="••••••••"
                onChange={onChange}
                required
                className="w-full px-4 py-3 rounded-xl glass-input text-sm text-white placeholder:text-slate-500"
              />
            </div>

            {/* Forgot Password */}
            <div className="flex justify-end">
              <Link
                to="/forgot-password"
                className="text-xs text-teal-400 hover:text-teal-300 transition-colors font-bold"
              >
                Forgot Password?
              </Link>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              className="
                group
                relative
                overflow-hidden
                w-full
                py-3.5
                rounded-xl
                font-extrabold
                text-sm
                text-white
                bg-gradient-to-r
                from-teal-500
                via-cyan-500
                to-blue-500
                hover:scale-[1.02]
                transition-all
                duration-300
                shadow-[0_0_20px_rgba(20,184,166,0.25)]
                hover:shadow-[0_0_30px_rgba(20,184,166,0.5)]
              "
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                Login to Account
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4.5 w-4.5 transition-transform group-hover:translate-x-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </span>
            </button>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center">
            <div className="flex-1 border-t border-white/5"></div>
            <span className="px-3 text-[9px] font-black uppercase tracking-[0.2em] text-slate-500">
              Or Continue With
            </span>
            <div className="flex-1 border-t border-white/5"></div>
          </div>

          {/* Google Login */}
          <div className="flex justify-center">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => toast.error("Google login failed")}
              theme="filled_black"
              size="large"
              text="continue_with"
              shape="pill"
            />
          </div>

          {/* Register */}
          <p className="text-center text-slate-400 mt-6 text-xs font-semibold">
            New here?{" "}
            <Link
              to="/register"
              className="text-teal-400 font-bold hover:text-teal-300 transition"
            >
              Create free account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;