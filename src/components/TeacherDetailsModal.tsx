import React, { useState } from 'react';
import { Teacher } from '../types';
import { X, Copy, Check, Eye, EyeOff } from 'lucide-react';

interface TeacherDetailsModalProps {
  teacher: Teacher;
  onClose: () => void;
}

// Corrected Component Definition:
// We type the destructured props object directly instead of using React.FC
const TeacherDetailsModal = ({ teacher, onClose }: TeacherDetailsModalProps) => {
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    }).catch(err => {
      console.error('Failed to copy text: ', err);
    });
  };

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4" dir="rtl">
      <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-xl w-full max-w-lg transform transition-all duration-300 ease-in-out animate-fade-in-up">
        <div className="flex justify-between items-center p-5 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800 tracking-tight">ملف المعلم</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-gray-400 hover:bg-gray-200 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        <div className="p-6">
          <div className="flex items-start mb-6 flex-row-reverse">
            <img
              src={teacher.imageUrl || 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg'}
              alt={teacher.name}
              className="w-28 h-28 rounded-full object-cover ml-6 border-4 border-white shadow-md"
            />
            <div className="pt-2 text-right">
              <h3 className="text-3xl font-extrabold text-gray-900">{teacher.name}</h3>
              <p className="text-indigo-600 text-lg font-medium">{teacher.subject}</p>
            </div>
          </div>
          <div className="space-y-6">
            <div>
              <h4 className="font-semibold text-gray-500 text-sm uppercase tracking-wider mb-2 text-right">السيرة الذاتية</h4>
              <p className="text-gray-600 leading-relaxed text-right">{teacher.bio}</p>
            </div>

            <div>
              <h4 className="font-semibold text-gray-500 text-sm uppercase tracking-wider mb-3 text-right">بيانات الاعتماد</h4>
              <div className="space-y-4 bg-gray-100 p-4 rounded-lg">
                <div className="flex items-center justify-between flex-row-reverse">
                  <div className="text-gray-700 text-right">
                    <span className="font-bold text-gray-800">:البريد الإلكتروني</span> {teacher.email}
                  </div>
                  <button onClick={() => handleCopy(teacher.email, 'email')} className="flex items-center text-sm text-indigo-600 hover:text-indigo-800 font-semibold transition-colors">
                    {copiedField === 'email' ? (
                      <>
                        تم النسخ!
                        <Check className="h-4 w-4 ml-1 text-green-500" />
                      </>
                    ) : (
                      <>
                        نسخ
                        <Copy className="h-4 w-4 ml-1" />
                      </>
                    )}
                  </button>
                </div>
                <div className="flex items-center justify-between flex-row-reverse">
                  <div className="flex items-center">
                    <p className="text-gray-700 text-right">
                      <span className="font-bold text-gray-800">:كلمة المرور</span>
                      <span className="mr-2 font-mono tracking-wider">
                        {isPasswordVisible ? teacher.password : '••••••••'}
                      </span>
                    </p>
                    <button onClick={togglePasswordVisibility} className="mr-3 text-gray-500 hover:text-gray-800 transition-colors">
                      {isPasswordVisible ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                  <button onClick={() => handleCopy(teacher.password, 'password')} className="flex items-center text-sm text-indigo-600 hover:text-indigo-800 font-semibold transition-colors">
                     {copiedField === 'password' ? (
                      <>
                        تم النسخ!
                        <Check className="h-4 w-4 ml-1 text-green-500" />
                      </>
                    ) : (
                      <>
                        نسخ
                        <Copy className="h-4 w-4 ml-1" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            <a href={`/teacher/${teacher.name}`} className="text-indigo-600 hover:underline mt-6 inline-block font-medium group transition-all text-right">
              عرض صفحة الملف الشخصي الكاملة
              <span className="inline-block transform group-hover:translate-x-1 transition-transform">←</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherDetailsModal;
