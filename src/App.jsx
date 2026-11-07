import React, { useState } from 'react';
import Login from './pages/Login';
import Register from './pages/Register';

function App() {
  const [currentPage, setCurrentPage] = useState('login'); // State penentu halaman ('login' atau 'register')

  return (
    <div>
      {currentPage === 'login' ? (
        <Login onNavigateToRegister={() => setCurrentPage('register')} />
      ) : (
        <Register onNavigateToLogin={() => setCurrentPage('login')} />
      )}
    </div>
  );
}

export default App;