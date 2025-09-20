import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom'; // Import useParams
import { useData } from '../context/DataContext';
import { Plus, Users, GraduationCap, Trash2, Pencil, Eye, Phone } from 'lucide-react';
import StudentDetailsModal from '../components/StudentDetailsModal';
import AddStudentModal from '../components/AddStudentModal'; // Import AddStudentModal
import { Student } from '../types';
import { generateStudentId } from '../utils/generators'; // Moved import to top

const Students: React.FC = () => {
  const { teacherSlug } = useParams<{ teacherSlug?: string }>(); // Get teacherSlug from URL
  const { students: allStudents, grades: allGrades, teachers, deleteStudent, addStudent } = useData(); // Import addStudent

  const currentTeacher = teacherSlug ? teachers.find(t => t.slug === teacherSlug) : undefined;

  // Filter students and grades based on current teacher if teacherSlug is present
  const students = currentTeacher ? allStudents.filter(s => s.teacherId === currentTeacher.id) : allStudents;
  const grades = currentTeacher ? allGrades.filter(g => g.teacherId === currentTeacher.id) : allGrades;

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGrade, setSelectedGrade] = useState('all');
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false); // Renamed for clarity
  const [isAddModalOpen, setIsAddModalOpen] = useState(false); // State for AddStudentModal
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [isDeleteConfirmModalOpen, setIsDeleteConfirmModalOpen] = useState(false);
  const [studentToDeleteId, setStudentToDeleteId] = useState<string | null>(null);

  // Reset selectedGrade when students or grades change (e.g., when navigating between teachers)
  useEffect(() => {
    setSelectedGrade('all');
  }, [teacherSlug]);

  // Calculate student counts per grade
  const studentCountsByGrade = grades.reduce((acc, grade) => {
    acc[grade.name] = students.filter(student => student.gradeId === grade.id).length;
    return acc;
  }, {} as Record<string, number>);

  const totalStudents = students.length;

  // Filtered students based on search term and selected grade
  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          student.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          student.parentNumber.includes(searchTerm); // Search by parentNumber
    
    const matchesGrade = selectedGrade === 'all' || 
                         (grades.find(grade => grade.id === student.gradeId)?.name === selectedGrade);
    
    return matchesSearch && matchesGrade;
  });

  const handleAddStudent = (studentData: {
    studentId: string; // Added studentId
    name: string;
    studentNumber: string;
    parentNumber: string;
    gradeId: string;
    location: string;
    teacherId: string;
  }) => {
    const newStudent: Student = {
      id: studentData.studentId, // Use the generated studentId for id
      studentId: studentData.studentId,
      name: studentData.name,
      studentNumber: studentData.studentNumber,
      phoneNumber: '', // Student's own phone number, can be added later if needed
      parentNumber: studentData.parentNumber,
      location: studentData.location,
      gradeId: studentData.gradeId,
      teacherId: studentData.teacherId,
      registrationDate: new Date(), // Set current date
      attendance: [],
      examScores: [],
    };
    addStudent(newStudent); // Call addStudent from DataContext
  };

  const getGradeName = (gradeId: string) => {
    return grades.find(grade => grade.id === gradeId)?.name || 'N/A';
  };

  const handleDeleteStudent = (studentId: string) => {
    setStudentToDeleteId(studentId);
    setIsDeleteConfirmModalOpen(true);
  };

  const confirmDeleteStudent = () => {
    if (studentToDeleteId) {
      deleteStudent(studentToDeleteId);
      setIsDeleteConfirmModalOpen(false);
      setStudentToDeleteId(null);
    }
  };

  const cancelDeleteStudent = () => {
    setIsDeleteConfirmModalOpen(false);
    setStudentToDeleteId(null);
  };

  const handleEditStudent = (student: Student) => {
    alert(`Edit student: ${student.name} (ID: ${student.id})`);
    // Navigate to an edit page or open an edit modal
  };

  const openStudentDetailsModal = (student: Student) => {
    setSelectedStudent(student);
    setIsDetailsModalOpen(true);
  };

  const closeStudentDetailsModal = () => {
    setIsDetailsModalOpen(false);
    setSelectedStudent(null);
  };

  const openAddStudentModal = () => {
    setIsAddModalOpen(true);
  };

  const closeAddStudentModal = () => {
    setIsAddModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 text-right">إدارة الطلاب</h1>
            <p className="mt-1 text-sm text-gray-600 text-right">
              معلومات وبيانات الطلاب المسجلين
            </p>
          </div>
          <button
            onClick={openAddStudentModal} // Open modal instead of navigating
            className="inline-flex items-center px-4 py-2 bg-blue-600 border border-transparent rounded-md font-medium text-white hover:bg-blue-700 transition-colors"
            dir="rtl" // Right-to-left for Arabic text
          >
            <Plus className="h-5 w-5 ml-2" /> {/* Icon on the left for RTL */}
            إضافة طالب جديد
          </button>
        </div>

        {/* Grade Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {grades.map(grade => (
            <div
              key={grade.id}
              className={`bg-white overflow-hidden shadow rounded-lg p-5 cursor-pointer transition-all duration-200 ease-in-out ${
                selectedGrade === grade.name ? 'ring-2 ring-indigo-500 ring-offset-2' : 'hover:shadow-lg'
              }`}
              onClick={() => setSelectedGrade(grade.name)}
            >
              <div className="flex items-center justify-between"> {/* Align content to the left, icon to the right */}
                <div>
                  <dt className="text-sm font-medium text-gray-500 truncate">{grade.name}</dt>
                  <dd className="text-lg font-medium text-gray-900">{studentCountsByGrade[grade.name] || 0} طلاب</dd>
                </div>
                <div className="flex-shrink-0">
                  <GraduationCap className="h-8 w-8 text-indigo-400" />
                </div>
              </div>
            </div>
          ))}
          <div
            className={`bg-white overflow-hidden shadow rounded-lg p-5 cursor-pointer transition-all duration-200 ease-in-out ${
              selectedGrade === 'all' ? 'ring-2 ring-indigo-500 ring-offset-2' : 'hover:shadow-lg'
            }`}
            onClick={() => setSelectedGrade('all')}
          >
            <div className="flex items-center justify-between">
              <div>
                <dt className="text-sm font-medium text-gray-500 truncate">إجمالي الطلاب</dt>
                <dd className="text-lg font-medium text-gray-900">{totalStudents} طلاب</dd>
              </div>
              <div className="flex-shrink-0">
                <Users className="h-8 w-8 text-gray-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Filter and Search */}
        <div className="bg-white shadow rounded-lg p-6 mb-8 flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0 sm:space-x-4 rtl:space-x-reverse">
          <div className="flex items-center space-x-4 rtl:space-x-reverse w-full sm:w-auto">
            <select
              value={selectedGrade}
              onChange={(e) => setSelectedGrade(e.target.value)}
              className="block w-full sm:w-auto pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md custom-textarea"
              dir="rtl"
            >
              <option value="all">جميع الفصول</option>
              {grades.map(grade => (
                <option key={grade.id} value={grade.name}>{grade.name}</option>
              ))}
            </select>
            <Users className="h-5 w-5 text-gray-400" />
          </div>
          <div className="relative flex-grow w-full sm:w-auto">
            <input
              type="text"
              placeholder="البحث عن طالب..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm custom-textarea text-right"
              dir="rtl"
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Student Table */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-4 py-5 sm:p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4 text-right">
              الطلاب ({filteredStudents.length})
            </h2>

            {filteredStudents.length === 0 ? (
              <div className="text-center py-12" dir="rtl">
                <Users className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">لا يوجد طلاب</h3>
                <p className="mt-1 text-sm text-gray-500">
                  لا يوجد طلاب مسجلين أو لا يوجد طلاب في الصف المحدد أو لا يوجد تطابق مع البحث.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200" dir="rtl">
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
                        البيانات
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
                    {filteredStudents.map((student) => (
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
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                          <div className="text-right">
                            <span>{student.parentNumber}</span> {/* Display parent number */}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end space-x-2 rtl:space-x-reverse">
                            <button
                              className="text-red-600 hover:text-red-900"
                              title="Delete Student"
                              onClick={() => handleDeleteStudent(student.id)}
                            >
                              <Trash2 className="h-5 w-5" />
                            </button>
                            <button
                              className="text-blue-600 hover:text-blue-900"
                              title="View Details"
                              onClick={() => openStudentDetailsModal(student)}
                            >
                              <Eye className="h-5 w-5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      {selectedStudent && isDetailsModalOpen && (
        <StudentDetailsModal student={selectedStudent} onClose={closeStudentDetailsModal} />
      )}

      {isAddModalOpen && (
        <AddStudentModal
          grades={grades}
          onClose={closeAddStudentModal}
          onAddStudent={handleAddStudent}
          teacherId={currentTeacher?.id}
        />
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteConfirmModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-sm mx-auto text-center">
            <h3 className="text-lg font-medium text-gray-900 mb-4">تأكيد الحذف</h3>
            <p className="text-sm text-gray-500 mb-6">
              هل أنت متأكد أنك تريد حذف هذا الطالب؟ لا يمكن التراجع عن هذا الإجراء.
            </p>
            <div className="flex justify-center space-x-4 rtl:space-x-reverse">
              <button
                onClick={confirmDeleteStudent}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
              >
                حذف
              </button>
              <button
                onClick={cancelDeleteStudent}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 transition-colors"
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Students;
