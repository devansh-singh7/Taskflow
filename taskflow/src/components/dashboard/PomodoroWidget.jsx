import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { RotateCcw } from 'lucide-react';
import { formatTime } from '../../utils/helpers';
import toast from 'react-hot-toast';

const MODES = [
  { id:'work',  label:'Focus',  dur:25*60, c:'#7c6af7' },
  { id:'short', label:'Short',  dur:5*60,  c:'#10b981' },
  { id:'long',  label:'Long',   dur:15*60, c:'#3b82f6' },
];

export default function PomodoroWidget() {
  const [mode, setMode]       = useState(MODES[0]);
  const [left, setLeft]       = useState(MODES[0].dur);
  const [running, setRunning] = useState(false);
  const iv = useRef(null);

  const circ = 2 * Math.PI * 44;
  const prog = 1 - left / mode.dur;
  const offset = circ - circ * prog;

  useEffect(() => {
    if (running) {
      iv.current = setInterval(() => {
        setLeft(t => {
          if (t <= 1) { setRunning(false); clearInterval(iv.current); toast.success(`${mode.label} session complete! 🎉`); return 0; }
          return t - 1;
        });
      }, 1000);
    } else clearInterval(iv.current);
    return () => clearInterval(iv.current);
  }, [running, mode.label]);

  const switchMode = m => { setMode(m); setLeft(m.dur); setRunning(false); };

  return (
    <motion.div initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ delay:.25 }}
      style={{
        background:'linear-gradient(145deg, #0e0f14 0%, #0c0d11 100%)',
        border:'1px solid rgba(255,255,255,0.07)', borderRadius:16, padding:'16px 18px', marginBottom:10,
      }}>
      <div style={{ fontSize:10, fontWeight:600, textTransform:'uppercase', letterSpacing:'.12em', color:'#3a3d44', marginBottom:12, fontFamily:'Geist, sans-serif' }}>
        ⏱ Focus Timer
      </div>

      {/* Mode tabs */}
      <div style={{ display:'flex', gap:4, background:'rgba(255,255,255,0.03)', borderRadius:10, padding:4, marginBottom:14, border:'1px solid rgba(255,255,255,0.06)' }}>
        {MODES.map(m => (
          <button key={m.id} onClick={() => switchMode(m)}
            style={{
              flex:1, padding:'6px', borderRadius:7, border:'none', cursor:'pointer',
              fontSize:11, fontWeight:600, fontFamily:'Geist, sans-serif', transition:'all 0.15s',
              background: mode.id===m.id ? 'rgba(255,255,255,0.08)' : 'transparent',
              color: mode.id===m.id ? '#e8eaed' : '#3a3d44',
              boxShadow: mode.id===m.id ? '0 1px 4px rgba(0,0,0,0.3)' : 'none',
            }}>
            {m.label}
          </button>
        ))}
      </div>

      {/* Circle timer */}
      <div style={{ display:'flex', justifyContent:'center', marginBottom:6, position:'relative' }}>
        <svg width="100" height="100" viewBox="0 0 100 100">
          {/* Track */}
          <circle cx="50" cy="50" r="44" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="5" />
          {/* Glow blur */}
          <circle cx="50" cy="50" r="44" fill="none" stroke={mode.c} strokeWidth="5" strokeLinecap="round"
            strokeDasharray={circ} strokeDashoffset={offset} transform="rotate(-90 50 50)"
            style={{ filter:`drop-shadow(0 0 6px ${mode.c}88)`, transition:'stroke-dashoffset 0.6s cubic-bezier(0.4,0,0.2,1), stroke 0.3s' }} />
        </svg>
        <div style={{ position:'absolute', top:'50%', left:'50%', transform:'translate(-50%,-50%)', textAlign:'center' }}>
          <div style={{ fontFamily:'Instrument Serif, serif', fontWeight:400, fontSize:22, color:'#e8eaed', lineHeight:1 }}>
            {formatTime(left)}
          </div>
          <div style={{ fontSize:9, color:'#3a3d44', marginTop:2, fontFamily:'Geist, sans-serif', fontWeight:600, textTransform:'uppercase', letterSpacing:'.08em' }}>
            {mode.label}
          </div>
        </div>
      </div>

      <div style={{ display:'flex', justifyContent:'center', gap:8, marginTop:4 }}>
        <button onClick={() => { setLeft(mode.dur); setRunning(false); }}
          style={{
            width:32, height:32, borderRadius:9, border:'1px solid rgba(255,255,255,0.08)',
            background:'rgba(255,255,255,0.04)', color:'#6b7280', cursor:'pointer',
            display:'flex', alignItems:'center', justifyContent:'center', transition:'all 0.15s',
          }}
          onMouseOver={e => { e.currentTarget.style.color='#e8eaed'; e.currentTarget.style.borderColor='rgba(255,255,255,0.15)'; }}
          onMouseOut={e => { e.currentTarget.style.color='#6b7280'; e.currentTarget.style.borderColor='rgba(255,255,255,0.08)'; }}>
          <RotateCcw size={13} />
        </button>
        <motion.button onClick={() => setRunning(!running)} whileTap={{ scale:0.95 }}
          style={{
            padding:'0 24px', height:32, borderRadius:9, border:'none',
            background: running
              ? 'rgba(255,255,255,0.08)'
              : `linear-gradient(135deg, ${mode.c}, ${mode.c}cc)`,
            color: running ? '#e8eaed' : '#fff',
            cursor:'pointer', fontFamily:'Geist, sans-serif', fontWeight:600, fontSize:12,
            transition:'all 0.15s',
            boxShadow: running ? 'none' : `0 3px 12px ${mode.c}44`,
          }}>
          {running ? '⏸ Pause' : '▶ Start'}
        </motion.button>
      </div>
    </motion.div>
  );
}
