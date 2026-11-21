import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import App from './App.jsx';
import './index.css';

// Automatically handle direct clean URLs (e.g. /oil-converters -> /#/oil-converters)
const cleanPath = window.location.pathname.replace(/^\/H\.I_Lubricant-Porject/, '');
if (cleanPath && cleanPath !== '/' && !window.location.hash) {
  const prefix = window.location.pathname.startsWith('/H.I_Lubricant-Porject') ? '/H.I_Lubricant-Porject/#' : '/#';
  window.location.replace(prefix + cleanPath + window.location.search);
}

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Application Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          backgroundColor: '#090909',
          color: '#F5F2EA',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px',
          textAlign: 'center',
          fontFamily: 'sans-serif'
        }}>
          <h1 style={{ color: '#D7AD55', fontSize: '24px', fontWeight: 'bold', marginBottom: '12px' }}>
            H.I LUBRICANT
          </h1>
          <p style={{ color: '#A5A19A', fontSize: '14px', maxWidth: '400px', marginBottom: '20px' }}>
            An unexpected error occurred while loading this page. Tap below to reload.
          </p>
          <button
            onClick={() => window.location.reload()}
            style={{
              padding: '10px 24px',
              backgroundColor: '#D7AD55',
              color: '#090909',
              border: 'none',
              borderRadius: '10px',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
          >
            Reload Website
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <HashRouter>
        <App />
      </HashRouter>
    </ErrorBoundary>
  </React.StrictMode>
);
