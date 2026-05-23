import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RotateCcw, Edit3, Check, X, Volume2, VolumeX } from 'lucide-react';
import toast from 'react-hot-toast';

const MODES = [
  { id:'work',  label:'Focus',  dur:25, c:'#7c6af7', sub:'Deep focus session' },
  { id:'short', label:'Short Break', dur:5, c:'#10b981', sub:'Quick recharge' },
  { id:'long',  label:'Long Break', dur:15, c:'#3b82f6', sub:'Extended rest' },
];

function playDone() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const notes = [523.25, 659.25, 783.99, 1046.5];
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain); gain.connect(ctx.destination);
      osc.frequency.value = freq;
      osc.type = 'sine';
      gain.gain.setValueAtTime(0, ctx.currentTime + i * 0.18);
      gain.gain.linearRampToValueAtTime(0.28, ctx.currentTime + i * 0.18 + 0.04);
      gain.gain.linearRampToValueAtTime(0, ctx.currentTime + i * 0.18 + 0.32);
      osc.start(ctx.currentTime + i * 0.18);
      osc.stop(ctx.currentTime + i * 0.18 + 0.35);
    });
  } catch {}
}

export default function Pomodoro() {
  const [mode, setMode] = useState(MODES[0]);
  const [mins, setMins] = useState(25);
  const [left, setLeft] = useState(25 * 60);
  const [running, setRunning] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editVal, setEditVal] = useState('25');
  const [muted, setMuted] = useState(false);
  const [sessions, setSessions] = useState([]);
  const [completions, setCompletions] = useState(0);
  const iv = useRef(null);

  const circ = 2 * Math.PI * 80;
  const prog = 1 - left / (mins * 60);
  const offset = circ - circ * prog;

  useEffect(() => {
    if (running) {
      iv.current = setInterval(() => {
        setLeft(t => {
          if (t <= 1) {
            clearInterval(iv.current);
            setRunning(false);
            if (!muted) playDone();
            toast.success(`${mode.label} complete! 🎉`, { duration: 5000 });
            setCompletions(c => c + 1);
            setSessions(s => [...s, { mode: mode.label, mins, ts: new Date().toLocaleTimeString() }]);
            return 0;
          }
          return t - 1;
        });
      }, 1000);
    } else clearInterval(iv.current);
    return () => clearInterval(iv.current);
  }, [running, mode.label, muted]);

  const switchMode = m => { setMode(m); setMins(m.dur); setLeft(m.dur * 60); setRunning(false); clearInterval(iv.current); };

  const saveEdit = () => {
    const v = parseInt(editVal);
    if (isNaN(v) || v < 1 || v > 180) { toast.error('Enter 1–180 minutes'); return; }
    setMins(v); setLeft(v * 60); setRunning(false); setEditing(false);
  };

  const fmt = t => `${String(Math.floor(t / 60)).padStart(2,'0')}:${String(t % 60).padStart(2,'0')}`;
  const pct = Math.round(prog * 100);

  return (
    <div style={{ maxWidth:700, margin:'0 auto' }}>
      <motion.div initial={{ opacity:0, y:-10 }} animate={{ opacity:1, y:0 }} style={{ marginBottom:28 }}>
        <h1 style={{ fontFamily:'Instrument Serif, serif', fontSize:26, color:'#e8eaed', fontWeight:400 }}>Pomodoro Timer</h1>
        <p style={{ fontSize:12, color:'#3a3d44', marginTop:4, fontFamily:'Geist, sans-serif' }}>Stay focused · {completions} sessions completed today</p>
      </motion.div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 320px', gap:16 }}>
        {/* Timer */}
        <div style={{ background:'linear-gradient(145deg,#0e0f14,#0c0d11)', border:'1px solid rgba(255,255,255,0.07)', borderRadius:16, padding:'28px 24px' }}>
          {/* Mode tabs */}
          <div style={{ display:'flex', gap:6, background:'rgba(255,255,255,0.03)', borderRadius:11, padding:4, marginBottom:28, border:'1px solid rgba(255,255,255,0.06)' }}>
            {MODES.map(m => (
              <button key={m.id} onClick={() => switchMode(m)}
                style={{ flex:1, padding:'8px', borderRadius:8, border:'none', cursor:'pointer', fontSize:12, fontWeight:600, fontFamily:'Geist, sans-serif', transition:'all .15s',
                  background: mode.id===m.id ? 'rgba(255,255,255,0.09)' : 'transparent',
                  color: mode.id===m.id ? '#e8eaed' : '#3a3d44',
                  boxShadow: mode.id===m.id ? '0 1px 4px rgba(0,0,0,0.3)' : 'none',
                }}>
                {m.label}
              </button>
            ))}
          </div>

          {/* Circle */}
          <div style={{ display:'flex', justifyContent:'center', marginBottom:20, position:'relative' }}>
            <svg width="190" height="190" viewBox="0 0 190 190">
              <circle cx="95" cy="95" r="80" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
              <circle cx="95" cy="95" r="80" fill="none" stroke={mode.c} strokeWidth="8" strokeLinecap="round"
                strokeDasharray={circ} strokeDashoffset={offset} transform="rotate(-90 95 95)"
                style={{ filter:`drop-shadow(0 0 10px ${mode.c}88)`, transition:'stroke-dashoffset .7s cubic-bezier(.4,0,.2,1), stroke .3s' }} />
              <circle cx="95" cy="95" r="72" fill="rgba(14,15,20,0.6)" />
            </svg>
            <div style={{ position:'absolute', top:'50%', left:'50%', transform:'translate(-50%,-50%)', textAlign:'center' }}>
              {editing ? (
                <div style={{ display:'flex', alignItems:'center', gap:6 }}>
                  <input autoFocus value={editVal} onChange={e => setEditVal(e.target.value)} onKeyDown={e => { if(e.key==='Enter') saveEdit(); if(e.key==='Escape') setEditing(false); }}
                    style={{ width:64, textAlign:'center', fontFamily:'Instrument Serif, serif', fontSize:26, color:'#e8eaed', background:'rgba(255,255,255,0.08)', border:`1px solid ${mode.c}66`, borderRadius:8, outline:'none', padding:'4px 6px' }} />
                  <span style={{ fontSize:14, color:'#6b7280', fontFamily:'Geist, sans-serif' }}>min</span>
                  <div style={{ display:'flex', flexDirection:'column', gap:3 }}>
                    <button onClick={saveEdit} style={{ width:22, height:22, borderRadius:6, background:'rgba(16,185,129,.2)', border:'1px solid rgba(16,185,129,.4)', color:'#10b981', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}><Check size={11} /></button>
                    <button onClick={() => setEditing(false)} style={{ width:22, height:22, borderRadius:6, background:'rgba(239,68,68,.1)', border:'1px solid rgba(239,68,68,.3)', color:'#f87171', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}><X size={11} /></button>
                  </div>
                </div>
              ) : (
                <>
                  <div style={{ fontFamily:'Instrument Serif, serif', fontSize:44, color:'#e8eaed', lineHeight:1 }}>{fmt(left)}</div>
                  <div style={{ fontSize:11, color:'#3a3d44', marginTop:4, fontFamily:'Geist, sans-serif', fontWeight:600, textTransform:'uppercase', letterSpacing:'.08em' }}>{mode.sub}</div>
                  <div style={{ fontSize:12, color: mode.c, marginTop:5, fontFamily:'Geist, sans-serif' }}>{pct}% complete</div>
                </>
              )}
            </div>
          </div>

          {/* Controls */}
          <div style={{ display:'flex', justifyContent:'center', gap:10, marginBottom:16 }}>
            <button onClick={() => { setLeft(mins * 60); setRunning(false); }}
              style={{ width:40, height:40, borderRadius:11, border:'1px solid rgba(255,255,255,0.08)', background:'rgba(255,255,255,0.04)', color:'#6b7280', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', transition:'all .15s' }}
              onMouseOver={e => { e.currentTarget.style.color='#e8eaed'; e.currentTarget.style.borderColor='rgba(255,255,255,0.15)'; }}
              onMouseOut={e => { e.currentTarget.style.color='#6b7280'; e.currentTarget.style.borderColor='rgba(255,255,255,0.08)'; }}>
              <RotateCcw size={15} />
            </button>
            <motion.button onClick={() => setRunning(!running)} whileTap={{ scale:.95 }}
              style={{ padding:'0 40px', height:40, borderRadius:11, border:'none',
                background: running ? 'rgba(255,255,255,0.08)' : `linear-gradient(135deg, ${mode.c}, ${mode.c}cc)`,
                color: running ? '#e8eaed' : '#fff', cursor:'pointer', fontFamily:'Geist, sans-serif', fontWeight:700, fontSize:14,
                boxShadow: running ? 'none' : `0 4px 14px ${mode.c}44`, transition:'all .15s' }}>
              {running ? '⏸  Pause' : '▶  Start'}
            </motion.button>
            <button onClick={() => { setEditing(true); setEditVal(String(mins)); setRunning(false); }}
              style={{ width:40, height:40, borderRadius:11, border:'1px solid rgba(255,255,255,0.08)', background:'rgba(255,255,255,0.04)', color:'#6b7280', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', transition:'all .15s' }}
              title="Edit duration"
              onMouseOver={e => { e.currentTarget.style.color='#a78bfa'; e.currentTarget.style.borderColor='rgba(124,106,247,.4)'; }}
              onMouseOut={e => { e.currentTarget.style.color='#6b7280'; e.currentTarget.style.borderColor='rgba(255,255,255,0.08)'; }}>
              <Edit3 size={14} />
            </button>
            <button onClick={() => setMuted(!muted)}
              style={{ width:40, height:40, borderRadius:11, border:`1px solid ${muted ? 'rgba(239,68,68,.35)' : 'rgba(255,255,255,0.08)'}`, background: muted ? 'rgba(239,68,68,.1)' : 'rgba(255,255,255,0.04)', color: muted ? '#f87171' : '#6b7280', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', transition:'all .15s' }}
              title={muted ? 'Unmute sound' : 'Mute sound'}>
              {muted ? <VolumeX size={14} /> : <Volume2 size={14} />}
            </button>
          </div>

          <div style={{ textAlign:'center', fontSize:11, color:'#3a3d44', fontFamily:'Geist, sans-serif' }}>
            Click <strong style={{ color:'#6b7280' }}>✎</strong> to set a custom duration · sound plays on completion
          </div>
        </div>

        {/* Right: session log + tips */}
        <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
          <div style={{ background:'linear-gradient(145deg,#0e0f14,#0c0d11)', border:'1px solid rgba(255,255,255,0.07)', borderRadius:14, padding:'16px' }}>
            <div style={{ fontSize:9, fontWeight:600, textTransform:'uppercase', letterSpacing:'.12em', color:'#3a3d44', marginBottom:12, fontFamily:'Geist, sans-serif' }}>Today's Sessions</div>
            {sessions.length === 0 ? (
              <div style={{ fontSize:12, color:'#2a2d35', textAlign:'center', padding:'20px 0', fontFamily:'Geist, sans-serif' }}>No sessions yet.<br/>Start your first focus!</div>
            ) : (
              <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
                {[...sessions].reverse().map((s, i) => (
                  <div key={i} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'7px 10px', background:'rgba(255,255,255,0.03)', borderRadius:8, border:'1px solid rgba(255,255,255,0.06)' }}>
                    <div style={{ display:'flex', alignItems:'center', gap:6 }}>
                      <div style={{ width:7, height:7, borderRadius:'50%', background:'#10b981', boxShadow:'0 0 5px #10b98177' }} />
                      <span style={{ fontSize:12, color:'#6b7280', fontFamily:'Geist, sans-serif' }}>{s.mode}</span>
                    </div>
                    <span style={{ fontSize:10, color:'#3a3d44', fontFamily:'Geist, sans-serif' }}>{s.ts}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div style={{ background:'linear-gradient(145deg,#0e0f14,#0c0d11)', border:'1px solid rgba(255,255,255,0.07)', borderRadius:14, padding:'16px' }}>
            <div style={{ fontSize:9, fontWeight:600, textTransform:'uppercase', letterSpacing:'.12em', color:'#3a3d44', marginBottom:12, fontFamily:'Geist, sans-serif' }}>Technique Tips</div>
            {[
              { e:'🎯', t:'Focus Block', d:'Work on one task at a time — no multitasking' },
              { e:'📵', t:'No Distractions', d:'Silence notifications during the session' },
              { e:'💧', t:'Take Breaks', d:'Use short breaks to recharge your mind' },
            ].map(tip => (
              <div key={tip.t} style={{ display:'flex', gap:10, marginBottom:12 }}>
                <span style={{ fontSize:18, flexShrink:0 }}>{tip.e}</span>
                <div>
                  <div style={{ fontSize:12, fontWeight:500, color:'#c8cad2', fontFamily:'Geist, sans-serif', marginBottom:2 }}>{tip.t}</div>
                  <div style={{ fontSize:11, color:'#3a3d44', fontFamily:'Geist, sans-serif', lineHeight:1.5 }}>{tip.d}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
