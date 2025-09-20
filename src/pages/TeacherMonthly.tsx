import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import {
  ArrowLeft,
  DollarSign,
  Search,
  Wallet,
  AlertCircle,
  CheckCircle,
  XCircle,
  Eye,
  Edit,
  Calendar,
  GraduationCap,
  BookOpen,
  User,
} from 'lucide-react';

interface PaymentRecord {
  id: string;
  studentName: string;
  studentCode: string;
  studentPhone: string;
  grade: string;
  monthlyFee: number;
  paidAmount: number;
  status: 'مدفوع' | 'متأخر' | 'معلق';
  lastPaymentDate: string;
  gradeId: string;
  studentId: string;
}

// Function to generate dynamic payment records
const generateStudentPaymentRecords = (students: any[], grades: any[], currentTeacher: any): PaymentRecord[] => {
  const paymentRecords: PaymentRecord[] = [];
  const teacherGrades = grades.filter(grade => grade.teacherId === currentTeacher.id);

  students.filter(student => student.teacherId === currentTeacher.id).forEach(student => {
    const studentGrade = teacherGrades.find(grade => grade.id === student.gradeId);
    if (studentGrade) {
      const monthlyFee = Math.floor(Math.random() * (500 - 200 + 1)) + 200; // Random fee between 200 and 500
      let paidAmount = 0;
      let status: 'مدفوع' | 'متأخر' | 'معلق' = 'معلق';
      let lastPaymentDate = 'N/A';

      // Simulate payment status
      const randomStatus = Math.random();
      if (randomStatus < 0.4) { // 40% paid
        paidAmount = monthlyFee;
        status = 'مدفوع';
        const dayPaid = Math.floor(Math.random() * 28) + 1;
        const monthPaid = Math.floor(Math.random() * 12) + 1;
        const yearPaid = 24; // For 'yy' format
        lastPaymentDate = `${dayPaid.toString().padStart(2, '0')}/${monthPaid.toString().padStart(2, '0')}/${yearPaid}`;
      } else if (randomStatus < 0.7) { // 30% late
        paidAmount = Math.floor(monthlyFee * Math.random() * 0.5); // Partially paid
        status = 'متأخر';
        const dayLate = Math.floor(Math.random() * 28) + 1;
        const monthLate = Math.floor(Math.random() * 11) + 1; // Up to Nov
        const yearLate = 24;
        lastPaymentDate = `${dayLate.toString().padStart(2, '0')}/${monthLate.toString().padStart(2, '0')}/${yearLate}`;
      } else { // 30% pending
        paidAmount = Math.floor(monthlyFee * Math.random() * 0.8); // Partially paid or 0
        status = 'معلق';
        const dayPending = Math.floor(Math.random() * 28) + 1;
        const monthPending = Math.floor(Math.random() * 11) + 1; // Up to Nov
        const yearPending = 24;
        lastPaymentDate = `${dayPending.toString().padStart(2, '0')}/${monthPending.toString().padStart(2, '0')}/${yearPending}`;
      }

      paymentRecords.push({
        id: `p-${student.id}`,
        studentName: student.name,
        studentCode: student.studentId, // Assuming studentId is the code
        studentPhone: student.phoneNumber || 'N/A',
        grade: studentGrade.name,
        monthlyFee,
        paidAmount,
        status,
        lastPaymentDate,
        gradeId: studentGrade.id,
        studentId: student.id,
      });
    }
  });
  return paymentRecords;
};

const getLocalStorageKey = (studentId: string, month: number, year: number) =>
  `payment-${studentId}-${month}-${year}`;

const getPaymentStatusFromLocalStorage = (studentId: string, month: number, year: number): boolean => {
  const key = getLocalStorageKey(studentId, month, year);
  const status = localStorage.getItem(key);
  return status === 'true';
};

const setPaymentStatusInLocalStorage = (studentId: string, month: number, year: number, paid: boolean) => {
  const key = getLocalStorageKey(studentId, month, year);
  localStorage.setItem(key, String(paid));
};

const TeacherMonthly: React.FC = () => {
  const { teacherSlug } = useParams<{ teacherSlug: string }>();
  const { getTeacherBySlug, students, grades } = useData(); // Removed monthlyPayments, updateMonthlyPayment
  const { isTeacherAuthenticated, currentTeacherEmail, isAdminAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterGrade, setFilterGrade] = useState('جميع الفصول'); // All Classes
  const [refreshKey, setRefreshKey] = useState(0); // Dummy state to force re-render

  const teacher = teacherSlug ? getTeacherBySlug(teacherSlug) : null;
  const teacherGrades = grades.filter(grade => grade.teacherId === teacher?.id);
  const teacherStudents = students.filter(student => student.teacherId === teacher?.id);

  useEffect(() => {
    if (!isAdminAuthenticated && (!isTeacherAuthenticated || teacher?.email !== currentTeacherEmail)) {
      navigate('/login', { replace: true });
    }
  }, [isAdminAuthenticated, isTeacherAuthenticated, currentTeacherEmail, teacher, navigate]);

  if (!teacher) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-900">المعلم غير موجود</h2>
          <Link to="/admin" className="mt-4 text-blue-600 hover:text-blue-500">
            العودة إلى لوحة التحكم
          </Link>
        </div>
      </div>
    );
  }

  const currentYear = new Date().getFullYear();
  const months = [
    'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
    'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'
  ];

  const getPaymentStatus = (studentId: string, month: number) => {
    return getPaymentStatusFromLocalStorage(studentId, month, currentYear);
  };

  const togglePayment = (studentId: string, month: number) => {
    const currentStatus = getPaymentStatus(studentId, month);
    setPaymentStatusInLocalStorage(studentId, month, currentYear, !currentStatus);
    setRefreshKey(prev => prev + 1); // Force re-render
  };

  // Removed savePaymentData as changes are saved directly to local storage

  const filteredStudents = useMemo(() => {
    let filtered = teacherStudents;

    if (filterGrade !== 'جميع الفصول') {
      const selectedGrade = teacherGrades.find(g => g.name === filterGrade);
      if (selectedGrade) {
        filtered = filtered.filter(student => student.gradeId === selectedGrade.id);
      }
    }

    if (searchTerm) {
      filtered = filtered.filter(student =>
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.studentId.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return filtered;
  }, [searchTerm, filterGrade, teacherStudents, teacherGrades, refreshKey]); // Add refreshKey to dependencies

  const getPaidMonthsCount = (studentId: string) => {
    let count = 0;
    for (let month = 1; month <= 12; month++) {
      if (getPaymentStatus(studentId, month)) {
        count++;
      }
    }
    return count;
  };

  return (
    <div className="min-h-screen bg-gray-100 font-sans text-right" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">إدارة المدفوعات الشهرية</h1>
            <p className="text-sm text-gray-600">انقر على الدوائر لتغيير حالة الدفع</p>
          </div>
          {/* Removed Save button as changes are saved directly to local storage */}
        </div>

        {/* Filters and Search */}
        <div className="bg-white shadow rounded-2xl p-6 mb-8 flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0 sm:space-x-4">
          <div className="flex items-center space-x-4 w-full sm:w-auto">
            <select
              value={filterGrade}
              onChange={(e) => setFilterGrade(e.target.value)}
              className="border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 w-full sm:w-48"
            >
              <option value="جميع الصفوف">جميع الصفوف</option>
              {teacherGrades.map(grade => (
                <option key={grade.id} value={grade.name}>{grade.name}</option>
              ))}
            </select>
          </div>
          <div className="relative w-full sm:w-64">
            <input
              type="text"
              placeholder="البحث عن طالب..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-4 py-2 border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          </div>
        </div>

        {/* Months Header */}
        <div className="bg-white shadow rounded-2xl p-6 mb-6">
          <div className="grid grid-cols-12 gap-4 text-center">
            {months.map((month, index) => (
              <div key={month} className="text-sm font-medium text-gray-700">
                {months[index]}
              </div>
            ))}
          </div>
        </div>

        {/* Students List */}
        <div className="space-y-4">
          {filteredStudents.map((student) => {
            const studentGrade = teacherGrades.find(g => g.id === student.gradeId);
            const paidMonths = getPaidMonthsCount(student.id);

            return (
              <div key={student.id} className="bg-white shadow rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                      <User className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{student.name}</h3>
                      <p className="text-sm text-gray-500">
                        {studentGrade?.name} • {student.studentId} • {paidMonths}/12 مدفوع
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-12 gap-4">
                  {months.map((month, index) => {
                    const monthNumber = index + 1;
                    const isPaid = getPaymentStatus(student.id, monthNumber);
                    // hasChange is no longer needed as changes are immediate

                    return (
                      <div key={month} className="flex flex-col items-center space-y-2">
                        <button
                          onClick={() => togglePayment(student.id, monthNumber)}
                          className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200 ${
                            isPaid
                              ? 'bg-green-500 hover:bg-green-600 text-white'
                              : 'bg-red-500 hover:bg-red-600 text-white'
                          }`}
                        >
                          {isPaid ? (
                            <CheckCircle className="h-6 w-6" />
                          ) : (
                            <XCircle className="h-6 w-6" />
                          )}
                        </button>
                        <span className="text-xs text-gray-500">{months[index]}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {filteredStudents.length === 0 && (
          <div className="bg-white shadow rounded-2xl p-12 text-center">
            <User className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">لا يوجد طلاب</h3>
            <p className="mt-1 text-sm text-gray-500">
              لم يتم العثور على طلاب مطابقين للبحث.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TeacherMonthly;
