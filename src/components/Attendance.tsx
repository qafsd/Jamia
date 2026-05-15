import { useState } from 'react';
import { motion } from 'motion/react';
import { Calendar, CheckCircle2, XCircle } from 'lucide-react';
import type { useAppData } from '../hooks/useAppData';
import { format } from 'date-fns';

export default function Attendance({ data }: { data: ReturnType<typeof useAppData> }) {
  const { students, attendance, markAttendance } = data;
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  
  const dayRecords = attendance[selectedDate] || [];

  return (
    <div className="space-y-4">
      <div className="sticky top-20 z-30 bg-slate-50/80 backdrop-blur-md pb-2">
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="p-2 bg-indigo-50 rounded-xl text-indigo-600">
            <Calendar size={20} />
          </div>
          <input 
            type="date" 
            value={selectedDate} 
            onChange={e => setSelectedDate(e.target.value)}
            className="flex-1 outline-none font-bold text-slate-700 bg-transparent"
          />
        </div>
      </div>

      <div className="space-y-3">
        {students.length === 0 ? (
          <p className="text-center text-slate-400 mt-10 urdu">کوئی طالب علم موجود نہیں</p>
        ) : (
          students.map((s, idx) => {
            const record = dayRecords.find(r => r.studentId === s.id);
            const status = record?.status;

            return (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                key={s.id} 
                className="bg-white p-4 rounded-2xl flex justify-between items-center shadow-sm border border-slate-50"
              >
                <div>
                  <p className="font-bold text-slate-800 urdu">{s.name}</p>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">ROLL: {s.roll}</p>
                </div>
                
                <div className="flex gap-2">
                  <button 
                    onClick={() => markAttendance(selectedDate, s.id, 'P')}
                    aria-label={`حاضر: ${s.name}`}
                    className={`
                      px-4 py-2 rounded-xl font-bold transition-all flex items-center gap-1.5
                      ${status === 'P' 
                        ? 'bg-green-600 text-white shadow-lg shadow-green-100 scale-105' 
                        : 'bg-slate-100 text-slate-400 hover:bg-slate-200'}
                    `}
                  >
                    <CheckCircle2 size={16} />
                    P
                  </button>
                  <button 
                    onClick={() => markAttendance(selectedDate, s.id, 'A')}
                    aria-label={`غیر حاضر: ${s.name}`}
                    className={`
                      px-4 py-2 rounded-xl font-bold transition-all flex items-center gap-1.5
                      ${status === 'A' 
                        ? 'bg-red-600 text-white shadow-lg shadow-red-100 scale-105' 
                        : 'bg-slate-100 text-slate-400 hover:bg-slate-200'}
                    `}
                  >
                    <XCircle size={16} />
                    A
                  </button>
                </div>
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
}
