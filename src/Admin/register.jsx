import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import '../Admin/Style/login.css';
import '../Admin/media/login-media.css';
import loginImage from '../assets/Login.img.png';
import axios from 'axios';

const Register = () => {
  const [formData, setFormData] = useState({ email: '', password: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false); 
  const navigate = useNavigate(); 

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
   
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }

    setLoading(true);

    try {
      const res = await axios.post('http://localhost:5000/register', {
        email: formData.email,
        password: formData.password
      });
      
 

      setFormData({ email: '', password: '', confirmPassword: '' });
      

      setTimeout(() => {
        navigate('/admin/login');
      }, 1000);
      
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Error registering user!');
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
        <p className='p-credentials'>Enter your details to create an account.</p>
        <div className="login-box p-4 rounded bg-white ">
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

            <Form.Group className="mb-3 input" controlId="formConfirmPassword">
              <Form.Control
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <div className="main justify-content-between align-items-center mb-3 input">
              <div className="align-items-center checkbox">
                <input type="checkbox" id="remember" className="form-check-input me-2 remember" />
                <label htmlFor="remember" className="mb-0">Remember me</label>
              </div>
              <div className="forget">
                <a href="#" className="text-decoration-none text-success">Forgot your password?</a>
              </div>
            </div>

            <Button 
              type="submit" 
              className="btn-login btn-success w-100 fw-semibold"
              disabled={loading} // ✅ Disable button while loading
            >
              {loading ? 'Registering...' : 'Sign in'}
            </Button>

            <p className="text-center mt-3 mb-0">
              You have an account?{' '}
              <a href="/admin/login" className="text-success text-decoration-none">Log in</a>
            </p>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default Register;