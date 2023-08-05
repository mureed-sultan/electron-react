import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import '../styles/main.css';
import PhoneNo from './PhoneNo';
import Otp from './Otp';

import PhoneNo from './PhoneNo';
export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<PhoneNo />} />
        <Route path="otp" element={<Otp />} />
      </Routes>
    </Router>
  );
}
