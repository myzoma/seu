import React, { useContext, useState } from 'react';
import { LanguageContext } from '../context/LanguageContext';

const Settings = () => {
  const { language, toggleLanguage } = useContext(LanguageContext);
  const [theme, setTheme] = useState('light');
  const [timeFormat, setTimeFormat] = useState('24h');
  const [notifications, setNotifications] = useState(true);
  
  const translations = {
    title: {
      en: 'Settings',
      ar: 'الإعدادات'
    },
    language: {
      en: 'Language',
      ar: 'اللغة'
    },
    english: {
      en: 'English',
      ar: 'الإنجليزية'
    },
    arabic: {
      en: 'Arabic',
      ar: 'العربية'
    },
    theme: {
      en: 'Theme',
      ar: 'السمة'
    },
    light: {
      en: 'Light',
      ar: 'فاتح'
    },
    dark: {
      en: 'Dark',
      ar: 'داكن'
    },
    timeFormat: {
      en: 'Time Format',
      ar: 'تنسيق الوقت'
    },
    hour24: {
      en: '24-hour',
      ar: '24 ساعة'
    },
    hour12: {
      en: '12-hour (AM/PM)',
      ar: '12 ساعة (ص/م)'
    },
    notifications: {
      en: 'Notifications',
      ar: 'الإشعارات'
    },
    enabled: {
      en: 'Enabled',
      ar: 'مفعل'
    },
    disabled: {
      en: 'Disabled',
      ar: 'معطل'
    },
    advanced: {
      en: 'Advanced Settings',
      ar: 'إعدادات متقدمة'
    },
    apiKey: {
      en: 'API Key',
      ar: 'مفتاح API'
    },
    save: {
      en: 'Save Settings',
      ar: 'حفظ الإعدادات'
    },
    saved: {
      en: 'Settings saved successfully!',
      ar: 'تم حفظ الإعدادات بنجاح!'
    },
    defaultValues: {
      en: 'Restore Default Values',
      ar: 'استعادة القيم الافتراضية'
    }
  };
  
  const [showSaveMessage, setShowSaveMessage] = useState(false);
  
  const handleSaveSettings = () => {
    setShowSaveMessage(true);
    setTimeout(() => setShowSaveMessage(false), 3000);
  };
  
  return (
    <div className="bg-white rounded-lg shadow p-6" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">{translations.title[language]}</h2>
      
      {showSaveMessage && (
        <div className="mb-6 bg-green-50 text-green-700 p-4 rounded-md border border-green-200">
          {translations.saved[language]}
        </div>
      )}
      
      <div className="grid gap-8">
        {/* Language Settings */}
        <div className="border-b border-gray-200 pb-6">
          <h3 className="text-lg font-medium text-gray-800 mb-4">{translations.language[language]}</h3>
          <div className="flex space-x-4 rtl:space-x-reverse">
            <button
              onClick={toggleLanguage}
              className={`px-4 py-2 rounded-md ${language === 'en' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700'}`}
            >
              {translations.english[language]}
            </button>
            <button
              onClick={toggleLanguage}
              className={`px-4 py-2 rounded-md ${language === 'ar' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700'}`}
            >
              {translations.arabic[language]}
            </button>
          </div>
        </div>
        
        {/* Theme Settings */}
        <div className="border-b border-gray-200 pb-6">
          <h3 className="text-lg font-medium text-gray-800 mb-4">{translations.theme[language]}</h3>
          <div className="flex space-x-4 rtl:space-x-reverse">
            <button
              onClick={() => setTheme('light')}
              className={`px-4 py-2 rounded-md ${theme === 'light' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700'}`}
            >
              {translations.light[language]}
            </button>
            <button
              onClick={() => setTheme('dark')}
              className={`px-4 py-2 rounded-md ${theme === 'dark' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700'}`}
            >
              {translations.dark[language]}
            </button>
          </div>
        </div>
        
        {/* Time Format */}
        <div className="border-b border-gray-200 pb-6">
          <h3 className="text-lg font-medium text-gray-800 mb-4">{translations.timeFormat[language]}</h3>
          <div className="flex space-x-4 rtl:space-x-reverse">
            <button
              onClick={() => setTimeFormat('24h')}
              className={`px-4 py-2 rounded-md ${timeFormat === '24h' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700'}`}
            >
              {translations.hour24[language]}
            </button>
            <button
              onClick={() => setTimeFormat('12h')}
              className={`px-4 py-2 rounded-md ${timeFormat === '12h' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700'}`}
            >
              {translations.hour12[language]}
            </button>
          </div>
        </div>
        
        {/* Notifications */}
        <div className="border-b border-gray-200 pb-6">
          <h3 className="text-lg font-medium text-gray-800 mb-4">{translations.notifications[language]}</h3>
          <div className="flex space-x-4 rtl:space-x-reverse">
            <button
              onClick={() => setNotifications(true)}
              className={`px-4 py-2 rounded-md ${notifications ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700'}`}
            >
              {translations.enabled[language]}
            </button>
            <button
              onClick={() => setNotifications(false)}
              className={`px-4 py-2 rounded-md ${!notifications ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700'}`}
            >
              {translations.disabled[language]}
            </button>
          </div>
        </div>
        
        {/* API Key Setting */}
        <div className="border-b border-gray-200 pb-6">
          <h3 className="text-lg font-medium text-gray-800 mb-4">{translations.advanced[language]}</h3>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {translations.apiKey[language]}
            </label>
            <input
              type="text"
              className="w-full md:w-96 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
            />
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={handleSaveSettings}
            className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {translations.save[language]}
          </button>
          <button
            className="px-6 py-3 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            {translations.defaultValues[language]}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;