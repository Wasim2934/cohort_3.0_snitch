import { useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, Eye, EyeOff } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { saveSession } from "../features/auth/authSlice.js";
import { persistSession, request } from "../lib/api.js";

export function AuthPage({ mode }) {
  const registering = mode === "register";
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const user = useSelector((state) => state.auth.user);
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "user" });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  if (user) return <Navigate to={user.role === "seller" ? "/seller" : "/shop"} replace />;

  async function submit(event) {
    event.preventDefault();
    setError("");
    setBusy(true);
    try {
      const result = await request(`/auth/${registering ? "register" : "login"}`, {
        method: "POST", auth: false,
        body: registering ? form : { email: form.email, password: form.password },
      });
      persistSession(result.data);
      dispatch(saveSession(result.data));
      navigate(location.state?.from || (result.data.user.role === "seller" ? "/seller" : "/shop"), { replace: true });
    } catch (submitError) {
      setError(submitError.details?.[0]?.msg || submitError.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-visual">
        <img src="https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1200&q=85" alt="Friends finding their own style" />
        <div className="auth-visual-overlay"><Link className="wordmark auth-mark" to="/shop">snitch<span>.</span></Link><p>Wear it<br /><em>your way.</em></p><span>STYLE IS PERSONAL. SO ARE WE.</span></div>
      </section>
      <section className="auth-form-side">
        <Link className="back-link" to="/shop"><ArrowLeft size={16} /> Back to the shop</Link>
        <div className="auth-form-wrap">
          <p className="eyebrow">{registering ? "A GOOD PLACE TO START" : "GOOD TO HAVE YOU BACK"}</p>
          <h1>{registering ? <>Make it <em>yours.</em></> : <>Welcome <em>back.</em></>}</h1>
          <p className="auth-intro">{registering ? "Create your account and find a new everyday." : "Sign in to pick up where you left off."}</p>
          {error && <p className="form-error" role="alert">{error}</p>}
          <form className="auth-form" onSubmit={submit}>
            {registering && <label>Your name<input autoComplete="name" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} placeholder="Alex Morgan" required minLength="2" maxLength="50" /></label>}
            <label>Email address<input type="email" autoComplete="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} placeholder="you@example.com" required /></label>
            <label>Password<span className="password-input"><input type={showPassword ? "text" : "password"} autoComplete={registering ? "new-password" : "current-password"} value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} placeholder="At least 6 characters" required minLength="6" /><button type="button" onClick={() => setShowPassword(!showPassword)} aria-label={showPassword ? "Hide password" : "Show password"}>{showPassword ? <EyeOff size={17} /> : <Eye size={17} />}</button></span></label>
            {registering && <fieldset className="role-fieldset"><legend>I'm here as</legend><div className="role-options"><label className={form.role === "user" ? "selected" : ""}><input type="radio" name="role" value="user" checked={form.role === "user"} onChange={() => setForm({ ...form, role: "user" })} /> Shopper</label><label className={form.role === "seller" ? "selected" : ""}><input type="radio" name="role" value="seller" checked={form.role === "seller"} onChange={() => setForm({ ...form, role: "seller" })} /> Seller</label></div></fieldset>}
            <button className="submit-button" type="submit" disabled={busy}>{busy ? "One moment..." : registering ? "Create account" : "Sign in"}<ArrowRight size={17} /></button>
          </form>
          <p className="auth-switch">{registering ? "Already part of it?" : "New around here?"} <Link to={registering ? "/login" : "/register"}>{registering ? "Sign in" : "Create an account"}</Link></p>
        </div>
      </section>
    </main>
  );
}