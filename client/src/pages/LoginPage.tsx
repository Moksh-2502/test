import { zodResolver } from "../utils/forms";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";
import { useAuth } from "../components/AuthProvider";
import { useState } from "react";

const schema = z.object({ email: z.string().email(), password: z.string().min(1, "Password is required") });

export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    const parsed = zodResolver(schema, form);
    if (!parsed.ok) return setError(parsed.message);
    try {
      await login(form.email, form.password);
      navigate("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    }
  }

  return (
    <main className="auth-page">
      <form className="auth-card" onSubmit={submit}>
        <span className="eyebrow">MathSprint</span>
        <h1>Student login</h1>
        <label>Email<input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></label>
        <label>Password<input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} /></label>
        {error && <p className="form-error">{error}</p>}
        <button className="primary-button">Login</button>
        <p>New here? <Link to="/register">Create account</Link></p>
      </form>
    </main>
  );
}
