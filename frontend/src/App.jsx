import { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AppProvider, useApp } from './context/AppContext';
import Login from './components/Login';
import SignUp from './components/SignUp';
import ProjectManagement from './components/ProjectManagement';
import HardwareManagement from './components/HardwareManagement';
import Status from './components/Status';
import './App.css';

const AppContent = () => {
  const { user, logout } = useAuth();
  const { resetAppState } = useApp();
  const [showSignUp, setShowSignUp] = useState(false);
  const [lastUser, setLastUser] = useState(null);

  // Reset app state when user changes (but not on initial load)
  useEffect(() => {
    if (user && user.username !== lastUser) {
      // User changed - reset state
      resetAppState();
      setLastUser(user.username);
    } else if (!user) {
      setLastUser(null);
    }
  }, [user, lastUser, resetAppState]);

  if (!user) {
    return (
      <>
        <h1>Hargis Hardware-as-a-Service (HaaS)</h1>
        {showSignUp ? (
          <SignUp onBackClick={() => setShowSignUp(false)} />
        ) : (
          <Login onSignUpClick={() => setShowSignUp(true)} />
        )}
      </>
    );
  }

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1>Hargis Hardware-as-a-Service (HaaS)</h1>
        <div>
          <span style={{ marginRight: '10px' }}>Logged in as: <strong>{user.username}</strong></span>
          <button className="secondary" onClick={logout}>
            Log Off
          </button>
        </div>
      </div>

      <ProjectManagement />
      <HardwareManagement />
      <Status />
    </>
  );
};

function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <AppContent />
      </AppProvider>
    </AuthProvider>
  );
}

export default App;
