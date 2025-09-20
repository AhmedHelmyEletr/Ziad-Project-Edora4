import React, { useState, useMemo } from 'react';
import { useData } from '../context/DataContext';
import TeacherCard from '../components/TeacherCard';
import { Search, Users } from 'lucide-react';

const Teachers: React.FC = () => {
  const { teachers, deleteTeacher } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedGovernment, setSelectedGovernment] = useState('');

  const availableSubjects = useMemo(() => {
    const subjects = new Set(teachers.map(t => t.subject));
    return Array.from(subjects).sort();
  }, [teachers]);

  const availableGovernments = useMemo(() => {
    const governments = new Set(teachers.map(t => t.government));
    return Array.from(governments).sort();
  }, [teachers]);

  const filteredTeachers = useMemo(() => {
    let filtered = teachers;

    if (searchTerm) {
      filtered = filtered.filter(teacher =>
        teacher.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedSubject) {
      filtered = filtered.filter(teacher => teacher.subject === selectedSubject);
    }

    if (selectedGovernment) {
      filtered = filtered.filter(teacher => teacher.government === selectedGovernment);
    }

    return filtered;
  }, [teachers, searchTerm, selectedSubject, selectedGovernment]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">جميع المعلمين</h1>
          <p className="mt-1 text-sm text-gray-600">
            تصفح جميع المعلمين المسجلين.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filter Sidebar */}
          <aside className="w-full lg:w-80 bg-white shadow-xl rounded-xl p-6 lg:flex-shrink-0 border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
              <Users className="h-6 w-6 ml-2 text-blue-600" />
              الفلاتر
            </h2>

            <div className="space-y-6">
              <div>
                <label htmlFor="subject" className="block text-sm font-semibold text-gray-700 mb-3">
                  المادة
                </label>
                <select
                  id="subject"
                  name="subject"
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value)}
                  className="block w-full pr-4 pl-10 py-3 text-base border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-lg shadow-sm transition-colors"
                >
                  <option value="">جميع المواد</option>
                  {availableSubjects.map(subject => (
                    <option key={subject} value={subject}>{subject}</option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="government" className="block text-sm font-semibold text-gray-700 mb-3">
                  المحافظة
                </label>
                <select
                  id="government"
                  name="government"
                  value={selectedGovernment}
                  onChange={(e) => setSelectedGovernment(e.target.value)}
                  className="block w-full pr-4 pl-10 py-3 text-base border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-lg shadow-sm transition-colors"
                >
                  <option value="">جميع المحافظات</option>
                  {availableGovernments.map(government => (
                    <option key={government} value={government}>{government}</option>
                  ))}
                </select>
              </div>

              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedSubject('');
                  setSelectedGovernment('');
                }}
                className="w-full px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-sm font-semibold text-red-700 hover:bg-red-100 hover:border-red-300 transition-all duration-200 shadow-sm"
              >
                مسح جميع الفلاتر
              </button>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            {/* Search Bar */}
            <div className="mb-8">
              <label htmlFor="search" className="sr-only">البحث عن المعلمين</label>
              <div className="relative rounded-xl shadow-lg">
                <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  name="search"
                  id="search"
                  className="block w-full pr-12 pl-4 py-4 border-gray-300 rounded-xl leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm shadow-sm transition-colors"
                  placeholder="البحث عن المعلمين بالاسم..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            {/* Teachers Count */}
            <div className="mb-6">
              <p className="text-sm text-gray-600">
                عرض <span className="font-semibold text-gray-900">{filteredTeachers.length}</span> من{' '}
                <span className="font-semibold text-gray-900">{teachers.length}</span> معلم
              </p>
            </div>

            {/* Teachers Grid */}
            {filteredTeachers.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-xl shadow-lg border border-gray-100">
                <Users className="mx-auto h-16 w-16 text-gray-300" />
                <h3 className="mt-4 text-lg font-semibold text-gray-900">لم يتم العثور على معلمين</h3>
                <p className="mt-2 text-sm text-gray-500 max-w-sm mx-auto">
                  حاول تعديل مصطلحات البحث أو مسح الفلاتر لرؤية المزيد من النتائج.
                </p>
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedSubject('');
                    setSelectedGovernment('');
                  }}
                  className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  مسح جميع الفلاتر
                </button>
              </div>
            ) : (
              <div className="max-h-[600px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredTeachers.map((teacher) => (
                    <TeacherCard key={teacher.id} teacher={teacher} onDelete={deleteTeacher} />
                  ))}
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Teachers;
