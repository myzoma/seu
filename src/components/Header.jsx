import React, { useContext } from 'react';
import { LanguageContext } from '../context/LanguageContext';

const Header = () => {
  const { language, toggleLanguage } = useContext(LanguageContext);
  
  const translations = {
    title: {
      en: 'Elliott Wave Analyzer',
      ar: 'محلل موجة إليوت'
    },
    marketStatus: {
      en: 'Market Open',
      ar: 'السوق مفتوح'
    },
    searchPlaceholder: {
      en: 'Search symbols...',
      ar: 'بحث عن الرموز...'
    }
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600 mr-2">
                <path d="M1 6v16l7-4 8 4 7-4V2l-7 4-8-4-7 4"></path>
              </svg>
              <span className="text-xl font-bold text-gray-900">{translations.title[language]}</span>
            </div>
          </div>
          <div className="ml-4 flex items-center md:ml-6">
            {/* Language toggle */}
            <button 
              onClick={toggleLanguage} 
              className="mr-4 px-3 py-1 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors"
            >
              {language === 'en' ? 'العربية' : 'English'}
            </button>
            
            {/* Market status indicator */}
            <div className="flex items-center mr-4">
              <div className="h-2.5 w-2.5 rounded-full bg-green-500 mr-2"></div>
              <span className="text-sm text-gray-600">{translations.marketStatus[language]}</span>
            </div>
            
            {/* Search bar */}
            <div className="hidden md:block">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
                    <circle cx="11" cy="11" r="8"></circle>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder={translations.searchPlaceholder[language]}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-md bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white w-48 md:w-64"
                  dir={language === 'ar' ? 'rtl' : 'ltr'}
                />
              </div>
            </div>
            
            {/* User profile */}
            <div className="ml-3 relative">
              <div>
                <button className="max-w-xs bg-gray-800 rounded-full flex items-center text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white">
                  <img className="h-8 w-8 rounded-full" src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="User" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;