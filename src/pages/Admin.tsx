import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { generateTeacherEmail, generatePassword } from '../utils/generators';
import TeacherCard from '../components/TeacherCard';
import CopyButton from '../components/CopyButton';
import { Plus, Users, GraduationCap, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom'; // Import Link for navigation

const Admin: React.FC = () => {
  const { teachers, addTeacher, deleteTeacher, students, grades } = useData();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phoneNumber: '',
    imageUrl: '',
    bio: '',
    subject: '',
    government: '',
    city: '',
  });
  const [generatedCredentials, setGeneratedCredentials] = useState<{
    email: string;
    password: string;
    profileLink: string;
    phoneNumber: string;
  } | null>(null);

  const handleSendToWhatsApp = () => {
    if (generatedCredentials) {
      const message = `Hello I am Ziad From Edoura Educational Platform and This is your account details:
Email: ${generatedCredentials.email}
Password: ${generatedCredentials.password}
Teacher Profile: ${window.location.origin}${generatedCredentials.profileLink}
Please sign in with this data on the platform and dont share with any one for security and save it in a safe place.`;
      const whatsappUrl = `https://wa.me/${generatedCredentials.phoneNumber}?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, '_blank');
    }
  };
  // Helper to create a URL-friendly slug from the teacher's name
  const createSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '') // Remove non-alphanumeric characters
      .trim()
      .replace(/\s+/g, '-'); // Replace spaces with hyphens
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const email = generateTeacherEmail(formData.name);
    const password = generatePassword(); // Revert to random password generation
    const teacherSlug = createSlug(formData.name); // Generate slug
    const location = `${formData.government}, ${formData.city}`; // Combine government and city for location

    addTeacher({
      ...formData,
      email,
      password,
      slug: teacherSlug, // Store slug with teacher data
      location, // Add location to teacher data
    });

    setGeneratedCredentials({
      email,
      password,
      profileLink: `/teacher/${teacherSlug}`,
      phoneNumber: formData.phoneNumber,
    });
    localStorage.setItem('lastGeneratedTeacherEmail', email);
    localStorage.setItem('lastGeneratedTeacherPassword', password);
    localStorage.setItem('lastGeneratedTeacherProfileLink', `/teacher/${teacherSlug}`); // Save profile link
    setFormData({
      name: '',
      phoneNumber: '',
      imageUrl: '',
      bio: '',
      subject: '',
      government: '',
      city: '',
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="mt-1 text-sm text-gray-600">
              Manage teachers and monitor school activities
            </p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="inline-flex items-center px-4 py-2 bg-blue-600 border border-transparent rounded-md font-medium text-white hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-5 w-5 mr-2" />
            Add New Teacher
          </button>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Users className="h-8 w-8 text-gray-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Total Teachers</dt>
                    <dd className="text-lg font-medium text-gray-900">{teachers.length}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <BookOpen className="h-8 w-8 text-gray-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Subjects Taught</dt>
                    <dd className="text-lg font-medium text-gray-900">{[...new Set(teachers.map(t => t.subject))].length}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Users className="h-8 w-8 text-gray-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Total Students</dt>
                    <dd className="text-lg font-medium text-gray-900">{students.length}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Add Teacher Form */}
        {showForm && (
          <div className="bg-white shadow rounded-lg p-6 mb-8">
            <h2 className="text-lg font-medium text-gray-900 mb-6">Add New Teacher</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Teacher's Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 custom-textarea"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phoneNumber"
                    required
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 custom-textarea"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Teacher's Image URL
                  </label>
                  <input
                    type="url"
                    name="imageUrl"
                    value={formData.imageUrl}
                    onChange={handleChange}
                    placeholder="https://example.com/image.jpg"
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 custom-textarea"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Subject
                  </label>
                  <input
                    type="text"
                    name="subject"
                    required
                    value={formData.subject}
                    onChange={handleChange}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 custom-textarea"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Government
                  </label>
                  <input
                    type="text"
                    name="government"
                    required
                    value={formData.government}
                    onChange={handleChange}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 custom-textarea"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    City
                  </label>
                  <input
                    type="text"
                    name="city"
                    required
                    value={formData.city}
                    onChange={handleChange}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 custom-textarea"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Bio
                </label>
                <textarea
                  name="bio"
                  rows={4}
                  required
                  value={formData.bio}
                  onChange={handleChange}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 custom-textarea"
                />
              </div>
              
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors"
                >
                  Add Teacher
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Generated Credentials */}
        {generatedCredentials && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8">
            <h3 className="text-lg font-medium text-green-800 mb-4">Teacher Added Successfully!</h3>
            <p className="text-sm text-green-700 mb-4">Please provide these credentials to the new teacher:</p>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-green-700">Email:</span>
                <span className="text-sm text-green-800 font-mono">{generatedCredentials.email}</span>
                <CopyButton text={generatedCredentials.email} />
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-green-700">Password:</span>
                <span className="text-sm text-green-800 font-mono">{generatedCredentials.password}</span>
                <CopyButton text={generatedCredentials.password} />
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-green-700">Profile Link:</span>
                <Link to={generatedCredentials.profileLink} className="text-sm text-blue-600 hover:underline font-mono">
                  {window.location.origin}{generatedCredentials.profileLink}
                </Link>
                <CopyButton text={`${window.location.origin}${generatedCredentials.profileLink}`} />
              </div>
            </div>
            <div className="flex justify-between items-center mt-4">
              <button
                onClick={handleSendToWhatsApp}
                className="inline-flex items-center px-4 py-2 bg-green-600 border border-transparent rounded-md font-medium text-white hover:bg-green-700 transition-colors"
              >
                Send To Teacher
              </button>
              <button
                onClick={() => setGeneratedCredentials(null)}
                className="text-sm text-green-600 hover:text-green-500"
              >
                Dismiss
              </button>
            </div>
          </div>
        )}

        {/* Latest Teachers */}
        <div>
          <h2 className="text-lg font-medium text-gray-900 mb-6">Latest Teachers</h2>
          {teachers.length === 0 ? (
            <div className="text-center py-12">
              <Users className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No teachers</h3>
              <p className="mt-1 text-sm text-gray-500">Get started by adding a new teacher.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {teachers
                .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()) // Sort by creation date, newest first
                .slice(0, 3) // Take only the latest 3
                .map((teacher) => (
                  <TeacherCard key={teacher.id} teacher={teacher} onDelete={deleteTeacher} />
                ))}
            </div>
          )}
          {teachers.length > 3 && (
            <div className="mt-8 text-center">
              <Link
                to="/teachers"
                className="inline-flex items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors"
              >
                View All Teachers
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Admin;
