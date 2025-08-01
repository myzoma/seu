/**
 * Binance API Service
 * Provides functions to fetch cryptocurrency market data from the Binance API
 */

// Fetch top trading symbols by volume
export const fetchTopSymbols = async (limit = 20) => {
  try {
    const response = await fetch('https://api.binance.com/api/v3/ticker/24hr');
    
    if (!response.ok) {
      throw new Error(`Failed to fetch data: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    
    // Sort by quote volume (USDT volume)
    const usdtPairs = data
      .filter(pair => pair.symbol.endsWith('USDT'))
      .sort((a, b) => parseFloat(b.quoteVolume) - parseFloat(a.quoteVolume))
      .slice(0, limit);
      
    return usdtPairs;
  } catch (error) {
    console.error('Error fetching top symbols:', error);
    throw error;
  }
};

// Fetch available trading symbols
export const fetchSymbols = async () => {
  try {
    const response = await fetch('https://api.binance.com/api/v3/exchangeInfo');
    
    if (!response.ok) {
      throw new Error(`Failed to fetch symbols: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    
    // Filter for USDT trading pairs only
    const usdtPairs = data.symbols
      .filter(pair => pair.symbol.endsWith('USDT') && pair.status === 'TRADING')
      .map(pair => pair.symbol);
      
    return usdtPairs;
  } catch (error) {
    console.error('Error fetching symbols:', error);
    throw error;
  }
};

// Fetch candlestick data for a specific symbol and timeframe
export const fetchKlines = async (symbol, interval, limit = 100) => {
  try {
    const response = await fetch(
      `https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=${interval}&limit=${limit}`
    );
    
    if (!response.ok) {
      throw new Error(`Failed to fetch klines: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    
    // Transform kline data to a more usable format
    const formattedData = data.map(kline => ({
      time: kline[0], // Open time
      open: parseFloat(kline[1]),
      high: parseFloat(kline[2]),
      low: parseFloat(kline[3]),
      close: parseFloat(kline[4]),
      volume: parseFloat(kline[5]),
      closeTime: kline[6],
      quoteVolume: parseFloat(kline[7]),
      trades: kline[8],
      takerBuyBaseVolume: parseFloat(kline[9]),
      takerBuyQuoteVolume: parseFloat(kline[10])
    }));
    
    return formattedData;
  } catch (error) {
    console.error(`Error fetching klines for ${symbol}:`, error);
    throw error;
  }
};

// Fetch current price for a symbol
export const fetchCurrentPrice = async (symbol) => {
  try {
    const response = await fetch(`https://api.binance.com/api/v3/ticker/price?symbol=${symbol}`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch price: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    return parseFloat(data.price);
  } catch (error) {
    console.error(`Error fetching price for ${symbol}:`, error);
    throw error;
  }
};