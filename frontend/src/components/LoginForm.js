import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MDBBtn,
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBIcon,
  MDBInput
} from 'mdb-react-ui-kit';
import api from '../services/api';

function LoginForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/login', {
        username,
        password
      });

      localStorage.setItem('token', response.data.token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Đăng nhập thất bại');
    }
  };

  return (
    <MDBContainer fluid>
      <MDBRow>
        <MDBCol sm='6'>
          <div className='d-flex flex-row ps-5 pt-5'>
            <MDBIcon fas icon="crow fa-3x me-3" style={{ color: '#709085' }}/>
            <span className="h1 fw-bold mb-0">Logo</span>
          </div>

          <div className='d-flex flex-column justify-content-center h-custom-2 w-75 pt-4'>
            <h3 className="fw-normal mb-3 ps-5 pb-3" style={{letterSpacing: '1px'}}>Log in</h3>
            
            {error && (
              <div className="alert alert-danger mx-5 w-100">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <MDBInput 
                wrapperClass='mb-4 mx-5 w-100' 
                label='Username' 
                id='username'
                type='text' 
                size="lg"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
              
              <MDBInput 
                wrapperClass='mb-4 mx-5 w-100' 
                label='Password' 
                id='password'
                type='password' 
                size="lg"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              <MDBBtn 
                className="mb-4 px-5 mx-5 w-100" 
                color='info' 
                size='lg'
                type='submit'
              >
                Login
              </MDBBtn>
            </form>

            <p className="small mb-5 pb-lg-3 ms-5">
              <a className="text-muted" href="#!">Forgot password?</a>
            </p>
            <p className='ms-5'>
              Don't have an account?{' '}
              <a href="/register" className="link-info">Register here</a>
            </p>
          </div>
        </MDBCol>

        <MDBCol sm='6' className='d-none d-sm-block px-0'>
          <img 
            src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/img3.webp"
            alt="Login" 
            className="w-100" 
            style={{objectFit: 'cover', objectPosition: 'left'}} 
          />
        </MDBCol>
      </MDBRow>
    </MDBContainer>
  );
}

export default LoginForm;