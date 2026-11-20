
import { useState } from 'react';
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';

import pivoLogo from '../assets/pivo-logo.png';
import heroImage from '../assets/pivo-product-poster-preview.png';

import './Login.css';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [feedback, setFeedback] = useState('');

  const handleLogin = (event) => {
    event.preventDefault();

    // Authentication and custom validation will be added later.
    setFeedback('Login UI preview only. Authentication is not connected yet.');
  };

  return (
    <div className="pivo-auth">

      {/* Navigation header */}
      <header className="pivo-header">
        <div className="pivo-header-inner">

          <div className="pivo-brand">
            <img src={pivoLogo} alt="PIVO logo" />

            <div className="pivo-brand-text">
              <strong>PIVO</strong>
              <span>PIVO Holdings</span>
            </div>
          </div>

          <nav className="pivo-nav" aria-label="Main navigation">
            <span>Home</span>
            <span>Products</span>
            <span>Our Story</span>
            <span className="active">Sign In</span>
          </nav>

        </div>
      </header>

      {/* Main Login section */}
      <main className="pivo-login-main">
        <div className="pivo-login-layout">

          {/* Left side - Login form */}
          <section className="pivo-login-content">

            <p className="pivo-eyebrow">
              Welcome to PIVO Holdings
            </p>

            <h1>Welcome Back</h1>

            <p className="pivo-description">
              Sign in to your account to manage your orders
              and stay connected with PIVO.
            </p>

            <form className="pivo-login-form" onSubmit={handleLogin}>

              <div className="pivo-form-field">
                <label htmlFor="login-email">Email Address</label>

                <div className="pivo-input-group">
                  <FaEnvelope className="pivo-input-icon" aria-hidden="true" />

                  <input
                    id="login-email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    autoComplete="username"
                    required
                  />
                </div>
              </div>

              <div className="pivo-form-field">
                <label htmlFor="login-password">Password</label>

                <div className="pivo-input-group">
                  <FaLock className="pivo-input-icon" aria-hidden="true" />

                  <input
                    id="login-password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    autoComplete="current-password"
                    required
                  />

                  <button
                    type="button"
                    className="pivo-password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>

              <div className="pivo-form-options">
                <label className="pivo-remember">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(event) => setRememberMe(event.target.checked)}
                  />
                  Remember Me
                </label>

                <button
                  type="button"
                  className="pivo-text-button"
                  onClick={() => setFeedback('Password recovery will be added later.')}
                >
                  Forgot Password?
                </button>
              </div>

              <button type="submit" className="pivo-login-button">
                Login
              </button>

              {feedback && (
                <p className="pivo-feedback" role="status">
                  {feedback}
                </p>
              )}

              <p className="pivo-register-text">
                Don't have an account?{' '}
                <button
                  type="button"
                  className="pivo-text-button"
                  onClick={() => setFeedback('Shop Owner Registration will be added later.')}
                >
                  Register your shop
                </button>
              </p>

            </form>
          </section>

          {/* Right side - Product imagery */}
          <aside className="pivo-login-visual">
            <img
              src={heroImage}
              alt="PIVO fruit nectar products"
            />
          </aside>

        </div>
      </main>

    </div>
  );
}

export default Login;
