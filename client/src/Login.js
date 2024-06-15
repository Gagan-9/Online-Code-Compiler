// import { useState } from "react";
// import axios from 'axios';
// import { Link } from 'react-router-dom';
// import { useNavigate } from "react-router-dom";
// import './Login.css';

// function Login() {
//     const [email, setEmail] = useState('');
//     const [password, setPassword] = useState(''); 
//     const navigate = useNavigate();

//     axios.defaults.withCredentials = true;

    
//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         if (!email || !password) {
//             alert("Please fill in all fields");
//             return;
//         }
       
//         axios.post('http://localhost:5000/login', { email, password })
//         .then(result => { 
//             console.log("Response from server:", result.data);
//             if (result.data === "No record existed") {
//                 alert("No record existed");
//             } else if (result.data === "the password is incorrect") {
//                 alert("Password is incorrect");
//             } else if (result.data.message === "Success") {
//                 navigate('/compiler');
//             }
//         })
//         .catch(err => console.log(err));
//     }
    
    
    
//     return (
//         <div className="d-flex justify-content-center align-items-center bg-secondary vh-100">
//             <div className="bg-white p-3 rounded w-25">
//                 <h2>Login</h2>
//                 <form onSubmit={handleSubmit}>
//                     <div className="mb-3">
//                         <label htmlFor="email">
//                             <strong>Email</strong>
//                         </label>
//                         <input
//                             type="text"
//                             placeholder="Enter Email"
//                             autoComplete="off"
//                             name="email"
//                             className="form-control rounded-0"
//                             value={email}
//                             onChange={(e) => setEmail(e.target.value)}
//                         />
//                     </div>
//                     <div className="mb-3">
//                         <label htmlFor="email">
//                             <strong>Password</strong>
//                         </label>
//                         <input
//                             type="password" 
//                             placeholder="Enter Password"
//                             autoComplete="off"
//                             name="password" 
//                             className="form-control rounded-0"
//                             value={password}
//                             onChange={(e) => setPassword(e.target.value)}
//                         />
//                     </div>
//                     <button type="submit" className="btn btn-success w-100 rounded-0">
//                         Login
//                     </button>
//                 </form>
//                 <p>Don't Have an Account</p>
//                 <Link to="/register" className="btn btn-default border w-100 bg-light rounded-0 text-decoration-none">
//                     Sign Up
//                 </Link>
//             </div>
//         </div>
//     );
// }


// export default Login;


import { useState } from "react";
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import './Login.css';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState(''); 
    const navigate = useNavigate();

    axios.defaults.withCredentials = true;

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email || !password) {
            alert("Please fill in all fields");
            return;
        }
       
        try {
            // Clear previous user data from local storage
            localStorage.removeItem('userData');
            
            // Make login request
            const response = await axios.post('http://localhost:5000/login', { email, password });
            
            // Handle response from server
            console.log("Response from server:", response.data);
            if (response.data === "No record existed") {
                alert("No record existed");
            } else if (response.data === "the password is incorrect") {
                alert("Password is incorrect");
            } else if (response.data.message === "Success") {
                // Store user data in local storage
                localStorage.setItem('userData', JSON.stringify(response.data.user));
                // Redirect to '/compiler' route upon successful login
                navigate('/compiler');
            }
        } catch (error) {
            console.error('Login failed:', error);
            alert('Login failed. Please try again.');
        }
    }
    
    return (
        <div className="d-flex justify-content-center align-items-center bg-secondary vh-100">
            <div className="bg-white p-3 rounded w-25">
                <h2>Login</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label htmlFor="email">
                            <strong>Email</strong>
                        </label>
                        <input
                            type="text"
                            placeholder="Enter Email"
                            autoComplete="off"
                            name="email"
                            className="form-control rounded-0"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="email">
                            <strong>Password</strong>
                        </label>
                        <input
                            type="password" 
                            placeholder="Enter Password"
                            autoComplete="off"
                            name="password" 
                            className="form-control rounded-0"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <button type="submit" className="btn btn-success w-100 rounded-0">
                        Login
                    </button>
                </form>
                <p>Don't Have an Account</p>
                <Link to="/register" className="btn btn-default border w-100 bg-light rounded-0 text-decoration-none">
                    Sign Up
                </Link>
            </div>
        </div>
    );
}

export default Login;

