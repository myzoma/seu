import React, { useState, useEffect, useContext } from 'react';
import { LanguageContext } from '../context/LanguageContext';
import ElliottWaveChart from './charts/ElliottWaveChart';
import StatsCard from './StatsCard';
import { fetchTopSymbols, fetchKlines } from '../services/binanceApi';

const Dashboard = () => {
  const { language } = useContext(LanguageContext);
  const [marketData, setMarketData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const translations = {
    welcome: {
      en: 'Welcome to Elliott Wave Analyzer',
      ar: 'مرحبًا بك في محلل موجة إليوت'
    },
    subtitle: {
      en: 'Advanced cryptocurrency market analysis using Elliott Wave Theory',
      ar: 'تحليل متقدم لسوق العملات المشفرة باستخدام نظرية موجة إليوت'
    },
    marketOverview: {
      en: 'Market Overview',
      ar: 'نظرة عامة على السوق'
    },
    btcAnalysis: {
      en: 'Bitcoin Elliott Wave Analysis',
      ar: 'تحليل موجة إليوت لبيتكوين'
    },
    ethAnalysis: {
      en: 'Ethereum Elliott Wave Analysis',
      ar: 'تحليل موجة إليوت للإيثريوم'
    },
    topGainers: {
      en: 'Top Gainers',
      ar: 'أعلى الرابحين'
    },
    topLosers: {
      en: 'Top Losers',
      ar: 'أعلى الخاسرين'
    },
    marketStats: {
      en: 'Market Statistics',
      ar: 'إحصائيات السوق'
    },
    marketCap: {
      en: 'Total Market Cap',
      ar: 'القيمة السوقية الإجمالية'
    },
    btcDominance: {
      en: 'BTC Dominance',
      ar: 'هيمنة البيتكوين'
    },
    ethDominance: {
      en: 'ETH Dominance',
      ar: 'هيمنة الإيثيريوم'
    },
    volume24h: {
      en: '24h Volume',
      ar: 'حجم التداول 24 ساعة'
    },
    loading: {
      en: 'Loading data...',
      ar: 'جاري تحميل البيانات...'
    }
  };
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const data = await fetchTopSymbols(20);
        setMarketData(data);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching market data:', error);
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  // Calculate market stats from the fetched data
  const marketStats = React.useMemo(() => {
    if (!marketData.length) return null;
    
    const totalVolume = marketData.reduce((sum, coin) => sum + parseFloat(coin.quoteVolume), 0);
    const btcData = marketData.find(coin => coin.symbol === 'BTCUSDT');
    const ethData = marketData.find(coin => coin.symbol === 'ETHUSDT');
    
    // Calculate simple estimate of BTC and ETH market dominance
    const btcPrice = btcData ? parseFloat(btcData.lastPrice) : 0;
    const ethPrice = ethData ? parseFloat(ethData.lastPrice) : 0;
    const btcVolume = btcData ? parseFloat(btcData.quoteVolume) : 0;
    const ethVolume = ethData ? parseFloat(ethData.quoteVolume) : 0;
    
    const btcDominance = totalVolume > 0 ? (btcVolume / totalVolume) * 100 : 0;
    const ethDominance = totalVolume > 0 ? (ethVolume / totalVolume) * 100 : 0;
    
    return {
      totalVolume,
      btcDominance,
      ethDominance,
      estimatedMarketCap: totalVolume * 7, // Simple estimate
      btcPrice,
      ethPrice
    };
  }, [marketData]);
  
  // Sort data for top gainers and losers
  const topGainers = React.useMemo(() => {
    if (!marketData.length) return [];
    return [...marketData]
      .sort((a, b) => parseFloat(b.priceChangePercent) - parseFloat(a.priceChangePercent))
      .slice(0, 5);
  }, [marketData]);
  
  const topLosers = React.useMemo(() => {
    if (!marketData.length) return [];
    return [...marketData]
      .sort((a, b) => parseFloat(a.priceChangePercent) - parseFloat(b.priceChangePercent))
      .slice(0, 5);
  }, [marketData]);
  
  // Format large numbers for display
  const formatLargeNumber = (num) => {
    if (num >= 1000000000) {
      return `$${(num / 1000000000).toFixed(2)}B`;
    } else if (num >= 1000000) {
      return `$${(num / 1000000).toFixed(2)}M`;
    } else {
      return `$${(num / 1000).toFixed(2)}K`;
    }
  };
  
  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">{translations.welcome[language]}</h1>
        <p className="text-gray-600">{translations.subtitle[language]}</p>
      </div>
      
      {/* Stats Cards */}
      {isLoading ? (
        <div className="flex justify-center items-center h-32 bg-white rounded-lg shadow">
          <div className="text-gray-500">{translations.loading[language]}</div>
        </div>
      ) : marketStats ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatsCard 
            title={translations.marketCap[language]}
            value={formatLargeNumber(marketStats.estimatedMarketCap)}
            change={2.5}
            changeType="up"
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 20 20" fill="currentColor">
                <path d="M3 12v3c0 1.657 3.134 3 7 3s7-1.343 7-3v-3c0 1.657-3.134 3-7 3s-7-1.343-7-3z" />
                <path d="M3 7v3c0 1.657 3.134 3 7 3s7-1.343 7-3V7c0 1.657-3.134 3-7 3S3 8.657 3 7z" />
                <path d="M17 5c0 1.657-3.134 3-7 3S3 6.657 3 5s3.134-3 7-3 7 1.343 7 3z" />
              </svg>
            }
          />
          <StatsCard 
            title={translations.btcDominance[language]}
            value={`${marketStats.btcDominance.toFixed(2)}%`}
            change={-0.8}
            changeType="down"
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 24 24" fill="currentColor">
                <path d="M11.5 11.5v-2.5c1.75 0 2.789.215 2.789 1.25 0 .909-.764 1.25-2.789 1.25zm0 .705c2.416 0 3.337.438 3.337 1.545 0 .992-1.006 1.5-3.337 1.5v-3.045z"/>
                <path d="M12 1c-6.338 0-12 4.226-12 10.007 0 2.05.739 4.063 2.047 5.625l-1.993 6.368 6.946-3c1.705.439 3.334.7 4.999.7 7.222 0 12-4.225 12-10.007 0-5.79-5.122-10.693-12-10.693zm0 19.062c-1.492 0-2.922-.241-4.312-.644l-4.295 1.857 1.239-3.956c-1.128-1.264-1.771-2.862-1.771-4.575 0-4.521 4.376-8.15 9.138-8.15 5.085 0 9.138 3.629 9.138 8.15s-4.053 8.317-9.138 8.317z"/>
              </svg>
            }
          />
          <StatsCard 
            title={translations.ethDominance[language]}
            value={`${marketStats.ethDominance.toFixed(2)}%`}
            change={1.2}
            changeType="up"
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm-.144 19.312l-5.545-3.328 5.545 7.965 5.545-7.965-5.545 3.328zm0-1.32l5.545-3.328-5.545-2.297-5.545 2.297 5.545 3.328zm0-9.317l-5.545 5.944 5.545-2.625 5.545 2.625-5.545-5.944z"/>
              </svg>
            }
          />
          <StatsCard 
            title={translations.volume24h[language]}
            value={formatLargeNumber(marketStats.totalVolume)}
            change={5.7}
            changeType="up"
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
              </svg>
            }
          />
        </div>
      ) : null}
      
      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Left Column - Market Stats */}
        <div className="lg:col-span-2 space-y-6">
          {/* Top Gainers */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="p-4 bg-green-50 border-b border-green-100">
              <h3 className="text-lg font-medium text-green-800">
                {translations.topGainers[language]}
              </h3>
            </div>
            <div className="p-4">
              <div className="overflow-x-auto">
                <table className="min-w-full" dir={language === 'ar' ? 'rtl' : 'ltr'}>
                  <thead>
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Symbol
                      </th>
                      <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Price
                      </th>
                      <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        24h %
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {topGainers.map((coin) => (
                      <tr key={coin.symbol} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm font-medium">
                          {coin.symbol}
                        </td>
                        <td className="px-4 py-3 text-sm text-right">
                          ${parseFloat(coin.lastPrice).toFixed(coin.lastPrice < 1 ? 4 : 2)}
                        </td>
                        <td className="px-4 py-3 text-sm font-medium text-green-600 text-right">
                          +{parseFloat(coin.priceChangePercent).toFixed(2)}%
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          
          {/* Top Losers */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="p-4 bg-red-50 border-b border-red-100">
              <h3 className="text-lg font-medium text-red-800">
                {translations.topLosers[language]}
              </h3>
            </div>
            <div className="p-4">
              <div className="overflow-x-auto">
                <table className="min-w-full" dir={language === 'ar' ? 'rtl' : 'ltr'}>
                  <thead>
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Symbol
                      </th>
                      <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Price
                      </th>
                      <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        24h %
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {topLosers.map((coin) => (
                      <tr key={coin.symbol} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm font-medium">
                          {coin.symbol}
                        </td>
                        <td className="px-4 py-3 text-sm text-right">
                          ${parseFloat(coin.lastPrice).toFixed(coin.lastPrice < 1 ? 4 : 2)}
                        </td>
                        <td className="px-4 py-3 text-sm font-medium text-red-600 text-right">
                          {parseFloat(coin.priceChangePercent).toFixed(2)}%
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
        
        {/* Right Column - Elliott Wave Charts */}
        <div className="lg:col-span-3 space-y-6">
          {/* Bitcoin Chart */}
          <div>
            <h3 className="text-lg font-medium text-gray-800 mb-4">
              {translations.btcAnalysis[language]}
            </h3>
            <ElliottWaveChart symbol="BTCUSDT" timeframe="1d" height={320} />
          </div>
          
          {/* Ethereum Chart */}
          <div>
            <h3 className="text-lg font-medium text-gray-800 mb-4">
              {translations.ethAnalysis[language]}
            </h3>
            <ElliottWaveChart symbol="ETHUSDT" timeframe="1d" height={320} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;