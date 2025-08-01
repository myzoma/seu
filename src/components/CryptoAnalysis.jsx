import React, { useState, useEffect, useContext } from 'react';
import ElliottWaveChart from './charts/ElliottWaveChart';
import { fetchSymbols } from '../services/binanceApi';
import { LanguageContext } from '../context/LanguageContext';

const CryptoAnalysis = () => {
  const [symbols, setSymbols] = useState([]);
  const [selectedSymbol, setSelectedSymbol] = useState('BTCUSDT');
  const [selectedTimeframe, setSelectedTimeframe] = useState('1d');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { language } = useContext(LanguageContext);
  
  const timeframes = [
    { value: '1d', label: { en: '1 Day', ar: 'يوم واحد' } },
    { value: '4h', label: { en: '4 Hours', ar: '4 ساعات' } },
    { value: '1h', label: { en: '1 Hour', ar: 'ساعة واحدة' } },
    { value: '30m', label: { en: '30 Minutes', ar: '30 دقيقة' } },
    { value: '15m', label: { en: '15 Minutes', ar: '15 دقيقة' } }
  ];
  
  const popularCoins = [
    'BTCUSDT', 'ETHUSDT', 'BNBUSDT', 'ADAUSDT', 'XRPUSDT', 
    'SOLUSDT', 'DOGEUSDT', 'DOTUSDT', 'SHIBUSDT', 'MATICUSDT'
  ];
  
  const translations = {
    title: {
      en: 'Elliott Wave Cryptocurrency Analysis',
      ar: 'تحليل العملات المشفرة باستخدام موجة إليوت'
    },
    selectCrypto: {
      en: 'Select Cryptocurrency',
      ar: 'اختر العملة المشفرة'
    },
    timeframe: {
      en: 'Timeframe',
      ar: 'الإطار الزمني'
    },
    popularCoins: {
      en: 'Popular Cryptocurrencies',
      ar: 'العملات المشفرة الشائعة'
    },
    searchSymbols: {
      en: 'Search symbols...',
      ar: 'البحث عن الرموز...'
    },
    loading: {
      en: 'Loading available trading pairs...',
      ar: 'جاري تحميل أزواج التداول المتاحة...'
    },
    error: {
      en: 'Error loading trading pairs',
      ar: 'خطأ في تحميل أزواج التداول'
    },
    noResults: {
      en: 'No results found',
      ar: 'لم يتم العثور على نتائج'
    },
    about: {
      en: 'About Elliott Wave Analysis',
      ar: 'نبذة عن تحليل موجة إليوت'
    },
    aboutContent: {
      en: 'Elliott Wave Theory is a form of technical analysis that looks for recurrent price patterns and investor psychology manifested as waves in the market price data. This analysis identifies impulse waves (5-wave structures) and corrective waves (3-wave structures) to predict future price movements.',
      ar: 'نظرية موجة إليوت هي شكل من أشكال التحليل الفني الذي يبحث عن أنماط الأسعار المتكررة وعلم نفس المستثمر التي تظهر على شكل موجات في بيانات أسعار السوق. يحدد هذا التحليل موجات الاندفاع (هياكل من 5 موجات) وموجات التصحيح (هياكل من 3 موجات) للتنبؤ بحركات الأسعار المستقبلية.'
    },
    keyPrinciples: {
      en: 'Key Principles:',
      ar: 'المبادئ الرئيسية:'
    },
    principles: {
      en: [
        'Wave 2 never retraces more than 100% of Wave 1',
        'Wave 3 is never the shortest among Waves 1, 3, and 5',
        'Wave 4 never overlaps with the price territory of Wave 1',
        'The Fibonacci sequence provides targets for retracements and extensions'
      ],
      ar: [
        'الموجة 2 لا تتراجع أبدًا أكثر من 100% من الموجة 1',
        'الموجة 3 ليست أبدًا الأقصر بين الموجات 1 و 3 و 5',
        'الموجة 4 لا تتداخل أبدًا مع منطقة سعر الموجة 1',
        'تسلسل فيبوناتشي يوفر أهدافًا للتراجعات والتمديدات'
      ]
    },
    disclaimer: {
      en: 'Disclaimer: This analysis is for informational purposes only and should not be considered financial advice. Always conduct your own research before making investment decisions.',
      ar: 'إخلاء المسؤولية: هذا التحليل لأغراض إعلامية فقط ولا ينبغي اعتباره نصيحة مالية. قم دائمًا بإجراء البحث الخاص بك قبل اتخاذ قرارات الاستثمار.'
    }
  };
  
  useEffect(() => {
    loadSymbols();
  }, []);
  
  const loadSymbols = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const availableSymbols = await fetchSymbols();
      setSymbols(availableSymbols);
      setIsLoading(false);
    } catch (err) {
      console.error('Error fetching symbols:', err);
      setError(err.message || 'Failed to load trading pairs');
      setIsLoading(false);
    }
  };
  
  const [searchQuery, setSearchQuery] = useState('');
  
  const filteredSymbols = searchQuery.trim() === '' 
    ? symbols 
    : symbols.filter(symbol => 
        symbol.toLowerCase().includes(searchQuery.toLowerCase())
      );
  
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">{translations.title[language]}</h2>
      
      {/* Selection Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-800 mb-4">{translations.selectCrypto[language]}</h3>
          
          {/* Popular coins quick selection */}
          <div className="mb-4">
            <h4 className="text-sm font-medium text-gray-600 mb-2">{translations.popularCoins[language]}</h4>
            <div className="flex flex-wrap gap-2">
              {popularCoins.map(coin => (
                <button
                  key={coin}
                  onClick={() => setSelectedSymbol(coin)}
                  className={`px-3 py-1.5 text-xs rounded-md ${
                    selectedSymbol === coin ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                  }`}
                >
                  {coin.replace('USDT', '')}
                </button>
              ))}
            </div>
          </div>
          
          {/* Search input */}
          <div className="relative mb-4">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </div>
            <input
              type="text"
              placeholder={translations.searchSymbols[language]}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              dir={language === 'ar' ? 'rtl' : 'ltr'}
            />
          </div>
          
          {/* Symbol select dropdown */}
          <div className="mb-6">
            {isLoading ? (
              <div className="text-sm text-gray-500">{translations.loading[language]}</div>
            ) : error ? (
              <div className="text-sm text-red-500">{translations.error[language]}: {error}</div>
            ) : (
              <select
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={selectedSymbol}
                onChange={(e) => setSelectedSymbol(e.target.value)}
                dir={language === 'ar' ? 'rtl' : 'ltr'}
              >
                {filteredSymbols.length > 0 ? (
                  filteredSymbols.map(symbol => (
                    <option key={symbol} value={symbol}>{symbol}</option>
                  ))
                ) : (
                  <option value="" disabled>{translations.noResults[language]}</option>
                )}
              </select>
            )}
          </div>
          
          {/* Timeframe selection */}
          <div>
            <h4 className="text-sm font-medium text-gray-600 mb-2">{translations.timeframe[language]}</h4>
            <div className="flex flex-wrap gap-2">
              {timeframes.map(tf => (
                <button
                  key={tf.value}
                  onClick={() => setSelectedTimeframe(tf.value)}
                  className={`px-3 py-1.5 text-xs rounded-md ${
                    selectedTimeframe === tf.value ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                  }`}
                >
                  {tf.label[language]}
                </button>
              ))}
            </div>
          </div>
        </div>
        
        {/* Information panel */}
        <div className="bg-white rounded-lg shadow p-6" dir={language === 'ar' ? 'rtl' : 'ltr'}>
          <h3 className="text-lg font-medium text-gray-800 mb-4">{translations.about[language]}</h3>
          <p className="text-gray-600 mb-4">
            {translations.aboutContent[language]}
          </p>
          <h4 className="text-md font-medium text-gray-800 mb-2">{translations.keyPrinciples[language]}</h4>
          <ul className="list-disc list-inside space-y-1 mb-4">
            {translations.principles[language].map((principle, index) => (
              <li key={index} className="text-gray-600 text-sm">{principle}</li>
            ))}
          </ul>
          <div className="text-xs text-gray-500 italic">
            {translations.disclaimer[language]}
          </div>
        </div>
      </div>
      
      {/* Elliott Wave Chart */}
      <ElliottWaveChart symbol={selectedSymbol} timeframe={selectedTimeframe} height={500} />
    </div>
  );
};

export default CryptoAnalysis;