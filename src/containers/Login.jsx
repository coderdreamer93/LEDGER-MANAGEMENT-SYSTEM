import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAuth } from './AuthContext';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const { login } = useAuth(); // Use the login function from AuthContext

  const { email, password } = formData;
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:8080/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      console.log('Response:', response); // Log response

      const data = await response.json();
      console.log('Response Data:', data); // Log response data

      // Check if login was successful
      if (response.ok) {
        login(data.token);
        console.log('Login successful:', data);
        // Show toast notification
        toast.success('Login successful');
        // Navigate to dashboard after toast closes
        navigate('/dashboard');
      } else {
        console.error('Login failed:', data);
        // Show toast notification for failure
        toast.error('Login failed');
      }
    } catch (error) {
      console.error('Error:', error);
      // Handle any network or other errors
      // Show toast notification for error
      toast.error('Invalid Email and Password');
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="border p-5 rounded">
        <h2 className="text-center mb-4">Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={handleChange}
              className="form-control"
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label">Password:</label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={handleChange}
              className="form-control"
              minLength={6}
              required
            />
          </div>
          <div className="d-flex justify-content-center">

          <button type="submit" className="btn btn-primary">Login</button>
          </div>
        </form>
        {/* <p className="mt-3 text-center">Don't have an account? <Link to="/register">Register</Link></p> */}
      </div>

      {/* Toast Container */}
      <ToastContainer />
    </div>
  );
};

export default Login;
