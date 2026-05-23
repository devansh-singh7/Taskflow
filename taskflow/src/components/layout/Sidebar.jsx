import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutDashboard, CheckSquare, BarChart2, Timer, Plus, X, ChevronLeft, ChevronRight, LogOut } from 'lucide-react';
import { useTaskStore } from '../../store/taskStore';
import { useAuthStore } from '../../store/authStore';
import toast from 'react-hot-toast';

const NAV = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'tasks',     label: 'All Tasks',  icon: CheckSquare },
  { id: 'analytics', label: 'Analytics',  icon: BarChart2 },
  { id: 'pomodoro',  label: 'Pomodoro',   icon: Timer },
];

const CAT_COLORS = ['#7c6af7','#ec4899','#f0c040','#10b981','#3b82f6','#8b5cf6','#ef4444','#06b6d4'];

export default function Sidebar({ activePage, setActivePage }) {
  const [collapsed, setCollapsed] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [newCat, setNewCat] = useState({ name: '', color: '#7c6af7', icon: '📌' });
  const { categories, addCategory, setFilter } = useTaskStore();
  const { user, logout } = useAuthStore();

  const handleAdd = () => {
    if (!newCat.name.trim()) return toast.error('Name required');
    addCategory(newCat);
    setNewCat({ name: '', color: '#7c6af7', icon: '📌' });
    setShowModal(false);
    toast.success(`"${newCat.name}" created!`);
  };

  const handleLogout = () => { logout(); toast.success('Signed out'); };

  return (
    <>
      <motion.aside
        animate={{ width: collapsed ? 64 : 228 }}
        transition={{ type: 'spring', stiffness: 320, damping: 32 }}
        className="relative h-full flex flex-col flex-shrink-0"
        style={{ background: 'linear-gradient(180deg, #0c0d10 0%, #090a0d 100%)', borderRight: '1px solid rgba(255,255,255,0.06)' }}>

        {/* Logo */}
        <div className="flex items-center gap-3 px-4 flex-shrink-0" style={{ height: 56, borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="flex-shrink-0" style={{ width:34, height:34, borderRadius:10, background:'linear-gradient(135deg,#7c6af7,#a78bfa)', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 4px 14px rgba(124,106,247,0.4)' }}>
            <svg width="18" height="18" viewBox="0 0 34 34" fill="none"><path d="M6 10h22M6 17h14M6 24h17" stroke="#fff" strokeWidth="2.5" strokeLinecap="round"/><circle cx="27" cy="24" r="5" fill="#fff" fillOpacity="0.25"/><path d="M25.2 24l1.2 1.4 2.4-2.6" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </div>
          <AnimatePresence>
            {!collapsed && (
              <motion.div initial={{ opacity:0, x:-8 }} animate={{ opacity:1, x:0 }} exit={{ opacity:0, x:-8 }} transition={{ duration:.18 }}>
                <div style={{ fontFamily:'Instrument Serif, serif', fontSize:17, color:'#e8eaed', letterSpacing:'-.01em', lineHeight:1.1 }}>TaskFlow</div>
                <div style={{ fontSize:10, color:'#3a3d44', fontFamily:'Geist, sans-serif', fontWeight:500, letterSpacing:'.05em', textTransform:'uppercase' }}>Workspace</div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto" style={{ padding:'12px 8px' }}>
          <AnimatePresence>
            {!collapsed && <motion.p initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }} style={{ fontSize:9, fontWeight:600, textTransform:'uppercase', letterSpacing:'.14em', color:'#2a2d35', padding:'8px 10px 6px', fontFamily:'Geist, sans-serif' }}>Navigation</motion.p>}
          </AnimatePresence>

          {NAV.map((item, idx) => {
            const Icon = item.icon;
            const active = activePage === item.id;
            return (
              <motion.button key={item.id} onClick={() => setActivePage(item.id)}
                whileHover={{ x: collapsed ? 0 : 2 }} whileTap={{ scale:.97 }}
                initial={{ opacity:0, x:-10 }} animate={{ opacity:1, x:0 }} transition={{ delay:idx*.04, duration:.2 }}
                className="w-full flex items-center gap-3 mb-0.5 relative"
                style={{ padding: collapsed ? '10px 0' : '9px 12px', justifyContent: collapsed ? 'center' : 'flex-start', borderRadius:10,
                  background: active ? 'linear-gradient(135deg,rgba(124,106,247,0.18),rgba(124,106,247,0.08))' : 'transparent',
                  border: active ? '1px solid rgba(124,106,247,0.25)' : '1px solid transparent',
                  cursor:'pointer', transition:'all .15s cubic-bezier(.4,0,.2,1)' }}>
                {active && <motion.div layoutId="nav-indicator" style={{ position:'absolute', left:0, top:'50%', transform:'translateY(-50%)', width:3, height:18, borderRadius:2, background:'linear-gradient(180deg,#7c6af7,#a78bfa)' }} />}
                <Icon size={15} style={{ flexShrink:0, color: active ? '#a78bfa' : '#3a3d44', transition:'color .15s' }} />
                <AnimatePresence>
                  {!collapsed && <motion.span initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }} style={{ fontSize:13, fontWeight:500, color: active ? '#e8eaed' : '#6b7280', fontFamily:'Geist, sans-serif' }}>{item.label}</motion.span>}
                </AnimatePresence>
              </motion.button>
            );
          })}

          {/* Categories */}
          <div style={{ borderTop:'1px solid rgba(255,255,255,0.06)', marginTop:14, paddingTop:14 }}>
            <AnimatePresence>
              {!collapsed && (
                <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }} className="flex items-center justify-between" style={{ padding:'0 10px 8px' }}>
                  <span style={{ fontSize:9, fontWeight:600, textTransform:'uppercase', letterSpacing:'.14em', color:'#2a2d35', fontFamily:'Geist, sans-serif' }}>Categories</span>
                  <button onClick={() => setShowModal(true)} style={{ width:20, height:20, borderRadius:6, background:'rgba(124,106,247,0.12)', border:'1px solid rgba(124,106,247,0.25)', color:'#7c6af7', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', fontSize:13, fontWeight:600, transition:'all .15s' }}
                    onMouseOver={e => { e.currentTarget.style.background='rgba(124,106,247,0.25)'; e.currentTarget.style.transform='scale(1.1)'; }}
                    onMouseOut={e => { e.currentTarget.style.background='rgba(124,106,247,0.12)'; e.currentTarget.style.transform='scale(1)'; }}>+</button>
                </motion.div>
              )}
            </AnimatePresence>

            <motion.button whileHover={{ x: collapsed ? 0 : 2 }} onClick={() => setFilter('category','all')}
              className="w-full flex items-center gap-2.5 mb-0.5"
              style={{ padding: collapsed ? '8px 0' : '7px 12px', justifyContent: collapsed ? 'center' : 'flex-start', borderRadius:9, cursor:'pointer', background:'transparent', border:'1px solid transparent', transition:'all .15s' }}
              onMouseOver={e => e.currentTarget.style.background='rgba(255,255,255,0.04)'}
              onMouseOut={e => e.currentTarget.style.background='transparent'}>
              <div style={{ width:7, height:7, borderRadius:'50%', background:'#2a2d35', flexShrink:0 }} />
              <AnimatePresence>{!collapsed && <motion.span initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }} style={{ fontSize:12, color:'#6b7280', fontFamily:'Geist, sans-serif' }}>All tasks</motion.span>}</AnimatePresence>
            </motion.button>

            {categories.map(cat => (
              <motion.button key={cat.id} whileHover={{ x: collapsed ? 0 : 2 }} onClick={() => setFilter('category', cat.id)}
                className="w-full flex items-center gap-2.5 mb-0.5"
                style={{ padding: collapsed ? '8px 0' : '7px 12px', justifyContent: collapsed ? 'center' : 'flex-start', borderRadius:9, cursor:'pointer', background:'transparent', border:'1px solid transparent', transition:'all .15s' }}
                onMouseOver={e => e.currentTarget.style.background='rgba(255,255,255,0.04)'}
                onMouseOut={e => e.currentTarget.style.background='transparent'}>
                <div style={{ width:7, height:7, borderRadius:'50%', background:cat.color, flexShrink:0, boxShadow:`0 0 6px ${cat.color}66` }} />
                <AnimatePresence>
                  {!collapsed && <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }} className="flex items-center justify-between flex-1 min-w-0">
                    <span style={{ fontSize:12, color:'#6b7280', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', fontFamily:'Geist, sans-serif' }}>{cat.icon} {cat.name}</span>
                  </motion.div>}
                </AnimatePresence>
              </motion.button>
            ))}
          </div>

          <AnimatePresence>
            {!collapsed && (
              <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }} style={{ padding:'14px 4px 4px' }}>
                <button onClick={() => setActivePage('tasks')} style={{ width:'100%', padding:'9px 14px', borderRadius:10, background:'rgba(124,106,247,0.08)', border:'1px solid rgba(124,106,247,0.18)', color:'#7c6af7', fontSize:12, fontWeight:500, cursor:'pointer', transition:'all .15s', fontFamily:'Geist, sans-serif', display:'flex', alignItems:'center', justifyContent:'center', gap:6 }}
                  onMouseOver={e => { e.currentTarget.style.background='rgba(124,106,247,0.16)'; e.currentTarget.style.borderColor='rgba(124,106,247,0.35)'; }}
                  onMouseOut={e => { e.currentTarget.style.background='rgba(124,106,247,0.08)'; e.currentTarget.style.borderColor='rgba(124,106,247,0.18)'; }}>
                  <Plus size={13} /> New Task
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </nav>

        {/* User + logout */}
        <div style={{ borderTop:'1px solid rgba(255,255,255,0.06)', padding:'10px 10px' }}>
          <div style={{ display:'flex', alignItems:'center', gap:9, justifyContent: collapsed ? 'center' : 'flex-start' }}>
            <div style={{ width:30, height:30, borderRadius:'50%', background:'linear-gradient(135deg,#7c6af7,#ec4899)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:12, fontWeight:600, color:'#fff', flexShrink:0 }}>
              {user?.name?.[0]?.toUpperCase() || 'U'}
            </div>
            <AnimatePresence>
              {!collapsed && (
                <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }} style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontSize:12, color:'#e8eaed', fontWeight:500, fontFamily:'Geist, sans-serif', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{user?.name || 'User'}</div>
                  <div style={{ fontSize:10, color:'#3a3d44', fontFamily:'Geist, sans-serif', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{user?.email}</div>
                </motion.div>
              )}
            </AnimatePresence>
            <button onClick={handleLogout} title="Sign out"
              style={{ width:28, height:28, borderRadius:8, border:'1px solid rgba(255,255,255,0.07)', background:'transparent', color:'#3a3d44', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', transition:'all .15s', flexShrink:0 }}
              onMouseOver={e => { e.currentTarget.style.color='#f87171'; e.currentTarget.style.borderColor='rgba(239,68,68,.3)'; e.currentTarget.style.background='rgba(239,68,68,.1)'; }}
              onMouseOut={e => { e.currentTarget.style.color='#3a3d44'; e.currentTarget.style.borderColor='rgba(255,255,255,0.07)'; e.currentTarget.style.background='transparent'; }}>
              <LogOut size={13} />
            </button>
          </div>
        </div>

        {/* Collapse toggle */}
        <button onClick={() => setCollapsed(!collapsed)} className="absolute flex items-center justify-center"
          style={{ width:22, height:22, borderRadius:'50%', background:'#141518', border:'1px solid rgba(255,255,255,0.1)', color:'#6b7280', right:-11, top:64, cursor:'pointer', zIndex:10, transition:'all .15s', boxShadow:'0 2px 8px rgba(0,0,0,0.5)' }}
          onMouseOver={e => { e.currentTarget.style.color='#e8eaed'; e.currentTarget.style.borderColor='rgba(124,106,247,0.4)'; }}
          onMouseOut={e => { e.currentTarget.style.color='#6b7280'; e.currentTarget.style.borderColor='rgba(255,255,255,0.1)'; }}>
          {collapsed ? <ChevronRight size={11} /> : <ChevronLeft size={11} />}
        </button>
      </motion.aside>

      {/* Add Category Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background:'rgba(0,0,0,0.82)', backdropFilter:'blur(8px)' }}
            onClick={e => e.target === e.currentTarget && setShowModal(false)}>
            <motion.div initial={{ scale:.92, y:24, opacity:0 }} animate={{ scale:1, y:0, opacity:1 }} exit={{ scale:.94, y:12, opacity:0 }} transition={{ type:'spring', stiffness:340, damping:30 }}
              style={{ width:'100%', maxWidth:380, background:'linear-gradient(145deg,#12131a,#0e0f14)', border:'1px solid rgba(255,255,255,0.09)', borderRadius:20, boxShadow:'0 24px 80px rgba(0,0,0,0.8)', overflow:'hidden' }}>
              <div style={{ height:3, background:'linear-gradient(90deg,#7c6af7,#a78bfa,#ec4899)', opacity:.8 }} />
              <div className="flex items-center justify-between" style={{ padding:'18px 20px 14px' }}>
                <div>
                  <h3 style={{ fontFamily:'Instrument Serif, serif', fontWeight:400, fontSize:19, color:'#e8eaed' }}>New Category</h3>
                  <p style={{ fontSize:11, color:'#3a3d44', marginTop:2, fontFamily:'Geist, sans-serif' }}>Organize your tasks better</p>
                </div>
                <button onClick={() => setShowModal(false)} style={{ width:30, height:30, borderRadius:8, background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.07)', color:'#6b7280', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', transition:'all .15s' }}
                  onMouseOver={e => { e.currentTarget.style.background='rgba(255,255,255,0.08)'; e.currentTarget.style.color='#e8eaed'; }}
                  onMouseOut={e => { e.currentTarget.style.background='rgba(255,255,255,0.04)'; e.currentTarget.style.color='#6b7280'; }}>
                  <X size={14} />
                </button>
              </div>
              <div style={{ padding:'0 20px 20px', display:'flex', flexDirection:'column', gap:16 }}>
                <div>
                  <label style={{ fontSize:10, fontWeight:600, color:'#3a3d44', display:'block', marginBottom:7, textTransform:'uppercase', letterSpacing:'.1em', fontFamily:'Geist, sans-serif' }}>Category Name</label>
                  <input autoFocus value={newCat.name} onChange={e => setNewCat(p => ({ ...p, name: e.target.value }))} onKeyDown={e => e.key==='Enter' && handleAdd()} placeholder="e.g. Side Projects"
                    style={{ width:'100%', padding:'10px 14px', borderRadius:10, border:'1px solid rgba(255,255,255,0.08)', background:'rgba(255,255,255,0.03)', color:'#e8eaed', fontSize:13, fontFamily:'Geist, sans-serif', outline:'none', transition:'all .18s' }} />
                </div>
                <div>
                  <label style={{ fontSize:10, fontWeight:600, color:'#3a3d44', display:'block', marginBottom:8, textTransform:'uppercase', letterSpacing:'.1em', fontFamily:'Geist, sans-serif' }}>Icon</label>
                  <div style={{ display:'flex', gap:7, flexWrap:'wrap' }}>
                    {['📌','🚀','🎯','💡','🎨','🛠️','📱','🌍','🎵','🏆','💼','🌱'].map(emoji => (
                      <button key={emoji} onClick={() => setNewCat(p => ({ ...p, icon: emoji }))}
                        style={{ width:38, height:38, borderRadius:10, fontSize:17, cursor:'pointer', background: newCat.icon===emoji ? 'rgba(124,106,247,0.2)' : 'rgba(255,255,255,0.03)', border: newCat.icon===emoji ? '1.5px solid rgba(124,106,247,0.5)' : '1px solid rgba(255,255,255,0.07)', transition:'all .15s', transform: newCat.icon===emoji ? 'scale(1.1)' : 'scale(1)' }}>
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label style={{ fontSize:10, fontWeight:600, color:'#3a3d44', display:'block', marginBottom:9, textTransform:'uppercase', letterSpacing:'.1em', fontFamily:'Geist, sans-serif' }}>Color</label>
                  <div style={{ display:'flex', gap:9 }}>
                    {CAT_COLORS.map(c => (
                      <button key={c} onClick={() => setNewCat(p => ({ ...p, color: c }))}
                        style={{ width:26, height:26, borderRadius:'50%', background:c, cursor:'pointer', border: newCat.color===c ? '3px solid #e8eaed' : '2px solid transparent', transform: newCat.color===c ? 'scale(1.25)' : 'scale(1)', transition:'all .15s', boxShadow: newCat.color===c ? `0 0 10px ${c}88` : 'none' }} />
                    ))}
                  </div>
                </div>
                {newCat.name && (
                  <motion.div initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} style={{ padding:'10px 14px', borderRadius:10, background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.07)', display:'flex', alignItems:'center', gap:10 }}>
                    <div style={{ width:8, height:8, borderRadius:'50%', background:newCat.color, boxShadow:`0 0 8px ${newCat.color}88` }} />
                    <span style={{ fontSize:13, color:'#e8eaed', fontFamily:'Geist, sans-serif' }}>{newCat.icon} {newCat.name}</span>
                    <span style={{ fontSize:10, color:'#3a3d44', marginLeft:'auto', fontFamily:'Geist, sans-serif' }}>Preview</span>
                  </motion.div>
                )}
                <div style={{ display:'flex', gap:8, marginTop:4 }}>
                  <button onClick={() => setShowModal(false)} style={{ flex:1, padding:'10px', borderRadius:10, border:'1px solid rgba(255,255,255,0.08)', background:'transparent', color:'#6b7280', fontSize:13, fontFamily:'Geist, sans-serif', fontWeight:500, cursor:'pointer', transition:'all .15s' }}>Cancel</button>
                  <button onClick={handleAdd} style={{ flex:1, padding:'10px', borderRadius:10, border:'none', background:'linear-gradient(135deg,#7c6af7,#9580ff)', color:'#fff', fontWeight:600, fontSize:13, fontFamily:'Geist, sans-serif', cursor:'pointer', transition:'all .15s', boxShadow:'0 4px 14px rgba(124,106,247,0.35)' }}>Create Category</button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
