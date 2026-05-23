import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Trash2, Edit3, Calendar, GripVertical, CheckCircle, Circle } from 'lucide-react';
import { useTaskStore } from '../../store/taskStore';
import { formatDueDate, isOverdue, isDueSoon } from '../../utils/helpers';
import toast from 'react-hot-toast';
import EditTaskModal from './EditTaskModal';

const PRIO_COLOR = { high:'#f87171', medium:'#fcd34d', low:'#6ee7b7' };
const PRIO_BG    = { high:'rgba(239,68,68,.1)', medium:'rgba(245,158,11,.12)', low:'rgba(16,185,129,.1)' };

export default function TaskCard({ task }) {
  const { toggleTask, deleteTask, categories } = useTaskStore();
  const [showEdit, setShowEdit]   = useState(false);
  const [delStage, setDelStage]   = useState(0); // 0=idle 1=hover-confirm 2=deleting
  const [dblHint, setDblHint]     = useState(false);
  const dblTimer = useRef(null);
  const delTimer = useRef(null);

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: task.id });

  const cat    = categories.find(c => c.id === task.categoryId) || categories[0];
  const over   = isOverdue(task.dueDate) && !task.completed;
  const soon   = isDueSoon(task.dueDate) && !task.completed;
  const accent = PRIO_COLOR[task.priority] || '#6b7280';

  // ── Delete with single-confirm click ──────────────────────────────────────
  const handleDelClick = (e) => {
    e.stopPropagation();
    if (delStage === 0) {
      setDelStage(1);
      delTimer.current = setTimeout(() => setDelStage(0), 2500);
    } else {
      clearTimeout(delTimer.current);
      setDelStage(2);
      setTimeout(() => { deleteTask(task.id); toast.success('Task deleted'); }, 280);
    }
  };

  // ── Double-click anywhere on card to delete ───────────────────────────────
  const handleCardDblClick = () => {
    clearTimeout(dblTimer.current);
    setDelStage(2);
    setTimeout(() => { deleteTask(task.id); toast.success('Deleted via double-click'); }, 280);
  };

  // Show "double-click to delete" hint on single click (non-interactive area)
  const handleCardClick = (e) => {
    if (e.detail === 1) {
      clearTimeout(dblTimer.current);
      dblTimer.current = setTimeout(() => {}, 300);
      setDblHint(true);
      setTimeout(() => setDblHint(false), 1800);
    }
  };

  return (
    <>
      <motion.div
        ref={setNodeRef}
        style={{ transform: CSS.Transform.toString(transform), transition }}
        layout
        initial={{ opacity:0, y:10, scale:.98 }}
        animate={{ opacity: delStage===2 ? 0 : isDragging ? 0.4 : task.completed ? 0.45 : 1, y:0, scale: delStage===2 ? 0.94 : 1 }}
        exit={{ opacity:0, y:-8, scale:.95, height:0, marginBottom:0, padding:0 }}
        transition={{ duration: delStage===2 ? .28 : .22 }}
        className="group"
        onDoubleClick={handleCardDblClick}
        onClick={handleCardClick}>

        <div
          style={{ background:'rgba(255,255,255,0.02)', border:`1px solid ${delStage===1?'rgba(239,68,68,0.4)':'rgba(255,255,255,0.07)'}`, borderRadius:12, padding:'11px 13px', display:'flex', alignItems:'flex-start', gap:9, position:'relative', overflow:'hidden', cursor:'default', transition:'border-color .15s, background .15s', boxShadow: isDragging?'0 16px 40px rgba(0,0,0,0.6)':delStage===1?'0 0 0 3px rgba(239,68,68,0.1)':'none' }}
          onMouseOver={e => { e.currentTarget.style.background='rgba(255,255,255,0.032)'; e.currentTarget.style.borderColor=delStage===1?'rgba(239,68,68,0.4)':'rgba(255,255,255,0.12)'; }}
          onMouseOut={e => { e.currentTarget.style.background='rgba(255,255,255,0.02)'; e.currentTarget.style.borderColor=delStage===1?'rgba(239,68,68,0.4)':'rgba(255,255,255,0.07)'; }}>

          {/* Priority left-edge bar */}
          {!task.completed && (
            <div style={{ position:'absolute', left:0, top:0, bottom:0, width:3, borderRadius:'12px 0 0 12px', background:accent, opacity:task.priority==='high'?.9:task.priority==='medium'?.55:.4 }} />
          )}

          {/* Drag handle */}
          <button {...attributes} {...listeners} onClick={e=>e.stopPropagation()}
            style={{ marginTop:3, color:'#2a2d35', cursor:'grab', background:'none', border:'none', opacity:0, transition:'opacity .15s', flexShrink:0 }}
            className="group-hover:opacity-100">
            <GripVertical size={13} />
          </button>

          {/* Checkbox */}
          <button onClick={e => { e.stopPropagation(); toggleTask(task.id); if (!task.completed) toast.success('Task completed! 🎉'); }}
            style={{ marginTop:2, flexShrink:0, background:'none', border:'none', cursor:'pointer', transition:'transform .15s' }}
            onMouseOver={e=>e.currentTarget.style.transform='scale(1.15)'}
            onMouseOut={e=>e.currentTarget.style.transform='scale(1)'}>
            {task.completed
              ? <CheckCircle size={16} style={{ color:'#10b981' }} />
              : <Circle size={16} style={{ color:'#3a3d44' }} />}
          </button>

          {/* Content */}
          <div style={{ flex:1, minWidth:0 }}>
            <div style={{ display:'flex', alignItems:'center', gap:7 }}>
              <span style={{ fontSize:14 }}>{task.emoji}</span>
              <span style={{ fontSize:13, fontFamily:'Geist, sans-serif', color: task.completed?'#3a3d44':'#c8cad2', textDecoration: task.completed?'line-through':'none', lineHeight:1.4, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                {task.title}
              </span>
            </div>
            {task.description && (
              <p style={{ fontSize:11, color:'#3a3d44', marginTop:2, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', fontFamily:'Geist, sans-serif' }}>
                {task.description}
              </p>
            )}
            <div style={{ display:'flex', gap:5, marginTop:7, flexWrap:'wrap' }}>
              <span style={{ padding:'2px 8px', borderRadius:5, fontSize:9, fontWeight:600, background:`${cat.color}18`, color:cat.color, border:`1px solid ${cat.color}28`, fontFamily:'Geist, sans-serif' }}>{cat.icon} {cat.name}</span>
              <span style={{ padding:'2px 8px', borderRadius:5, fontSize:9, fontWeight:600, background:PRIO_BG[task.priority], color:accent, border:`1px solid ${accent}30`, fontFamily:'Geist, sans-serif', textTransform:'capitalize' }}>{task.priority}</span>
              {task.dueDate && (
                <span style={{ padding:'2px 8px', borderRadius:5, fontSize:9, fontWeight:600, display:'flex', alignItems:'center', gap:3, fontFamily:'Geist, sans-serif', background:over?'rgba(239,68,68,.1)':soon?'rgba(245,158,11,.1)':'rgba(255,255,255,0.04)', color:over?'#f87171':soon?'#fcd34d':'#6b7280', border:`1px solid ${over?'rgba(239,68,68,.22)':soon?'rgba(245,158,11,.22)':'rgba(255,255,255,0.07)'}` }}>
                  <Calendar size={8} />{over?'⚠ ':''}{formatDueDate(task.dueDate)}
                </span>
              )}
            </div>
          </div>

          {/* Action buttons */}
          <div style={{ display:'flex', gap:4, opacity:0, transition:'opacity .15s', flexShrink:0 }} className="group-hover:opacity-100">
            <button onClick={e => { e.stopPropagation(); setShowEdit(true); }}
              style={{ width:27, height:27, borderRadius:8, border:'1px solid rgba(255,255,255,0.07)', background:'transparent', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', color:'#3a3d44', transition:'all .15s' }}
              onMouseOver={e => { e.currentTarget.style.background='rgba(255,255,255,0.08)'; e.currentTarget.style.color='#e8eaed'; e.currentTarget.style.borderColor='rgba(255,255,255,0.15)'; }}
              onMouseOut={e => { e.currentTarget.style.background='transparent'; e.currentTarget.style.color='#3a3d44'; e.currentTarget.style.borderColor='rgba(255,255,255,0.07)'; }}>
              <Edit3 size={12} />
            </button>

            <button onClick={handleDelClick}
              title={delStage===1 ? 'Click again to confirm delete' : 'Delete task (or double-click card)'}
              style={{ width:27, height:27, borderRadius:8, border:`1px solid ${delStage===1?'rgba(239,68,68,.5)':'rgba(255,255,255,0.07)'}`, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', transition:'all .15s', background:delStage===1?'rgba(239,68,68,.2)':'transparent', color:delStage===1?'#f87171':'#3a3d44' }}
              onMouseOver={e => { if(delStage===0){ e.currentTarget.style.background='rgba(239,68,68,.12)'; e.currentTarget.style.color='#f87171'; e.currentTarget.style.borderColor='rgba(239,68,68,.35)'; } }}
              onMouseOut={e => { if(delStage===0){ e.currentTarget.style.background='transparent'; e.currentTarget.style.color='#3a3d44'; e.currentTarget.style.borderColor='rgba(255,255,255,0.07)'; } }}>
              {delStage===1 ? '✓' : <Trash2 size={12} />}
            </button>
          </div>

          {/* Double-click hint tooltip */}
          <AnimatePresence>
            {dblHint && (
              <motion.div initial={{ opacity:0, y:4 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0 }}
                style={{ position:'absolute', bottom:6, right:8, fontSize:9, color:'#3a3d44', fontFamily:'Geist, sans-serif', pointerEvents:'none' }}>
                double-click to delete
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      <EditTaskModal isOpen={showEdit} onClose={() => setShowEdit(false)} task={task} />
    </>
  );
}
