import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import signupImg from '../../../assets/signup-logo.png';

function Otp() {
  const location = useLocation();
  const phoneNumb = location.state;
  const formattedNumber = phoneNumb.phoneNo
    .replace(/[^\d]/g, '')
    .replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3');
  const navgate = useNavigate();
  const [otpCode, setOtpCode] = useState('');

  const handleOtpChange = (event: { target: { value: string } }) => {
    const input = event.target.value.replace(/[^\d]/g, '');
    setOtpCode(input);
  };
  const navToFullName = (event: { preventDefault: () => void }) => {
    event.preventDefault();
    navgate('/fullname', { state: phoneNumb });
  };
  const isButtonDisabled = otpCode.length <= 3;
  return (
    <div className="container-new">
      <img src={signupImg} alt="Signup" />
      <p className="subheading phone-number-display">
        {`${phoneNumb.country} ${formattedNumber}`}
      </p>
      <p className="otp-text">We have sent you an SMS with the code</p>
      <div className="input-container">
        <input
          type="text"
          className="otp-code input-padding"
          placeholder="Code"
          id="otpInput"
          onChange={handleOtpChange}
        />
      </div>
      <button
        disabled={isButtonDisabled}
        type="button"
        className="next-button"
        onClick={navToFullName}
      >
        Next
      </button>
    </div>
  );
}
export default Otp;
