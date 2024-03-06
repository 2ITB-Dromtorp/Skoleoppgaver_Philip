import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Logo from '../images/MoneyMan.png';
import { toast, Toaster } from 'react-hot-toast';

function Signup() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSignUp = async () => {

    username = username.toLowerCase();

    if (username === '') {
      toast.error('Vennligst skriv inn et brukernavn');
    } else if (username.split('').includes(' ')) {
      toast.error("DU KAN IKKE HA MELLOMROM I BRUKERNAVN!!!!!!!!!!!!!!!");
    } else if (email === '') {
      toast.error('Vennligst skriv inn en email');
    } else if (password === '') {
      toast.error('Vennligst skriv inn et passord');
    }

    try {
      const response = await fetch('/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password }),
      });

      if (response.ok) {
        toast.success('User created successfully');
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        const data = await response.json();
        toast.error(data.error || 'Failed to create user');
      }
    } catch (error) {
      console.error('Error signing up:', error);
      toast.error('An error occurred while signing up');
    }
  };

  return (
    <div id="mainWindow">
      <div id="loginSection">
        <img id="logo" src={Logo} alt='logo' />
        <div id="inputWrapper">
          <input placeholder="Brukernavn" value={username} onChange={(e) => setUsername(e.target.value)} />
        </div>
        <div id="inputWrapper">
          <input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div id="inputWrapper">
          <input placeholder="Passord" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <button type='button' onClick={handleSignUp} id="submitButton">
          Opprett bruker
        </button>
        <Link id="blueLink" to="/login">Har du allerede en konto? Logg inn</Link>
      </div>
      <Toaster />
    </div>
  );
}

export default Signup;
