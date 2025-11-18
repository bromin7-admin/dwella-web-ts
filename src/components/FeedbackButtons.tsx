import React, { useState } from "react";
//import { sendFeedback } from "../api/feedback";

interface Props {
  messageId?: string;
}

export const FeedbackButtons: React.FC<Props> = ({ messageId }) => {
  const [submitted, setSubmitted] = useState(false);

  if (!messageId) return null;
  if (submitted) return <span className="feedback-submitted">Thanks!</span>;

  const handle = async (value: boolean) => {
    try {
      await sendFeedback(messageId, value);
      setSubmitted(true);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="feedback-buttons">
      <button className="thumb thumb-up" onClick={() => handle(true)}>
        👍
      </button>
      <button className="thumb thumb-down" onClick={() => handle(false)}>
        👎
      </button>
    </div>
  );
};
