export interface Teacher {
  id: string;
  name: string;
  phoneNumber: string;
  imageUrl: string;
  bio: string;
  subject: string;
  government: string;
  city: string;
  location: string;
  email: string;
  password: string;
  slug: string; // Add slug for URL-friendly names
  grades: Grade[];
  createdAt: Date;
}

export interface Grade {
  id: string;
  name: string;
  groupName: string; // Added group name
  location: string;  // Added location
  students: Student[];
  teacherId: string;
}

export interface Student {
  id: string;
  studentId: string; // Reverted from code to studentId
  name: string;
  studentNumber: string;
  phoneNumber: string; // Keep as phoneNumber as per user's initial request
  parentNumber: string; // Added parentNumber
  location: string;
  gradeId: string;
  teacherId: string;
  registrationDate: Date;
  attendance: AttendanceRecord[];
  examScores: ExamScore[];
}

export interface AttendanceRecord {
  id: string;
  date: string;
  status: 'present' | 'absent' | 'late';
  studentId: string; // Reverted from code to studentId
}

export interface ExamScore {
  id: string;
  examName: string;
  score: number;
  studentId: string; // Reverted from code to studentId
  date: string;
}

export interface Exam {
  id: string;
  name: string;
  teacherId: string;
  gradeId: string;
  groupName: string; // New field
  fullMark: number;  // New field
  date: string;
  scores: { [studentId: string]: number };
}

export interface MonthlyPayment {
  id: string;
  studentId: string;
  month: number; // 1-12
  year: number;
  paid: boolean;
  datePaid?: string;
  teacherId: string;
}

export interface Memo {
  id: string;
  gradeId: string;
  title: string;
  description: string;
  date: string;
  teacherId: string;
  payments: { [studentId: string]: boolean }; // Track which students have "paid" for this memo
}
