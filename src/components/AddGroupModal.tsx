import React, { useState, useEffect } from 'react';
import { X, Users, MapPin, GraduationCap } from 'lucide-react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';

interface AddGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
  teacherId: string;
  selectedGradeName?: string;
}

const AddGroupModal: React.FC<AddGroupModalProps> = ({ isOpen, onClose, teacherId, selectedGradeName }) => {
  const { addGrade } = useData();
  const { currentTeacherEmail } = useAuth();
  const [groupName, setGroupName] = useState('');
  const [gradeName, setGradeName] = useState(selectedGradeName || '');
  const [location, setLocation] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (selectedGradeName) {
      setGradeName(selectedGradeName);
    }
  }, [selectedGradeName]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!groupName.trim() || !gradeName.trim() || !location.trim()) {
      setError('Please fill in all fields.');
      return;
    }

    try {
      await addGrade({
        name: gradeName.trim(),
        teacherId: teacherId,
        groupName: groupName.trim(),
        location: location.trim(),
      });
      onClose();
      setGroupName('');
      setGradeName('');
      setLocation('');
    } catch (err) {
      setError('Failed to add group. Please try again.');
      console.error('Error adding group:', err);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4" dir="rtl">
      <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-xl w-full max-w-lg transform transition-all duration-300 ease-in-out animate-fade-in-up">
        <div className="flex justify-between items-center p-5 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800 tracking-tight">إضافة مجموعة جديدة</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-gray-400 hover:bg-gray-200 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        <div className="p-6">
          <div className="flex items-start mb-6">
            <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mr-6 border-4 border-white shadow-md">
              <Users className="w-12 h-12 text-green-600" />
            </div>
            <div className="pt-2">
              <h3 className="text-2xl font-extrabold text-gray-900">إنشاء مجموعة جديدة</h3>
              <p className="text-green-600 text-lg font-medium">إضافة مجموعة طلاب جديدة</p>
              <p className="text-gray-600 text-sm">إعداد مجموعة صفية جديدة لطلابك</p>
            </div>
          </div>
          {error && (
            <div className="mb-4 text-red-600 text-sm text-center bg-red-50 p-3 rounded-lg">{error}</div>
          )}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <h4 className="font-semibold text-gray-500 text-sm uppercase tracking-wider mb-3">تفاصيل المجموعة</h4>
              <div className="space-y-4">
                <div className="bg-gray-100 p-4 rounded-lg">
                  <label htmlFor="groupName" className="block text-sm font-medium text-gray-700 mb-2 text-right">
                    اسم المجموعة
                  </label>
                  <div className="flex items-center">
                    <Users className="h-5 w-5 text-gray-500 ml-3" />
                    <input
                      type="text"
                      id="groupName"
                      value={groupName}
                      onChange={(e) => setGroupName(e.target.value)}
                      className="flex-1 border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm text-right"
                      placeholder="مثال: مجموعة الصباح"
                      required
                    />
                  </div>
                </div>
                <div className="bg-gray-100 p-4 rounded-lg">
                  <label htmlFor="gradeName" className="block text-sm font-medium text-gray-700 mb-2 text-right">
                    اسم الصف
                  </label>
                  <div className="flex items-center">
                    <GraduationCap className="h-5 w-5 text-gray-500 ml-3" />
                    <input
                      type="text"
                      id="gradeName"
                      value={gradeName}
                      onChange={(e) => setGradeName(e.target.value)}
                      className="flex-1 border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm text-right"
                      placeholder="مثال: الأول الثانوي"
                      required
                    />
                  </div>
                </div>
                <div className="bg-gray-100 p-4 rounded-lg">
                  <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2 text-right">
                    الموقع
                  </label>
                  <div className="flex items-center">
                    <MapPin className="h-5 w-5 text-gray-500 ml-3" />
                    <input
                      type="text"
                      id="location"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="flex-1 border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm text-right"
                      placeholder="مثال: غرفة 101"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-8">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-3 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
              >
                إلغاء
              </button>
              <button
                type="submit"
                className="px-6 py-3 bg-green-600 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
              >
                إضافة مجموعة
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddGroupModal;
