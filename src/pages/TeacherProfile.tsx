import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import {
  Home,
  Users,
  BookOpen,
  DollarSign,
  FileText,
  Search,
  ClipboardCheck,
  Calendar,
  User,
  GraduationCap,
  Activity,
  Wallet,
  Book,
  CheckCircle,
  Clock,
  Award,
  Bell,
  Settings,
  LogOut,
  Menu,
  X,
  Plus, // Added Plus icon for "Add New Grade" button
  MoreVertical, // Added for grade actions menu
  MapPin,
} from 'lucide-react';
import AddGradeModal from '../components/AddGradeModal'; // Import AddGradeModal
import AddGroupModal from '../components/AddGroupModal'; // Import AddGroupModal
import GradeActionsModal from '../components/GradeActionsModal'; // Import GradeActionsModal
import { Grade } from '../types'; // Import Grade interface

const TeacherProfile: React.FC = () => {
  const { teachers, grades, students, memos } = useData();
  const [showAddGradeModal, setShowAddGradeModal] = useState(false); // State for modal visibility
  const [showAddGroupModal, setShowAddGroupModal] = useState(false); // State for add group modal visibility
  const [showGradeActionsModal, setShowGradeActionsModal] = useState(false); // State for grade actions modal visibility
  const [selectedGrade, setSelectedGrade] = useState<Grade | null>(null); // State to hold the selected grade
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // State for mobile menu
  const { isTeacherAuthenticated, currentTeacherEmail, isAdminAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation(); // Get current location

  const currentTeacher = teachers.find(teacher => teacher.email === currentTeacherEmail);

  // Get current date in dd/mm/yy format
  const getCurrentDate = () => {
    const date = new Date();
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear().toString().slice(-2);
    return `${day}/${month}/${year}`;
  };

  // Redirect if not authorized
  useEffect(() => {
    if (!isAdminAuthenticated && (!isTeacherAuthenticated || !currentTeacher)) {
      navigate('/login', { replace: true });
    }
  }, [isAdminAuthenticated, isTeacherAuthenticated, currentTeacher, navigate]);

  if (!currentTeacher) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="text-center bg-white p-8 rounded-2xl shadow-xl">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">المعلم غير موجود أو غير مصرح له</h2>
          <p className="text-gray-600 mb-6">الرجاء تسجيل الدخول بحساب معلم صالح.</p>
          <Link to="/login" className="inline-block px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 transition-transform transform hover:scale-105">
            الذهاب إلى صفحة تسجيل الدخول
          </Link>
        </div>
      </div>
    );
  }

  // Data based on current teacher
  const teacherName = currentTeacher.name;
  const teacherGrades = grades.filter(grade => grade.teacherId === currentTeacher.id);
  const teacherStudents = students.filter(student => student.teacherId === currentTeacher.id);

  // Dummy data for demonstration (to be replaced with real data if available)
  const pendingPayments = 23;
  const totalStudents = teacherStudents.length; // Real data

  // Calculate today's attendance
  const today = getCurrentDate(); // Get today's date in dd/mm/yy format
  const presentStudentsToday = teacherStudents.filter(student =>
    student.attendance.some(record => record.date === today && record.status === 'present')
  ).length;
  const todayAttendance = presentStudentsToday;
  // Calculate paid memos
  const teacherMemos = memos.filter(memo => memo.teacherId === currentTeacher.id);
  const totalPaidStudentsForMemos = teacherMemos.reduce((sum, memo) => {
    return sum + Object.values(memo.payments || {}).filter(Boolean).length;
  }, 0);
  const activeClasses = teacherGrades.map(grade => ({
    id: grade.id,
    name: grade.name,
    students: students.filter(student => student.gradeId === grade.id).length,
    subject: currentTeacher.subject, // Assuming teacher teaches one subject for all grades
    status: 'نشط', // Hardcoded for now, can be dynamic based on grade status
  }));

  const recentActivities = [
    { id: '1', text: 'تم تسجيل حضور الصف الثالث الثانوي', time: 'منذ 5 دقائق', type: 'attendance' }, // Third Secondary attendance recorded - 5 minutes ago
    { id: '2', text: 'تم إضافة درجات امتحان الرياضيات للصف الثاني', time: 'منذ 15 دقيقة', type: 'grades' }, // Second Secondary Math exam grades added - 15 minutes ago
    { id: '3', text: 'تم استلام دفعة من أحمد محمد', time: 'منذ 30 دقيقة', type: 'payment' }, // Payment received from Ahmed Mohamed - 30 minutes ago
    { id: '4', text: 'تم رفع مذكرة الفيزياء الجديدة', time: 'منذ ساعة', type: 'memo' }, // New Physics memo uploaded - an hour ago
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'نشط': // Active
        return 'bg-green-100 text-green-800';
      case 'منتهي': // Finished
        return 'bg-gray-100 text-gray-600';
      case 'قريبا': // Soon
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 font-sans text-right" dir="rtl">
      {/* Mobile Header */}
      <header className="lg:hidden bg-white shadow-sm p-4 flex justify-between items-center">
        <div className="flex items-center">
          <GraduationCap className="h-6 w-6 text-indigo-600 ml-2" />
          <h1 className="text-lg font-bold text-gray-900">لوحة المعلم</h1>
        </div>
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
        >
          {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </header>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black bg-opacity-50" onClick={() => setIsMobileMenuOpen(false)}>
          <div className="fixed right-0 top-0 h-full w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out">
            <div className="p-6">
              <div className="flex items-center mb-8">
                <GraduationCap className="h-8 w-8 text-indigo-600 ml-3" />
                <h2 className="text-2xl font-bold text-gray-900">لوحة المعلم</h2>
              </div>
              <nav>
                <ul className="space-y-3">
                  <li>
                    <Link
                      to="#"
                      className="flex items-center p-3 rounded-lg bg-indigo-50 text-indigo-700 font-semibold hover:bg-indigo-100 transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <Home className="h-5 w-5 ml-3" />
                      الرئيسية
                    </Link>
                  </li>
                  <li>
                    <Link
                      to={`/teacher/${currentTeacher.slug}/status`}
                      className="flex items-center p-3 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <Users className="h-5 w-5 ml-3" />
                      الحضور والغياب
                    </Link>
                  </li>
                  <li>
                    <Link
                      to={`/teacher/${currentTeacher.slug}/exams`}
                      className="flex items-center p-3 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <BookOpen className="h-5 w-5 ml-3" />
                      الدرجات والتقييمات
                    </Link>
                  </li>
                  <li>
                    <Link
                      to={`/teacher/${currentTeacher.slug}/monthly`}
                      className={`flex items-center p-3 rounded-lg ${
                        location.pathname === `/teacher/${currentTeacher.slug}/monthly`
                          ? 'bg-indigo-50 text-indigo-700 font-semibold'
                          : 'text-gray-700 hover:bg-gray-50'
                      } transition-colors`}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <DollarSign className="h-5 w-5 ml-3" />
                      المدفوعات
                    </Link>
                  </li>
                  <li>
                    <Link
                      to={`/teacher/${currentTeacher.slug}/memos`}
                      className="flex items-center p-3 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <FileText className="h-5 w-5 ml-3" />
                      المذكرات والملفات
                    </Link>
                  </li>
                  <li>
                    <Link
                      to={`/teacher/${currentTeacher.slug}/students`}
                      className="flex items-center p-3 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <User className="h-5 w-5 ml-3" />
                      الطلاب
                    </Link>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
        </div>
      )}

      <div className="flex">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:flex w-64 bg-white shadow-lg p-6 flex-col">
          <div className="flex items-center mb-8">
            <GraduationCap className="h-8 w-8 text-indigo-600 ml-3" />
            <h2 className="text-2xl font-bold text-gray-900">لوحة المعلم</h2>
          </div>
          <nav className="flex-1">
            <ul>
              <li className="mb-3">
                <Link to="#" className="flex items-center p-3 rounded-lg bg-indigo-50 text-indigo-700 font-semibold hover:bg-indigo-100 transition-colors">
                  <Home className="h-5 w-5 ml-3" />
                  الرئيسية
                </Link>
              </li>
              <li className="mb-3">
                <Link to={`/teacher/${currentTeacher.slug}/status`} className="flex items-center p-3 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
                  <Users className="h-5 w-5 ml-3" />
                  الحضور والغياب
                </Link>
              </li>
              <li className="mb-3">
                <Link to={`/teacher/${currentTeacher.slug}/exams`} className="flex items-center p-3 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
                  <BookOpen className="h-5 w-5 ml-3" />
                  الدرجات والتقييمات
                </Link>
              </li>
              <li className="mb-3">
                <Link
                  to={`/teacher/${currentTeacher.slug}/monthly`}
                  className={`flex items-center p-3 rounded-lg ${
                    location.pathname === `/teacher/${currentTeacher.slug}/monthly`
                      ? 'bg-indigo-50 text-indigo-700 font-semibold'
                      : 'text-gray-700 hover:bg-gray-50'
                  } transition-colors`}
                >
                  <DollarSign className="h-5 w-5 ml-3" />
                  المدفوعات
                </Link>
              </li>
              <li className="mb-3">
                <Link to={`/teacher/${currentTeacher.slug}/memos`} className="flex items-center p-3 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
                  <FileText className="h-5 w-5 ml-3" />
                  المذكرات والملفات
                </Link>
              </li>
              <li className="mb-3">
                <Link to={`/teacher/${currentTeacher.slug}/students`} className="flex items-center p-3 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
                  <User className="h-5 w-5 ml-3" />
                  الطلاب
                </Link>
              </li>
            </ul>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-4 lg:p-8">
          {/* Header */}
          <header className="flex justify-between items-center mb-8">
            <div className="flex items-center">
              <Calendar className="h-5 w-5 text-gray-500 ml-2" />
              <span className="text-gray-700 text-sm">{getCurrentDate()}</span>
            </div>
            <div className="flex items-center space-x-4">
              <Search className="h-5 w-5 text-gray-500 cursor-pointer" />
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">مرحباً بك يا {teacherName}</h1>
            </div>
          </header>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-2xl shadow-md flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">المدفوعات المعلقة</p>
              <p className="text-3xl font-bold text-gray-900">{pendingPayments}</p>
              <p className="text-xs text-gray-400">بحاجة للمتابعة</p>
            </div>
            <Wallet className="h-10 w-10 text-orange-400" />
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-md flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">طلاب دفعوا المذكرات</p>
              <p className="text-3xl font-bold text-gray-900">{totalPaidStudentsForMemos}</p>
              <p className="text-xs text-gray-400">إجمالي المدفوعات للمذكرات</p>
            </div>
            <FileText className="h-10 w-10 text-purple-400" />
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-md flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">الحضور اليوم</p>
              <p className="text-3xl font-bold text-gray-900">{todayAttendance}</p>
              <p className="text-xs text-gray-400">٩١٪ معدل الحضور</p>
            </div>
            <Users className="h-10 w-10 text-green-400" />
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-md flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">إجمالي الطلاب</p>
              <p className="text-3xl font-bold text-gray-900">{totalStudents}</p>
              <p className="text-xs text-gray-400">+١٢٪ عن الشهر الماضي</p>
            </div>
            <User className="h-10 w-10 text-blue-400" />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Active Classes */}
          <div className="bg-white p-6 rounded-2xl shadow-md">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">الصفوف النشطة</h2>
              <button
                onClick={() => setShowAddGradeModal(true)}
                className="inline-flex items-center px-4 py-2 bg-indigo-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-indigo-700 transition-colors"
              >
                <Plus className="h-4 w-4 ml-2" />
                إضافة صف جديد
              </button>
            </div>
            <div className="space-y-4">
              {activeClasses.map((cls) => {
                const grade = grades.find(g => g.id === cls.id);
                return (
                  <div key={cls.id} className={`p-4 rounded-xl ${cls.status === 'نشط' ? 'bg-blue-50' : cls.status === 'قريبا' ? 'bg-yellow-50' : 'bg-gray-50'}`}>
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <p className="text-lg font-semibold text-gray-800">{cls.name}</p>
                        <p className="text-sm text-gray-500">{cls.students} طالب • {cls.subject}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(cls.status)}`}>
                          {cls.status}
                        </span>
                        <button
                          onClick={() => {
                            setSelectedGrade(grade || null);
                            setShowGradeActionsModal(true);
                          }}
                          className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100"
                          title="إجراءات الصف"
                        >
                          <MoreVertical className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                    {grade && (
                      <div className="flex items-center space-x-2">
                        <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                          <Users className="h-3 w-3 ml-1" />
                          {grade.groupName}
                        </div>
                        <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          <MapPin className="h-3 w-3 ml-1" />
                          {grade.location}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Recent Activities */}
          <div className="bg-white p-6 rounded-2xl shadow-md">
            <h2 className="text-xl font-bold text-gray-900 mb-6">الأنشطة الأخيرة</h2>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-center p-3 rounded-xl bg-gray-50">
                  <div className={`h-2.5 w-2.5 rounded-full ml-3 ${
                    activity.type === 'attendance' ? 'bg-green-500' :
                    activity.type === 'grades' ? 'bg-blue-500' :
                    activity.type === 'payment' ? 'bg-orange-500' :
                    'bg-purple-500'
                  }`}></div>
                  <div>
                    <p className="text-md text-gray-800">{activity.text}</p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        </main>
      </div>
      {/* Add Grade Modal */}
      <AddGradeModal
        isOpen={showAddGradeModal}
        onClose={() => setShowAddGradeModal(false)}
        teacherId={currentTeacher.id}
      />
      {/* Grade Actions Modal */}
      <GradeActionsModal
        isOpen={showGradeActionsModal}
        onClose={() => setShowGradeActionsModal(false)}
        grade={selectedGrade}
        onAddNewGroup={() => setShowAddGroupModal(true)}
      />
      {/* Add Group Modal */}
      <AddGroupModal
        isOpen={showAddGroupModal}
        onClose={() => setShowAddGroupModal(false)}
        teacherId={currentTeacher.id}
        selectedGradeName={selectedGrade?.name}
      />
    </div>
  );
};

export default TeacherProfile;
