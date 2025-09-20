import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, User, GraduationCap, LayoutDashboard, Users as TeachersIcon, BookUser, Menu, X } from 'lucide-react';

const Header: React.FC = () => {
  const { isAdminAuthenticated, isParentAuthenticated, logoutAdmin, logoutParent } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    if (isAdminAuthenticated) {
      logoutAdmin();
    } else if (isParentAuthenticated) {
      logoutParent();
    }
    navigate('/');
  };

  const isHomePage = location.pathname === '/';

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <Link to="/" className="flex items-center space-x-2">
            <GraduationCap className="h-8 w-8 text-blue-600" />
            <span className="text-2xl font-bold text-gray-900">إيدورا</span>
          </Link>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-600 hover:text-gray-900 focus:outline-none focus:text-gray-900"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

          {/* Desktop navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {isHomePage && (
              <div className="flex items-center space-x-8">
                <a href="#features" className="text-gray-600 hover:text-blue-600 transition">المميزات</a>
                <a href="#how-it-works" className="text-gray-600 hover:text-blue-600 transition">كيف يعمل</a>
                <a href="#testimonials" className="text-gray-600 hover:text-blue-600 transition">آراء العملاء</a>
              </div>
            )}

            {!isAdminAuthenticated && !isParentAuthenticated && (
              <div className="flex items-center space-x-4">
                <Link to="/login" className="text-gray-600 hover:text-blue-600 transition font-medium">
                  دخول المدير
                </Link>
                <Link
                  to="/parents"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
                >
                  بوابة الوالدين
                </Link>
              </div>
            )}

            {isAdminAuthenticated && (
              <div className="flex items-center space-x-4">
                <Link
                  to="/admin"
                  className="text-gray-600 hover:text-blue-600 transition font-medium inline-flex items-center"
                >
                  <LayoutDashboard className="h-4 w-4 ml-2" />
                  لوحة التحكم
                </Link>
                <Link
                  to="/teachers"
                  className="text-gray-600 hover:text-blue-600 transition font-medium inline-flex items-center"
                >
                  <TeachersIcon className="h-4 w-4 ml-2" />
                  المدرسين
                </Link>
                <button
                  onClick={handleLogout}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                >
                  <LogOut className="h-4 w-4 ml-2" />
                  تسجيل الخروج
                </button>
              </div>
            )}

            {isParentAuthenticated && (
              <button
                onClick={handleLogout}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
              >
                <LogOut className="h-4 w-4 ml-2" />
                تسجيل الخروج
              </button>
            )}
          </nav>

          {/* Mobile menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden absolute top-full left-0 right-0 bg-white border-t border-gray-200 shadow-lg">
              <div className="px-4 py-4 space-y-4">
                {isHomePage && (
                  <div className="space-y-2">
                    <a href="#features" className="block text-gray-600 hover:text-blue-600 transition py-2">المميزات</a>
                    <a href="#how-it-works" className="block text-gray-600 hover:text-blue-600 transition py-2">كيف يعمل</a>
                    <a href="#testimonials" className="block text-gray-600 hover:text-blue-600 transition py-2">آراء العملاء</a>
                  </div>
                )}

                {!isAdminAuthenticated && !isParentAuthenticated && (
                  <div className="space-y-2">
                    <Link to="/login" className="block text-gray-600 hover:text-blue-600 transition font-medium py-2">
                      دخول المدير
                    </Link>
                    <Link
                      to="/parents"
                      className="block inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors w-full justify-center"
                    >
                      بوابة الوالدين
                    </Link>
                  </div>
                )}

                {isAdminAuthenticated && (
                  <div className="space-y-2">
                    <Link
                      to="/admin"
                      className="flex items-center text-gray-600 hover:text-blue-600 transition font-medium py-2"
                    >
                      <LayoutDashboard className="h-4 w-4 ml-2" />
                      لوحة التحكم
                    </Link>
                    <Link
                      to="/teachers"
                      className="flex items-center text-gray-600 hover:text-blue-600 transition font-medium py-2"
                    >
                      <TeachersIcon className="h-4 w-4 ml-2" />
                      المدرسين
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                    >
                      <LogOut className="h-4 w-4 ml-2" />
                      تسجيل الخروج
                    </button>
                  </div>
                )}

                {isParentAuthenticated && (
                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                  >
                    <LogOut className="h-4 w-4 ml-2" />
                    تسجيل الخروج
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
