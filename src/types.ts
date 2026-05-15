import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface Student {
  id: number;
  name: string;
  roll: string;
  fee: number;
  joinedAt: string;
}

export interface AttendanceRecord {
  studentId: number;
  status: 'P' | 'A';
}

export type AttendanceData = Record<string, AttendanceRecord[]>;

export type FeeData = Record<number, Record<string, 'Paid' | 'Unpaid'>>;
