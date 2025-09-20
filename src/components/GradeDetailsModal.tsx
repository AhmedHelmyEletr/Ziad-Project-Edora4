import React from 'react';
import { Grade, Student } from '../types';
import { X, Users, User, GraduationCap } from 'lucide-react';

interface GradeDetailsModalProps {
  grade: Grade;
  students: Student[];
  onClose: () => void;
}

const GradeDetailsModal = ({ grade, students, onClose }: GradeDetailsModalProps) => {
  const gradeStudents = students.filter(student => student.gradeId === grade.id);

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4" dir="rtl">
      <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-xl w-full max-w-lg transform transition-all duration-300 ease-in-out animate-fade-in-up">
        <div className="flex justify-between items-center p-5 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800 tracking-tight">تفاصيل الصف</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-gray-400 hover:bg-gray-200 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        <div className="p-6">
          <div className="flex items-center mb-6 flex-row-reverse">
            <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center ml-4">
              <GraduationCap className="h-8 w-8 text-indigo-600" />
            </div>
            <div className="text-right">
              <h3 className="text-2xl font-extrabold text-gray-900">{grade.name}</h3>
              <p className="text-indigo-600 text-lg font-medium">عدد الطلاب: {gradeStudents.length}</p>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <h4 className="font-semibold text-gray-500 text-sm uppercase tracking-wider mb-3 text-right">إحصائيات الصف</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex items-center justify-end">
                    <span className="text-sm font-medium text-blue-800">إجمالي الطلاب</span>
                    <Users className="h-5 w-5 text-blue-500 ml-2" />
                  </div>
                  <div className="text-2xl font-bold text-blue-600 mt-2 text-right">{gradeStudents.length}</div>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="flex items-center justify-end">
                    <span className="text-sm font-medium text-green-800">الطلاب النشطون</span>
                    <User className="h-5 w-5 text-green-500 ml-2" />
                  </div>
                  <div className="text-2xl font-bold text-green-600 mt-2 text-right">{gradeStudents.length}</div>
                </div>
              </div>
            </div>

            {gradeStudents.length === 0 && (
              <div className="text-center py-8">
                <Users className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">لا يوجد طلاب بعد</h3>
                <p className="mt-1 text-sm text-gray-500">
                  لم يتم تعيين أي طلاب لهذا الصف بعد.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GradeDetailsModal;
