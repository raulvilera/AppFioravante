import { useState, useEffect } from 'react';
import Login from './components/Login';
import ProfessorView from './components/ProfessorView';
import './index.css';

function App() {
  const [user, setUser] = useState<string | null>(null);

  // Recupera sessão se existir
  useEffect(() => {
    const savedUser = localStorage.getItem('user_session');
    if (savedUser) setUser(savedUser);
  }, []);

  const handleLogin = (email: string) => {
    setUser(email);
    localStorage.setItem('user_session', email);
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user_session');
  };

  return (
    <div className="min-h-screen">
      {!user ? (
        <Login onLogin={handleLogin} />
      ) : (
        <ProfessorView userEmail={user} onLogout={handleLogout} />
      )}
    </div>
  );
}

export default App;
