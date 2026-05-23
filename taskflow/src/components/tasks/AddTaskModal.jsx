import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles } from 'lucide-react';
import { useTaskStore } from '../../store/taskStore';
import toast from 'react-hot-toast';

const PRIOS = [
  { v:'high',   label:'High',   icon:'🔴', c:'rgba(239,68,68,.14)',   bc:'rgba(239,68,68,.4)',   tc:'#f87171' },
  { v:'medium', label:'Medium', icon:'🟡', c:'rgba(245,158,11,.12)',  bc:'rgba(245,158,11,.4)',  tc:'#fcd34d' },
  { v:'low',    label:'Low',    icon:'🟢', c:'rgba(16,185,129,.12)',  bc:'rgba(16,185,129,.4)',  tc:'#6ee7b7' },
];

export default function AddTaskModal({ isOpen, onClose }) {
  const { addTask, categories } = useTaskStore();
  const [form, setForm] = useState({ title:'', description:'', priority:'high', categoryId:'work', dueDate:'' });
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const handle = () => {
    if (!form.title.trim()) { toast.error('Title required!'); return; }
    addTask(form);
    toast.success('Task created!');
    setForm({ title:'', description:'', priority:'high', categoryId:'work', dueDate:'' });
    onClose();
  };

  const inp = {
    width:'100%', background:'rgba(255,255,255,0.03)',
    border:'1px solid rgba(255,255,255,0.08)', borderRadius:10,
    padding:'10px 14px', color:'#e8eaed', fontSize:13,
    fontFamily:'Geist, sans-serif', transition:'all 0.18s',
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background:'rgba(0,0,0,0.82)', backdropFilter:'blur(10px)' }}
          onClick={e => e.target === e.currentTarget && onClose()}>
          <motion.div
            initial={{ scale:0.92, y:28, opacity:0 }}
            animate={{ scale:1, y:0, opacity:1 }}
            exit={{ scale:0.94, y:12, opacity:0 }}
            transition={{ type:'spring', stiffness:340, damping:30 }}
            style={{
              width:'100%', maxWidth:440,
              background:'linear-gradient(145deg, #12131c 0%, #0e0f16 100%)',
              border:'1px solid rgba(255,255,255,0.09)',
              borderRadius:20, overflow:'hidden',
              boxShadow:'0 28px 80px rgba(0,0,0,0.85), 0 0 0 1px rgba(124,106,247,0.1)',
            }}>

            {/* Top accent bar */}
            <div style={{ height:3, background:'linear-gradient(90deg, #7c6af7, #a78bfa, #ec4899)', opacity:0.85 }} />

            {/* Header */}
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'18px 22px 14px' }}>
              <div style={{ display:'flex', alignItems:'center', gap:11 }}>
                <div style={{
                  width:34, height:34, borderRadius:10,
                  background:'linear-gradient(135deg, rgba(124,106,247,0.2) 0%, rgba(124,106,247,0.08) 100%)',
                  border:'1px solid rgba(124,106,247,0.3)',
                  display:'flex', alignItems:'center', justifyContent:'center',
                }}>
                  <svg width="17" height="17" viewBox="0 0 34 34" fill="none">
                    <path d="M6 10h22M6 17h14M6 24h17" stroke="#a78bfa" strokeWidth="2.5" strokeLinecap="round"/>
                    <circle cx="27" cy="24" r="5" fill="#a78bfa" fillOpacity="0.3"/>
                    <path d="M25.2 24l1.2 1.4 2.4-2.6" stroke="#a78bfa" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div>
                  <div style={{ fontFamily:'Instrument Serif, serif', fontWeight:400, fontSize:18, color:'#e8eaed' }}>New Task</div>
                  <div style={{ fontSize:10, color:'#3a3d44', fontFamily:'Geist, sans-serif', marginTop:1 }}>Fill in the details below</div>
                </div>
              </div>
              <button onClick={onClose}
                style={{
                  width:30, height:30, borderRadius:8, background:'rgba(255,255,255,0.04)',
                  border:'1px solid rgba(255,255,255,0.07)', color:'#6b7280',
                  display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', transition:'all 0.15s',
                }}
                onMouseOver={e => { e.currentTarget.style.background='rgba(255,255,255,0.08)'; e.currentTarget.style.color='#e8eaed'; }}
                onMouseOut={e => { e.currentTarget.style.background='rgba(255,255,255,0.04)'; e.currentTarget.style.color='#6b7280'; }}>
                <X size={14} />
              </button>
            </div>

            <div style={{ padding:'0 22px 18px', display:'flex', flexDirection:'column', gap:14 }}>
              {/* Title */}
              <div>
                <label style={{ fontSize:10, fontWeight:600, color:'#3a3d44', display:'block', marginBottom:7, textTransform:'uppercase', letterSpacing:'.1em', fontFamily:'Geist, sans-serif' }}>
                  Task Title <span style={{ color:'#f87171' }}>*</span>
                </label>
                <input autoFocus value={form.title} onChange={e => set('title', e.target.value)} onKeyDown={e => e.key==='Enter' && handle()}
                  placeholder="What needs to be done?" style={{ ...inp, fontSize:14 }} />
              </div>

              {/* Description */}
              <div>
                <label style={{ fontSize:10, fontWeight:600, color:'#3a3d44', display:'block', marginBottom:7, textTransform:'uppercase', letterSpacing:'.1em', fontFamily:'Geist, sans-serif' }}>
                  Description
                </label>
                <textarea value={form.description} onChange={e => set('description', e.target.value)}
                  placeholder="Add more context… (optional)" rows={2}
                  style={{ ...inp, resize:'none', lineHeight:1.5 }} />
              </div>

              {/* Priority */}
              <div>
                <label style={{ fontSize:10, fontWeight:600, color:'#3a3d44', display:'block', marginBottom:8, textTransform:'uppercase', letterSpacing:'.1em', fontFamily:'Geist, sans-serif' }}>
                  Priority
                </label>
                <div style={{ display:'flex', gap:7 }}>
                  {PRIOS.map(p => (
                    <button key={p.v} onClick={() => set('priority', p.v)}
                      style={{
                        flex:1, padding:'9px 8px', borderRadius:10,
                        border: form.priority===p.v ? `1.5px solid ${p.bc}` : '1px solid rgba(255,255,255,0.07)',
                        background: form.priority===p.v ? p.c : 'rgba(255,255,255,0.02)',
                        cursor:'pointer', fontSize:12, fontWeight:600, fontFamily:'Geist, sans-serif',
                        color: form.priority===p.v ? p.tc : '#3a3d44', transition:'all 0.15s',
                        display:'flex', alignItems:'center', justifyContent:'center', gap:5,
                      }}>
                      <span style={{ fontSize:10 }}>{p.icon}</span> {p.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Category + Due Date */}
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
                <div>
                  <label style={{ fontSize:10, fontWeight:600, color:'#3a3d44', display:'block', marginBottom:7, textTransform:'uppercase', letterSpacing:'.1em', fontFamily:'Geist, sans-serif' }}>
                    Category
                  </label>
                  <select value={form.categoryId} onChange={e => set('categoryId', e.target.value)}
                    style={{ ...inp, cursor:'pointer' }}>
                    {categories.map(c => <option key={c.id} value={c.id}>{c.icon} {c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize:10, fontWeight:600, color:'#3a3d44', display:'block', marginBottom:7, textTransform:'uppercase', letterSpacing:'.1em', fontFamily:'Geist, sans-serif' }}>
                    Due Date
                  </label>
                  <input type="date" value={form.dueDate} onChange={e => set('dueDate', e.target.value)}
                    style={{ ...inp, cursor:'pointer', colorScheme:'dark' }} />
                </div>
              </div>
            </div>

            {/* Footer */}
            <div style={{ display:'flex', gap:8, padding:'0 22px 20px' }}>
              <button onClick={onClose}
                style={{
                  flex:1, padding:'11px', borderRadius:11, border:'1px solid rgba(255,255,255,0.08)',
                  background:'transparent', color:'#6b7280', cursor:'pointer', fontSize:13,
                  fontFamily:'Geist, sans-serif', fontWeight:500, transition:'all 0.15s',
                }}
                onMouseOver={e => { e.target.style.color='#e8eaed'; e.target.style.borderColor='rgba(255,255,255,0.15)'; }}
                onMouseOut={e => { e.target.style.color='#6b7280'; e.target.style.borderColor='rgba(255,255,255,0.08)'; }}>
                Cancel
              </button>
              <motion.button onClick={handle} whileHover={{ scale:1.02 }} whileTap={{ scale:0.97 }}
                style={{
                  flex:2, padding:'11px', borderRadius:11, border:'none',
                  background:'linear-gradient(135deg, #7c6af7 0%, #9580ff 100%)',
                  color:'#fff', fontWeight:600, fontSize:13, fontFamily:'Geist, sans-serif',
                  cursor:'pointer', transition:'all 0.15s',
                  boxShadow:'0 4px 16px rgba(124,106,247,0.4)',
                  display:'flex', alignItems:'center', justifyContent:'center', gap:7,
                }}
                onMouseOver={e => { e.currentTarget.style.boxShadow='0 6px 22px rgba(124,106,247,0.55)'; e.currentTarget.style.transform='translateY(-1px)'; }}
                onMouseOut={e => { e.currentTarget.style.boxShadow='0 4px 16px rgba(124,106,247,0.4)'; e.currentTarget.style.transform='translateY(0)'; }}>
                <Sparkles size={13} /> Create Task
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
