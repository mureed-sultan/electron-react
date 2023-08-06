/* eslint-disable react/no-unescaped-entities */
import React from 'react';
import signupImg from '../../../assets/signup-logo.png';

function FullName() {
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
          />
        </div>
        <div className="input-container">
          <input
            type="text"
            className="last-name input-padding"
            placeholder="Last Name"
          />
        </div>
        <button type="button" className="next-button">
          Next
        </button>
      </div>
    </div>
  );
}

export default FullName;
