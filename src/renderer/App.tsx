import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import '../styles/main.css';
import PhoneSignup from './screen/PhoneSignup';
import NameInput from './screen/NameInput';
import Otp from './screen/Otp';
import ChatInterface from './screen/ChatInterface';
import UserAuthentication from './screen/UserAuthentication';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<PhoneSignup />} />
        <Route path="/name-input" element={<NameInput />} />
        <Route path="otp" element={<Otp />} />
        <Route path="/chat-interface" element={<ChatInterface />} />
        <Route path="/user-authentication" element={<UserAuthentication />} />
      </Routes>
    </Router>
  );
}
