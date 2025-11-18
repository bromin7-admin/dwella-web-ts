import React, { useEffect, useState } from "react";
import { useAuth } from "../store/authStore";

declare global {
  interface Window {
    google?: any;
    AppleID?: any;
  }
}

interface AuthModalProps {
  open: boolean;
  onClose: () => void;
}

type Mode = "login" | "register";

export const AuthModal: React.FC<AuthModalProps> = ({ open, onClose }) => {
  const { login, register, loginWithGoogle, loginWithApple } = useAuth();
  const [mode, setMode] = useState<Mode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    if (window.google) return;

    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);
  }, [open]);

  const handleGoogle = () => {
    if (!window.google) {
      console.error("Google not loaded");
      return;
    }

    window.google.accounts.id.initialize({
      client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
      callback: async (response: any) => {
        try {
          setLoading(true);
          setError(null);
          await loginWithGoogle(response.credential);
          onClose();
        } catch (e) {
          console.error(e);
          setError("Google sign-in failed");
        } finally {
          setLoading(false);
        }
      }
    });

    window.google.accounts.id.prompt();
  };

  const handleApple = async () => {
    try {
      if (!window.AppleID) {
        console.warn("AppleID JS not loaded");
        return;
      }
      setLoading(true);
      const result = await window.AppleID.auth.signIn();
      const idToken = result?.authorization?.id_token;
      if (idToken) {
        await loginWithApple(idToken);
        onClose();
      }
    } catch (e) {
      console.error(e);
      setError("Apple sign-in failed");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      if (mode === "login") {
        await login(email, password);
      } else {
        await register({ name, surname, email, password });
      }
      onClose();
    } catch (e) {
      console.error(e);
      setError("Authentication error");
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="dwella-auth-backdrop">
      <div className="dwella-auth-modal">
        <button className="dwella-auth-close" onClick={onClose}>
          ×
        </button>

        <h2 className="dwella-auth-title">
          {mode === "login" ? "Sign in to your account" : "Create your account"}
        </h2>

        <div className="dwella-auth-buttons">
          <button
            className="dwella-auth-btn dwella-auth-btn-outline"
            type="button"
            onClick={handleGoogle}
            disabled={loading}
          >
            <span className="icon">G</span>
            <span>Continue with Google</span>
          </button>

          <button
            className="dwella-auth-btn dwella-auth-btn-purple-soft"
            type="button"
            onClick={handleApple}
            disabled={loading}
          >
            <span className="icon"></span>
            <span>Continue with Apple</span>
          </button>
        </div>

        <div className="dwella-auth-divider">
          <span>or</span>
        </div>

        <form className="dwella-auth-form" onSubmit={handleSubmit}>
          {mode === "register" && (
            <div className="dwella-auth-row">
              <input
                type="text"
                placeholder="First name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              <input
                type="text"
                placeholder="Last name"
                value={surname}
                onChange={(e) => setSurname(e.target.value)}
                required
              />
            </div>
          )}

          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {error && <div className="dwella-auth-error">{error}</div>}

          <button
            className="dwella-auth-btn dwella-auth-btn-email"
            type="submit"
            disabled={loading}
          >
            {loading
              ? "Please wait..."
              : mode === "login"
              ? "Continue with email"
              : "Sign up with email"}
          </button>
        </form>

        <p className="dwella-auth-legal">
          By signing up with Dwella, you agree to our{" "}
          <a href="/terms" target="_blank" rel="noreferrer">
            Terms of Use
          </a>{" "}
          and{" "}
          <a href="/privacy" target="_blank" rel="noreferrer">
            Privacy Policy
          </a>
          .
        </p>

        <p className="dwella-auth-switch">
          {mode === "login" ? (
            <>
              Don’t have an account?{" "}
              <button type="button" onClick={() => setMode("register")}>
                Sign up here
              </button>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <button type="button" onClick={() => setMode("login")}>
                Log in
              </button>
            </>
          )}
        </p>
      </div>
    </div>
  );
};
