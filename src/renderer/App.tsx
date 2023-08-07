import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import '../styles/main.css';
import PhoneNo from './screen/PhoneNo';
import FullName from './screen/FullName';
import Otp from './screen/Otp';
import ChatSec from './screen/ChatSec';
import SignIn from './screen/SignIn'

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<PhoneNo />} />
        <Route path="fullname" element={<FullName />} />
        <Route path="otp" element={<Otp />} />
        <Route path="chatsec" element={<ChatSec />} />
        <Route path="signin" element={<SignIn />} />
      </Routes>
    </Router>
  );
}
