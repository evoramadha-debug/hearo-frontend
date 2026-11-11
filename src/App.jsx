import React, { useState } from 'react';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Register from './pages/Register';

function App() {
  const [currentPage, setCurrentPage] = useState('landing'); // Default: 'landing'

  return (
    <div>
      {currentPage === 'landing' && (
        <LandingPage
          onNavigateToLogin={() => setCurrentPage('login')}
          onNavigateToRegister={() => setCurrentPage('register')}
        />
      )}

      {currentPage === 'login' && (
        <Login onNavigateToRegister={() => setCurrentPage('register')} />
      )}

      {currentPage === 'register' && (
        <Register onNavigateToLogin={() => setCurrentPage('login')} />
      )}
    </div>
  );
}

export default App;