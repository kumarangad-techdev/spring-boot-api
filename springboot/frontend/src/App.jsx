import { useState } from "react";

const API = "";

export default function App() {
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState(false);
  const [busy, setBusy] = useState(false);
  const [signedInEmail, setSignedInEmail] = useState("");

  async function onSubmit(event) {
    event.preventDefault();
    setBusy(true);
    setMessage("");
    setError(false);

    try {
      const response = await fetch(`${API}/api/auth/${mode === "login" ? "login" : "register"}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const text = await response.text();
      const failed = !response.ok || text.startsWith("Error:");
      setError(failed);
      setMessage(text || `Request failed (${response.status})`);
      if (!failed && mode === "login") {
        setSignedInEmail(email);
      }
      if (!failed && mode === "register") {
        setMode("login");
        setPassword("");
      }
    } catch {
      setError(true);
      setMessage("Could not reach the API. Start the Spring Boot app on port 8080.");
    } finally {
      setBusy(false);
    }
  }

  function signOut() {
    setSignedInEmail("");
    setPassword("");
    setMessage("");
    setError(false);
  }

  if (signedInEmail) {
    return (
      <main className="page">
        <section className="card">
          <p className="eyebrow">Signed in</p>
          <h1>Welcome back</h1>
          <p className="lead">{signedInEmail}</p>
          <button type="button" onClick={signOut}>
            Sign out
          </button>
        </section>
      </main>
    );
  }

  const isLogin = mode === "login";

  return (
    <main className="page">
      <section className="card">
        <p className="eyebrow">{isLogin ? "Welcome back" : "Create an account"}</p>
        <h1>{isLogin ? "Sign in" : "Register"}</h1>
        <p className="lead">
          {isLogin
            ? "Use the email and password saved in the users table."
            : "This stores a hashed password in the users table."}
        </p>

        <form onSubmit={onSubmit}>
          <label>
            Email
            <input
              type="email"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </label>
          <label>
            Password
            <input
              type="password"
              autoComplete={isLogin ? "current-password" : "new-password"}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              minLength={6}
              required
            />
          </label>
          <button type="submit" disabled={busy}>
            {busy ? "Please wait…" : isLogin ? "Sign in" : "Create account"}
          </button>
        </form>

        {message ? <p className={error ? "message error" : "message"}>{message}</p> : null}

        <button
          type="button"
          className="link"
          onClick={() => {
            setMode(isLogin ? "register" : "login");
            setMessage("");
            setError(false);
          }}
        >
          {isLogin ? "Need an account? Register" : "Already registered? Sign in"}
        </button>
      </section>
    </main>
  );
}
