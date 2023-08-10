import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import signupImg from '../../../assets/signup-logo.png';

function UserAuthentication() {
  const [email, setEmail] = useState<string>('');
  const [pass, setPass] = useState<string>('');
  const navigate = useNavigate();

  const signinHandle = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    window.electron.ipcRenderer.sendMessage('auth-user', email, pass);
  };

  const navigateToChatInterface = () => {
    window.electron.ipcRenderer.once('user-accept', (arg) => {
      if (arg) {
        navigate('/chat-interface');
      }
    });
    window.electron.ipcRenderer.sendMessage('user-accept');
  };

  return (
    <div className="container-new">
      <img src={signupImg} alt="Sign Up" />
      <p className="subheading">What&apos;s your Phone Number?</p>
      <form onSubmit={signinHandle}>
        <div className="input-container">
          <input
            type="text"
            className="input-padding"
            placeholder="Email e.g. firstname@email.com"
            id="email"
            required
            onChange={(e) => {
              setEmail(e.target.value);
            }}
          />
        </div>
        <div className="input-container">
          <input
            type="password"
            className="input-padding"
            id="password"
            placeholder="Password"
            required
            onChange={(e) => {
              setPass(e.target.value);
            }}
          />
        </div>
        <button
          onClick={navigateToChatInterface}
          className="next-button"
          type="submit"
        >
          Login
        </button>
      </form>
      <Link className="link-text" to="/">
        Register
      </Link>
    </div>
  );
}

export default UserAuthentication;
