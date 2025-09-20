import React, { useState } from 'react';
import { X, Trash2, Info, Plus, Users, MapPin, GraduationCap } from 'lucide-react';
import { Grade } from '../types';
import { useData } from '../context/DataContext';
import DeleteConfirmationModal from './DeleteConfirmationModal';

interface GradeActionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  grade: Grade | null;
  onAddNewGroup?: () => void;
}

const GradeActionsModal: React.FC<GradeActionsModalProps> = ({ isOpen, onClose, grade, onAddNewGroup }) => {
  const { deleteGrade, students } = useData();
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  if (!isOpen || !grade) return null;

  const studentsInGrade = students.filter(student => student.gradeId === grade.id).length;

  const handleDeleteGrade = () => {
    deleteGrade(grade.id);
    onClose();
  };

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
          <div className="flex items-start mb-6">
            <div className="w-20 h-20 rounded-full bg-indigo-100 flex items-center justify-center ml-6 border-4 border-white shadow-md">
              <GraduationCap className="w-12 h-12 text-indigo-600" />
            </div>
            <div className="pt-2 text-right">
              <h3 className="text-2xl font-extrabold text-gray-900">{grade.name}</h3>
              <p className="text-indigo-600 text-lg font-medium">المجموعة: {grade.groupName}</p>
              <p className="text-gray-600 text-sm">الموقع: {grade.location}</p>
            </div>
          </div>
          <div className="space-y-6">
            <div>
              <h4 className="font-semibold text-gray-500 text-sm uppercase tracking-wider mb-3 text-right">معلومات الصف</h4>
              <div className="space-y-4 bg-gray-100 p-4 rounded-lg">
                <div className="flex items-center text-gray-700 justify-end">
                  <span className="ml-2">مسجل {studentsInGrade}</span>
                  <span className="font-bold text-gray-800">:الطلاب</span>
                  <Users className="h-5 w-5 ml-3 text-gray-500" />
                </div>
                <div className="flex items-center text-gray-700 justify-end">
                  <span className="ml-2">{grade.location}</span>
                  <span className="font-bold text-gray-800">:الموقع</span>
                  <MapPin className="h-5 w-5 ml-3 text-gray-500" />
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-between space-x-3 rtl:space-x-reverse mt-8">
            {onAddNewGroup && (
              <button
                type="button"
                onClick={() => {
                  onAddNewGroup();
                  onClose();
                }}
                className="flex-1 px-4 py-3 bg-green-600 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 flex items-center justify-center transition-colors"
              >
                إضافة مجموعة جديدة
                <Plus className="h-5 w-5 mr-2" />
              </button>
            )}
            <button
              type="button"
              onClick={() => setShowDeleteModal(true)}
              className="flex-1 px-4 py-3 bg-red-600 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 flex items-center justify-center transition-colors"
            >
              حذف الصف
              <Trash2 className="h-5 w-5 mr-2" />
            </button>
          </div>
        </div>
      </div>
      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteGrade}
        title="حذف الصف"
        message={`هل أنت متأكد أنك تريد حذف الصف "${grade.name}"؟ سيؤدي هذا أيضًا إلى حذف جميع الطلاب والمذكرات المرتبطة بهذا الصف. لا يمكن التراجع عن هذا الإجراء.`}
        confirmText="حذف الصف"
      />
    </div>
  );
};

export default GradeActionsModal;
