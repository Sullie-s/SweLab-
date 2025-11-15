import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const SignUp = ({ onBackClick }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 3) {
      setError('Password must be at least 3 characters');
      return;
    }

    setLoading(true);
    const result = await signup(username, password);
    setLoading(false);

    if (!result.success) {
      setError(result.error || 'Sign up failed');
    }
  };

  return (
    <div className="card">
      <h2>Create New Account</h2>
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
        <label>
          Confirm Password:
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </label>
        {error && <div style={{ color: '#c53030', marginTop: '8px', padding: '8px', background: '#fed7d7', borderRadius: '6px', border: '1px solid #fc8181' }}>{error}</div>}
        <div style={{ marginTop: '10px' }}>
          <button type="submit" className="primary" disabled={loading}>
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>
          <button type="button" className="secondary" onClick={onBackClick}>
            Back to Login
          </button>
        </div>
      </form>
    </div>
  );
};

export default SignUp;

