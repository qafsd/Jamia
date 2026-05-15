import { motion } from 'motion/react';
import { Download, FileText, Share2 } from 'lucide-react';
import type { useAppData } from '../hooks/useAppData';
import html2pdf from 'html2pdf.js';

export default function Reports({ data }: { data: ReturnType<typeof useAppData> }) {
  const { students, attendance, fees } = data;
  const monthKey = new Date().toLocaleString('ur-PK', { month: 'long', year: 'numeric' });

  const generatePDF = (studentId: number) => {
    const student = students.find(s => s.id === studentId);
    if (!student) return;

    // Calculate Stats
    let presentCount = 0;
    let absentCount = 0;
    let totalDays = 0;

    Object.keys(attendance).forEach(date => {
      const record = attendance[date].find(r => r.studentId === studentId);
      if (record) {
        totalDays++;
        if (record.status === 'P') presentCount++;
        else absentCount++;
      }
    });

    const percentage = totalDays > 0 ? ((presentCount / totalDays) * 100).toFixed(1) : '0';
    const isPaid = fees[studentId]?.[monthKey] === 'Paid';
    const feeStatus = isPaid ? 'ادا شدہ' : 'بقایا (ادا کریں)';
    const feeColor = isPaid ? '#16a34a' : '#dc2626';

    const element = document.createElement('div');
    element.innerHTML = `
      <div style="padding: 50px; font-family: 'Noto Nastaliq Urdu', serif; direction: rtl; text-align: right; background-color: #ffffff; line-height: 2.2; border: 15px solid #4f46e5;">
        <div style="text-align: center; margin-bottom: 40px; border-bottom: 4px double #4f46e5; padding-bottom: 20px;">
          <h1 style="font-size: 32px; color: #4f46e5; margin: 0; font-weight: bold;">جامعہ عبداللہ بن عباس فیصل آباد</h1>
          <p style="font-size: 20px; color: #64748b; margin-top: 15px; font-weight: normal;">رپورٹ برائے والدین - ${monthKey}</p>
        </div>

        <div style="background-color: #f1f5f9; border: 1px solid #cbd5e1; padding: 25px; border-radius: 20px; margin-bottom: 40px; display: flex; justify-content: space-between; align-items: center;">
          <div style="flex: 1;">
            <p style="font-size: 20px; margin: 5px 0; color: #1e293b;"><strong>نام طالب علم:</strong> ${student.name}</p>
            <p style="font-size: 20px; margin: 5px 0; color: #1e293b;"><strong>رول نمبر:</strong> ${student.roll}</p>
          </div>
        </div>

        <div style="margin-bottom: 40px;">
          <h3 style="font-size: 24px; color: #4f46e5; border-bottom: 2px solid #e2e8f0; padding-bottom: 10px; margin-bottom: 20px;">1. تعلیمی حاضری</h3>
          <div style="padding-right: 20px; background: #fff; padding: 20px; border-radius: 15px; border: 1px solid #f1f5f9;">
            <p style="font-size: 18px; margin: 10px 0;">کل درج شدہ دن: <strong style="font-family: sans-serif;">${totalDays}</strong></p>
            <p style="font-size: 18px; margin: 10px 0; color: #16a34a;">حاضری کے دن: <strong style="font-family: sans-serif;">${presentCount}</strong></p>
            <p style="font-size: 18px; margin: 10px 0; color: #dc2626;">غیر حاضری کے دن: <strong style="font-family: sans-serif;">${absentCount}</strong></p>
            <p style="font-size: 22px; margin: 20px 0; font-weight: bold; color: #4f46e5;">سالانہ حاضری اوسط: <span style="direction: ltr; display: inline-block; font-family: sans-serif;">${percentage}%</span></p>
          </div>
        </div>

        <div style="margin-bottom: 40px;">
          <h3 style="font-size: 24px; color: #4f46e5; border-bottom: 2px solid #e2e8f0; padding-bottom: 10px; margin-bottom: 20px;">2. مالی معاملات (فیس)</h3>
          <div style="padding-right: 20px; background: #fff; padding: 20px; border-radius: 15px; border: 1px solid #f1f5f9;">
            <p style="font-size: 18px; margin: 10px 0;">ماہانہ مقررہ فیس: <span style="font-family: sans-serif;">Rs. ${student.fee}</span></p>
            <p style="font-size: 24px; margin: 15px 0; font-weight: bold; color: ${feeColor};">موجودہ صورتحال: ${feeStatus}</p>
          </div>
        </div>

        <div style="margin-top: 80px; text-align: center; border-top: 1px solid #e2e8f0; padding-top: 30px;">
          <div style="display: flex; justify-content: space-around; margin-bottom: 30px;">
            <div style="text-align: center;">
              <div style="width: 150px; border-bottom: 1px solid #1e293b; margin-bottom: 5px;"></div>
              <p style="font-size: 14px; color: #64748b;">دستخط ہیڈ ماسٹر</p>
            </div>
            <div style="text-align: center;">
              <div style="width: 150px; border-bottom: 1px solid #1e293b; margin-bottom: 5px;"></div>
              <p style="font-size: 14px; color: #64748b;">دستخط نگران</p>
            </div>
          </div>
          <p style="font-size: 12px; color: #94a3b8;">یہ رپورٹ "جامعہ عبداللہ مینجر" سے تیار کردہ ہے۔</p>
        </div>
      </div>
    `;

    const opt = {
      margin: 0,
      filename: `Report_${student.roll}_${student.name}.pdf`,
      image: { type: 'jpeg' as const, quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true, letterRendering: true },
      jsPDF: { unit: 'in' as const, format: 'letter' as const, orientation: 'portrait' as const }
    };

    html2pdf().set(opt).from(element).save();
  };

  return (
    <div className="space-y-6">
      <div className="bg-indigo-50 border border-indigo-100 p-6 rounded-[2.5rem] flex items-center gap-4">
        <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-indigo-600 shadow-sm">
          <FileText size={32} />
        </div>
        <div>
          <h2 className="text-lg font-bold text-slate-800 urdu">تعلیمی رپورٹس</h2>
          <p className="text-xs text-slate-500 urdu">والدین کے لیے ماہانہ کارکردگی کارڈ تیار کریں</p>
        </div>
      </div>

      <div className="space-y-3">
        {students.length === 0 ? (
          <p className="text-center text-slate-400 mt-10 urdu">کوئی طالب علم موجود نہیں</p>
        ) : (
          students.map((s, idx) => (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              key={s.id} 
              className="bg-white p-5 rounded-[2rem] flex justify-between items-center shadow-sm border border-slate-50 active:bg-slate-50 transition-colors"
            >
              <div>
                <p className="font-bold text-slate-800 urdu text-lg">{s.name}</p>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">ROLL: {s.roll}</p>
              </div>
              
              <div className="flex gap-2">
                <button 
                  onClick={() => generatePDF(s.id)}
                  aria-label={`ڈاؤن لوڈ رپورٹ برائے ${s.name}`}
                  className="w-12 h-12 bg-indigo-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-100 active:scale-90 transition-all"
                >
                  <Download size={20} />
                </button>
                <button 
                  aria-label={`شیئر کریں ${s.name}`}
                  className="w-12 h-12 bg-white border border-slate-200 text-slate-400 rounded-2xl flex items-center justify-center active:scale-90 transition-all"
                >
                  <Share2 size={18} />
                </button>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
