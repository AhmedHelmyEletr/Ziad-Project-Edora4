import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { User, Phone, MapPin, Calendar, Award, BarChart3, AlertCircle, DollarSign, FileText, MessageSquare, Send } from 'lucide-react';

const getLocalStorageKey = (studentId: string, month: number, year: number) =>
  `payment-${studentId}-${month}-${year}`;

const getPaymentStatusFromLocalStorage = (studentId: string, month: number, year: number): boolean => {
  const key = getLocalStorageKey(studentId, month, year);
  const status = localStorage.getItem(key);
  return status === 'true';
};

const Parents: React.FC = () => {
  const { isParentAuthenticated, currentStudentId, loginParent } = useAuth();
  const { getStudentByStudentId, getTeacherById, exams, memos, grades } = useData();
  const [studentId, setStudentId] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const student = currentStudentId ? getStudentByStudentId(currentStudentId) : null;
  const teacher = student ? getTeacherById(student.teacherId) : null;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const success = await loginParent(studentId);
      if (!success) {
        setError('Invalid student ID. Please check and try again.');
      }
    } catch (err) {
      setError('An error occurred during login');
    } finally {
      setLoading(false);
    }
  };

  if (!isParentAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="flex justify-center">
            <User className="h-12 w-12 text-blue-600" />
          </div>
          <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
            بوابة ولي الأمر
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            أدخل الرقم التعريفي للطالب لعرض معلوماته
          </p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            {error && (
              <div className="mb-4 bg-red-50 border border-red-200 rounded-md p-4">
                <div className="flex">
                  <AlertCircle className="h-5 w-5 text-red-400" />
                  <div className="ml-3">
                    <p className="text-sm text-red-800">{error}</p>
                  </div>
                </div>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label htmlFor="studentId" className="block text-sm font-medium text-gray-700">
                  الرقم التعريفي للطالب
                </label>
                <div className="mt-1">
                  <input
                    id="studentId"
                    name="studentId"
                    type="text"
                    required
                    value={studentId}
                    onChange={(e) => setStudentId(e.target.value)}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="أدخل الرقم التعريفي للطالب (8 أرقام)"
                    maxLength={11}
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={loading || studentId.length !== 11}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {loading ? 'جاري تسجيل الدخول...' : 'الدخول إلى البوابة'}
                </button>
              </div>
            </form>

            <div className="mt-6">
              <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                <div className="text-sm text-blue-800">
                  <p className="font-medium">كيف تجد الرقم التعريفي للطالب:</p>
                  <ul className="mt-2 list-disc list-inside space-y-1">
                    <li>تحقق من وثائق طفلك المدرسية</li>
                    <li>اتصل بمعلم طفلك</li>
                    <li>قم بزيارة إدارة المدرسة</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!student || !teacher) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-900">الطالب غير موجود</h2>
          <p className="mt-2 text-gray-600">
            تعذر العثور على معلومات الطالب. يرجى الاتصال بإدارة المدرسة.
          </p>
        </div>
      </div>
    );
  }

  const presentDays = student.attendance.filter(record => record.status === 'present').length;
  const absentDays = student.attendance.filter(record => record.status === 'absent').length;
  const totalDays = presentDays + absentDays;
  const attendanceRate = totalDays > 0 ? Math.round((presentDays / totalDays) * 100) : 0;

  const absenceMessage = encodeURIComponent(
    `Hello ${teacher.name}, I am writing to inform you that my child, ${student.name} (ID: ${student.studentId}), will be absent. Thank you.`
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Promotional Banner */}
        <div className="relative bg-gradient-to-r from-teal-500 to-cyan-600 rounded-2xl p-8 mb-8 overflow-hidden shadow-lg">
          {/* ========== CORRECTED CODE BLOCK STARTS HERE ========== */}
          <div className="relative z-10 max-w-lg text-right">
            <h2 className="text-3xl font-bold text-white mb-3">
              قابل معلم طفلك: {teacher.name}
            </h2>
            <p className="text-teal-100 text-lg mb-2">
              المادة: {teacher.subject}
            </p>
            <p className="text-teal-100 text-lg mb-2">
              للتواصل: {teacher.phoneNumber}
            </p>
            <p className="text-teal-100 text-lg mb-6">
              الموقع: {teacher.government}
            </p>
          </div>
          {/* ========== CORRECTED CODE BLOCK ENDS HERE ========== */}
          <div className="absolute -right-20 -top-10 h-64 w-64 rounded-full bg-teal-400 opacity-20"></div>
          <div className="absolute -right-40 top-20 h-80 w-80 rounded-full bg-cyan-400 opacity-15"></div>
          <img
            src={teacher.imageUrl || 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg'}
            alt={teacher.name}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 h-64 w-64 object-cover rounded-full border-4 border-white shadow-xl"
            style={{ right: '100px', top: '50%', transform: 'translateY(-50%)' }}
          />
        </div>

        {/* Header */}
        <div className="mb-8">
          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex items-center space-x-4">
              <div className="h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center">
                <User className="h-8 w-8 text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{student.name}</h1>
                <p className="text-sm text-gray-600">الرقم التعريفي للطالب: {student.studentId}</p>
                <p className="text-sm text-gray-600">رقم الطالب: #{student.studentNumber}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Student Info */}
          <div className="lg:col-span-1 space-y-6">
            {/* Personal Information */}
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">المعلومات الشخصية</h2>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <User className="h-5 w-5 text-gray-400" />
                  <span className="text-sm text-gray-700">{student.name}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="h-5 w-5 text-gray-400" />
                  <span className="text-sm text-gray-700">{student.parentNumber}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <MapPin className="h-5 w-5 text-gray-400" />
                  <span className="text-sm text-gray-700">{student.location}</span>
                </div>
              </div>
            </div>

            {/* Teacher Information */}
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">المعلم</h2>
              <div className="flex items-center space-x-3">
                <img
                  src={teacher.imageUrl || 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg'}
                  alt={teacher.name}
                  className="h-12 w-12 rounded-full"
                />
                <div>
                  <p className="text-sm font-medium text-gray-900">{teacher.name}</p>
                  <p className="text-sm text-gray-500">{teacher.subject}</p>
                  <p className="text-sm text-gray-500">{teacher.phoneNumber}</p>
                </div>
              </div>
            </div>

            {/* Attendance Summary */}
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">ملخص الحضور</h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">نسبة الحضور</span>
                  <span className={`text-sm font-medium ${attendanceRate >= 80 ? 'text-green-600' : attendanceRate >= 60 ? 'text-yellow-600' : 'text-red-600'}`}>
                    {attendanceRate}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${attendanceRate >= 80 ? 'bg-green-500' : attendanceRate >= 60 ? 'bg-yellow-500' : 'bg-red-500'}`}
                    style={{ width: `${attendanceRate}%` }}
                  ></div>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">حاضر: </span>
                    <span className="font-medium text-green-600">{presentDays}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">غائب: </span>
                    <span className="font-medium text-red-600">{absentDays}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Academic Performance */}
          <div className="lg:col-span-2 space-y-6">
            {/* Exam Scores */}
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">درجات الامتحانات</h2>
              {student.examScores.length === 0 ? (
                <div className="text-center py-8">
                  <BarChart3 className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">لا توجد درجات امتحانات بعد</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    ستظهر درجات الامتحانات هنا عندما تكون متاحة.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {student.examScores.map((examScore) => {
                    const exam = exams.find(e => e.id === examScore.examName);
                    const examName = exam ? exam.name : 'امتحان غير معروف';

                    return (
                      <div key={examScore.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <Award className="h-5 w-5 text-blue-500" />
                          <div>
                            <p className="text-sm font-medium text-gray-900">{examName}</p>
                            <p className="text-xs text-gray-500">{examScore.date}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className={`text-lg font-bold ${
                            examScore.score >= 80 ? 'text-green-600' : 
                            examScore.score >= 60 ? 'text-yellow-600' : 'text-red-600'
                          }`}>
                            {examScore.score}%
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Recent Attendance */}
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">الحاضرين مؤخراً</h2>
              {student.attendance.length === 0 ? (
                <div className="text-center py-8">
                  <Calendar className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">لا توجد سجلات حضور بعد</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    ستظهر سجلات الحضور هنا عندما تكون متاحة.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {student.attendance
                    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                    .slice(0, 10)
                    .map((record) => (
                      <div key={record.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          <span className="text-sm text-gray-900">
                            {new Date(record.date).toLocaleDateString()}
                          </span>
                        </div>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          record.status === 'present'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {record.status === 'present' ? 'حاضر' : 'غائب'}
                        </span>
                      </div>
                    ))}
                </div>
              )}
            </div>

            {/* Monthly Payment Status */}
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">حالة الدفع الشهرية</h2>
              {(() => {
                const currentYear = new Date().getFullYear();
                const months = [
                  'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
                  'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'
                ];

                const paidMonthsData = months.filter((_, index) =>
                  getPaymentStatusFromLocalStorage(student.id, index + 1, currentYear)
                );

                return (
                  <div className="space-y-4">
                    {paidMonthsData.length === 0 ? (
                      <div className="text-center py-4">
                        <DollarSign className="mx-auto h-12 w-12 text-gray-400" />
                        <h3 className="mt-2 text-sm font-medium text-gray-900">لا توجد أشهر مدفوعة بعد</h3>
                        <p className="mt-1 text-sm text-gray-500">
                          بمجرد إجراء الدفعات، ستظهر هنا.
                        </p>
                      </div>
                    ) : (
                      <>
                        <div className="text-sm text-gray-600">
                          الأشهر المدفوعة: {paidMonthsData.length}/12
                        </div>
                        <div className="grid grid-cols-6 gap-2">
                          {paidMonthsData.map((month) => (
                            <div key={month} className="text-center">
                              <div className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-xs font-medium bg-green-100 text-green-800`}>
                                ✓
                              </div>
                              <div className="text-xs text-gray-500 mt-1">{month}</div>
                            </div>
                          ))}
                        </div>
                        <div className="text-xs text-gray-500 text-center">
                          علامات الصح الخضراء تشير إلى الأشهر المدفوعة.
                        </div>
                      </>
                    )}
                  </div>
                );
              })()}
            </div>

            {/* All Available Memos */}
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">المذكرات المتاحة</h2>
              {(() => {
                const studentMemos = memos.filter(memo => memo.gradeId === student.gradeId);

                if (studentMemos.length === 0) {
                  return (
                    <div className="text-center py-8">
                      <FileText className="mx-auto h-12 w-12 text-gray-400" />
                      <h3 className="mt-2 text-sm font-medium text-gray-900">لا توجد مذكرات متاحة</h3>
                      <p className="mt-1 text-sm text-gray-500">
                        لم يتم إنشاء أي مذكرات لصف طفلك بعد.
                      </p>
                    </div>
                  );
                }

                return (
                  <div className="space-y-4">
                    {studentMemos.map((memo) => {
                      const isPaid = memo.payments && memo.payments[student.id];
                      const grade = grades.find(g => g.id === memo.gradeId);
                      const gradeName = grade ? grade.name : 'صف غير معروف';

                      return (
                        <div key={memo.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3">
                              <div className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
                                isPaid
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-red-100 text-red-800'
                              }`}>
                                {isPaid ? '✓' : '✗'}
                              </div>
                              <div>
                                <h4 className="text-sm font-medium text-gray-900">{memo.title}</h4>
                                <p className="text-xs text-gray-500">{gradeName} • {memo.date}</p>
                                <p className="text-xs text-gray-600 mt-1">{memo.description}</p>
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              isPaid
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {isPaid ? 'مدفوع' : 'غير مدفوع'}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                );
              })()}
            </div>
          </div>
        </div>

        {/* Quick Actions Section */}
        <div className="mt-12">
            <h2 className="text-xl font-bold text-gray-800 mb-4 text-center">إجراءات سريعة</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

            {/* Contact via WhatsApp */}
            <a
                href={`https://wa.me/${teacher.phoneNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className="block p-6 bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300"
            >
                <div className="flex items-center space-x-4">
                <div className="bg-green-100 p-3 rounded-full">
                    <MessageSquare className="h-6 w-6 text-green-600" />
                </div>
                <div>
                    <h3 className="text-lg font-semibold text-gray-900">التواصل عبر واتساب</h3>
                    <p className="text-sm text-gray-500">الدردشة مع {teacher.name}</p>
                </div>
                </div>
            </a>

            {/* Call Teacher */}
            <a
                href={`tel:${teacher.phoneNumber}`}
                className="block p-6 bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300"
            >
                <div className="flex items-center space-x-4">
                <div className="bg-blue-100 p-3 rounded-full">
                    <Phone className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                    <h3 className="text-lg font-semibold text-gray-900">الاتصال بالمعلم</h3>
                    <p className="text-sm text-gray-500">الاتصال المباشر بـ {teacher.name}</p>
                </div>
                </div>
            </a>

            {/* Send Absent Request */}
            <a
                href={`https://wa.me/${teacher.phoneNumber}?text=${absenceMessage}`}
                target="_blank"
                rel="noopener noreferrer"
                className="block p-6 bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300"
            >
                <div className="flex items-center space-x-4">
                <div className="bg-yellow-100 p-3 rounded-full">
                    <Send className="h-6 w-6 text-yellow-600" />
                </div>
                <div>
                    <h3 className="text-lg font-semibold text-gray-900">إرسال طلب غياب</h3>
                    <p className="text-sm text-gray-500">إبلاغ المعلم بالغياب</p>
                </div>
                </div>
            </a>

            </div>
        </div>
      </div>
    </div>
  );
};

export default Parents;