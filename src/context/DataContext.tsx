import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Teacher, Student, Grade, Exam, MonthlyPayment, Memo } from '../types';
import { generateId } from '../utils/generators';

interface DataContextType {
  teachers: Teacher[];
  students: Student[];
  grades: Grade[];
  exams: Exam[];
  monthlyPayments: MonthlyPayment[];
  memos: Memo[];
  addTeacher: (teacher: Omit<Teacher, 'id' | 'grades' | 'createdAt'>) => void;
  addStudent: (student: Omit<Student, 'attendance' | 'examScores'>) => void; // Removed 'id' from Omit
  addGrade: (grade: Omit<Grade, 'id' | 'students' | 'teacherId'> & { teacherId: string }) => void;
  addExam: (exam: Omit<Exam, 'id'>) => void;
  updateAttendance: (studentId: string, date: string, status: 'present' | 'absent' | 'late') => void;
  updateExamScore: (studentId: string, examName: string, score: number) => void;
  updateMonthlyPayment: (studentId: string, month: number, year: number, paid: boolean) => void;
  addMemo: (memo: Omit<Memo, 'id'>) => void;
  updateMemoPayment: (memoId: string, studentId: string, paid: boolean) => void;
  deleteMemo: (memoId: string) => void;
  deleteStudent: (studentId: string) => void;
  deleteGrade: (gradeId: string) => void;
  deleteTeacher: (teacherId: string) => void; // Add deleteTeacher method
  refreshTeachers: () => void; // Add refreshTeachers method
  getTeacherById: (id: string) => Teacher | undefined;
  getTeacherByEmail: (email: string) => Teacher | undefined;
  getTeacherBySlug: (slug: string) => Teacher | undefined; // Add new method
  getStudentByStudentId: (studentId: string) => Student | undefined;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

interface DataProviderProps {
  children: ReactNode;
}

export const DataProvider: React.FC<DataProviderProps> = ({ children }) => {
  const [teachers, setTeachers] = useState<Teacher[]>(() => {
    const savedTeachers = localStorage.getItem('teachers');
    let initialTeachers: Teacher[] = [];
    if (savedTeachers) {
      try {
        // Parse the teachers and convert createdAt strings back to Date objects
        initialTeachers = JSON.parse(savedTeachers).map((teacher: Teacher) => ({
          ...teacher,
          createdAt: new Date(teacher.createdAt),
        }));
      } catch (e) {
        console.error("Failed to parse teachers from localStorage", e);
        // If parsing fails, clear localStorage and start fresh
        localStorage.removeItem('teachers');
      }
    }

    // Do not add a default teacher if no teachers are found or parsing failed
    // The user explicitly asked to remove the "John Doe" card.
    return initialTeachers;
  });
  const [students, setStudents] = useState<Student[]>(() => {
    const savedStudents = localStorage.getItem('students');
    return savedStudents ? JSON.parse(savedStudents) : [];
  });
  const [grades, setGrades] = useState<Grade[]>(() => {
    const savedGrades = localStorage.getItem('grades');
    return savedGrades ? JSON.parse(savedGrades) : [];
  });
  const [exams, setExams] = useState<Exam[]>(() => {
    const savedExams = localStorage.getItem('exams');
    return savedExams ? JSON.parse(savedExams) : [];
  });
  const [monthlyPayments, setMonthlyPayments] = useState<MonthlyPayment[]>(() => {
    const savedPayments = localStorage.getItem('monthlyPayments');
    return savedPayments ? JSON.parse(savedPayments) : [];
  });
  const [memos, setMemos] = useState<Memo[]>(() => {
    const savedMemos = localStorage.getItem('memos');
    return savedMemos ? JSON.parse(savedMemos) : [];
  });

  // Save data to localStorage whenever it changes
  React.useEffect(() => {
    localStorage.setItem('teachers', JSON.stringify(teachers));
  }, [teachers]);

  React.useEffect(() => {
    localStorage.setItem('students', JSON.stringify(students));
  }, [students]);

  React.useEffect(() => {
    localStorage.setItem('grades', JSON.stringify(grades));
  }, [grades]);

  React.useEffect(() => {
    localStorage.setItem('exams', JSON.stringify(exams));
  }, [exams]);

  React.useEffect(() => {
    localStorage.setItem('monthlyPayments', JSON.stringify(monthlyPayments));
  }, [monthlyPayments]);

  React.useEffect(() => {
    localStorage.setItem('memos', JSON.stringify(memos));
  }, [memos]);

  const addTeacher = (teacherData: Omit<Teacher, 'id' | 'grades' | 'createdAt'>) => {
    const newTeacher: Teacher = {
      ...teacherData,
      id: generateId(),
      grades: [],
      createdAt: new Date(),
    };
    setTeachers(prev => [...prev, newTeacher]);
  };

  const addStudent = (studentData: Omit<Student, 'attendance' | 'examScores'>) => { // Removed 'id' from Omit
    const newStudent: Student = {
      ...studentData,
      id: studentData.studentId, // Use studentData.studentId for id
      attendance: [],
      examScores: [],
      registrationDate: studentData.registrationDate || new Date(),
    };
    setStudents(prev => [...prev, newStudent]);
  };

  const addGrade = (gradeData: Omit<Grade, 'id' | 'students' | 'teacherId'> & { teacherId: string }) => {
    const newGrade: Grade = {
      ...gradeData,
      id: generateId(),
      students: [],
    };
    setGrades(prev => [...prev, newGrade]);
  };

  const addExam = (examData: Omit<Exam, 'id'>) => {
    const newExam: Exam = {
      ...examData,
      id: generateId(),
    };
    setExams(prev => [...prev, newExam]);
  };

  const refreshTeachers = () => {
    const savedTeachers = localStorage.getItem('teachers');
    let refreshedTeachers: Teacher[] = [];
    if (savedTeachers) {
      try {
        refreshedTeachers = JSON.parse(savedTeachers).map((teacher: Teacher) => ({
          ...teacher,
          createdAt: new Date(teacher.createdAt),
        }));
      } catch (e) {
        console.error("Failed to parse teachers from localStorage during refresh", e);
        localStorage.removeItem('teachers');
      }
    }
    setTeachers(refreshedTeachers);
  };

  const deleteTeacher = (teacherId: string) => {
    setTeachers(prev => prev.filter(teacher => teacher.id !== teacherId));
    // Optionally, also delete related students, grades, exams if desired
    setStudents(prev => prev.filter(student => student.teacherId !== teacherId));
    setGrades(prev => prev.filter(grade => grade.teacherId !== teacherId));
    setExams(prev => prev.filter(exam => exam.teacherId !== teacherId));
  };

  const updateAttendance = (studentId: string, date: string, status: 'present' | 'absent' | 'late') => {
    setStudents(prev => prev.map(student => {
      if (student.id === studentId) {
        const existingRecord = student.attendance.find(record => record.date === date);
        if (existingRecord) {
          return {
            ...student,
            attendance: student.attendance.map(record =>
              record.date === date ? { ...record, status } : record
            ),
          };
        } else {
          return {
            ...student,
            attendance: [...student.attendance, {
              id: generateId(),
              date,
              status,
              studentId: student.id, // Correctly assign student.id to the 'studentId' property of AttendanceRecord
            }],
          };
        }
      }
      return student;
    }));
  };

  const updateExamScore = (studentId: string, examName: string, score: number) => {
    setStudents(prev => prev.map(student => {
      if (student.id === studentId) {
        const existingScore = student.examScores.find(exam => exam.examName === examName);
        if (existingScore) {
          return {
            ...student,
            examScores: student.examScores.map(exam =>
              exam.examName === examName ? { ...exam, score } : exam
            ),
          };
        } else {
          return {
            ...student,
            examScores: [...student.examScores, {
              id: generateId(),
              examName,
              score,
              studentId: student.id, // Correctly assign student.id to the 'studentId' property of ExamScore
              date: new Date().toISOString().split('T')[0],
            }],
          };
        }
      }
      return student;
    }));
  };

  const updateMonthlyPayment = (studentId: string, month: number, year: number, paid: boolean) => {
    console.log(`DataContext: Updating monthly payment for student ${studentId}, month ${month}, year ${year}, paid: ${paid}`);
    setMonthlyPayments(prev => {
      const existingPayment = prev.find(payment =>
        payment.studentId === studentId && payment.month === month && payment.year === year
      );
      console.log('Existing payment found:', existingPayment);
      let updated;
      if (existingPayment) {
        updated = prev.map(payment =>
          payment.id === existingPayment.id
            ? { ...payment, paid, datePaid: paid ? new Date().toISOString().split('T')[0] : undefined }
            : payment
        );
        console.log('Updated existing payment:', updated.find(p => p.id === existingPayment.id));
      } else {
        const newPayment = {
          id: generateId(),
          studentId,
          month,
          year,
          paid,
          datePaid: paid ? new Date().toISOString().split('T')[0] : undefined,
          teacherId: students.find(s => s.id === studentId)?.teacherId || '',
        };
        console.log('Created new payment:', newPayment);
        updated = [...prev, newPayment];
      }
      // Manually save to localStorage to ensure persistence
      localStorage.setItem('monthlyPayments', JSON.stringify(updated));
      console.log('Saved to localStorage:', updated);
      return updated;
    });
  };

  const addMemo = (memoData: Omit<Memo, 'id'>) => {
    const newMemo: Memo = {
      ...memoData,
      id: generateId(),
    };
    setMemos(prev => [...prev, newMemo]);
  };

  const updateMemoPayment = (memoId: string, studentId: string, paid: boolean) => {
    setMemos(prev => prev.map(memo => {
      if (memo.id === memoId) {
        return {
          ...memo,
          payments: {
            ...memo.payments,
            [studentId]: paid,
          },
        };
      }
      return memo;
    }));
  };

  const deleteMemo = (memoId: string) => {
    setMemos(prev => prev.filter(memo => memo.id !== memoId));
  };

  const deleteStudent = (studentId: string) => {
    setStudents(prev => prev.filter(student => student.id !== studentId));
    // Also remove student from monthly payments and memos
    setMonthlyPayments(prev => prev.filter(payment => payment.studentId !== studentId));
    setMemos(prev => prev.map(memo => ({
      ...memo,
      payments: Object.fromEntries(
        Object.entries(memo.payments || {}).filter(([id]) => id !== studentId)
      ),
    })));
  };

  const deleteGrade = (gradeId: string) => {
    setGrades(prev => prev.filter(grade => grade.id !== gradeId));
    // Also remove students in this grade
    const studentsInGrade = students.filter(student => student.gradeId === gradeId);
    studentsInGrade.forEach(student => deleteStudent(student.id));
    // Remove memos for this grade
    setMemos(prev => prev.filter(memo => memo.gradeId !== gradeId));
  };

  const getTeacherById = (id: string): Teacher | undefined => {
    return teachers.find(teacher => teacher.id === id);
  };

  const getStudentByStudentId = (studentId: string): Student | undefined => {
    return students.find(student => student.studentId === studentId);
  };

  const getTeacherByEmail = (email: string): Teacher | undefined => {
    return teachers.find(teacher => teacher.email === email);
  };

  const getTeacherBySlug = (slug: string): Teacher | undefined => {
    return teachers.find(teacher => teacher.slug === slug);
  };

  return (
    <DataContext.Provider value={{
      teachers,
      students,
      grades,
      exams,
      monthlyPayments,
      memos,
      addTeacher,
      addStudent,
      addGrade,
      addExam,
      updateAttendance,
      updateExamScore,
      updateMonthlyPayment,
      addMemo,
      updateMemoPayment,
      deleteMemo,
      deleteStudent,
      deleteGrade,
      deleteTeacher, // Add new method
      refreshTeachers, // Add new method
      getTeacherById,
      getTeacherByEmail,
      getTeacherBySlug, // Add new method
      getStudentByStudentId,
    }}>
      {children}
    </DataContext.Provider>
  );
};
