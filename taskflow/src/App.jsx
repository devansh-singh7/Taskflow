import { useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { useAuthStore } from './store/authStore';
import { reinitForUser } from './store/taskStore';
import MainLayout from './layouts/MainLayout';
import Login from './pages/Login';

export default function App() {
  const { isAuthenticated, user, checkAuth } = useAuthStore();

  // On mount: verify stored JWT is still valid and re-init task store for the user
  useEffect(() => {
    const valid = checkAuth();
    if (valid && user?.id) {
      reinitForUser(user.id);
    }
  }, []); // eslint-disable-line

  return (
    <div className="min-h-screen" style={{ background:'var(--c-bg)', color:'var(--c-text)' }}>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            fontFamily: 'Geist, sans-serif',
            fontSize: '13px',
            borderRadius: '12px',
            padding: '12px 16px',
            background: 'linear-gradient(145deg,#13141c,#0e0f16)',
            color: '#e8eaed',
            border: '1px solid rgba(255,255,255,0.1)',
            boxShadow: '0 12px 40px rgba(0,0,0,0.7)',
          },
          success: { iconTheme: { primary:'#10b981', secondary:'#0a1512' } },
          error:   { iconTheme: { primary:'#f87171', secondary:'#180a0a' } },
        }}
      />
      {isAuthenticated ? <MainLayout /> : <Login />}
    </div>
  );
}
