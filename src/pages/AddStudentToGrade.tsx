import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { generateStudentId } from '../utils/generators';
import { ArrowLeft, UserPlus } from 'lucide-react';

const AddStudentToGrade: React.FC = () => {
  const { teacherSlug, gradeNameSlug } = useParams<{ teacherSlug: string; gradeNameSlug: string }>();
  const { getTeacherBySlug, grades, addStudent } = useData();
  const [studentForm, setStudentForm] = useState({
    name: '',
    studentNumber: '',
    parentNumber: '',
    location: '',
  });
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const { isTeacherAuthenticated, currentTeacherEmail, isAdminAuthenticated } = useAuth();
  const navigate = useNavigate();

  const teacher = teacherSlug ? getTeacherBySlug(teacherSlug) : null;
  const grade = grades.find(
    g => g.teacherId === teacher?.id && g.name.toLowerCase().replace(/\s+/g, '-') === gradeNameSlug
  );

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

  if (!grade) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-900">Grade not found</h2>
          <Link to={`/teacher/${teacher.slug}`} className="mt-4 text-blue-600 hover:text-blue-500">
            Back to Teacher Profile
          </Link>
        </div>
      </div>
    );
  }

  const handleAddStudent = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    if (!studentForm.name.trim() || !studentForm.studentNumber.trim() || !studentForm.parentNumber.trim() || !studentForm.location.trim()) {
      setError('All fields are required.');
      return;
    }

    if (teacher?.id && grade?.id) {
      const studentId = generateStudentId();
      addStudent({
        ...studentForm,
        studentId,
        gradeId: grade.id,
        teacherId: teacher.id,
      });
      setSuccessMessage(`Student "${studentForm.name}" added successfully to ${grade.name}!`);
      setStudentForm({
        name: '',
        studentNumber: '',
        parentNumber: '',
        location: '',
      });
    } else {
      setError('Could not add student. Teacher or Grade ID is missing.');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStudentForm(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <Link
              to={`/teacher/${teacher.slug}`}
              className="inline-flex items-center text-blue-600 hover:text-blue-500"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back to {teacher.name}'s Profile
            </Link>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Add Student to {grade.name}</h1>
          <p className="mt-1 text-sm text-gray-600">
            Teacher: {teacher.name} ({teacher.subject})
          </p>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Student Details</h2>
          <form onSubmit={handleAddStudent} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Student Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                value={studentForm.name}
                onChange={handleChange}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 custom-textarea"
              />
            </div>
            <div>
              <label htmlFor="studentNumber" className="block text-sm font-medium text-gray-700">
                Student Number
              </label>
              <input
                type="text"
                id="studentNumber"
                name="studentNumber"
                required
                value={studentForm.studentNumber}
                onChange={handleChange}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 custom-textarea"
              />
            </div>
            <div>
              <label htmlFor="parentNumber" className="block text-sm font-medium text-gray-700">
                Parent Phone Number
              </label>
              <input
                type="tel"
                id="parentNumber"
                name="parentNumber"
                required
                value={studentForm.parentNumber}
                onChange={handleChange}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 custom-textarea"
              />
            </div>
            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                Location
              </label>
              <input
                type="text"
                id="location"
                name="location"
                required
                value={studentForm.location}
                onChange={handleChange}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 custom-textarea"
              />
            </div>

            {error && <p className="text-sm text-red-600">{error}</p>}
            {successMessage && <p className="text-sm text-green-600">{successMessage}</p>}

            <div className="flex justify-end space-x-3 pt-4">
              <Link
                to={`/teacher/${teacher.slug}`}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors inline-flex items-center"
              >
                Cancel
              </Link>
              <button
                type="submit"
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors inline-flex items-center"
              >
                <UserPlus className="h-5 w-5 mr-2" />
                Add Student
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddStudentToGrade;
