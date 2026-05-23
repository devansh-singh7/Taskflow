import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, User, Eye, EyeOff, Sparkles, CheckCircle } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { reinitForUser } from '../store/taskStore';
import toast from 'react-hot-toast';

const FIELD_RULES = {
  name:     v => v.trim().length >= 2     ? null : 'Name must be at least 2 characters',
  email:    v => /\S+@\S+\.\S+/.test(v)  ? null : 'Enter a valid email address',
  password: v => v.length >= 6            ? null : 'Password must be at least 6 characters',
};

export default function Login() {
  const [mode, setMode]       = useState('login');
  const [show, setShow]       = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors]   = useState({});
  const [form, setForm]       = useState({ name: '', email: '', password: '' });
  const { login, register }   = useAuthStore();

  const setField = (k, v) => {
    setForm(p => ({ ...p, [k]: v }));
    if (errors[k]) setErrors(p => ({ ...p, [k]: null }));
  };

  const validate = () => {
    const errs = {};
    if (mode === 'register') { const e = FIELD_RULES.name(form.name); if (e) errs.name = e; }
    const ee = FIELD_RULES.email(form.email);     if (ee) errs.email    = ee;
    const ep = FIELD_RULES.password(form.password); if (ep) errs.password = ep;
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handle = async () => {
    if (!validate()) return;
    setLoading(true);
    await new Promise(r => setTimeout(r, 500)); // UX delay
    const result = mode === 'login'
      ? login(form.email, form.password)
      : register(form.name, form.email, form.password);
    setLoading(false);
    if (result.error) { toast.error(result.error); return; }
    // Re-init task store with this user's scoped key
    reinitForUser(result.user.id);
    toast.success(mode === 'login' ? `Welcome back, ${result.user.name}! 👋` : `Account created! Let's get productive 🎉`);
  };

  const inp = (hasError) => ({
    width:'100%', padding:'11px 14px 11px 40px', borderRadius:11,
    border: `1px solid ${hasError ? 'rgba(239,68,68,0.5)' : 'rgba(255,255,255,0.09)'}`,
    background: hasError ? 'rgba(239,68,68,0.06)' : 'rgba(255,255,255,0.04)',
    color:'#e8eaed', fontSize:13, fontFamily:'Geist, sans-serif',
    outline:'none', transition:'all 0.18s',
  });

  return (
    <div style={{ minHeight:'100vh', background:'#08090a', display:'flex', alignItems:'center', justifyContent:'center', padding:20, position:'relative', overflow:'hidden' }}>
      {/* Ambient orbs */}
      <div style={{ position:'absolute', top:'15%', left:'10%', width:500, height:500, borderRadius:'50%', background:'radial-gradient(circle, rgba(124,106,247,0.07) 0%, transparent 70%)', pointerEvents:'none' }} />
      <div style={{ position:'absolute', bottom:'10%', right:'10%', width:400, height:400, borderRadius:'50%', background:'radial-gradient(circle, rgba(236,72,153,0.05) 0%, transparent 70%)', pointerEvents:'none' }} />

      <motion.div initial={{ opacity:0, y:28 }} animate={{ opacity:1, y:0 }} transition={{ duration:.5, ease:[0.22,1,0.36,1] }}
        style={{ width:'100%', maxWidth:420 }}>

        {/* Brand */}
        <div style={{ display:'flex', flexDirection:'column', alignItems:'center', marginBottom:32 }}>
          <motion.div whileHover={{ scale:1.05 }} style={{ width:52, height:52, borderRadius:16, background:'linear-gradient(135deg,#7c6af7,#a78bfa)', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 10px 30px rgba(124,106,247,0.45)', marginBottom:14 }}>
            <svg width="28" height="28" viewBox="0 0 34 34" fill="none"><path d="M6 10h22M6 17h14M6 24h17" stroke="#fff" strokeWidth="2.5" strokeLinecap="round"/><circle cx="27" cy="24" r="5" fill="#fff" fillOpacity="0.3"/><path d="M25.2 24l1.2 1.4 2.4-2.6" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </motion.div>
          <div style={{ fontFamily:'Instrument Serif, serif', fontSize:26, color:'#e8eaed', lineHeight:1.1, textAlign:'center' }}>TaskFlow</div>
          <div style={{ fontSize:11, color:'#3a3d44', textTransform:'uppercase', letterSpacing:'.1em', fontFamily:'Geist, sans-serif', marginTop:4 }}>Your productivity workspace</div>
        </div>

        <div style={{ background:'linear-gradient(145deg,#0e0f14,#0c0d11)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:24, overflow:'hidden', boxShadow:'0 24px 80px rgba(0,0,0,0.7), 0 0 0 1px rgba(124,106,247,0.06)' }}>
          <div style={{ height:3, background:'linear-gradient(90deg,#7c6af7,#a78bfa,#ec4899)', opacity:.85 }} />

          {/* Tab switcher */}
          <div style={{ display:'flex', margin:'22px 22px 0', background:'rgba(255,255,255,0.03)', borderRadius:12, padding:4, border:'1px solid rgba(255,255,255,0.06)' }}>
            {['login','register'].map(m => (
              <button key={m} onClick={() => { setMode(m); setErrors({}); }}
                style={{ flex:1, padding:'9px', borderRadius:9, border:'none', cursor:'pointer', fontFamily:'Geist, sans-serif', fontSize:13, fontWeight:500, transition:'all .18s',
                  background: mode===m ? 'rgba(255,255,255,0.09)' : 'transparent',
                  color: mode===m ? '#e8eaed' : '#3a3d44',
                  boxShadow: mode===m ? '0 2px 6px rgba(0,0,0,0.35)' : 'none',
                }}>
                {m === 'login' ? '→ Sign In' : '✦ Create Account'}
              </button>
            ))}
          </div>

          <div style={{ padding:'22px 24px 26px' }}>
            <AnimatePresence mode="wait">
              <motion.div key={mode} initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-6 }} transition={{ duration:.18 }}>

                <div style={{ marginBottom:20 }}>
                  <div style={{ fontFamily:'Instrument Serif, serif', fontSize:20, color:'#e8eaed', marginBottom:5 }}>
                    {mode === 'login' ? 'Welcome back' : 'Get started free'}
                  </div>
                  <div style={{ fontSize:12, color:'#3a3d44', fontFamily:'Geist, sans-serif', lineHeight:1.5 }}>
                    {mode === 'login'
                      ? 'Sign in to access your personal workspace'
                      : 'Every account gets a fully isolated, private workspace'}
                  </div>
                </div>

                <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
                  {mode === 'register' && (
                    <div>
                      <div style={{ position:'relative' }}>
                        <User size={14} style={{ position:'absolute', left:13, top:'50%', transform:'translateY(-50%)', color:'#3a3d44', pointerEvents:'none' }} />
                        <input value={form.name} onChange={e => setField('name', e.target.value)} placeholder="Full name" style={inp(errors.name)}
                          onFocus={e => { e.target.style.borderColor='rgba(124,106,247,0.5)'; e.target.style.boxShadow='0 0 0 3px rgba(124,106,247,0.1)'; }}
                          onBlur={e => { e.target.style.borderColor=errors.name?'rgba(239,68,68,0.5)':'rgba(255,255,255,0.09)'; e.target.style.boxShadow='none'; }} />
                      </div>
                      {errors.name && <div style={{ fontSize:11, color:'#f87171', marginTop:5, fontFamily:'Geist, sans-serif', paddingLeft:4 }}>⚠ {errors.name}</div>}
                    </div>
                  )}

                  <div>
                    <div style={{ position:'relative' }}>
                      <Mail size={14} style={{ position:'absolute', left:13, top:'50%', transform:'translateY(-50%)', color:'#3a3d44', pointerEvents:'none' }} />
                      <input type="email" value={form.email} onChange={e => setField('email', e.target.value)} placeholder="Email address" style={inp(errors.email)}
                        onFocus={e => { e.target.style.borderColor='rgba(124,106,247,0.5)'; e.target.style.boxShadow='0 0 0 3px rgba(124,106,247,0.1)'; }}
                        onBlur={e => { e.target.style.borderColor=errors.email?'rgba(239,68,68,0.5)':'rgba(255,255,255,0.09)'; e.target.style.boxShadow='none'; }} />
                    </div>
                    {errors.email && <div style={{ fontSize:11, color:'#f87171', marginTop:5, fontFamily:'Geist, sans-serif', paddingLeft:4 }}>⚠ {errors.email}</div>}
                  </div>

                  <div>
                    <div style={{ position:'relative' }}>
                      <Lock size={14} style={{ position:'absolute', left:13, top:'50%', transform:'translateY(-50%)', color:'#3a3d44', pointerEvents:'none' }} />
                      <input type={show?'text':'password'} value={form.password} onChange={e => setField('password', e.target.value)}
                        onKeyDown={e => e.key==='Enter' && handle()} placeholder="Password (6+ characters)" style={{ ...inp(errors.password), paddingRight:42 }}
                        onFocus={e => { e.target.style.borderColor='rgba(124,106,247,0.5)'; e.target.style.boxShadow='0 0 0 3px rgba(124,106,247,0.1)'; }}
                        onBlur={e => { e.target.style.borderColor=errors.password?'rgba(239,68,68,0.5)':'rgba(255,255,255,0.09)'; e.target.style.boxShadow='none'; }} />
                      <button onClick={() => setShow(!show)} style={{ position:'absolute', right:12, top:'50%', transform:'translateY(-50%)', background:'none', border:'none', cursor:'pointer', color:'#3a3d44', padding:2 }}
                        onMouseOver={e=>e.currentTarget.style.color='#6b7280'} onMouseOut={e=>e.currentTarget.style.color='#3a3d44'}>
                        {show ? <EyeOff size={14} /> : <Eye size={14} />}
                      </button>
                    </div>
                    {errors.password && <div style={{ fontSize:11, color:'#f87171', marginTop:5, fontFamily:'Geist, sans-serif', paddingLeft:4 }}>⚠ {errors.password}</div>}
                  </div>
                </div>

                <motion.button onClick={handle} whileHover={{ scale:1.01 }} whileTap={{ scale:.98 }} disabled={loading}
                  style={{ width:'100%', marginTop:22, padding:'13px', borderRadius:13, border:'none', background:'linear-gradient(135deg,#7c6af7,#9580ff)', color:'#fff', fontWeight:600, fontSize:14, fontFamily:'Geist, sans-serif', cursor:loading?'not-allowed':'pointer', boxShadow:'0 4px 20px rgba(124,106,247,0.45)', display:'flex', alignItems:'center', justifyContent:'center', gap:9, opacity:loading?.7:1, transition:'all .15s' }}>
                  {loading
                    ? <><motion.div animate={{ rotate:360 }} transition={{ duration:.9, repeat:Infinity, ease:'linear' }}><Sparkles size={15}/></motion.div>{mode==='login'?'Signing in…':'Creating account…'}</>
                    : <>{mode==='login'?'Sign In':'Create Account'} →</>}
                </motion.button>

                {mode === 'register' && (
                  <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} style={{ marginTop:16, padding:'12px 14px', borderRadius:11, background:'rgba(16,185,129,0.07)', border:'1px solid rgba(16,185,129,0.2)' }}>
                    {['Isolated private workspace per account','Tasks never shared between users','Persistent login with secure token'].map(f => (
                      <div key={f} style={{ display:'flex', alignItems:'center', gap:8, marginBottom:6, fontSize:11, color:'#6ee7b7', fontFamily:'Geist, sans-serif' }}>
                        <CheckCircle size={11} />{f}
                      </div>
                    ))}
                  </motion.div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        <div style={{ textAlign:'center', marginTop:20, fontSize:11, color:'#2a2d35', fontFamily:'Geist, sans-serif' }}>
          Each user account has completely isolated data · Passwords are hashed
        </div>
      </motion.div>
    </div>
  );
}
