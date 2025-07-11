import React, { useState } from 'react';
import {
  MDBBtn,
  MDBContainer,
  MDBCard,
  MDBCardBody,
  MDBInput,
  MDBIcon,
  MDBRow,
  MDBCol,
  MDBCheckbox
} from 'mdb-react-ui-kit';
import api from '../services/api'; // Import API service của bạn

function RegisterForm() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/register', {
        username: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        password: formData.password
      });
      console.log('Registration success:', response.data);
    } catch (error) {
      console.error('Registration failed:', error.response?.data);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <MDBContainer fluid className='my-5'>
      <MDBRow className='g-0 align-items-center'>
        <MDBCol col='6'>
          <MDBCard className='my-5 cascading-right' style={{background: 'hsla(0, 0%, 100%, 0.55)',  backdropFilter: 'blur(30px)'}}>
            <MDBCardBody className='p-5 shadow-5 text-center'>
              <h2 className="fw-bold mb-5">Sign up now</h2>

              <form onSubmit={handleSubmit}>
                <MDBRow>
                  <MDBCol col='6'>
                    <MDBInput 
                      wrapperClass='mb-4' 
                      label='First name' 
                      name='firstName'
                      value={formData.firstName}
                      onChange={handleChange}
                      required
                    />
                  </MDBCol>

                  <MDBCol col='6'>
                    <MDBInput 
                      wrapperClass='mb-4' 
                      label='Last name' 
                      name='lastName'
                      value={formData.lastName}
                      onChange={handleChange}
                      required
                    />
                  </MDBCol>
                </MDBRow>

                <MDBInput 
                  wrapperClass='mb-4' 
                  label='Email' 
                  type='email'
                  name='email'
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
                
                <MDBInput 
                  wrapperClass='mb-4' 
                  label='Password' 
                  type='password'
                  name='password'
                  value={formData.password}
                  onChange={handleChange}
                  required
                />

                <div className='d-flex justify-content-center mb-4'>
                  <MDBCheckbox 
                    name='flexCheck' 
                    id='flexCheckDefault' 
                    label='Subscribe to our newsletter' 
                  />
                </div>

                <MDBBtn className='w-100 mb-4' size='md' type='submit'>
                  Sign up
                </MDBBtn>
              </form>

              <div className="text-center">
                <p>or sign up with:</p>
                {/* Các nút social login */}
              </div>
            </MDBCardBody>
          </MDBCard>
        </MDBCol>

        <MDBCol col='6'>
          <img 
            src="https://mdbootstrap.com/img/new/ecommerce/vertical/004.jpg" 
            className="w-100 rounded-4 shadow-4"
            alt="" 
          />
        </MDBCol>
      </MDBRow>
    </MDBContainer>
  );
}

export default RegisterForm;