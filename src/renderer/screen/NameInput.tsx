import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import signupImg from '../../../assets/signup-logo.png';

interface LocationState {
  PhoneNumberObject: number;
}

function NameInput() {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [showWarning, setShowWarning] = useState(false);
  const location = useLocation<LocationState>();
  const pass = location.state.phoneNumber;
  const regUser = () => {
    if (firstName.length <= 0 && lastName.length <= 0) {
      setShowWarning(true);
      setTimeout(() => {
        setShowWarning(false);
      }, 5000);
    } else {
      if (window.electron && window.electron.ipcRenderer) {
        window.electron.ipcRenderer.sendMessage(
          'reg-user',
          firstName,
          lastName,
          pass
        );
      }
      window.electron.ipcRenderer.once('user-accept', (arg) => {
        if (arg) {
          navigate('/chat-interface');
        }
      });
      window.electron.ipcRenderer.sendMessage('user-accept');
    }
  };

  return (
    <div className="container-new">
      {showWarning && (
        <div className="warning">Please Enter OTP code more then 4 digits</div>
      )}
      <img src={signupImg} alt="Signup" />
      <p className="subheading">What&apos;s your Phone Number?</p>
      <div className="input-container">
        <input
          type="text"
          className="first-name input-padding"
          placeholder="First Name"
          value={firstName}
          onChange={(e) => {
            setFirstName(e.target.value);
          }}
        />
      </div>
      <div className="input-container">
        <input
          type="text"
          className="last-name input-padding"
          placeholder="Last Name"
          value={lastName}
          onChange={(e) => {
            setLastName(e.target.value);
          }}
        />
      </div>
      <button onClick={regUser} type="button" className="next-button">
        Next
      </button>
    </div>
  );
}

export default NameInput;
