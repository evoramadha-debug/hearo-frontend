import React, { useEffect, useState } from 'react';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Register from './pages/Register';
import StudentDashboard from './pages/StudentDashboard';
import ForgotPasswordFlow from './components/ForgotPasswordFlow';
import TeacherDashboard from './pages/TeacherDashboard';
import ParentDashboard from './pages/ParentDashboard';
import {
  apiRequest,
  clearAccessToken,
  getAccessToken,
  normalizeUser,
  setAccessToken,
} from './services/api';

const getDashboardPage = (role) => {
  const roleUpper = role?.toUpperCase();

  if (roleUpper === 'MURID') return 'student-dashboard';
  if (roleUpper === 'GURU') return 'teacher-dashboard';
  if (roleUpper === 'ORANG TUA' || roleUpper === 'ORANG_TUA') return 'parent-dashboard';

  throw new Error('Peran akun dari server tidak dikenali.');
};

function App() {
  const [currentPage, setCurrentPage] = useState(() =>
    getAccessToken() ? 'loading' : 'landing'
  );
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [authError, setAuthError] = useState('');
  const [resetPrefill, setResetPrefill] = useState({
    email: '',
    role: 'Murid',
  });

  useEffect(() => {
    const token = getAccessToken();
    if (!token) return;

    let active = true;
    apiRequest('/user')
      .then((response) => {
        if (!active) return;
        const user = normalizeUser(response, response?.role);
        setLoggedInUser(user);
        setCurrentPage(getDashboardPage(user.role));
      })
      .catch((error) => {
        if (!active) return;
        if (error.status === 401) clearAccessToken();
        else setAuthError(error.message);
        setCurrentPage('landing');
      });

    return () => {
      active = false;
    };
  }, []);

  const handleAuthSuccess = ({ user, token }) => {
    setAccessToken(token);
    setLoggedInUser(user);
    setAuthError('');
    setCurrentPage(getDashboardPage(user.role));
  };

  const handleLoginSuccess = (authData) => {
    handleAuthSuccess(authData);
  };

  const handleRegisterSuccess = (authData) => {
    handleAuthSuccess(authData);
  };

  // Menyamakan format role dari Login (GURU/MURID/ORANG TUA) ke Lupa Password
  const normalizeRole = (rawRole) => {
    if (!rawRole) return 'Murid';
    const upper = rawRole.toUpperCase();
    if (upper === 'GURU') return 'Guru';
    if (upper === 'ORANG TUA' || upper === 'ORANG_TUA') return 'Orang Tua';
    return 'Murid';
  };

  const handleLogout = async () => {
    try {
      await apiRequest('/logout', { method: 'POST' });
    } catch (error) {
      if (error.status !== 401) setAuthError(`Keluar dari server gagal: ${error.message}`);
    } finally {
      clearAccessToken();
      setLoggedInUser(null);
      setCurrentPage('landing');
    }
  };

  if (currentPage === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center text-[#102A43]">
        Memeriksa sesi akun...
      </div>
    );
  }

  return (
    <div>
      {authError && (
        <div role="alert" className="fixed top-3 left-1/2 -translate-x-1/2 z-[100] max-w-xl rounded-lg bg-rose-100 px-4 py-3 text-sm text-rose-800 shadow-lg">
          {authError}
          <button type="button" className="ml-3 font-bold" onClick={() => setAuthError('')}>
            Tutup
          </button>
        </div>
      )}
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
          onRegisterSuccess={handleRegisterSuccess}
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