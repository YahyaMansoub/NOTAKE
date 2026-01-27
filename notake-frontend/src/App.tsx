import { useState, useEffect } from 'react';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Dashboard from './pages/Dashboard';
import authService from './services/authService';

type View = 'login' | 'register' | 'dashboard';

function App() {
  const [currentView, setCurrentView] = useState<View>('login');

  useEffect(() => {
    if (authService.isAuthenticated()) {
      setCurrentView('dashboard');
    }
  }, []);

  const handleLoginSuccess = () => {
    setCurrentView('dashboard');
  };

  const handleRegisterSuccess = () => {
    setCurrentView('dashboard');
  };

  const switchToRegister = () => {
    setCurrentView('register');
  };

  const switchToLogin = () => {
    setCurrentView('login');
  };

  return (
    <>
      {currentView === 'dashboard' && <Dashboard />}
      {currentView === 'login' && (
        <LoginPage 
          onLoginSuccess={handleLoginSuccess} 
          onSwitchToRegister={switchToRegister}
        />
      )}
      {currentView === 'register' && (
        <RegisterPage 
          onRegisterSuccess={handleRegisterSuccess}
          onSwitchToLogin={switchToLogin}
        />
      )}
    </>
  );
}

export default App;
