import React, { useState, useEffect, useContext } from 'react';
import { LanguageContext } from '../../context/LanguageContext';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Label,
  LabelList
} from 'recharts';
import ElliottWaveAnalyzer from '../../utils/elliottWaveAnalyzer';
import { fetchKlines } from '../../services/binanceApi';

const ElliottWaveChart = ({ symbol = 'BTCUSDT', timeframe = '1d', height = 400 }) => {
  const [priceData, setPriceData] = useState([]);
  const [analysis, setAnalysis] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showFibonacci, setShowFibonacci] = useState(true);
  const { language } = useContext(LanguageContext);
  
  const translations = {
    price: {
      en: 'Price',
      ar: 'السعر'
    },
    date: {
      en: 'Date',
      ar: 'التاريخ'
    },
    patternDetected: {
      en: 'Pattern Detected',
      ar: 'النمط المكتشف'
    },
    confidence: {
      en: 'Confidence',
      ar: 'مستوى الثقة'
    },
    prediction: {
      en: 'Prediction',
      ar: 'التنبؤ'
    },
    target: {
      en: 'Target',
      ar: 'الهدف'
    },
    loading: {
      en: 'Loading chart data...',
      ar: 'جاري تحميل بيانات الرسم البياني...'
    },
    noPattern: {
      en: 'No clear Elliott Wave pattern detected',
      ar: 'لم يتم اكتشاف نمط واضح لموجة إليوت'
    },
    error: {
      en: 'Error loading chart data',
      ar: 'خطأ في تحميل بيانات الرسم البياني'
    },
    fibonacci: {
      en: 'Fibonacci Levels',
      ar: 'مستويات فيبوناتشي'
    },
    toggleFib: {
      en: 'Toggle Fibonacci',
      ar: 'تبديل فيبوناتشي'
    }
  };
  
  useEffect(() => {
    loadChartData();
  }, [symbol, timeframe]);
  
  const loadChartData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const klines = await fetchKlines(symbol, timeframe, 100);
      
      // Format data for chart
      const formattedData = klines.map((kline, index) => ({
        date: new Date(kline.time).toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US'),
        time: kline.time,
        open: kline.open,
        high: kline.high,
        low: kline.low,
        close: kline.close,
        volume: kline.volume,
        index
      }));
      
      setPriceData(formattedData);
      
      // Analyze data for Elliott Wave patterns
      const analyzer = new ElliottWaveAnalyzer();
      const waveAnalysis = analyzer.analyzeWaves(klines);
      setAnalysis(waveAnalysis);
      
      setIsLoading(false);
    } catch (err) {
      console.error('Error loading chart data:', err);
      setError(err.message || 'Failed to load chart data');
      setIsLoading(false);
    }
  };
  
  // Format price for tooltip display
  const formatPrice = (price) => {
    if (price < 0.1) {
      return '$' + price.toFixed(6);
    } else if (price < 100) {
      return '$' + price.toFixed(4);
    } else {
      return '$' + price.toFixed(2);
    }
  };
  
  // Custom tooltip for chart
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 shadow-md rounded">
          <p className="font-medium">{label}</p>
          <p className="text-green-600">
            {translations.price[language]}: {formatPrice(payload[0].value)}
          </p>
        </div>
      );
    }
    return null;
  };
  
  // Generate Fibonacci levels if analysis is available
  const fibonacciLevels = () => {
    if (!analysis || !analysis.waveLabels || analysis.waveLabels.length < 2 || !showFibonacci) {
      return [];
    }
    
    // Use the last two wave points for Fibonacci retracement levels
    const startPoint = analysis.waveLabels[analysis.waveLabels.length - 2];
    const endPoint = analysis.waveLabels[analysis.waveLabels.length - 1];
    
    if (!startPoint || !endPoint) return [];
    
    const startPrice = startPoint.price;
    const endPrice = endPoint.price;
    const diff = endPrice - startPrice;
    
    // Calculate key Fibonacci levels
    return [
      { level: 0, value: endPrice, label: '0%' },
      { level: 0.236, value: endPrice - diff * 0.236, label: '23.6%' },
      { level: 0.382, value: endPrice - diff * 0.382, label: '38.2%' },
      { level: 0.5, value: endPrice - diff * 0.5, label: '50.0%' },
      { level: 0.618, value: endPrice - diff * 0.618, label: '61.8%' },
      { level: 0.786, value: endPrice - diff * 0.786, label: '78.6%' },
      { level: 1, value: startPrice, label: '100%' }
    ];
  };
  
  // Map wave labels to chart data points
  const mapWaveLabels = () => {
    if (!analysis || !analysis.waveLabels || !priceData.length) return [];
    
    return analysis.waveLabels.map(wave => ({
      index: wave.index,
      close: wave.price,
      label: wave.label
    }));
  };
  
  // Generate a custom data point for prediction if available
  const getPredictionPoint = () => {
    if (!analysis || !analysis.predictions) return null;
    
    const lastDataPoint = priceData[priceData.length - 1];
    return {
      date: 'Target',
      close: analysis.predictions.target,
      predicted: true
    };
  };
  
  // Merge data with prediction for chart display
  const chartData = () => {
    const prediction = getPredictionPoint();
    if (prediction) {
      return [...priceData, prediction];
    }
    return priceData;
  };
  
  // Get the min and max values for YAxis domain
  const getYAxisDomain = () => {
    if (!priceData.length) return [0, 0];
    
    let min = Math.min(...priceData.map(p => p.low || p.close));
    let max = Math.max(...priceData.map(p => p.high || p.close));
    
    // Add prediction if available
    if (analysis && analysis.predictions) {
      min = Math.min(min, analysis.predictions.target);
      max = Math.max(max, analysis.predictions.target);
    }
    
    // Add some padding
    const padding = (max - min) * 0.1;
    return [min - padding, max + padding];
  };
  
  return (
    <div className="bg-white rounded-lg shadow p-4 mb-6">
      <div className="flex flex-wrap items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-gray-800">
          {symbol} - {timeframe === '1d' ? language === 'en' ? 'Daily' : 'يومي' : 
                    timeframe === '4h' ? '4' + (language === 'en' ? ' Hours' : ' ساعات') : 
                    timeframe === '1h' ? language === 'en' ? '1 Hour' : 'ساعة واحدة' : 
                    timeframe}
        </h3>
        
        {analysis && analysis.confidence > 0 && (
          <div className="flex flex-wrap items-center">
            <div className="ml-4 text-sm">
              <span className="font-medium">{translations.patternDetected[language]}: </span>
              <span className="text-blue-600 font-medium">{analysis.pattern}</span>
            </div>
            <div className="ml-4 text-sm">
              <span className="font-medium">{translations.confidence[language]}: </span>
              <span className="text-green-600 font-medium">{analysis.confidence}%</span>
            </div>
            <button
              onClick={() => setShowFibonacci(!showFibonacci)}
              className="ml-4 px-2 py-1 text-xs bg-gray-100 text-gray-800 rounded hover:bg-gray-200"
            >
              {translations.toggleFib[language]}
            </button>
          </div>
        )}
      </div>
      
      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">{translations.loading[language]}</div>
        </div>
      ) : error ? (
        <div className="bg-red-50 text-red-700 p-4 rounded-md border border-red-200">
          {translations.error[language]}: {error}
        </div>
      ) : analysis && analysis.confidence > 30 ? (
        <div>
          <div style={{ height }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={chartData()}
                margin={{ top: 20, right: 30, left: 20, bottom: 30 }}
              >
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis 
                  dataKey="date" 
                  tick={{ fontSize: 10 }} 
                  tickCount={6} 
                  padding={{ left: 10, right: 10 }} 
                />
                <YAxis 
                  domain={getYAxisDomain()}
                  tickFormatter={formatPrice} 
                  orientation={language === 'ar' ? 'right' : 'left'} 
                />
                <Tooltip content={<CustomTooltip />} />
                
                {/* Main price line */}
                <Line 
                  type="monotone" 
                  dataKey="close" 
                  stroke="#2563eb" 
                  strokeWidth={2} 
                  dot={false} 
                  activeDot={{ r: 6 }} 
                />
                
                {/* Wave labels as dots */}
                {analysis.waveLabels.map((wave, index) => {
                  const dataIndex = priceData.findIndex(p => p.index === wave.index);
                  if (dataIndex === -1) return null;
                  
                  return (
                    <Line
                      key={`wave-${index}`}
                      data={[priceData[dataIndex]]}
                      dataKey="close"
                      stroke="none"
                      dot={{
                        r: 6,
                        fill: '#f59e0b',
                        stroke: '#d97706',
                        strokeWidth: 1
                      }}
                    >
                      <LabelList 
                        dataKey="index" 
                        position="top" 
                        content={(props) => {
                          const { x, y, value } = props;
                          return (
                            <text 
                              x={x} 
                              y={y - 10} 
                              fill="#000" 
                              textAnchor="middle" 
                              fontSize={12}
                              fontWeight="bold"
                            >
                              {wave.label}
                            </text>
                          );
                        }} 
                      />
                    </Line>
                  );
                })}
                
                {/* Prediction point if available */}
                {analysis.predictions && (
                  <Line
                    data={[getPredictionPoint()]}
                    dataKey="close"
                    stroke="none"
                    dot={{
                      r: 7,
                      fill: '#10b981',
                      stroke: '#059669',
                      strokeWidth: 2
                    }}
                  >
                    <LabelList 
                      dataKey="close" 
                      position="top" 
                      content={(props) => {
                        const { x, y, value } = props;
                        return (
                          <g>
                            <text 
                              x={x} 
                              y={y - 25} 
                              fill="#059669" 
                              textAnchor="middle" 
                              fontSize={12}
                              fontWeight="bold"
                            >
                              {translations.target[language]}
                            </text>
                            <text 
                              x={x} 
                              y={y - 10} 
                              fill="#059669" 
                              textAnchor="middle" 
                              fontSize={12}
                            >
                              {formatPrice(value)}
                            </text>
                          </g>
                        );
                      }} 
                    />
                  </Line>
                )}
                
                {/* Fibonacci levels */}
                {showFibonacci && fibonacciLevels().map((level, index) => (
                  <ReferenceLine 
                    key={`fib-${index}`} 
                    y={level.value} 
                    stroke="#9ca3af" 
                    strokeDasharray="3 3"
                    strokeOpacity={0.6}
                  >
                    <Label 
                      value={`${level.label}`} 
                      position={language === 'ar' ? 'insideLeft' : 'insideRight'} 
                      fill="#9ca3af"
                      fontSize={10}
                    />
                  </ReferenceLine>
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
          
          {/* Prediction info if available */}
          {analysis.predictions && (
            <div className="mt-4 p-3 bg-green-50 border border-green-100 rounded-md">
              <h4 className="font-medium text-green-800 mb-1">{translations.prediction[language]}</h4>
              <div className="flex items-center">
                <span className="text-sm text-gray-600">{translations.target[language]}: </span>
                <span className="text-sm font-medium text-green-700 ml-2">{formatPrice(analysis.predictions.target)}</span>
                <span className="text-sm text-gray-600 ml-4">{translations.confidence[language]}: </span>
                <span className="text-sm font-medium text-green-700 ml-2">{Math.round(analysis.predictions.confidence)}%</span>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="flex items-center justify-center h-64 bg-gray-50 rounded-md">
          <div className="text-gray-500">{translations.noPattern[language]}</div>
        </div>
      )}
    </div>
  );
};

export default ElliottWaveChart;