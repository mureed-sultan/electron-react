import React,{useState} from 'react';
import { Link, useNavigate } from 'react-router-dom';
import signupImg from '../../../assets/signup-logo.png';

function SignIn() {
const [email, setEmail] = useState("")
const [pass, setPass] = useState("")
const navigate = useNavigate()
  const signIn=()=>{
    event.preventDefault();
    window.electron.ipcRenderer.sendMessage('auth-user', email,pass);
  };
  const nav = () => {
    window.electron.ipcRenderer.once('user-accept', (arg) => {
      console.log(arg);
      if (arg) {
        navigate('/chatsec');
      }
    });
    window.electron.ipcRenderer.sendMessage('user-accept');
  };
  return (
    <div className="container-new">
      <img src={signupImg} alt="" />
      <p className="subheading">What's your Phone Number?</p>
      <form onSubmit={signIn}>
        <div className="input-container">
          <input
            type="text"
            className="input-padding"
            placeholder="Email e.g. firstname@email.com"
            id="email"
            required
            onChange={e=>{setEmail(e.target.value)}}
          />
        </div>
        <div className="input-container">
          <input
            type="password"
            className="input-padding"
            id="password"
            placeholder="Password"
            required
            onChange={e=>{setPass(e.target.value)}}
          />
        </div>
        <button onClick={nav} className="next-button" type="submit">
          Login
        </button>
      </form>
      <Link className="link-text" to={'/'}>
        Register
      </Link>
    </div>
  );
}

export default SignIn;
