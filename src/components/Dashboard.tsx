import { motion } from 'motion/react';
import type { useAppData } from '../hooks/useAppData';
import { format } from 'date-fns';

export default function Dashboard({ data }: { data: ReturnType<typeof useAppData> }) {
  const { students, attendance, fees } = data;
  const today = format(new Date(), 'yyyy-MM-dd');
  const todayRecords = attendance[today] || [];
  
  const present = todayRecords.filter(r => r.status === 'P').length;
  const absent = todayRecords.filter(r => r.status === 'A').length;
  
  const monthKey = new Date().toLocaleString('ur-PK', { month: 'long', year: 'numeric' });
  const totalPossibleFees = students.reduce((sum, s) => sum + (Number(s.fee) || 0), 0);
  const collectedFees = students.reduce((sum, s) => {
    const studentFees = fees[s.id] || {};
    return sum + (studentFees[monthKey] === 'Paid' ? (Number(s.fee) || 0) : 0);
  }, 0);

  const feeProgress = totalPossibleFees > 0 ? (collectedFees / totalPossibleFees) * 100 : 0;

  return (
    <div className="space-y-6">
      <motion.div 
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        className="bg-indigo-600 text-white p-6 rounded-[2.5rem] shadow-xl relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl" />
        <div className="relative z-10">
          <p className="opacity-80 urdu text-sm">آج کی حاضری</p>
          <div className="flex items-baseline gap-2 mt-1">
            <h2 className="text-4xl font-bold">{present}</h2>
            <span className="text-sm urdu opacity-80">حاضر</span>
            <span className="text-2xl font-light opacity-30 mx-1">/</span>
            <h2 className="text-2xl font-semibold text-indigo-200">{absent}</h2>
            <span className="text-xs urdu text-indigo-200">غیر حاضر</span>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm transition-all active:scale-95">
          <p className="text-xs text-slate-500 urdu">کل طلباء</p>
          <div className="flex items-end justify-between mt-2">
            <p className="text-2xl font-bold text-slate-800">{students.length}</p>
            <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600">
              <span className="text-[10px] font-bold">ST</span>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm transition-all active:scale-95">
          <p className="text-xs text-slate-500 urdu">وصول شدہ فیس</p>
          <div className="flex items-end justify-between mt-2">
            <p className="text-xl font-bold text-green-600">Rs {collectedFees}</p>
          </div>
        </div>
      </div>

      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100"
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-slate-700 urdu">فیس کا خلاصہ ({monthKey})</h3>
          <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-lg">
            {feeProgress.toFixed(0)}%
          </span>
        </div>
        <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${feeProgress}%` }}
            className="bg-gradient-to-r from-green-400 to-green-500 h-full rounded-full"
          />
        </div>
        <div className="flex justify-between mt-3">
          <p className="text-xs text-slate-400 urdu">باقی فیس: Rs {totalPossibleFees - collectedFees}</p>
          <p className="text-xs text-slate-400 urdu font-mono">Total: {totalPossibleFees}</p>
        </div>
      </motion.div>
    </div>
  );
}
