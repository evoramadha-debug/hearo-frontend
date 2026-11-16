import React, { useState } from 'react';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Register from './pages/Register';
import StudentDashboard from './pages/StudentDashboard';

function App() {
  const [currentPage, setCurrentPage] = useState('landing');
  const [loggedInUser, setLoggedInUser] = useState(null);

  const handleLoginSuccess = (userData) => {
    setLoggedInUser(userData);
    if (userData?.role === 'MURID') {
      setCurrentPage('student-dashboard');
    } else {
      // Sementara arahkan ke student-dashboard jika role lain belum dibuat
      setCurrentPage('student-dashboard');
    }
  };

  return (
    <div>
      {currentPage === 'landing' && (
        <LandingPage
          onNavigateToLogin={() => setCurrentPage('login')}
          onNavigateToRegister={() => setCurrentPage('register')}
        />
      )}

      {currentPage === 'login' && (
        <Login
          onNavigateToRegister={() => setCurrentPage('register')}
          onNavigateToLanding={() => setCurrentPage('landing')}
          onLoginSuccess={handleLoginSuccess}
        />
      )}

      {currentPage === 'register' && (
        <Register
          onNavigateToLogin={() => setCurrentPage('login')}
          onNavigateToLanding={() => setCurrentPage('landing')}
        />
      )}

      {currentPage === 'student-dashboard' && (
        <StudentDashboard
          user={loggedInUser}
          onLogout={() => {
            setLoggedInUser(null);
            setCurrentPage('landing');
          }}
        />
      )}
    </div>
  );
}

export default App;