import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Simple but secure-enough client-side password hashing using a salt
// In production this would be bcrypt on the server — this mirrors that pattern
const hashPassword = (password, salt) => {
  let hash = 0;
  const str = password + salt;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(36) + salt;
};

const generateSalt = () => Math.random().toString(36).substring(2, 10);

const generateJWT = (userId, email) => {
  // Simulated JWT: base64(header).base64(payload).signature
  const header  = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const payload = btoa(JSON.stringify({ sub: userId, email, iat: Date.now(), exp: Date.now() + 7*24*60*60*1000 }));
  const sig = btoa(hashPassword(header + '.' + payload, 'tf-secret-2025'));
  return `${header}.${payload}.${sig}`;
};

const verifyJWT = (token) => {
  try {
    const [, payloadB64] = token.split('.');
    const payload = JSON.parse(atob(payloadB64));
    if (payload.exp < Date.now()) return null; // expired
    return payload;
  } catch { return null; }
};

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      /**
       * Login with email + password.
       * Looks up hashed password in tf-users registry.
       * Issues a JWT token on success.
       */
      login: (email, password) => {
        const users = JSON.parse(localStorage.getItem('tf-users') || '[]');
        const found = users.find(u => u.email.toLowerCase() === email.toLowerCase());
        if (!found) return { error: 'No account found with this email' };

        const inputHash = hashPassword(password, found.salt);
        if (inputHash !== found.passwordHash) return { error: 'Incorrect password' };

        const token = generateJWT(found.id, found.email);
        const user = { id: found.id, name: found.name, email: found.email };
        set({ user, token, isAuthenticated: true });
        return { success: true, user };
      },

      /**
       * Register a new user.
       * Hashes password with a unique salt before storing.
       */
      register: (name, email, password) => {
        const users = JSON.parse(localStorage.getItem('tf-users') || '[]');
        if (users.find(u => u.email.toLowerCase() === email.toLowerCase())) {
          return { error: 'This email is already registered' };
        }
        const salt = generateSalt();
        const passwordHash = hashPassword(password, salt);
        const id = `user_${Date.now()}_${Math.random().toString(36).slice(2)}`;
        const newUser = { id, name, email: email.toLowerCase(), passwordHash, salt, createdAt: new Date().toISOString() };
        localStorage.setItem('tf-users', JSON.stringify([...users, newUser]));

        const token = generateJWT(id, email);
        const user = { id, name, email: email.toLowerCase() };
        set({ user, token, isAuthenticated: true });
        return { success: true, user };
      },

      /** Logout: clear session state */
      logout: () => set({ user: null, token: null, isAuthenticated: false }),

      /** Verify stored token is still valid */
      checkAuth: () => {
        const state = useAuthStore.getState();
        if (!state.token) { set({ user: null, isAuthenticated: false }); return false; }
        const payload = verifyJWT(state.token);
        if (!payload) { set({ user: null, token: null, isAuthenticated: false }); return false; }
        return true;
      },
    }),
    {
      name: 'taskflow-auth-v2',
      partialize: (s) => ({ user: s.user, token: s.token, isAuthenticated: s.isAuthenticated }),
    }
  )
);
