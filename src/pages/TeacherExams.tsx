import React, { useState, useMemo, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { ArrowLeft, Plus, FileText, Users, Save, GraduationCap, X } from 'lucide-react';

const TeacherExams: React.FC = () => {
  const { teacherSlug } = useParams<{ teacherSlug: string }>();
  const { getTeacherBySlug, students, grades, exams, addExam, updateExamScore } = useData();
  const [examName, setExamName] = useState('');
  const [groupName, setGroupName] = useState(''); // New state for group name
  const [fullMark, setFullMark] = useState(''); // New state for full mark
  const [scores, setScores] = useState<{ [studentId: string]: string }>({});
  const [showAddExam, setShowAddExam] = useState(false);
  const [currentExamId, setCurrentExamId] = useState<string>('');
  const [selectedGradeId, setSelectedGradeId] = useState('');

  const { isTeacherAuthenticated, currentTeacherEmail, isAdminAuthenticated } = useAuth();
  const navigate = useNavigate();

  const teacher = teacherSlug ? getTeacherBySlug(teacherSlug) : null;
  const teacherGrades = grades.filter(grade => grade.teacherId === teacher?.id);
  const teacherExams = exams.filter(exam => exam.teacherId === teacher?.id);

  useEffect(() => {
    if (!isAdminAuthenticated && (!isTeacherAuthenticated || teacher?.email !== currentTeacherEmail)) {
      navigate('/login', { replace: true });
    }
  }, [isAdminAuthenticated, isTeacherAuthenticated, currentTeacherEmail, teacher, navigate]);

  if (!teacher) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-900">Teacher not found</h2>
          <Link to="/admin" className="mt-4 text-blue-600 hover:text-blue-500">
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const filteredStudents = useMemo(() => {
    if (!selectedGradeId) {
      return students.filter(student => student.teacherId === teacher.id);
    }
    return students.filter(student => student.teacherId === teacher.id && student.gradeId === selectedGradeId);
  }, [students, teacher.id, selectedGradeId]);

  const availableExams = useMemo(() => {
    if (!selectedGradeId) {
      return teacherExams;
    }
    return teacherExams.filter(exam => exam.gradeId === selectedGradeId);
  }, [teacherExams, selectedGradeId]);

  const handleAddExam = () => {
    if (!examName.trim() || !selectedGradeId || !groupName.trim() || !fullMark.trim()) {
      alert('Please fill in all fields: Exam Name, Group Name, Full Mark, and select a Grade.');
      return;
    }

    const parsedFullMark = parseInt(fullMark, 10);
    if (isNaN(parsedFullMark) || parsedFullMark <= 0 || parsedFullMark > 999) {
      alert('Full Mark must be a number between 1 and 999.');
      return;
    }

    addExam({
      name: examName,
      teacherId: teacher.id,
      gradeId: selectedGradeId,
      groupName: groupName, // Add groupName
      fullMark: parsedFullMark, // Add fullMark
      date: new Date().toISOString().split('T')[0],
      scores: {},
    });
    setExamName('');
    setGroupName('');
    setFullMark('');
    setShowAddExam(false);
  };

  const handleScoreChange = (studentId: string, score: string) => {
    const currentExam = availableExams.find(e => e.id === currentExamId);
    const maxScore = currentExam?.fullMark || 0; // Get fullMark for the current exam

    if (score === '') {
      setScores(prev => ({ ...prev, [studentId]: score }));
      return;
    }

    if (/^\d+$/.test(score)) {
      const parsedScore = parseInt(score, 10);
      if (parsedScore >= 0 && parsedScore <= maxScore) {
        setScores(prev => ({ ...prev, [studentId]: score }));
      } else if (parsedScore > maxScore) {
        alert(`Score cannot exceed the full mark of ${maxScore}.`);
      }
    }
  };

  const handleSaveScores = () => {
    if (currentExamId) {
      Object.entries(scores).forEach(([studentId, score]) => {
        if (score !== '') {
          updateExamScore(studentId, currentExamId, parseInt(score, 10));
        }
      });
      alert('Scores saved successfully!');
    }
  };

  const getStudentScore = (studentId: string, examId: string) => {
    const student = filteredStudents.find(s => s.id === studentId);
    if (!student) return '';
    
    const examScore = student.examScores.find(score => score.examName === examId);
    return examScore ? examScore.score.toString() : '';
  };

  const loadExamScores = (examId: string) => {
    const examScores: { [studentId: string]: string } = {};
    filteredStudents.forEach(student => {
      examScores[student.id] = getStudentScore(student.id, examId);
    });
    setScores(examScores);
    setCurrentExamId(examId);
  };

  useEffect(() => {
    setCurrentExamId('');
    setScores({});
  }, [selectedGradeId]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <Link
              to={`/teacher/${teacher.slug}`}
              className="inline-flex items-center text-blue-600 hover:text-blue-500"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              العودة إلى الملف الشخصي
            </Link>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">درجات الامتحانات</h1>
              <p className="mt-1 text-sm text-gray-600">
                {teacher.name} - {teacher.subject}
              </p>
            </div>
            <button
              onClick={() => setShowAddExam(true)}
              className="inline-flex items-center px-4 py-2 bg-blue-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-blue-700 transition-colors"
            >
              <Plus className="h-4 w-4 mr-2" />
              إضافة امتحان جديد
            </button>
          </div>
        </div>

        {/* Add Exam Modal */}
        {showAddExam && (
          <div className="fixed inset-0 bg-gray-900 bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-xl w-full max-w-lg transform transition-all duration-300 ease-in-out animate-fade-in-up">
              <div className="flex justify-between items-center p-5 border-b border-gray-200">
                <h2 className="text-2xl font-bold text-gray-800 tracking-tight">إضافة امتحان جديد</h2>
                <button
                  onClick={() => {
                    setShowAddExam(false);
                    setExamName('');
                    setGroupName('');
                    setFullMark('');
                    setSelectedGradeId('');
                  }}
                  className="p-2 rounded-full text-gray-400 hover:bg-gray-200 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      اسم الامتحان
                    </label>
                    <input
                      type="text"
                      value={examName}
                      onChange={(e) => setExamName(e.target.value)}
                      className="block w-full py-2.5 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      placeholder="مثال: امتحان منتصف الفصل, اختبار 1"
                    />
                  </div>
                  {/* Group Name Input */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      اسم المجموعة
                    </label>
                    <input
                      type="text"
                      value={groupName}
                      onChange={(e) => setGroupName(e.target.value)}
                      className="block w-full py-2.5 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      placeholder="مثال: المجموعة أ, مجموعة العلوم"
                    />
                  </div>
                  {/* Full Mark Input */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      الدرجة النهائية (حد أقصى 3 أرقام)
                    </label>
                    <input
                      type="text"
                      value={fullMark}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (/^\d{0,3}$/.test(value) || value === '') { // Allow empty or up to 3 digits
                          setFullMark(value);
                        }
                      }}
                      className="block w-full py-2.5 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      placeholder="مثال: 100"
                      maxLength={3}
                    />
                  </div>
                  {/* Grade Selector for New Exam */}
                  {teacherGrades.length > 0 && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        اختر الصف
                      </label>
                      <select
                        value={selectedGradeId}
                        onChange={(e) => setSelectedGradeId(e.target.value)}
                        className="block w-full py-2.5 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="">اختر صفًا</option>
                        {teacherGrades.map(grade => (
                          <option key={grade.id} value={grade.id}>{grade.name}</option>
                        ))}
                      </select>
                    </div>
                  )}
                  <div className="flex justify-end space-x-3 pt-4">
                    <button
                      onClick={() => {
                        setShowAddExam(false);
                        setExamName('');
                        setGroupName(''); // Reset group name
                        setFullMark(''); // Reset full mark
                        setSelectedGradeId('');
                      }}
                      className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                    >
                      إلغاء
                    </button>
                    <button
                      onClick={handleAddExam}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                    >
                      إضافة امتحان
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Grade Selector for existing exams */}
        {teacherGrades.length > 0 && (
          <div className="bg-white shadow rounded-lg p-6 mb-8">
            <h2 className="text-lg font-medium text-gray-900 mb-4">تصفية حسب الصف</h2>
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
          </div>
        )}

        {/* Exam Selection */}
        {availableExams.length > 0 && (
          <div className="bg-white shadow rounded-lg p-6 mb-8">
            <h2 className="text-lg font-medium text-gray-900 mb-4">اختر الامتحان</h2>
            <div className="flex flex-wrap gap-2">
              {availableExams.map((exam) => (
                <button
                  key={exam.id}
                  onClick={() => loadExamScores(exam.id)}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    currentExamId === exam.id
                      ? 'bg-blue-100 text-blue-700 border-2 border-blue-300'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300'
                  }`}
                >
                  {exam.name} {exam.groupName ? `(${exam.groupName})` : ''}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Students Scores */}
        {currentExamId && (
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-medium text-gray-900">
                  {availableExams.find(e => e.id === currentExamId)?.name} - درجات الطلاب
                </h2>
                <button
                  onClick={handleSaveScores}
                  className="inline-flex items-center px-4 py-2 bg-green-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-green-700 transition-colors"
                >
                  <Save className="h-4 w-4 mr-2" />
                  حفظ الدرجات
                </button>
              </div>
              
              {filteredStudents.length === 0 ? (
                <div className="text-center py-12">
                  <Users className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">لا يوجد طلاب</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    هذا المعلم ليس لديه أي طلاب بعد أو لا يوجد طلاب في الصف المحدد.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredStudents.map((student) => (
                    <div key={student.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                            <span className="text-sm font-medium text-gray-700">
                              {student.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-gray-900">{student.name}</h4>
                          <p className="text-sm text-gray-500">الرقم التعريفي: {student.studentId}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <label className="text-sm text-gray-700">الدرجة:</label>
                        <input
                          type="text"
                          value={scores[student.id] || ''}
                          onChange={(e) => handleScoreChange(student.id, e.target.value)}
                          className="w-20 px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
                          placeholder={`0-${availableExams.find(e => e.id === currentExamId)?.fullMark || '?'}`}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* No Exams State */}
        {availableExams.length === 0 && !showAddExam && (
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-12 text-center">
              <FileText className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">لا توجد امتحانات بعد</h3>
              <p className="mt-1 text-sm text-gray-500">
                ابدأ بإضافة امتحان جديد لتتبع درجات الطلاب.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TeacherExams;
