import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(form.email, form.password);
      const redirectTo = location.state?.from || "/dashboard";
      navigate(redirectTo, { replace: true });
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-xl py-16 md:py-24">
      <div className="max-w-md mx-auto bg-white border border-stone-line rounded-sm p-8 md:p-10">
        <p className="section-eyebrow mb-2">Welcome back</p>
        <h1 className="font-display text-3xl font-medium mb-8">Sign in to your account</h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="text-xs font-mono uppercase tracking-wide text-ink/50">Email</label>
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="input-field mt-1"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="text-xs font-mono uppercase tracking-wide text-ink/50">Password</label>
            <input
              type="password"
              required
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="input-field mt-1"
              placeholder="••••••••"
            />
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full !py-3 disabled:opacity-60">
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p className="text-sm text-ink/60 mt-6 text-center">
          Don't have an account?{" "}
          <Link to="/register" className="text-brass font-medium hover:underline">
            Create one
          </Link>
        </p>

        <div className="mt-6 pt-6 border-t border-stone-line text-xs text-ink/40 text-center leading-relaxed">
          Demo admin: admin@realestate.com / admin123
          <br />
          (only valid after running <code>npm run seed</code> on the server)
        </div>
      </div>
    </div>
  );
};

export default Login;
