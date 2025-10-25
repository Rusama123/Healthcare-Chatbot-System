import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // ✅ Import useNavigate
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import '../Admin/Style/login.css';
import '../Admin/media/login-media.css';
import loginImage from '../assets/Login.img.png';
import axios from 'axios';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); // ✅ Initialize navigate

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post('http://localhost:5000/login', formData);
      
      // ✅ Store user data
      localStorage.setItem('user', JSON.stringify(res.data.user));
      
      
      
      // ✅ Redirect to dashboard
      navigate('/admin/pages/dashboard');
      
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Error logging in!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-login d-flex">
      <div className="text-center login ">
        <img src={loginImage} alt="Login" className="mb-3" />
        <h2>
          Login to{' '}
          <span className="ip">IP</span>
          <span className="i">I</span>
          <span className="m">M</span>
          <span className="i">S</span>
        </h2>
        <p className='p-credentials'>Enter your credentials to access the system.</p>
        <div className="login-box p-4 rounded bg-white">
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3 input" controlId="formEmail">
              <Form.Control
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3 input" controlId="formPassword">
              <Form.Control
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <div className="main justify-content-between align-items-center mb-3 input">
              <div className="align-items-center checkbox">
                <input 
                  type="checkbox" 
                  id="remember" 
                  className="form-check-input me-2 remember" 
                />
                <label htmlFor="remember" className="mb-0">
                  Remember me
                </label>
              </div>

              <div className="forget">
                <a href="#" className="text-decoration-none text-success">
                  Forgot your password?
                </a>
              </div>
            </div>

            <Button 
              type="submit" 
              className="btn-login btn-success w-100 fw-semibold"
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Log in'}
            </Button>

            <p className="text-center mt-3 mb-0">
              Don't have an account?{' '}
              <a href="/admin/register" className="text-success text-decoration-none">
                Sign up
              </a>
            </p>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default Login;