import React from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div style={{ textAlign: 'center', padding: '20px' }}>
      <h1>Welcome to Dashboard</h1>
      <p>You are logged in!</p>
      <button 
        onClick={handleLogout}
        style={{ padding: '10px 15px', background: '#dc3545', color: 'white', border: 'none' }}
      >
        Logout
      </button>
    </div>
  );
};

export default Dashboard;