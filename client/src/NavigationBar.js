/*
import React, { useState } from 'react'; // Importing useState from React
import { useAuth0 } from "@auth0/auth0-react";

function NavigationBar() {
    const { loginWithRedirect } = useAuth0();
    const [codeHistory, setCodeHistory] = useState([]);

     // Function to add executed code to history
     const addToHistory = (code) => {
      setCodeHistory(prevHistory => [...prevHistory, code]);
  };

  return (
    <nav>
    <ul style={{ listStyleType: 'none', padding: 0 }}>
      <li style={{ display: 'inline-block', marginRight: '10px', fontSize: 'larger' }}>
        <a href="#">Online Code Compiler</a>
      </li>
      <li style={{ display: 'inline-block', marginRight: '10px' }}>
        <a href="home">Home</a>
      </li>
      <li style={{ display: 'inline-block', marginRight: '10px' }}>
        <a href="about">About</a>
      </li>
      <li style={{ display: 'inline-block' }}>
        <a href="history">History</a>
      </li>
      <li>
      <button onClick={() => loginWithRedirect()}>Log In</button>
      </li>
    </ul>
  </nav>
  );
}

// Assume Compiler component handles code execution and passes the executed code to addToHistory function
// You can replace it with your actual component that executes code
function Compiler({ addToHistory }) {
  const executeCode = (code) => {
      // Execute code here
      // After executing, add code to history
      addToHistory(code);
  };

  return (
      <div>
          {/* Assume there's an input for code execution 
          <textarea rows="10" cols="50" onChange={(e) => executeCode(e.target.value)}></textarea>
      </div>
  );
}
export default NavigationBar; 
*/


// correct code until the history saved
// NavigationBar.js
/*
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth0 } from "@auth0/auth0-react";

function NavigationBar() {
    const { loginWithRedirect } = useAuth0();

    return (
        <nav>
            <ul style={{ listStyleType: 'none', padding: 0 }}>
                <li style={{ display: 'inline-block', marginRight: '10px', fontSize: 'larger' }}>
                    <a href="#">Online Code Compiler</a>
                </li>
                <li style={{ display: 'inline-block', marginRight: '10px' }}>
                    <Link to="/">Home</Link>
                </li>
                <li style={{ display: 'inline-block', marginRight: '10px' }}>
                    <Link to="/about">About</Link>
                </li>
                <li style={{ display: 'inline-block' }}>
                    <Link to="/history">History</Link>
                </li>
                <li>
                    <button onClick={() => loginWithRedirect()}>Log In</button>
                </li>
            </ul>
        </nav>
    );
}

export default NavigationBar;
*/

/*
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth0 } from "@auth0/auth0-react";

function NavigationBar() {
    const { isAuthenticated, loginWithRedirect, logout } = useAuth0();

    return (
        <nav>
            <ul style={{ listStyleType: 'none', padding: 0 }}>
                <li style={{ display: 'inline-block', marginRight: '10px', fontSize: 'larger' }}>
                    <a href="#">Online Code Compiler</a>
                </li>
                <li style={{ display: 'inline-block', marginRight: '10px' }}>
                    <Link to="/">Home</Link>
                </li>
                <li style={{ display: 'inline-block', marginRight: '10px' }}>
                    <Link to="/about">About</Link>
                </li>
                <li style={{ display: 'inline-block' }}>
                    <Link to="/history">History</Link>
                </li>
                <li>
                    {isAuthenticated ? (
                        <button onClick={() => logout({ returnTo: window.location.origin })}>Log Out</button>
                    ) : (
                        <button onClick={() => loginWithRedirect()}>Log In</button>
                    )}
                </li>
            </ul>
        </nav>
    );
}

export default NavigationBar;
*/

//correct code fully 

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './NavigationBar.css';
import { useNavigate } from 'react-router-dom';


function NavigationBar() {
    const [loggedIn, setLoggedIn] = useState(false);
    const [username, setUsername] = useState('');
    const navigate = useNavigate();

    // Function to handle login
    const handleLogin = () => {
        const userData = JSON.parse(localStorage.getItem('userData'));

        // Implement your login logic here
        // Example: Set loggedIn to true and store the username
        setLoggedIn(true);
        setUsername(userData.name);  // Replace 'JohnDoe' with the actual username
    };

    // Function to handle logout
    const handleLogout = () => {
        // Implement your logout logic here
        // Example: Set loggedIn to false and clear the username
        setLoggedIn(false);
        setUsername('');
        navigate('/login')
    };

    return (
        <nav>
            <ul style={{ listStyleType: 'none', padding: 0 }}>
                <li style={{ display: 'inline-block', marginRight: '10px', fontSize: 'larger' }}>
                    <a href="/compiler">Online Code Compiler</a>
                </li>
                <li style={{ display: 'inline-block', marginRight: '10px' }}>
                    <Link to="/problems">Problems</Link>
                </li>
                <li style={{ display: 'inline-block', marginRight: '10px' }}>
                    <Link to="/submissions">Submissions</Link>
                </li>
                <li style={{ display: 'inline-block' }}>
                    <Link to="/history">History</Link>
                </li>
                {loggedIn ? (
                    <li style={{ float: 'right', marginRight: '10px' }}>
                        <span>Welcome, {username}!</span>
                        <button onClick={handleLogout}>Logout</button>
                    </li>
                ) : (
                    <li style={{ float: 'right', marginRight: '10px' }}>
                        <button onClick={handleLogin}>Log In</button>
                    </li>
                    
                )}
            </ul>
        </nav>
    );
}

export default NavigationBar;


