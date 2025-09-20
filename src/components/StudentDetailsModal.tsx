import React, { useState } from 'react';
import { Student } from '../types';
import { X, Copy, Check, Eye, EyeOff, Phone, MapPin, User, Calendar, Award, UserCircle } from 'lucide-react';

interface StudentDetailsModalProps {
  student: Student;
  onClose: () => void;
}

const StudentDetailsModal = ({ student, onClose }: StudentDetailsModalProps) => {
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    }).catch(err => {
      console.error('Failed to copy text: ', err);
    });
  };

  const presentDays = student.attendance.filter(record => record.status === 'present').length;
  const absentDays = student.attendance.filter(record => record.status === 'absent').length;
  const totalDays = presentDays + absentDays;
  const attendanceRate = totalDays > 0 ? Math.round((presentDays / totalDays) * 100) : 0;

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4" dir="rtl">
      <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-xl w-full max-w-lg transform transition-all duration-300 ease-in-out animate-fade-in-up">
        <div className="flex justify-between items-center p-5 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800 tracking-tight">ملف الطالب</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-gray-400 hover:bg-gray-200 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        <div className="p-6">
          <div className="flex items-start mb-6 flex-row-reverse">
            <div className="w-28 h-28 rounded-full bg-indigo-100 flex items-center justify-center ml-6 border-4 border-white shadow-md">
              <UserCircle className="w-20 h-20 text-indigo-600" />
            </div>
            <div className="pt-2 text-right">
              <h3 className="text-3xl font-extrabold text-gray-900">{student.name}</h3>
              <p className="text-indigo-600 text-lg font-medium">معرف الطالب: {student.studentId}</p>
              <p className="text-gray-600 text-sm">الرقم الأكاديمي للطالب: #{student.studentNumber}</p>
            </div>
          </div>
          <div className="space-y-6">
            <div>
              <h4 className="font-semibold text-gray-500 text-sm uppercase tracking-wider mb-3 text-right">المعلومات الشخصية</h4>
              <div className="space-y-4 bg-gray-100 p-4 rounded-lg">
                <div className="flex items-center justify-between flex-row-reverse">
                  <div className="flex items-center text-gray-700">
                    <span className="ml-2">{student.parentNumber}</span>
                    <span className="font-bold text-gray-800">:هاتف ولي الأمر</span>
                    <Phone className="h-5 w-5 ml-3 text-gray-500" />
                  </div>
                  <button onClick={() => handleCopy(student.parentNumber, 'phone')} className="flex items-center text-sm text-indigo-600 hover:text-indigo-800 font-semibold transition-colors">
                    {copiedField === 'phone' ? (
                      <>
                        <Check className="h-4 w-4 mr-1 text-green-500" />
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4 mr-1" />
                      </>
                    )}
                  </button>
                </div>
                <div className="flex items-center text-gray-700 justify-end">
                  <span className="ml-2">{student.location}</span>
                  <span className="font-bold text-gray-800">:الموقع</span>
                  <MapPin className="h-5 w-5 ml-3 text-gray-500" />
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-gray-500 text-sm uppercase tracking-wider mb-3 text-right">الأداء الأكاديمي</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex items-center justify-end">
                    <span className="text-sm font-medium text-blue-800">معدل الحضور</span>
                    <Calendar className="h-5 w-5 text-blue-500 ml-2" />
                  </div>
                  <div className="text-2xl font-bold text-blue-600 mt-2 text-right">{attendanceRate}%</div>
                  <div className="text-xs text-blue-600 mt-1 text-right">
                    {presentDays} حاضر، {absentDays} غائب
                  </div>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="flex items-center justify-end">
                    <span className="text-sm font-medium text-green-800">الاختبارات التي تم إجراؤها</span>
                    <Award className="h-5 w-5 text-green-500 ml-2" />
                  </div>
                  <div className="text-2xl font-bold text-green-600 mt-2 text-right">{student.examScores.length}</div>
                  <div className="text-xs text-green-600 mt-1 text-right">
                    المتوسط: {student.examScores.length > 0
                      ? Math.round(student.examScores.reduce((sum, exam) => sum + exam.score, 0) / student.examScores.length)
                      : 0}%
                  </div>
                </div>
              </div>
            </div>

            
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDetailsModal;
