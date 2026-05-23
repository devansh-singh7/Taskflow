import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Mic, MicOff, Sparkles, Plus, X } from 'lucide-react';
import { useTaskStore } from '../../store/taskStore';
import toast from 'react-hot-toast';

export default function Header({ activePage, setActivePage, onAddTask }) {
  const { setFilter, filter, addTask } = useTaskStore();
  const [listening, setListening] = useState(false);
  const [showAIPopup, setShowAIPopup] = useState(false);

  const handleVoice = () => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) { toast.error('Voice not supported'); return; }
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    const r = new SR(); r.lang = 'en-US';
    r.onstart = () => setListening(true);
    r.onresult = e => { const txt = e.results[0][0].transcript; addTask({ title: txt, priority: 'medium', categoryId: 'work', description: '' }); toast.success(`Added: "${txt}"`); };
    r.onend = () => setListening(false);
    r.onerror = () => { setListening(false); toast.error('Voice failed'); };
    r.start();
  };

  const handleAI = () => { setShowAIPopup(true); setTimeout(() => setShowAIPopup(false), 3200); };

  return (
    <>
      <header className="flex items-center flex-shrink-0"
        style={{ height:56, paddingLeft:20, paddingRight:20, background:'rgba(10,11,14,0.92)', borderBottom:'1px solid rgba(255,255,255,0.06)', backdropFilter:'blur(20px)', gap:12 }}>

        {/* Center: Search */}
        <div style={{ flex:1, display:'flex', justifyContent:'center' }}>

          <div style={{ position:'relative', width:'100%', maxWidth:340 }}>
            <Search size={13} style={{ position:'absolute', left:12, top:'50%', transform:'translateY(-50%)', color:'#3a3d44', pointerEvents:'none' }} />
            <input value={filter.search} onChange={e => setFilter('search', e.target.value)} placeholder="Search tasks…"
              style={{ width:'100%', paddingLeft:34, paddingRight:12, paddingTop:8, paddingBottom:8, borderRadius:10, border:'1px solid rgba(255,255,255,0.07)', background:'rgba(255,255,255,0.04)', color:'#e8eaed', fontSize:12, fontFamily:'Geist, sans-serif', outline:'none', transition:'all .18s' }}
              onFocus={e => { e.target.style.borderColor='rgba(124,106,247,0.4)'; e.target.style.boxShadow='0 0 0 3px rgba(124,106,247,0.1)'; }}
              onBlur={e => { e.target.style.borderColor='rgba(255,255,255,0.07)'; e.target.style.boxShadow='none'; }} />
          </div>
        </div>

        {/* Right: actions */}
        <div style={{ display:'flex', alignItems:'center', gap:8, flexShrink:0, marginLeft:'auto' }}>

          <motion.button whileTap={{ scale:.92 }} onClick={handleVoice}
            style={{ height:32, borderRadius:9, cursor:'pointer', display:'flex', alignItems:'center', gap:6, padding:'0 12px', fontSize:12, fontWeight:500, fontFamily:'Geist, sans-serif', transition:'all .15s', border: listening ? '1px solid rgba(239,68,68,0.4)' : '1px solid rgba(255,255,255,0.08)', background: listening ? 'rgba(239,68,68,0.12)' : 'rgba(255,255,255,0.04)', color: listening ? '#f87171' : '#6b7280' }}>
            {listening ? <MicOff size={13} /> : <Mic size={13} />}
            <span>{listening ? 'Stop' : 'Voice'}</span>
            {listening && <motion.div animate={{ scale:[1,1.3,1] }} transition={{ repeat:Infinity, duration:1 }} style={{ width:5, height:5, borderRadius:'50%', background:'#f87171' }} />}
          </motion.button>

          <motion.button whileTap={{ scale:.92 }} onClick={handleAI}
            style={{ height:32, borderRadius:9, cursor:'pointer', display:'flex', alignItems:'center', gap:6, padding:'0 12px', fontSize:12, fontWeight:500, fontFamily:'Geist, sans-serif', transition:'all .15s', border:'1px solid rgba(124,106,247,0.25)', background:'rgba(124,106,247,0.08)', color:'#a78bfa' }}
            onMouseOver={e => { e.currentTarget.style.background='rgba(124,106,247,0.16)'; e.currentTarget.style.borderColor='rgba(124,106,247,0.4)'; }}
            onMouseOut={e => { e.currentTarget.style.background='rgba(124,106,247,0.08)'; e.currentTarget.style.borderColor='rgba(124,106,247,0.25)'; }}>
            <Sparkles size={13} /><span>AI</span>
          </motion.button>

          <motion.button whileHover={{ scale:1.03 }} whileTap={{ scale:.96 }} onClick={onAddTask}
            style={{ height:32, borderRadius:9, border:'none', background:'linear-gradient(135deg,#7c6af7,#9580ff)', color:'#fff', fontSize:12, fontWeight:600, fontFamily:'Geist, sans-serif', cursor:'pointer', display:'flex', alignItems:'center', gap:6, padding:'0 14px', boxShadow:'0 3px 12px rgba(124,106,247,0.35)', flexShrink:0, transition:'all .15s' }}
            onMouseOver={e => { e.currentTarget.style.boxShadow='0 4px 18px rgba(124,106,247,0.5)'; }}
            onMouseOut={e => { e.currentTarget.style.boxShadow='0 3px 12px rgba(124,106,247,0.35)'; }}>
            <Plus size={13} /> Add Task
          </motion.button>
        </div>

      </header>

      {/* AI Popup */}
      <AnimatePresence>
        {showAIPopup && (
          <motion.div initial={{ opacity:0, y:20, scale:.9 }} animate={{ opacity:1, y:0, scale:1 }} exit={{ opacity:0, y:-12, scale:.94 }} transition={{ type:'spring', stiffness:360, damping:28 }}
            style={{ position:'fixed', top:72, right:20, zIndex:9999, background:'linear-gradient(145deg,#13141c,#0e0f16)', border:'1px solid rgba(124,106,247,0.3)', borderRadius:16, padding:'16px 20px', boxShadow:'0 20px 60px rgba(0,0,0,0.7)', minWidth:240, maxWidth:280 }}>
            <div style={{ height:2, background:'linear-gradient(90deg,#7c6af7,#a78bfa)', borderRadius:2, marginBottom:14, opacity:.8 }} />
            <div style={{ display:'flex', alignItems:'flex-start', gap:12 }}>
              <div style={{ width:36, height:36, borderRadius:10, flexShrink:0, background:'rgba(124,106,247,0.15)', border:'1px solid rgba(124,106,247,0.3)', display:'flex', alignItems:'center', justifyContent:'center' }}>
                <motion.div animate={{ rotate:[0,360] }} transition={{ duration:2, repeat:Infinity, ease:'linear' }}><Sparkles size={16} color="#a78bfa" /></motion.div>
              </div>
              <div>
                <div style={{ fontFamily:'Instrument Serif, serif', fontWeight:400, fontSize:15, color:'#e8eaed', marginBottom:4 }}>AI Assistant</div>
                <div style={{ fontSize:12, color:'#6b7280', fontFamily:'Geist, sans-serif', lineHeight:1.5 }}>⚙️ Under working — coming soon!</div>
                <div style={{ marginTop:8, display:'flex', gap:4 }}>
                  {[0,1,2].map(i => (
                    <motion.div key={i} animate={{ opacity:[0.3,1,0.3] }} transition={{ duration:1.2, repeat:Infinity, delay:i*.2 }}
                      style={{ width:5, height:5, borderRadius:'50%', background:'#7c6af7' }} />
                  ))}
                </div>
              </div>
            </div>
            <button onClick={() => setShowAIPopup(false)} style={{ position:'absolute', top:10, right:10, background:'none', border:'none', color:'#3a3d44', cursor:'pointer', padding:4 }}><X size={13} /></button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
