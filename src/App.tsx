import { Routes, Route } from "react-router-dom";
import CopilotChat from "./components/CopilotChat";
import AuthModal from "./components/AuthModal";
import FeedbackButtons from "./components/FeedbackButtons";
import Suggestions from "./components/Suggestions";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<CopilotChat />} />
      <Route path="/auth" element={<AuthModal />} />
      <Route path="/suggestions" element={<Suggestions />} />
      <Route path="/feedback" element={<FeedbackButtons />} />
    </Routes>
  );
}