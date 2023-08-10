import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import signupImg from '../../../assets/signup-logo.png';

interface Country {
  dial_code: number;
}

function PhoneSignup() {
  const [countryCodes, setCountryCodes] = useState<Country[]>([]);
  const [number, setNumber] = useState<string>('');
  const [countryCode, setCountryCode] = useState<string>('+1');
  const [showWarning, setShowWarning] = useState(false);
  const navigate = useNavigate();

  async function fetchCountryCodes() {
    try {
      const response = await fetch(
        'https://gist.githubusercontent.com/anubhavshrimal/75f6183458db8c453306f93521e93d37/raw/f77e7598a8503f1f70528ae1cbf9f66755698a16/CountryCodes.json'
      );
      const data: Country[] = await response.json();

      const uniqueCountryCodes = new Set<string>();
      const filteredCountryCodes = data.filter((country) => {
        if (country.dial_code.length <= 4) {
          if (!uniqueCountryCodes.has(country.dial_code)) {
            uniqueCountryCodes.add(country.dial_code);
            return true;
          }
          return false;
        }
        return false;
      });

      const sortedCountryCodes = filteredCountryCodes.sort(
        (a, b) => parseInt(a.dial_code, 10) - parseInt(b.dial_code, 10)
      );
      setCountryCodes(sortedCountryCodes);
    } catch (error) {
      console.error('Error fetching country codes:', error);
    }
  }

  useEffect(() => {
    fetchCountryCodes();
  }, []);

  const handleSubmit = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    event.preventDefault();
    const PhoneNumberObject = {
      countryCodes: countryCode,
      phoneNumber: number,
    };

    if (PhoneNumberObject.phoneNumber === '') {
      setShowWarning(true);
      setTimeout(() => {
        setShowWarning(false);
      }, 5000);
    } else {
      navigate('otp', { state: PhoneNumberObject }); // Navigate to 'otp' route
    }
  };

  return (
    <div>
      {showWarning && <div className="warning">Please Enter Phone Number</div>}
      <div className="container-new mx-auto">
        <img src={signupImg} alt="Signup" />
        <p className="subheading">What&apos;s your Phone Number?</p>
        <div className="input-container">
          <select
            className="country-code"
            id="countryCodeSelect"
            onChange={(e) => setCountryCode(e.target.value)}
            value={countryCode}
          >
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
            value={number}
          />
        </div>
        <button type="button" className="next-button" onClick={handleSubmit}>
          Next
        </button>
        <Link className="link-text" to="user-authentication">
          Sign In
        </Link>
      </div>
    </div>
  );
}

export default PhoneSignup;
