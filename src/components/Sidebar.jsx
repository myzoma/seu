import React, { useContext } from 'react';
import { LanguageContext } from '../context/LanguageContext';

const Sidebar = ({ currentPage, setCurrentPage }) => {
  const { language } = useContext(LanguageContext);
  
  const menuItems = [
    {
      id: 'dashboard',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
        </svg>
      ),
      name: { en: 'Dashboard', ar: 'لوحة المعلومات' }
    },
    {
      id: 'market',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
        </svg>
      ),
      name: { en: 'Market Overview', ar: 'نظرة عامة على السوق' }
    },
    {
      id: 'analysis',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z" />
          <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z" />
        </svg>
      ),
      name: { en: 'Elliott Wave Analysis', ar: 'تحليل موجة إليوت' }
    },
    {
      id: 'settings',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
        </svg>
      ),
      name: { en: 'Settings', ar: 'الإعدادات' }
    }
  ];
  
  const translations = {
    title: { 
      en: 'Elliott Wave Analyzer', 
      ar: 'محلل موجة إليوت' 
    },
    version: { 
      en: 'Version 1.0', 
      ar: 'الإصدار 1.0' 
    }
  };
  
  return (
    <div className={`bg-white shadow-md w-64 md:block hidden border-r border-gray-200 ${language === 'ar' ? 'text-right' : 'text-left'}`} dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <div className="flex flex-col h-full">
        <div className="p-4">
          <div className="flex items-center space-x-3 rtl:space-x-reverse">
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600">
              <path d="M1 6v16l7-4 8 4 7-4V2l-7 4-8-4-7 4"></path>
            </svg>
            <div>
              <h2 className="text-lg font-bold text-gray-900">{translations.title[language]}</h2>
              <p className="text-xs text-gray-500">{translations.version[language]}</p>
            </div>
          </div>
        </div>
        
        <div className="py-4 flex-1">
          <nav className="px-2 space-y-1">
            {menuItems.map(item => (
              <button
                key={item.id}
                className={`group flex items-center px-4 py-3 w-full text-sm font-medium rounded-md ${
                  currentPage === item.id 
                    ? 'bg-blue-50 text-blue-700' 
                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                }`}
                onClick={() => setCurrentPage(item.id)}
              >
                <div className={`mr-3 ${language === 'ar' ? 'ml-3 mr-0' : 'mr-3'}`}>
                  <div className={currentPage === item.id ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-500'}>
                    {item.icon}
                  </div>
                </div>
                {item.name[language]}
              </button>
            ))}
          </nav>
        </div>
        
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center">
            <img className="h-8 w-8 rounded-full" src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="User" />
            <div className="ml-3 rtl:ml-0 rtl:mr-3">
              <p className="text-sm font-medium text-gray-700">Alex Smith</p>
              <p className="text-xs text-gray-500">alex@example.com</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;