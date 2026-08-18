import { useState } from "react";
import axios from "axios";
import "./Login.css";

const API_URL = "http://127.0.0.1:8000";

function Login({ onLogin }) {
  const [showRegister, setShowRegister] = useState(false);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [registerUsername, setRegisterUsername] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

const handleLogin = async (e) => {
  e.preventDefault();

  setError("");
  setLoading(true);

  try {
    const response = await axios.post(
      `${API_URL}/api/token/`,
      {
        username: username.trim(),
        password: password,
      }
    );

    console.log("LOGIN SUCCESS:", response.data);

    localStorage.setItem(
      "access",
      response.data.access
    );

    localStorage.setItem(
      "refresh",
      response.data.refresh
    );

    onLogin();

  } catch (error) {
    console.error(
      "LOGIN ERROR:",
      error.response?.status,
      error.response?.data
    );

    if (error.response?.status === 401) {
      setError("Incorrect username or password.");
    } else {
      setError(
        error.response?.data?.detail ||
        "Something went wrong. Check the Django server."
      );
    }

  } finally {
    setLoading(false);
  }
};
  const handleRegister = async (e) => {
    e.preventDefault();

    setError("");

    if (registerPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      await axios.post(
        `${API_URL}/api/register/`,
        {
          username: registerUsername,
          password: registerPassword,
        }
      );

      setShowRegister(false);

      setUsername(registerUsername);
      setPassword("");

      setRegisterUsername("");
      setRegisterPassword("");
      setConfirmPassword("");

      setError("");
    } catch (error) {
      console.error(
        "REGISTER ERROR:",
        error.response?.data || error
      );

      setError(
        error.response?.data?.username?.[0] ||
        error.response?.data?.detail ||
        "Could not create account."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">

      <div className="login-decoration decoration-one"></div>
      <div className="login-decoration decoration-two"></div>

      <div className="login-layout">

        {/* LEFT SIDE */}

        <div className="login-intro">

          <div className="login-logo">
            HabitTrackz
          </div>

          <h2 className="login-tagline">
            Small habits.
            <br />
            Big changes.
          </h2>

          <p className="login-description">
            Build better routines, keep track of your
            progress, and turn everyday actions into
            lasting habits.
          </p>

          <div className="login-mini-stats">

            <div>
              <strong>✓</strong>
              <span>Daily tracking</span>
            </div>

            <div>
              <strong>🔥</strong>
              <span>Build streaks</span>
            </div>

          </div>

        </div>

        {/* LOGIN / REGISTER CARD */}

        <div className="login-card">

          {!showRegister ? (

            <>
              <div className="login-card-heading">

                <p className="login-eyebrow">
                  WELCOME BACK
                </p>

                <h1>
                  Sign in
                </h1>

                <p>
                  Continue your habit journey.
                </p>

              </div>

              <form
                className="login-form"
                onSubmit={handleLogin}
              >

                <label>
                  Username
                </label>

                <input
                  type="text"
                  value={username}
                  onChange={(e) =>
                    setUsername(e.target.value)
                  }
                  placeholder="Enter your username"
                  required
                />

                <label>
                  Password
                </label>

                <input
                  type="password"
                  value={password}
                  onChange={(e) =>
                    setPassword(e.target.value)
                  }
                  placeholder="Enter your password"
                  required
                />

                {error && (
                  <div className="login-error">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  className="login-submit"
                  disabled={loading}
                >
                  {loading ? "Signing in..." : "Sign in"}
                </button>

              </form>

              <div className="login-switch">

                <span>
                  Don't have an account?
                </span>

                <button
                  type="button"
                  onClick={() => {
                    setShowRegister(true);
                    setError("");
                  }}
                >
                  Create account
                </button>

              </div>
            </>

          ) : (

            <>
              <div className="login-card-heading">

                <p className="login-eyebrow">
                  GET STARTED
                </p>

                <h1>
                  Create account
                </h1>

                <p>
                  Start building better habits today.
                </p>

              </div>

              <form
                className="login-form"
                onSubmit={handleRegister}
              >

                <label>
                  Username
                </label>

                <input
                  type="text"
                  value={registerUsername}
                  onChange={(e) =>
                    setRegisterUsername(e.target.value)
                  }
                  placeholder="Choose a username"
                  required
                />

                <label>
                  Password
                </label>

                <input
                  type="password"
                  value={registerPassword}
                  onChange={(e) =>
                    setRegisterPassword(e.target.value)
                  }
                  placeholder="Create a password"
                  required
                />

                <label>
                  Confirm Password
                </label>

                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) =>
                    setConfirmPassword(e.target.value)
                  }
                  placeholder="Confirm your password"
                  required
                />

                {error && (
                  <div className="login-error">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  className="login-submit"
                  disabled={loading}
                >
                  {loading
                    ? "Creating account..."
                    : "Create account"}
                </button>

              </form>

              <div className="login-switch">

                <span>
                  Already have an account?
                </span>

                <button
                  type="button"
                  onClick={() => {
                    setShowRegister(false);
                    setError("");
                  }}
                >
                  Sign in
                </button>

              </div>
            </>

          )}

        </div>

      </div>

    </div>
  );
}

export default Login;