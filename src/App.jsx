import React, { useState } from 'react';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Register from './pages/Register';
import StudentDashboard from './pages/StudentDashboard';
import ForgotPasswordFlow from './components/ForgotPasswordFlow';

function App() {
  const [currentPage, setCurrentPage] = useState('landing');
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [resetPrefill, setResetPrefill] = useState({
    email: '',
    role: 'Murid',
  });

  const handleLoginSuccess = (userData) => {
    setLoggedInUser(userData);
    if (userData?.role === 'MURID') {
      setCurrentPage('student-dashboard');
    } else {
      // Sementara arahkan ke student-dashboard jika role lain belum dibuat
      setCurrentPage('student-dashboard');
    }
  };

  // Menyamakan format role dari Login (GURU/MURID/ORANG TUA) ke Lupa Password
  const normalizeRole = (rawRole) => {
    if (!rawRole) return 'Murid';
    const upper = rawRole.toUpperCase();
    if (upper === 'GURU') return 'Guru';
    if (upper === 'ORANG TUA') return 'Orang Tua';
    return 'Murid';
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
          onNavigateToForgotPassword={(email = '', role = 'Murid') => {
            setResetPrefill({
              email,
              role: normalizeRole(role),
            });
            setCurrentPage('forgot-password');
          }}
          onLoginSuccess={handleLoginSuccess}
        />
      )}

      {currentPage === 'forgot-password' && (
        <ForgotPasswordFlow
          initialEmail={resetPrefill.email}
          initialRole={resetPrefill.role}
          onBackToLogin={() => setCurrentPage('login')}
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