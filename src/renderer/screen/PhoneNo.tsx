import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import signupImg from '../../../assets/signup-logo.png';

function PhoneNo() {
  const [countryCodes, setCountryCodes] = useState([]);
  const [number, setNumber] = useState(0);
  const [countryCode, setCountryCode] = useState('+1');
  const navigate = useNavigate();
  async function fetchCountryCodes() {
    try {
      const response = await fetch(
        'https://gist.githubusercontent.com/anubhavshrimal/75f6183458db8c453306f93521e93d37/raw/f77e7598a8503f1f70528ae1cbf9f66755698a16/CountryCodes.json'
      );
      const data = await response.json();

      const uniqueCountryCodes = new Set();
      const filteredCountryCodes = data.filter((country: { hasOwnProperty: (arg0: string) => any; dial_code: unknown; }) => {
        if (
          country.hasOwnProperty('dial_code') &&
          country.dial_code.length <= 4
        ) {
          if (!uniqueCountryCodes.has(country.dial_code)) {
            uniqueCountryCodes.add(country.dial_code);
            return true;
          }
          return false;
        }
        return false;
      });

      const sortedCountryCodes = filteredCountryCodes.sort(
        (a: { dial_code: string }, b: { dial_code: string }) =>
          parseInt(a.dial_code, 10) - parseInt(b.dial_code, 10)
      );
      setCountryCodes(sortedCountryCodes);
    } catch (error) {
      console.error('Error fetching country codes:', error);
    }
  }

  useEffect(() => {
    fetchCountryCodes();
  }, []);
  const handleSubmit = (event: { preventDefault: () => void }) => {
    event.preventDefault();
    const navObj = {
      country: countryCode,
      phoneNo: number,
    };
    // navigate(`/otp?countryCode=${countryCode}&number=${number}`);
    navigate('otp', { state: navObj });
  };
  return (
    <div>
      <div className="container-new mx-auto">
        <img src={signupImg} alt="Signup" />
        <p className="subheading">What's your Phone Number?</p>
        <div className="input-container">
          <select
            className="country-code"
            id="countryCodeSelect"
            onChange={(e) => setCountryCode(e.target.value)}
          >
            <option value="+1">+1</option> {/* Default value */}
            {countryCodes.map((country) => (
              <option key={country.dial_code} value={country.dial_code}>
                {country.dial_code}
              </option>
            ))}
          </select>
          <input
            type="number"
            className="phone-number"
            id="phoneNumber"
            placeholder="Phone number"
            onChange={(e) => setNumber(e.target.value)}
          />
        </div>
        <button type="submit" className="next-button" onClick={handleSubmit}>
          Next
        </button>
        <a className="link-text" href="../pages/login.html">
          Already Account
        </a>
      </div>
    </div>
  );
}

export default PhoneNo;
