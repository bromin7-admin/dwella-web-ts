import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../store/authStore";

interface Props {
  onOpenAuth: () => void;
}

export const LandingPage: React.FC<Props> = ({ onOpenAuth }) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handlePrimary = () => {
    if (user) navigate("/copilot");
    else onOpenAuth();
  };

  return (
    <div className="landing-root">
      <nav className="dwella-nav">
        <div className="logo">DWELLA</div>
        <div className="nav-links">
          <a href="#features">Features</a>
          <a href="#faqs">FAQs</a>
          <a href="#contact">Contact</a>
        </div>
        <div className="nav-actions">
          {!user ? (
            <>
              <button className="nav-link" onClick={onOpenAuth}>
                Log in
              </button>
              <button className="nav-cta" onClick={onOpenAuth}>
                Sign Up Now
              </button>
            </>
          ) : (
            <button className="nav-cta" onClick={() => navigate("/copilot")}>
              Open Copilot
            </button>
          )}
        </div>
      </nav>

      <main className="landing-main">
        <div className="hero">
          <h1>AI Mortgage Copilot</h1>
          <p>
            Get mortgage-ready, understand what you qualify for, and connect
            with vetted lenders — all in one conversation.
          </p>
          <button className="hero-cta" onClick={handlePrimary}>
            Ask Dwella, your homebuying guide
          </button>
        </div>
      </main>
    </div>
  );
};
