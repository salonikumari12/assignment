import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Zap, Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";

const RegisterPage = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password.length < 6) {
      return toast.error("Password must be at least 6 characters");
    }
    setLoading(true);
    try {
      await register(form.name, form.email, form.password);
      toast.success("Account created! Welcome 🎉");
      navigate("/dashboard");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[radial-gradient(ellipse_at_50%_0%,_rgba(139,92,246,0.12)_0%,_transparent_60%),_var(--color-base)]">
      <div className="w-full max-w-[400px]">
        {/* Brand */}
        <div className="text-center mb-8">
          <div className="w-[52px] h-[52px] rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center mx-auto mb-4 shadow-[0_8px_24px_rgba(99,102,241,0.4)]">
            <Zap size={24} color="white" />
          </div>
          <h1 className="text-3xl font-extrabold text-[#f1f1f5]">
            Join TaskFlow
          </h1>
          <p className="text-[#5a5a72] mt-1 text-sm">
            The first account gets Admin access
          </p>
        </div>

        <div className="bg-[#13131a] border border-white/10 rounded-2xl p-7 transition-all hover:border-white/15 hover:shadow-[0_4px_24px_rgba(99,102,241,0.06)]">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="block text-[13px] font-medium text-[#9191a8] mb-1.5">Full Name</label>
              <input
                id="reg-name"
                type="text"
                className="w-full px-3.5 py-2.5 bg-white/5 border border-white/10 rounded-lg text-[#f1f1f5] text-sm transition-all focus:border-indigo-500 focus:shadow-[0_0_0_3px_rgba(99,102,241,0.15)] outline-none"
                placeholder="John Doe"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
                autoFocus
              />
            </div>

            <div>
              <label className="block text-[13px] font-medium text-[#9191a8] mb-1.5">Username or Email</label>
              <input
                id="reg-email"
                type="text"
                className="w-full px-3.5 py-2.5 bg-white/5 border border-white/10 rounded-lg text-[#f1f1f5] text-sm transition-all focus:border-indigo-500 focus:shadow-[0_0_0_3px_rgba(99,102,241,0.15)] outline-none"
                placeholder="admin1 or you@example.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
            </div>

            <div>
              <label className="block text-[13px] font-medium text-[#9191a8] mb-1.5">Password</label>
              <div className="relative">
                <input
                  id="reg-password"
                  type={showPass ? "text" : "password"}
                  className="w-full px-3.5 py-2.5 pr-11 bg-white/5 border border-white/10 rounded-lg text-[#f1f1f5] text-sm transition-all focus:border-indigo-500 focus:shadow-[0_0_0_3px_rgba(99,102,241,0.15)] outline-none"
                  placeholder="Min. 6 characters"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 bg-transparent border-none cursor-pointer text-[#5a5a72] flex items-center p-1"
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              id="reg-submit"
              type="submit"
              className="mt-1 w-full flex justify-center items-center gap-1.5 bg-gradient-to-br from-indigo-500 to-violet-500 text-white shadow-[0_4px_14px_rgba(99,102,241,0.35)] hover:shadow-[0_6px_20px_rgba(99,102,241,0.5)] hover:-translate-y-px px-4 py-2.5 text-sm font-medium rounded-lg transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none border-none"
              disabled={loading}
            >
              {loading ? "Creating account..." : "Create Account"}
            </button>
          </form>
        </div>

        <p className="text-center mt-5 text-sm text-[#5a5a72]">
          Already have an account?{" "}
          <Link to="/login" className="text-indigo-500 no-underline font-medium hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
