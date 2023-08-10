import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import signupImg from '../../../assets/signup-logo.png';

interface PhoneNumberObject {
  countryCodes: number;
  phoneNumber: number;
}

function Otp() {
  const location = useLocation();
  const PhoneNumberObject = location.state as PhoneNumberObject;
  const formattedNumber = PhoneNumberObject.phoneNumber
    .toString()
    .replace(/[^\d]/g, '')
    .replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3');
  const navgate = useNavigate();
  const [otpCode, setOtpCode] = useState('');
  const [showWarning, setShowWarning] = useState(false);

  const handleOtpChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const input = event.target.value.replace(/[^\d]/g, '');
    setOtpCode(input);
  };
  const navToFullName = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    if (otpCode.length <= 3) {
      setShowWarning(true);
      setTimeout(() => {
        setShowWarning(false);
      }, 5000);
    } else {
      navgate('/name-input', { state: PhoneNumberObject });
    }
  };
  const isButtonDisabled = otpCode.length <= 3;

  return (
    <div className="container-new">
      {showWarning && (
        <div className="warning">Please Enter OTP code more then 4 digits</div>
      )}
      <img src={signupImg} alt="Signup" />
      <p className="subheading phone-number-display">
        {`${PhoneNumberObject.countryCodes} ${formattedNumber}`}
      </p>
      <p className="otp-text">We have sent you an SMS with the code</p>
      <div className="input-container">
        <input
          type="text"
          className="otp-code input-padding"
          placeholder="Code"
          id="otpInput"
          value={otpCode}
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
