import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const Login = ({ onSignUpClick }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(username, password);
    setLoading(false);

    if (!result.success) {
      setError(result.error || 'Login failed');
    }
  };

  return (
    <div className="card">
      <h2>User Login</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Username:
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </label>
        <label>
          Password:
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        {error && <div style={{ color: '#c53030', marginTop: '8px', padding: '8px', background: '#fed7d7', borderRadius: '6px', border: '1px solid #fc8181' }}>{error}</div>}
        <div style={{ marginTop: '10px' }}>
          <button type="submit" className="primary" disabled={loading}>
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
          <button type="button" className="secondary" onClick={onSignUpClick}>
            New User
          </button>
        </div>
      </form>
    </div>
  );
};

export default Login;

