import React, { useState } from 'react';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Register from './pages/Register';
import StudentDashboard from './pages/StudentDashboard';
import ForgotPasswordFlow from './components/ForgotPasswordFlow';
import TeacherDashboard from './pages/TeacherDashboard';
import ParentDashboard from './pages/ParentDashboard';

function App() {
  const [currentPage, setCurrentPage] = useState('landing');
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [resetPrefill, setResetPrefill] = useState({
    email: '',
    role: 'Murid',
  });

  const handleLoginSuccess = (userData) => {
    setLoggedInUser(userData);
    const roleUpper = userData?.role?.toUpperCase();

    if (roleUpper === 'MURID') {
      setCurrentPage('student-dashboard');
    } else if (roleUpper === 'GURU') {
      setCurrentPage('teacher-dashboard');
    } else if (roleUpper === 'ORANG TUA' || roleUpper === 'ORANG_TUA') {
      setCurrentPage('parent-dashboard');
    }
  };

  // Menyamakan format role dari Login (GURU/MURID/ORANG TUA) ke Lupa Password
  const normalizeRole = (rawRole) => {
    if (!rawRole) return 'Murid';
    const upper = rawRole.toUpperCase();
    if (upper === 'GURU') return 'Guru';
    if (upper === 'ORANG TUA' || upper === 'ORANG_TUA') return 'Orang Tua';
    return 'Murid';
  };

  const handleLogout = () => {
    setLoggedInUser(null);
    setCurrentPage('landing');
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
        <StudentDashboard user={loggedInUser} onLogout={handleLogout} />
      )}

      {currentPage === 'teacher-dashboard' && (
        <TeacherDashboard user={loggedInUser} onLogout={handleLogout} />
      )}

      {currentPage === 'parent-dashboard' && (
        <ParentDashboard user={loggedInUser} onLogout={handleLogout} />
      )}
    </div>
  );
}

export default App;