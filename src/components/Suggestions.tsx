import React from "react";

interface Props {
  onSend: (text: string) => void;
}

export const Suggestions: React.FC<Props> = ({ onSend }) => {
  const suggestions = [
    "Get lender offers (anonymously) 🏦",
    "Check my readiness (Dwella Index Score) 📊",
    "Can I afford this home? (paste a property link) 🏡",
  ];

  return (
    <div className="suggestions">
      {suggestions.map((s, i) => (
        <button
          key={i}
          className="suggestion-chip"
          onClick={() => onSend(s)}  // ✅ FIXED CLICK HANDLER
        >
          {s}
        </button>
      ))}
    </div>
  );
};