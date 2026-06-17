import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { register, reset } from "../features/auth/authSlice";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    password2: "",
  });

  const { name, email, password, password2 } = formData;

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

    if (isSuccess) {
      toast.success("User Registered Successfully");
      navigate("/");
      dispatch(reset());
    }

    if (user && !isSuccess) {
      navigate("/");
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

    if (password !== password2) {
      toast.error("Passwords do not match");
      return;
    }

    const userData = {
      name,
      email,
      password,
    };

    dispatch(register(userData));
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-slate-950">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-slate-950 px-4 py-10">
      
      {/* Background Effects */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-cyan-500/20 blur-[140px] rounded-full"></div>

      <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500/20 blur-[140px] rounded-full"></div>

      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px]"></div>

      <div className="relative z-10 w-full max-w-lg">
        <div className="bg-slate-900/90 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 shadow-2xl">

          {/* Header */}
          <div className="text-center mb-8">

            <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-r from-cyan-500 to-blue-600 flex items-center justify-center text-white text-3xl font-black shadow-lg shadow-cyan-500/30">
              AI
            </div>

            <h2 className="mt-6 text-cyan-400 text-sm tracking-[0.4em] uppercase font-bold">
              MockMind
            </h2>

            <h1 className="mt-4 text-4xl font-black text-white">
              Create
              <span className="text-cyan-400"> Account</span>
            </h1>

            <p className="text-slate-400 mt-3">
              Join thousands of developers preparing smarter with AI.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={onSubmit} className="space-y-5">

            <div>
              <label className="text-xs uppercase tracking-wider text-slate-400 font-semibold">
                Full Name
              </label>

              <input
                type="text"
                name="name"
                value={name}
                onChange={onChange}
                placeholder="John Doe"
                required
                className="w-full mt-2 px-4 py-4 bg-slate-800 border border-slate-700 rounded-2xl text-white placeholder-slate-500 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 outline-none transition-all"
              />
            </div>

            <div>
              <label className="text-xs uppercase tracking-wider text-slate-400 font-semibold">
                Email Address
              </label>

              <input
                type="email"
                name="email"
                value={email}
                onChange={onChange}
                placeholder="john@example.com"
                required
                className="w-full mt-2 px-4 py-4 bg-slate-800 border border-slate-700 rounded-2xl text-white placeholder-slate-500 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 outline-none transition-all"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">

              <div>
                <label className="text-xs uppercase tracking-wider text-slate-400 font-semibold">
                  Password
                </label>

                <input
                  type="password"
                  name="password"
                  value={password}
                  onChange={onChange}
                  placeholder="••••••••"
                  required
                  className="w-full mt-2 px-4 py-4 bg-slate-800 border border-slate-700 rounded-2xl text-white placeholder-slate-500 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 outline-none transition-all"
                />
              </div>

              <div>
                <label className="text-xs uppercase tracking-wider text-slate-400 font-semibold">
                  Confirm Password
                </label>

                <input
                  type="password"
                  name="password2"
                  value={password2}
                  onChange={onChange}
                  placeholder="••••••••"
                  required
                  className="w-full mt-2 px-4 py-4 bg-slate-800 border border-slate-700 rounded-2xl text-white placeholder-slate-500 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 outline-none transition-all"
                />
              </div>

            </div>

            <button
              type="submit"
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-lg hover:scale-[1.02] transition-all shadow-lg shadow-cyan-500/20"
            >
              Create Free Account →
            </button>
          </form>

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-slate-400">
              Already have an account?
              <Link
                to="/login"
                className="ml-2 text-cyan-400 font-semibold hover:text-cyan-300"
              >
                Sign In
              </Link>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Register;