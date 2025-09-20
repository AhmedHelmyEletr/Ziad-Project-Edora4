import React from 'react';
import { Link } from 'react-router-dom';
import { Teacher } from '../types';
import { truncateText } from '../utils/generators';
import { Users, BookOpen, MoreVertical, Trash2, Info } from 'lucide-react';
import { useData } from '../context/DataContext';
import TeacherDetailsModal from './TeacherDetailsModal';

interface TeacherCardProps {
  teacher: Teacher;
  onDelete: (teacherId: string) => void;
}

const TeacherCard: React.FC<TeacherCardProps> = ({ teacher, onDelete }) => {
  const { students, grades } = useData();
  const [showMenu, setShowMenu] = React.useState(false);
  const [showModal, setShowModal] = React.useState(false);

  const teacherGrades = grades.filter(grade => grade.teacherId === teacher.id);
  const teacherStudents = students.filter(student => student.teacherId === teacher.id);

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 overflow-hidden relative">
      <div className="absolute top-2 right-2 z-10">
        <button
          onClick={() => setShowMenu(!showMenu)}
          className="p-2 rounded-full hover:bg-gray-100 transition-colors"
          aria-label="Teacher actions"
        >
          <MoreVertical className="h-5 w-5 text-gray-600" />
        </button>
        {showMenu && (
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5 focus:outline-none">
            <button
              onClick={() => {
                setShowModal(true);
                setShowMenu(false);
              }}
              className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
            >
              <Info className="h-4 w-4 mr-2" />
              Details
            </button>
            <button
              onClick={() => {
                onDelete(teacher.id);
                setShowMenu(false);
              }}
              className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 hover:text-red-700"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </button>
          </div>
        )}
      </div>
      {showModal && <TeacherDetailsModal teacher={teacher} onClose={() => setShowModal(false)} />}
      <div className="aspect-w-16 aspect-h-9">
        <img
          src={teacher.imageUrl || 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg'}
          alt={teacher.name}
          className="w-full h-48 object-cover"
        />
      </div>
      
      <div className="p-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold text-gray-900">{teacher.name}</h3>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            <BookOpen className="h-3 w-3 mr-1" />
            {teacher.subject}
          </span>
        </div>
        
        <p className="text-sm text-gray-600 mb-4">
          {truncateText(teacher.bio, 60)}
        </p>
        
        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
          <div className="flex items-center">
            <Users className="h-4 w-4 mr-1" />
            <span>{teacherGrades.length} Grade Groups</span>
          </div>
          <div className="flex items-center">
            <Users className="h-4 w-4 mr-1" />
            <span>{teacherStudents.length} Students</span>
          </div>
        </div>
        
        <Link
          to={`/teacher/${teacher.name}`}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white text-center py-2 px-4 rounded-md transition-colors duration-200 inline-block"
        >
          View Profile
        </Link>
      </div>
    </div>
  );
};

export default TeacherCard;
