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
    <div className="relative min-h-screen flex items-center justify-center px-4 py-10 overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-black">
      {/* Background Glow */}
      <div className="absolute top-20 left-20 h-72 w-72 rounded-full bg-teal-500/20 blur-[120px]" />
      <div className="absolute bottom-20 right-20 h-72 w-72 rounded-full bg-cyan-500/20 blur-[120px]" />

      {/* Card */}
      <div className="relative z-10 w-full max-w-md">
        <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl shadow-2xl p-8 md:p-10">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-gradient-to-r from-teal-500 to-cyan-500 mb-5 shadow-lg shadow-teal-500/30">
              <span className="text-2xl font-black text-white">AI</span>
            </div>

            <h2 className="text-xs font-black tracking-[0.4em] uppercase text-teal-400 mb-3">
            MOCKMIND
            </h2>

            <h1 className="text-4xl font-black text-white">
              Welcome <span className="text-teal-400">Back</span>
            </h1>

            <p className="text-slate-400 mt-3 text-sm">
              Practice interviews, improve skills and land your dream job.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={onSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-xs uppercase tracking-wider font-bold text-slate-400 mb-2">
                Email Address
              </label>

              <input
                type="email"
                name="email"
                value={email}
                placeholder="john@example.com"
                onChange={onChange}
                required
                className="
                  w-full
                  px-4
                  py-4
                  rounded-2xl
                  bg-slate-800/60
                  border
                  border-slate-700
                  text-white
                  placeholder:text-slate-500
                  focus:outline-none
                  focus:ring-2
                  focus:ring-teal-500/40
                  focus:border-teal-500
                  transition-all
                "
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs uppercase tracking-wider font-bold text-slate-400 mb-2">
                Password
              </label>

              <input
                type="password"
                name="password"
                value={password}
                placeholder="••••••••"
                onChange={onChange}
                required
                className="
                  w-full
                  px-4
                  py-4
                  rounded-2xl
                  bg-slate-800/60
                  border
                  border-slate-700
                  text-white
                  placeholder:text-slate-500
                  focus:outline-none
                  focus:ring-2
                  focus:ring-teal-500/40
                  focus:border-teal-500
                  transition-all
                "
              />
            </div>

            {/* Forgot Password */}
            <div className="flex justify-end">
              <Link
                to="/forgot-password"
                className="text-sm text-teal-400 hover:text-teal-300 transition"
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
                py-4
                rounded-2xl
                font-bold
                text-white
                bg-gradient-to-r
                from-teal-500
                via-cyan-500
                to-blue-500
                hover:scale-[1.02]
                transition-all
                duration-300
                shadow-[0_0_25px_rgba(20,184,166,0.35)]
                hover:shadow-[0_0_40px_rgba(20,184,166,0.7)]
              "
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                Login to Account

                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 transition-transform group-hover:translate-x-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </span>

              <div
                className="
                  absolute
                  inset-0
                  bg-white/10
                  translate-x-[-100%]
                  skew-x-12
                  group-hover:translate-x-[100%]
                  transition-transform
                  duration-1000
                "
              />
            </button>
          </form>

          {/* Divider */}
          <div className="my-8 flex items-center">
            <div className="flex-1 border-t border-slate-700"></div>

            <span className="px-4 text-xs font-bold uppercase tracking-[0.3em] text-slate-500">
              Or Continue With
            </span>

            <div className="flex-1 border-t border-slate-700"></div>
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
          <p className="text-center text-slate-400 mt-8">
            New here?{" "}
            <Link
              to="/register"
              className="text-teal-400 font-semibold hover:text-teal-300 transition"
            >
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;