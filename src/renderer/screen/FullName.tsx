/* eslint-disable react/no-unescaped-entities */
import React, { useState } from 'react';
import signupImg from '../../../assets/signup-logo.png';
import { useLocation, useNavigate } from 'react-router-dom';

function FullName() {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState('');
  const [LastName, setLastName] = useState('');
  const location = useLocation();
  const pass = location.state.phoneNo;
  const regUser = () => {
    window.electron.ipcRenderer.sendMessage(
      'reg-user',
      firstName,
      LastName,
      pass
    );
    window.electron.ipcRenderer.once('user-accept', (arg) => {
      console.log(arg);
      if (arg) {
        navigate('/chatsec');
      }
    });
    window.electron.ipcRenderer.sendMessage('user-accept');
  };
  return (
    <div>
      <div className="container-new">
        <img src={signupImg} alt="Signup" />
        <p className="subheading">What's your full name?</p>
        <div className="input-container">
          <input
            type="text"
            className="first-name input-padding"
            placeholder="First Name"
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
            onChange={(e) => {
              setLastName(e.target.value);
            }}
          />
        </div>
        <button onClick={regUser} type="button" className="next-button">
          Next
        </button>
      </div>
    </div>
  );
}

export default FullName;
