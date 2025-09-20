import React, { useState, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { ArrowLeft, Check, X, Calendar, Users, GraduationCap, Search, FileDown, Clock, Eye } from 'lucide-react';
import StudentDetailsModal from '../components/StudentDetailsModal';
import { Student } from '../types';

const TeacherStatus: React.FC = () => {
  const { teacherSlug } = useParams<{ teacherSlug: string }>();
  const { getTeacherBySlug, students, grades, updateAttendance } = useData();
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedGradeId, setSelectedGradeId] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  const { isTeacherAuthenticated, currentTeacherEmail, isAdminAuthenticated } = useAuth();
  const navigate = useNavigate();

  const teacher = teacherSlug ? getTeacherBySlug(teacherSlug) : null;
  const teacherGrades = grades.filter(grade => grade.teacherId === teacher?.id);

  React.useEffect(() => {
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

  const filteredStudents = useMemo(() => {
    let currentStudents = students.filter(student => student.teacherId === teacher.id);

    if (selectedGradeId) {
      currentStudents = currentStudents.filter(student => student.gradeId === selectedGradeId);
    }

    if (searchQuery) {
      currentStudents = currentStudents.filter(student =>
        student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.studentId.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return currentStudents;
  }, [students, teacher.id, selectedGradeId, searchQuery]);

  const handleAttendance = (studentId: string, status: 'present' | 'absent' | 'late') => {
    updateAttendance(studentId, selectedDate, status);
  };

  const getStudentAttendance = (studentId: string) => {
    const student = students.find(s => s.id === studentId); // Use all students to find attendance
    if (!student) return null;
    
    return student.attendance.find(record => record.date === selectedDate);
  };

  const getGradeName = (gradeId: string) => {
    return grades.find(grade => grade.id === gradeId)?.name || 'N/A';
  };

  const openStudentDetailsModal = (student: Student) => {
    setSelectedStudent(student);
    setIsModalOpen(true);
  };

  const closeStudentDetailsModal = () => {
    setIsModalOpen(false);
    setSelectedStudent(null);
  };

  const handleExportReport = () => {
    // Placeholder for export report functionality
    alert('Export Report functionality coming soon!');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <Link
              to={`/teacher/${teacher.slug}`}
              className="inline-flex items-center text-blue-600 hover:text-blue-500"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              العودة إلى الملف الشخصي
            </Link>
            <button
              onClick={handleExportReport}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <FileDown className="h-5 w-5 mr-2" />
              تصدير التقرير
            </button>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">حالة الحضور</h1>
              <p className="mt-1 text-sm text-gray-600">
                {teacher.name} - {teacher.subject}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Calendar className="h-5 w-5 text-gray-400" />
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              {/* Grade Selector */}
              {teacherGrades.length > 0 && (
                <div className="flex items-center space-x-2">
                  <GraduationCap className="h-5 w-5 text-gray-400" />
                  <select
                    value={selectedGradeId}
                    onChange={(e) => setSelectedGradeId(e.target.value)}
                    className="border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">جميع الصفوف</option>
                    {teacherGrades.map(grade => (
                      <option key={grade.id} value={grade.id}>{grade.name}</option>
                    ))}
                  </select>
                </div>
              )}
              {/* Search Input */}
              <div className="relative flex items-center">
                <Search className="h-5 w-5 text-gray-400 absolute left-3" />
                <input
                  type="text"
                  placeholder="البحث عن طالب..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Students List Table */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-4 py-5 sm:p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              الطلاب ({filteredStudents.length})
            </h2>
            
            {filteredStudents.length === 0 ? (
              <div className="text-center py-12">
                <Users className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">لا يوجد طلاب</h3>
                <p className="mt-1 text-sm text-gray-500">
                  هذا المعلم ليس لديه أي طلاب بعد أو لا يوجد طلاب في الصف المحدد أو مطابقين للبحث.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        الطالب
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        الكود
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        الصف
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        الحالة
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        الإجراءات
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredStudents.map((student) => {
                      const attendance = getStudentAttendance(student.id);
                      const statusText = attendance?.status === 'present' ? 'حاضر' : attendance?.status === 'absent' ? 'غائب' : attendance?.status === 'late' ? 'متأخر' : 'لم يتم التحديد';
                      const statusColor = attendance?.status === 'present' ? 'bg-green-100 text-green-800' : attendance?.status === 'absent' ? 'bg-red-100 text-red-800' : attendance?.status === 'late' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800';

                      return (
                        <tr key={student.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 text-right">
                            {student.name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                            {student.studentId}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                            {getGradeName(student.gradeId)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusColor}`}>
                              {statusText}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex justify-end space-x-2">
                              <button
                                className="text-gray-400 hover:text-gray-600"
                                title="عرض التفاصيل"
                                onClick={() => openStudentDetailsModal(student)}
                              >
                                <Eye className="h-5 w-5" />
                              </button>
                              <button
                                onClick={() => handleAttendance(student.id, 'present')}
                                className={`p-2 rounded-full transition-colors ${
                                  attendance?.status === 'present'
                                    ? 'bg-green-500 text-white'
                                    : 'text-gray-400 hover:bg-green-100 hover:text-green-600'
                                }`}
                                title="تحديد حاضر"
                              >
                                <Check className="h-5 w-5" />
                              </button>
                              <button
                                onClick={() => handleAttendance(student.id, 'absent')}
                                className={`p-2 rounded-full transition-colors ${
                                  attendance?.status === 'absent'
                                    ? 'bg-red-500 text-white'
                                    : 'text-gray-400 hover:bg-red-100 hover:text-red-600'
                                }`}
                                title="تحديد غائب"
                              >
                                <X className="h-5 w-5" />
                              </button>
                              <button
                                onClick={() => handleAttendance(student.id, 'late')}
                                className={`p-2 rounded-full transition-colors ${
                                  attendance?.status === 'late'
                                    ? 'bg-yellow-500 text-white'
                                    : 'text-gray-400 hover:bg-yellow-100 hover:text-yellow-600'
                                }`}
                                title="تحديد متأخر"
                              >
                                <Clock className="h-5 w-5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Summary */}
        {filteredStudents.length > 0 && (
          <div className="mt-8 bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              ملخص الحضور لتاريخ {selectedDate}
            </h3>
            <div className="grid grid-cols-4 gap-4"> {/* Changed to 4 columns for 'Late' */}
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {filteredStudents.filter(student => 
                    getStudentAttendance(student.id)?.status === 'present'
                  ).length}
                </div>
                <div className="text-sm text-gray-500">حاضر</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">
                  {filteredStudents.filter(student => 
                    getStudentAttendance(student.id)?.status === 'absent'
                  ).length}
                </div>
                <div className="text-sm text-gray-500">غائب</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">
                  {filteredStudents.filter(student => 
                    getStudentAttendance(student.id)?.status === 'late'
                  ).length}
                </div>
                <div className="text-sm text-gray-500">متأخر</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-600">
                  {filteredStudents.filter(student => 
                    !getStudentAttendance(student.id)
                  ).length}
                </div>
                <div className="text-sm text-gray-500">لم يتم التحديد</div>
              </div>
            </div>
          </div>
        )}
      </div>

      {selectedStudent && isModalOpen && (
        <StudentDetailsModal student={selectedStudent} onClose={closeStudentDetailsModal} />
      )}
    </div>
  );
};

export default TeacherStatus;
