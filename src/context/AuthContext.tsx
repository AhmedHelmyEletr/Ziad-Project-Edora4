import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useData } from './DataContext'; // Import useData

interface AuthContextType {
  isAdminAuthenticated: boolean;
  isParentAuthenticated: boolean;
  isTeacherAuthenticated: boolean;
  currentStudentId: string | null;
  currentTeacherEmail: string | null;
  loginAdmin: (username: string, password: string) => boolean;
  loginParent: (studentId: string) => Promise<boolean>;
  loginTeacher: (email: string, password: string) => Promise<boolean>; // Removed getTeacherByEmail parameter
  logoutAdmin: () => void;
  logoutParent: () => void;
  logoutTeacher: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const { getStudentByStudentId } = useData(); // Use getStudentByStudentId from DataContext

  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [isParentAuthenticated, setIsParentAuthenticated] = useState(false);
  const [isTeacherAuthenticated, setIsTeacherAuthenticated] = useState(false);
  const [currentStudentId, setCurrentStudentId] = useState<string | null>(null);
  const [currentTeacherEmail, setCurrentTeacherEmail] = useState<string | null>(null);

  useEffect(() => {
    const adminAuth = localStorage.getItem('adminAuth');
    const parentAuth = localStorage.getItem('parentAuth');
    const studentId = localStorage.getItem('currentStudentId');
    const teacherAuth = localStorage.getItem('teacherAuth');
    const teacherEmail = localStorage.getItem('currentTeacherEmail');
    
    if (adminAuth === 'true') {
      setIsAdminAuthenticated(true);
    }
    if (parentAuth === 'true' && studentId) {
      setIsParentAuthenticated(true);
      setCurrentStudentId(studentId);
    }
    if (teacherAuth === 'true' && teacherEmail) {
      setIsTeacherAuthenticated(true);
      setCurrentTeacherEmail(teacherEmail);
    }
  }, []);

  const loginAdmin = (username: string, password: string): boolean => {
    if (username === 'Admin' && password === 'Admin123') {
      setIsAdminAuthenticated(true);
      localStorage.setItem('adminAuth', 'true');
      return true;
    }
    return false;
  };

  const loginParent = async (studentId: string): Promise<boolean> => {
    const student = getStudentByStudentId(studentId);
    if (student) {
      setIsParentAuthenticated(true);
      setCurrentStudentId(studentId);
      localStorage.setItem('parentAuth', 'true');
      localStorage.setItem('currentStudentId', studentId);
      return true;
    }
    return false;
  };

  const loginTeacher = async (email: string, password: string): Promise<boolean> => {
    const savedTeachers = localStorage.getItem('teachers');
    if (savedTeachers) {
      try {
        const teachers: any[] = JSON.parse(savedTeachers);
        const teacher = teachers.find(t => t.email === email && t.password === password);
        if (teacher) {
          setIsTeacherAuthenticated(true);
          setCurrentTeacherEmail(email);
          localStorage.setItem('teacherAuth', 'true');
          localStorage.setItem('currentTeacherEmail', email);
          return true;
        }
      } catch (e) {
        console.error("Failed to parse teachers from localStorage during login", e);
      }
    }
    return false;
  };

  const logoutAdmin = () => {
    setIsAdminAuthenticated(false);
    localStorage.removeItem('adminAuth');
  };

  const logoutParent = () => {
    setIsParentAuthenticated(false);
    setCurrentStudentId(null);
    localStorage.removeItem('parentAuth');
    localStorage.removeItem('currentStudentId');
  };

  const logoutTeacher = () => {
    setIsTeacherAuthenticated(false);
    setCurrentTeacherEmail(null);
    localStorage.removeItem('teacherAuth');
    localStorage.removeItem('currentTeacherEmail');
  };

  return (
    <AuthContext.Provider value={{
      isAdminAuthenticated,
      isParentAuthenticated,
      isTeacherAuthenticated,
      currentStudentId,
      currentTeacherEmail,
      loginAdmin,
      loginParent,
      loginTeacher,
      logoutAdmin,
      logoutParent,
      logoutTeacher
    }}>
      {children}
    </AuthContext.Provider>
  );
};
