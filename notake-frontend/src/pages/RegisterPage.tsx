import { useState, FormEvent } from 'react';
import authService from '../services/authService';

interface RegisterPageProps {
  onRegisterSuccess?: () => void;
  onSwitchToLogin?: () => void;
}

export default function RegisterPage({ onRegisterSuccess, onSwitchToLogin }: RegisterPageProps) {
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      await authService.register({ fullName, username, email, password });
      if (onRegisterSuccess) {
        onRegisterSuccess();
      }
    } catch (err: any) {
      setError(
        err.response?.data?.error || 
        'Registration failed. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div 
        className={`container ${isOpen ? 'open' : ''}`}
        onMouseEnter={() => setIsOpen(true)}
      >
        <div className="top"></div>
        <div className="bottom"></div>
        <div className="center">
          <h2>Create Account</h2>
          
          {error && (
            <div style={{ 
              width: '100%', 
              background: '#fee', 
              color: '#c00', 
              padding: '12px', 
              borderRadius: '4px', 
              marginBottom: '10px',
              fontSize: '14px',
              textAlign: 'center'
            }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ width: '100%' }}>
            <input
              type="text"
              placeholder="full name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              disabled={loading}
              required
            />
            <input
              type="text"
              placeholder="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={loading}
              required
            />
            <input
              type="email"
              placeholder="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              required
            />
            <input
              type="password"
              placeholder="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              required
            />
            <input
              type="password"
              placeholder="confirm password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={loading}
              required
            />
            <button 
              type="submit" 
              disabled={loading}
            >
              {loading ? 'Creating account...' : 'Sign Up'}
            </button>
          </form>

          <p style={{ marginTop: '15px', color: '#666', fontSize: '14px' }}>
            Already have an account?{' '}
            <button 
              onClick={onSwitchToLogin}
              style={{
                background: 'none',
                border: 'none',
                color: '#e46569',
                fontWeight: 'bold',
                cursor: 'pointer',
                textDecoration: 'underline',
                fontSize: '14px'
              }}
            >
              Sign in
            </button>
          </p>
        </div>
      </div>

      <style>{`
        .container {
          position: absolute;
          width: 100%;
          height: 100%;
          overflow: hidden;
        }

        .top:before, .top:after,
        .bottom:before, .bottom:after {
          content: '';
          display: block;
          position: absolute;
          width: 200vmax;
          height: 200vmax;
          top: 50%;
          left: 50%;
          margin-top: -100vmax;
          margin-left: -100vmax;
          transform-origin: 0 50%;
          transition: all 0.5s cubic-bezier(0.445, 0.05, 0, 1);
          z-index: 10;
          opacity: 0.65;
          transition-delay: 0.2s;
        }

        .top:before {
          transform: rotate(45deg);
          background: #667eea;
        }

        .top:after {
          transform: rotate(135deg);
          background: #f093fb;
        }

        .bottom:before {
          transform: rotate(-45deg);
          background: #4facfe;
        }

        .bottom:after {
          transform: rotate(-135deg);
          background: #43e97b;
        }

        .container.open .top:before,
        .container.open .top:after,
        .container.open .bottom:before,
        .container.open .bottom:after {
          margin-left: 200px;
          transform-origin: -200px 50%;
          transition-delay: 0s;
        }

        .center {
          position: absolute;
          width: 400px;
          height: 400px;
          top: 50%;
          left: 50%;
          margin-left: -200px;
          margin-top: -200px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          padding: 30px;
          opacity: 0;
          transition: all 0.5s cubic-bezier(0.445, 0.05, 0, 1);
          transition-delay: 0s;
          color: #333;
          z-index: 20;
        }

        .container.open .center {
          opacity: 1;
          transition-delay: 0.2s;
        }

        .center h2 {
          margin-bottom: 20px;
          font-size: 28px;
          font-weight: 700;
        }

        .center input {
          width: 100%;
          padding: 15px;
          margin: 5px;
          border-radius: 1px;
          border: 1px solid #ccc;
          font-family: inherit;
          font-size: 16px;
        }

        .center button[type="submit"] {
          width: 100%;
          padding: 15px;
          margin: 5px;
          border-radius: 1px;
          border: none;
          background: #e46569;
          color: white;
          font-size: 16px;
          font-weight: bold;
          cursor: pointer;
          font-family: inherit;
        }

        .center button[type="submit"]:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .center input:focus {
          outline: none;
          border-color: #e46569;
        }
      `}</style>
    </>
  );
}
