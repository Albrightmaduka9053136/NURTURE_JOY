import {Routes, Route } from "react-router-dom";

import Login from "./pages/components/Login";
import Signup from "./pages/components/SignUp";
import Dashboard from "./pages/components/Dasshboard";
import Landing from "./pages/Landing";

// import SessionHistory from "./pages/SessionHistory";
import ChatHistory from "./pages/chatbot/ChatHistory";

/* import Community from "./pages/Community"; */ // Placeholder for future community page
import BreathingBox from "./pages/resources/BreathingBox";
import Grounding54321 from "./pages/resources/Grounding54321";
import CareProviders from "./pages/resources/CareProviders";
import Journal from "./pages/resources/JournalPrompts";
import UrgentSupport from "./pages/resources/UrgentSupport";
import Resources from "./pages/Resources";
import UserProfile from "./pages/components/UserProfile";


function App() {
  return (
     
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Signup/>} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/sessions" element={<ChatHistory />} />
        <Route path="/profile" element={<UserProfile />} />
        {/* <Route path="/community" element={<Community />} /> */}
        <Route path="/resources" element={<Resources/>} />
        <Route path="/resources/breathing-box" element={<BreathingBox />} />
        <Route path="/resources/grounding-54321" element={<Grounding54321 />} />
        <Route path="/resources/care-providers" element={<CareProviders />} />
        <Route path="/resources/journal" element={<Journal />} />
        <Route path="/resources/urgent-support" element={<UrgentSupport />} />

      </Routes>
  
  );
}

export default App;
