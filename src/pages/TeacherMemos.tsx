import React, { useState, useMemo, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { ArrowLeft, Plus, FileText, Users, Save, GraduationCap, Trash2 } from 'lucide-react';

const TeacherMemos: React.FC = () => {
  const { teacherSlug } = useParams<{ teacherSlug: string }>();
  const { getTeacherBySlug, students, grades, memos, addMemo, updateMemoPayment, deleteMemo } = useData();
  const [showAddMemo, setShowAddMemo] = useState(false);
  const [selectedGradeId, setSelectedGradeId] = useState('');
  const [memoTitle, setMemoTitle] = useState('');
  const [memoDescription, setMemoDescription] = useState('');
  const [currentMemoId, setCurrentMemoId] = useState<string>('');
  const [paymentStatuses, setPaymentStatuses] = useState<{ [studentId: string]: boolean }>({});

  const { isTeacherAuthenticated, currentTeacherEmail, isAdminAuthenticated } = useAuth();
  const navigate = useNavigate();

  const teacher = teacherSlug ? getTeacherBySlug(teacherSlug) : null;
  const teacherGrades = grades.filter(grade => grade.teacherId === teacher?.id);
  const teacherMemos = memos.filter(memo => memo.teacherId === teacher?.id);

  useEffect(() => {
    if (!isAdminAuthenticated && (!isTeacherAuthenticated || teacher?.email !== currentTeacherEmail)) {
      navigate('/login', { replace: true });
    }
  }, [isAdminAuthenticated, isTeacherAuthenticated, currentTeacherEmail, teacher, navigate]);

  // Reset payment statuses when opening add memo modal
  useEffect(() => {
    if (showAddMemo) {
      setPaymentStatuses({});
    }
  }, [showAddMemo]);

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

  const filteredMemos = useMemo(() => {
    if (!selectedGradeId) {
      return teacherMemos;
    }
    return teacherMemos.filter(memo => memo.gradeId === selectedGradeId);
  }, [teacherMemos, selectedGradeId]);

  const handleAddMemo = () => {
    if (selectedGradeId && memoTitle.trim() && memoDescription.trim()) {
      // Create payments object with all students in the grade defaulting to false
      // Only use paymentStatuses if the user actually checked boxes during creation
      const initialPayments: { [studentId: string]: boolean } = {};
      filteredStudents.forEach(student => {
        // For new memos, always start with false - don't carry over from loaded memos
        initialPayments[student.id] = false;
      });

      addMemo({
        gradeId: selectedGradeId,
        title: memoTitle.trim(),
        description: memoDescription.trim(),
        date: new Date().toISOString().split('T')[0],
        teacherId: teacher.id,
        payments: initialPayments,
      });
      setSelectedGradeId('');
      setMemoTitle('');
      setMemoDescription('');
      setPaymentStatuses({});
      setShowAddMemo(false);
    }
  };

  const handleSavePayments = () => {
    if (currentMemoId) {
      Object.entries(paymentStatuses).forEach(([studentId, paid]) => {
        updateMemoPayment(currentMemoId, studentId, paid);
      });
      alert('Payment statuses saved successfully!');
    }
  };

  const handleDeleteMemo = (memoId: string) => {
    if (window.confirm('Are you sure you want to delete this memo?')) {
      deleteMemo(memoId);
    }
  };

  const loadMemoPayments = (memoId: string) => {
    const memo = teacherMemos.find(m => m.id === memoId);
    if (memo) {
      setPaymentStatuses(memo.payments || {});
      setCurrentMemoId(memoId);
    }
  };

  const handlePaymentToggle = (studentId: string) => {
    setPaymentStatuses(prev => ({
      ...prev,
      [studentId]: !prev[studentId],
    }));
  };

  const getGradeName = (gradeId: string) => {
    const grade = grades.find(g => g.id === gradeId);
    return grade ? grade.name : 'Unknown Grade';
  };

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
              <h1 className="text-3xl font-bold text-gray-900">مذكرات الطلاب</h1>
              <p className="mt-1 text-sm text-gray-600">
                {teacher.name} - {teacher.subject}
              </p>
            </div>
            <button
              onClick={() => setShowAddMemo(true)}
              className="inline-flex items-center px-4 py-2 bg-blue-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-blue-700 transition-colors"
            >
              <Plus className="h-4 w-4 mr-2" />
              إضافة مذكرة جديدة
            </button>
          </div>
        </div>

        {/* Add Memo Modal */}
        {showAddMemo && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
              <h3 className="text-lg font-medium text-gray-900 mb-4">إضافة مذكرة جديدة</h3>
              <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      اختر الصف
                    </label>
                    <select
                      value={selectedGradeId}
                      onChange={(e) => setSelectedGradeId(e.target.value)}
                      className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">اختر صفًا</option>
                      {teacherGrades.map(grade => (
                        <option key={grade.id} value={grade.id}>{grade.name}</option>
                      ))}
                    </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    عنوان المذكرة
                  </label>
                  <input
                    type="text"
                    value={memoTitle}
                    onChange={(e) => setMemoTitle(e.target.value)}
                    className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    placeholder="مثال: رحلة مدرسية, رسوم الكتب"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    الوصف
                  </label>
                  <textarea
                    value={memoDescription}
                    onChange={(e) => setMemoDescription(e.target.value)}
                    rows={4}
                    className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    placeholder="أدخل وصف المذكرة..."
                  />
                </div>
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    onClick={() => {
                      setShowAddMemo(false);
                      setSelectedGradeId('');
                      setMemoTitle('');
                      setMemoDescription('');
                      setPaymentStatuses({});
                    }}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                  >
                    إلغاء
                  </button>
                  <button
                    onClick={handleAddMemo}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  >
                    إضافة مذكرة
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Grade Selector */}
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

        {/* Memo Selection and Payment Table */}
        {filteredMemos.length > 0 && (
          <div className="bg-white shadow rounded-lg p-6 mb-8">
            <h2 className="text-lg font-medium text-gray-900 mb-4">اختر المذكرة</h2>
            <div className="flex flex-wrap gap-2 mb-4">
              {filteredMemos.map((memo) => (
                <button
                  key={memo.id}
                  onClick={() => loadMemoPayments(memo.id)}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    currentMemoId === memo.id
                      ? 'bg-blue-100 text-blue-700 border-2 border-blue-300'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300'
                  }`}
                >
                  {memo.title}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Payment Table */}
        {currentMemoId && (
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-lg font-medium text-gray-900">
                    {filteredMemos.find(m => m.id === currentMemoId)?.title} - حالة الدفع
                  </h2>
                  <p className="text-sm text-gray-600 mt-1">
                    {filteredMemos.find(m => m.id === currentMemoId)?.description}
                  </p>
                </div>
                <button
                  onClick={handleSavePayments}
                  className="inline-flex items-center px-4 py-2 bg-green-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-green-700 transition-colors"
                >
                  <Save className="h-4 w-4 mr-2" />
                  حفظ المدفوعات
                </button>
              </div>

              {filteredStudents.length === 0 ? (
                <div className="text-center py-12">
                  <Users className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">لا يوجد طلاب</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    هذا الصف ليس لديه أي طلاب بعد.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          الطالب
                        </th>
                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                          حالة الدفع
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredStudents.map((student) => (
                        <tr key={student.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10">
                                <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                                  <span className="text-sm font-medium text-gray-700">
                                    {student.name.charAt(0).toUpperCase()}
                                  </span>
                                </div>
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">{student.name}</div>
                                <div className="text-sm text-gray-500">الرقم التعريفي: {student.studentId}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-center">
                            <input
                              type="checkbox"
                              checked={paymentStatuses[student.id] || false}
                              onChange={() => handlePaymentToggle(student.id)}
                              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Memos List */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-4 py-5 sm:p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">جميع المذكرات</h2>

            {filteredMemos.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">لا توجد مذكرات بعد</h3>
                <p className="mt-1 text-sm text-gray-500">
                  ابدأ بإضافة مذكرة جديدة لطلابك.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredMemos.map((memo) => (
                  <div key={memo.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="text-lg font-medium text-gray-900">{memo.title}</h3>
                          <span className="text-sm text-gray-500">•</span>
                          <span className="text-sm text-gray-500">{getGradeName(memo.gradeId)}</span>
                          <span className="text-sm text-gray-500">•</span>
                          <span className="text-sm text-gray-500">{memo.date}</span>
                        </div>
                        <p className="text-gray-700 whitespace-pre-wrap">{memo.description}</p>
                        <div className="mt-2 text-sm text-gray-500">
                          تم الدفع: {Object.values(memo.payments || {}).filter(Boolean).length} / {filteredStudents.length} طلاب
                        </div>
                      </div>
                      <button
                        onClick={() => handleDeleteMemo(memo.id)}
                        className="ml-4 text-red-600 hover:text-red-800 p-1"
                        title="حذف المذكرة"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherMemos;
