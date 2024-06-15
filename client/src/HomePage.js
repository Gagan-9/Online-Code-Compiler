// import React from 'react';
// import './HomePage.css'; // Import CSS file for styling

// function HomePage() {
//   return (
//     <div className="home-container">
//       <h1>Welcome to Online Code Compiler</h1>
//       <p>This is the homepage for our Code Compiler. Feel free to explore!</p> <br />
//       <img
//         src="https://cdn.dribbble.com/userupload/12488878/file/original-758e32017ddafee6fec0df3194e4b527.png?resize=400x300&vertical=center"
//         alt="Example"
//         className="img-size"
//       />

//     </div>
//   );
// }

// export default HomePage;

import React from 'react';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom
import './HomePage.css'; // Import CSS file for styling

function HomePage() {
  return (
    <div className="home-container">
      <h1>Welcome to Online Code Compiler</h1>
      <p>This is the homepage for our Code Compiler. Feel free to explore!</p> <br />
      <img
        src="https://cdn.dribbble.com/userupload/12488878/file/original-758e32017ddafee6fec0df3194e4b527.png?resize=400x300&vertical=center"
        alt="Example"
        className="img-size"
      />
      <div className="button-container">
        <Link to="/register">
          <button className="button">Register</button>
        </Link>
        <Link to="/login">
          <button className="button">Login</button>
        </Link>
      </div>
    </div>
  );
}

export default HomePage;

