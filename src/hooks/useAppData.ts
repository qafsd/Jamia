import { useState, useEffect } from 'react';
import type { Student, AttendanceData, FeeData } from '../types';

export function useAppData() {
  const [students, setStudents] = useState<Student[]>(() => {
    const saved = localStorage.getItem('app_students');
    return saved ? JSON.parse(saved) : [];
  });

  const [attendance, setAttendance] = useState<AttendanceData>(() => {
    const saved = localStorage.getItem('app_attendance');
    return saved ? JSON.parse(saved) : {};
  });

  const [fees, setFees] = useState<FeeData>(() => {
    const saved = localStorage.getItem('app_fees');
    return saved ? JSON.parse(saved) : {};
  });

  useEffect(() => {
    localStorage.setItem('app_students', JSON.stringify(students));
  }, [students]);

  useEffect(() => {
    localStorage.setItem('app_attendance', JSON.stringify(attendance));
  }, [attendance]);

  useEffect(() => {
    localStorage.setItem('app_fees', JSON.stringify(fees));
  }, [fees]);

  const addStudent = (student: Student) => {
    setStudents(prev => [...prev, student]);
  };

  const deleteStudent = (id: number) => {
    if (confirm('کیا آپ اس طالب علم کو حذف کرنا چاہتے ہیں؟')) {
      setStudents(prev => prev.filter(s => s.id !== id));
      // Cleanup attendance and fees for deleted student? 
      // Keeping for history, but could clean up here.
    }
  };

  const markAttendance = (date: string, studentId: number, status: 'P' | 'A') => {
    setAttendance(prev => {
      const dayRecord = prev[date] || [];
      const filtered = dayRecord.filter(r => r.studentId !== studentId);
      return {
        ...prev,
        [date]: [...filtered, { studentId, status }]
      };
    });
  };

  const toggleFee = (studentId: number, monthKey: string) => {
    setFees(prev => {
      const studentFees = prev[studentId] || {};
      const currentStatus = studentFees[monthKey] || 'Unpaid';
      return {
        ...prev,
        [studentId]: {
          ...studentFees,
          [monthKey]: currentStatus === 'Paid' ? 'Unpaid' : 'Paid'
        }
      };
    });
  };

  return {
    students,
    attendance,
    fees,
    addStudent,
    deleteStudent,
    markAttendance,
    toggleFee
  };
}
