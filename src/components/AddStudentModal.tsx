import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Grade } from '../types';
import { generateStudentId } from '../utils/generators';

interface AddStudentModalProps {
  grades: Grade[];
  onClose: () => void;
  onAddStudent: (studentData: {
    studentId: string; // Added studentId
    name: string;
    studentNumber: string;
    parentNumber: string;
    gradeId: string;
    location: string; // Assuming a default location or user input
    teacherId: string; // Passed from Students page
  }) => void;
  teacherId?: string; // Optional, if adding from a teacher's page
}

const AddStudentModal: React.FC<AddStudentModalProps> = ({ grades, onClose, onAddStudent, teacherId }) => {
  const [name, setName] = useState('');
  const [studentNumber, setStudentNumber] = useState('');
  const [parentNumber, setParentNumber] = useState('');
  const [selectedGradeId, setSelectedGradeId] = useState(grades.length > 0 ? grades[0].id : '');
  const [location, setLocation] = useState('Default Location'); // Placeholder for location

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !studentNumber || !parentNumber || !selectedGradeId) {
      alert('الرجاء ملء جميع الحقول المطلوبة.');
      return;
    }

    const newStudentData = {
      studentId: generateStudentId(), // Generate and assign studentId
      name,
      studentNumber,
      parentNumber,
      gradeId: selectedGradeId,
      location,
      teacherId: teacherId || '', // Use provided teacherId or empty string
    };

    onAddStudent(newStudentData);
    onClose(); // Close modal after adding
  };

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4" dir="rtl">
      <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-xl w-full max-w-md transform transition-all duration-300 ease-in-out animate-fade-in-up">
        <div className="flex justify-between items-center p-5 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800 tracking-tight">إضافة طالب جديد</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-gray-400 hover:bg-gray-200 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label htmlFor="studentName" className="block text-sm font-medium text-gray-700 text-right">
              اسم الطالب
            </label>
            <input
              type="text"
              id="studentName"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-right"
              required
              dir="rtl"
            />
          </div>
          <div>
            <label htmlFor="studentNumber" className="block text-sm font-medium text-gray-700 text-right">
              الرقم الأكاديمي للطالب
            </label>
            <input
              type="text"
              id="studentNumber"
              value={studentNumber}
              onChange={(e) => setStudentNumber(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-right"
              required
              dir="rtl"
            />
          </div>
          <div>
            <label htmlFor="parentNumber" className="block text-sm font-medium text-gray-700 text-right">
              رقم هاتف ولي الأمر
            </label>
            <input
              type="text"
              id="parentNumber"
              value={parentNumber}
              onChange={(e) => setParentNumber(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-right"
              required
              dir="rtl"
            />
          </div>
          <div>
            <label htmlFor="grade" className="block text-sm font-medium text-gray-700 text-right">
              الصف الدراسي
            </label>
            <select
              id="grade"
              value={selectedGradeId}
              onChange={(e) => setSelectedGradeId(e.target.value)}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md custom-textarea text-right"
              required
              dir="rtl"
            >
              {grades.map((grade) => (
                <option key={grade.id} value={grade.id}>
                  {grade.name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex justify-end space-x-3 rtl:space-x-reverse">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
            >
              إلغاء
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
            >
              إضافة طالب
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddStudentModal;
