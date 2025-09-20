import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useParams } from 'react-router-dom'; // Import useParams
import { AuthProvider, useAuth } from './context/AuthContext';
import { DataProvider, useData } from './context/DataContext';
import Header from './components/Header';
import Footer from './components/Footer'; // Import Footer
import Home from './pages/Home';
import Login from './pages/Login';
import TeacherLogin from './pages/TeacherLogin';
import Admin from './pages/Admin';
import TeacherProfile from './pages/TeacherProfile';
import TeacherStatus from './pages/TeacherStatus';
import TeacherExams from './pages/TeacherExams';
import TeacherMonthly from './pages/TeacherMonthly';
import TeacherMemos from './pages/TeacherMemos';
import Parents from './pages/Parents';
import Teachers from './pages/Teachers';
import AddStudentToGrade from './pages/AddStudentToGrade'; // Import AddStudentToGrade
import Students from './pages/Students'; // Import Students

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode; requiredAuth: 'admin' | 'parent' | 'teacher' }> = ({ 
  children, 
  requiredAuth 
}) => {
  const { isAdminAuthenticated, isParentAuthenticated, isTeacherAuthenticated, currentTeacherEmail } = useAuth();
  const { getTeacherByEmail, getTeacherBySlug } = useData();
  const { teacherSlug } = useParams<{ teacherSlug?: string }>();

  if (requiredAuth === 'admin' && !isAdminAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  if (requiredAuth === 'parent' && !isParentAuthenticated) {
    return <Navigate to="/parents" replace />;
  }

  if (requiredAuth === 'teacher') {
    if (!isTeacherAuthenticated || !currentTeacherEmail) {
      return <Navigate to="/login" replace />;
    }

    // Specific check for teacher access: URL slug must match authenticated teacher's slug
    if (teacherSlug) {
      const authenticatedTeacher = getTeacherByEmail(currentTeacherEmail);
      if (!authenticatedTeacher || authenticatedTeacher.slug !== teacherSlug) {
        // If the authenticated teacher doesn't match the URL slug, redirect to their own profile
        return <Navigate to={`/teacher/${authenticatedTeacher?.slug || ''}`} replace />;
      }
    }
  }
  
  return <>{children}</>;
};

function App() {
  return (
    <DataProvider> {/* DataProvider should wrap AuthProvider */}
      <AuthProvider>
        <Router>
          <div className="min-h-screen bg-gray-50" dir="rtl">
            <Header />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/teacher-login" element={<TeacherLogin />} /> {/* Add TeacherLogin route */}
              <Route path="/parents" element={<Parents />} />
              <Route path="/teachers" element={<Teachers />} /> {/* Add the new Teachers route */}
              
              {/* Admin Routes */}
              <Route 
                path="/admin/students" 
                element={
                  <ProtectedRoute requiredAuth="admin">
                    <Students />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin" 
                element={
                  <ProtectedRoute requiredAuth="admin">
                    <Admin />
                  </ProtectedRoute>
                } 
              />
              
              {/* Teacher Routes - Accessible by Admin or the specific Teacher */}
              <Route 
                path="/teacher/:teacherSlug" // Change to teacherSlug
                element={
                  <ProtectedRoute requiredAuth="teacher">
                    <TeacherProfile />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/teacher/:teacherSlug/status"
                element={
                  <ProtectedRoute requiredAuth="teacher"> {/* Change to teacher */}
                    <TeacherStatus />
                  </ProtectedRoute>
                } 
              />
              <Route
                path="/teacher/:teacherSlug/exams"
                element={
                  <ProtectedRoute requiredAuth="teacher"> {/* Change to teacher */}
                    <TeacherExams />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/teacher/:teacherSlug/monthly"
                element={
                  <ProtectedRoute requiredAuth="teacher">
                    <TeacherMonthly />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/teacher/:teacherSlug/memos"
                element={
                  <ProtectedRoute requiredAuth="teacher">
                    <TeacherMemos />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/teacher/:teacherSlug/students"
                element={
                  <ProtectedRoute requiredAuth="teacher">
                    <Students />
                  </ProtectedRoute>
                }
              />
              {/* New route for adding students to a specific grade */}
              <Route
                path="/teacher/:teacherSlug/:gradeNameSlug/students"
                element={
                  <ProtectedRoute requiredAuth="teacher">
                    <AddStudentToGrade />
                  </ProtectedRoute>
                }
              />

              {/* Catch all route */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
            <Footer /> {/* Add Footer component */}
          </div>
        </Router>
      </AuthProvider>
    </DataProvider>
  );
}

export default App;
