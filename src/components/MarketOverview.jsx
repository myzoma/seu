import React, { useState, useEffect, useContext } from 'react';
import { fetchTopSymbols } from '../services/binanceApi';
import { LanguageContext } from '../context/LanguageContext';

const MarketOverview = () => {
  const [marketData, setMarketData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { language } = useContext(LanguageContext);
  
  const translations = {
    title: {
      en: 'Cryptocurrency Market Overview',
      ar: 'نظرة عامة على سوق العملات المشفرة'
    },
    lastUpdated: {
      en: 'Last updated',
      ar: 'آخر تحديث'
    },
    loading: {
      en: 'Loading market data...',
      ar: 'جاري تحميل بيانات السوق...'
    },
    error: {
      en: 'Error loading market data',
      ar: 'خطأ في تحميل بيانات السوق'
    },
    refresh: {
      en: 'Refresh Data',
      ar: 'تحديث البيانات'
    },
    symbol: {
      en: 'Symbol',
      ar: 'الرمز'
    },
    price: {
      en: 'Price',
      ar: 'السعر'
    },
    change: {
      en: '24h Change',
      ar: 'التغير 24 ساعة'
    },
    volume: {
      en: '24h Volume',
      ar: 'حجم التداول 24 ساعة'
    },
    elliottWave: {
      en: 'Elliott Wave Pattern',
      ar: 'نمط موجة إليوت'
    },
    pattern: {
      en: 'Pattern',
      ar: 'النمط'
    },
    confidence: {
      en: 'Confidence',
      ar: 'الثقة'
    },
    suggestion: {
      en: 'Suggestion',
      ar: 'اقتراح'
    }
  };
  
  // Simulated Elliott Wave patterns for demo
  const wavePatterns = {
    'BTCUSDT': { pattern: language === 'en' ? 'Wave 3 of 5' : 'الموجة 3 من 5', confidence: 86, suggestion: language === 'en' ? 'Strong Buy' : 'شراء قوي' },
    'ETHUSDT': { pattern: language === 'en' ? 'Wave 5 of 5' : 'الموجة 5 من 5', confidence: 78, suggestion: language === 'en' ? 'Hold/Take Profit' : 'احتفاظ/جني الأرباح' },
    'BNBUSDT': { pattern: language === 'en' ? 'Wave 2 of 5' : 'الموجة 2 من 5', confidence: 82, suggestion: language === 'en' ? 'Accumulate' : 'تجميع' },
    'ADAUSDT': { pattern: language === 'en' ? 'Wave A of ABC' : 'الموجة A من ABC', confidence: 75, suggestion: language === 'en' ? 'Sell' : 'بيع' },
    'XRPUSDT': { pattern: language === 'en' ? 'Wave B of ABC' : 'الموجة B من ABC', confidence: 68, suggestion: language === 'en' ? 'Neutral' : 'محايد' },
    'DOGEUSDT': { pattern: language === 'en' ? 'Wave 1 of 5' : 'الموجة 1 من 5', confidence: 72, suggestion: language === 'en' ? 'Buy' : 'شراء' },
    'SOLUSDT': { pattern: language === 'en' ? 'Wave 4 of 5' : 'الموجة 4 من 5', confidence: 84, suggestion: language === 'en' ? 'Accumulate' : 'تجميع' },
    'DOTUSDT': { pattern: language === 'en' ? 'Wave C of ABC' : 'الموجة C من ABC', confidence: 76, suggestion: language === 'en' ? 'Sell' : 'بيع' },
  };
  
  // Get default pattern for other coins
  const getDefaultPattern = (symbol) => {
    const randomPatterns = [
      { pattern: language === 'en' ? 'Wave 1 of 5' : 'الموجة 1 من 5', confidence: Math.floor(60 + Math.random() * 20), suggestion: language === 'en' ? 'Buy' : 'شراء' },
      { pattern: language === 'en' ? 'Wave 3 of 5' : 'الموجة 3 من 5', confidence: Math.floor(70 + Math.random() * 20), suggestion: language === 'en' ? 'Strong Buy' : 'شراء قوي' },
      { pattern: language === 'en' ? 'Wave C of ABC' : 'الموجة C من ABC', confidence: Math.floor(60 + Math.random() * 20), suggestion: language === 'en' ? 'Sell' : 'بيع' },
      { pattern: language === 'en' ? 'Wave A of ABC' : 'الموجة A من ABC', confidence: Math.floor(60 + Math.random() * 20), suggestion: language === 'en' ? 'Sell' : 'بيع' },
    ];
    
    return randomPatterns[Math.floor(Math.random() * randomPatterns.length)];
  };
  
  useEffect(() => {
    fetchMarketData();
  }, []);
  
  const fetchMarketData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await fetchTopSymbols(30);
      setMarketData(data);
      setIsLoading(false);
    } catch (err) {
      console.error('Error fetching market data:', err);
      setError(err.message || 'Failed to load market data');
      setIsLoading(false);
    }
  };
  
  // Format price based on value
  const formatPrice = (price) => {
    if (price < 0.1) {
      return '$' + price.toFixed(6);
    } else if (price < 100) {
      return '$' + price.toFixed(4);
    } else {
      return '$' + price.toFixed(2);
    }
  };
  
  // Format volume for display
  const formatVolume = (volume) => {
    if (volume >= 1000000000) {
      return `$${(volume / 1000000000).toFixed(2)}B`;
    } else if (volume >= 1000000) {
      return `$${(volume / 1000000).toFixed(2)}M`;
    } else {
      return `$${(volume / 1000).toFixed(2)}K`;
    }
  };
  
  // Get color for percent change
  const getChangeColor = (change) => {
    if (change > 0) {
      return 'text-green-600';
    } else if (change < 0) {
      return 'text-red-600';
    }
    return 'text-gray-600';
  };
  
  // Get color for suggestion
  const getSuggestionColor = (suggestion) => {
    const text = suggestion.toLowerCase();
    if (text.includes('buy') || text.includes('شراء')) {
      return 'text-green-600';
    } else if (text.includes('sell') || text.includes('بيع')) {
      return 'text-red-600';
    }
    return 'text-yellow-600';
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">{translations.title[language]}</h2>
        <div className="flex items-center">
          <span className="text-sm text-gray-500 mr-4">
            {translations.lastUpdated[language]}: {new Date().toLocaleString(language === 'ar' ? 'ar-SA' : 'en-US')}
          </span>
          <button
            onClick={fetchMarketData}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-blue-300"
            disabled={isLoading}
          >
            {translations.refresh[language]}
          </button>
        </div>
      </div>
      
      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-md border border-red-200">
          {translations.error[language]}: {error}
        </div>
      )}
      
      {isLoading ? (
        <div className="flex items-center justify-center h-64 bg-white rounded-lg shadow">
          <div className="text-gray-500">{translations.loading[language]}</div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full" dir={language === 'ar' ? 'rtl' : 'ltr'}>
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {translations.symbol[language]}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {translations.price[language]}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {translations.change[language]}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {translations.volume[language]}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" colSpan={3}>
                    {translations.elliottWave[language]}
                  </th>
                </tr>
                <tr className="bg-gray-50">
                  <th className="px-6 py-3"></th>
                  <th className="px-6 py-3"></th>
                  <th className="px-6 py-3"></th>
                  <th className="px-6 py-3"></th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {translations.pattern[language]}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {translations.confidence[language]}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {translations.suggestion[language]}
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {marketData.map((coin) => {
                  const waveData = wavePatterns[coin.symbol] || getDefaultPattern(coin.symbol);
                  
                  return (
                    <tr key={coin.symbol} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {coin.symbol}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {formatPrice(parseFloat(coin.lastPrice))}
                      </td>
                      <td className={`px-6 py-4 whitespace-nowrap text-sm ${getChangeColor(parseFloat(coin.priceChangePercent))}`}>
                        {parseFloat(coin.priceChangePercent).toFixed(2)}%
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {formatVolume(parseFloat(coin.quoteVolume))}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-700">
                        {waveData.pattern}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div className="flex items-center">
                          <div className="w-16 bg-gray-200 rounded-full h-2.5 mr-2">
                            <div 
                              className={`h-2.5 rounded-full ${waveData.confidence > 80 ? 'bg-green-500' : waveData.confidence > 70 ? 'bg-blue-500' : 'bg-yellow-500'}`} 
                              style={{ width: `${waveData.confidence}%` }}
                            ></div>
                          </div>
                          <span>{waveData.confidence}%</span>
                        </div>
                      </td>
                      <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${getSuggestionColor(waveData.suggestion)}`}>
                        {waveData.suggestion}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default MarketOverview;