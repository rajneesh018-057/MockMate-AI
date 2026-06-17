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
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-slate-950 px-4 py-10 font-sans">
      
      {/* Background Effects */}
      <div className="absolute top-[10%] left-[10%] w-[400px] h-[400px] bg-cyan-500/10 blur-[130px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-[10%] right-[10%] w-[400px] h-[400px] bg-blue-500/10 blur-[130px] rounded-full pointer-events-none"></div>

      <div className="relative z-10 w-full max-w-lg page-enter">
        <div className="glass-card rounded-[2rem] p-8 shadow-2xl">

          {/* Header */}
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex w-14 h-14 mx-auto rounded-2xl bg-gradient-to-r from-teal-500 to-cyan-500 items-center justify-center text-white text-xl font-black shadow-lg shadow-teal-500/30 hover:scale-105 transition duration-300">
              MM
            </Link>

            <h2 className="mt-5 text-teal-400 text-[10px] tracking-[0.3em] uppercase font-bold">
              MockMate AI
            </h2>

            <h1 className="mt-3 text-3xl font-extrabold text-white">
              Create <span className="bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-cyan-400">Account</span>
            </h1>

            <p className="text-slate-400 mt-2 text-xs font-semibold">
              Join thousands of developers preparing smarter with AI.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={onSubmit} className="space-y-5">

            <div>
              <label className="text-[10px] uppercase tracking-wider text-slate-400 font-extrabold ml-1">
                Full Name
              </label>

              <input
                type="text"
                name="name"
                value={name}
                onChange={onChange}
                placeholder="John Doe"
                required
                className="w-full mt-1.5 px-4 py-3 glass-input rounded-xl text-sm"
              />
            </div>

            <div>
              <label className="text-[10px] uppercase tracking-wider text-slate-400 font-extrabold ml-1">
                Email Address
              </label>

              <input
                type="email"
                name="email"
                value={email}
                onChange={onChange}
                placeholder="john@example.com"
                required
                className="w-full mt-1.5 px-4 py-3 glass-input rounded-xl text-sm"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">

              <div>
                <label className="text-[10px] uppercase tracking-wider text-slate-400 font-extrabold ml-1">
                  Password
                </label>

                <input
                  type="password"
                  name="password"
                  value={password}
                  onChange={onChange}
                  placeholder="••••••••"
                  required
                  className="w-full mt-1.5 px-4 py-3 glass-input rounded-xl text-sm"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase tracking-wider text-slate-400 font-extrabold ml-1">
                  Confirm Password
                </label>

                <input
                  type="password"
                  name="password2"
                  value={password2}
                  onChange={onChange}
                  placeholder="••••••••"
                  required
                  className="w-full mt-1.5 px-4 py-3 glass-input rounded-xl text-sm"
                />
              </div>

            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-teal-500 via-cyan-500 to-blue-500 text-white font-extrabold text-sm hover:scale-[1.02] transition-all shadow-lg shadow-teal-500/20"
            >
              Create Free Account →
            </button>
          </form>

          {/* Footer */}
          <div className="mt-8 text-center text-xs font-semibold">
            <p className="text-slate-400">
              Already have an account?
              <Link
                to="/login"
                className="ml-1.5 text-teal-400 font-bold hover:text-teal-300 transition"
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