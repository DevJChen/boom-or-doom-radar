// Types for meme coin data
export interface MemeCoinData {
  timestamp: number;
  price: number;
  market_cap: number;
  volume: number;
  rsi: number;
  ema_6h: number;
  ma_6h: number;
  ema_24h?: number;
  ma_24h?: number;
  bollinger_upper: number;
  bollinger_lower: number;
  whale_transactions: number;
  forecast_price?: number | null;
  lifestage?: string;
  rolling_high_24h?: number;
  rolling_low_24h?: number;
}

export interface MemeCoin {
  symbol: string;
  name: string;
  logo: string;
  data: MemeCoinData[];
}

// List of available meme coins for search - updated to match CSV files
export const availableCoins = [
  { symbol: 'DOGE', name: 'Dogecoin', logo: '🐶' },
  { symbol: 'SHIB', name: 'Shiba Inu', logo: '🦊' },
  { symbol: 'PEPE', name: 'Pepe', logo: '🐸' },
  { symbol: 'FLOKI', name: 'Floki Inu', logo: '🐕' },
  { symbol: 'BONK', name: 'Bonk', logo: '🐕' },
  { symbol: 'WIF', name: 'Dogwifhat', logo: '🐶' },
  { symbol: 'MEME', name: 'Meme', logo: '😂' },
  { symbol: 'BABYDOGE', name: 'Baby Doge Coin', logo: '🐶' },
  { symbol: 'SAMO', name: 'Samoyedcoin', logo: '🐕' },
  { symbol: 'ELON', name: 'Dogelon Mars', logo: '👽' },
  // Additional coins from CSV files
  { symbol: 'AMC', name: 'AMC Entertainment', logo: '🎬' },
  { symbol: 'GME', name: 'GameStop', logo: '🎮' },
  { symbol: 'SLERF', name: 'Slerf', logo: '😴' },
  { symbol: 'POPCAT', name: 'Popcat', logo: '🐱' },
  { symbol: 'MYRO', name: 'Myro', logo: '🐾' },
];

// Generate mock data for a given coin (fallback if CSV loading fails)
export function generateMockData(symbol: string, days = 30): MemeCoinData[] {
  const data: MemeCoinData[] = [];
  const now = Date.now();
  let price = Math.random() * (symbol === 'DOGE' ? 0.1 : 0.00001);
  let volume = Math.random() * 1000000000;
  let market_cap = price * volume * 10;
  
  for (let i = 0; i < days * 24; i++) {
    // Create some price volatility
    const volatilityFactor = 1 + (Math.random() * 0.1 - 0.05);
    price = price * volatilityFactor;
    volume = volume * (1 + (Math.random() * 0.2 - 0.1));
    market_cap = price * volume * 10;
    
    // Calculate technical indicators
    const ema_6h = price * (1 + (Math.random() * 0.03 - 0.015));
    const ma_6h = price * (1 + (Math.random() * 0.02 - 0.01));
    
    // Create some mood swings in RSI to simulate different market conditions
    const rsi = 30 + Math.sin(i / 20) * 20 + Math.random() * 30;
    
    // Bollinger bands
    const bollinger_upper = price * (1 + 0.05 + Math.random() * 0.02);
    const bollinger_lower = price * (1 - 0.05 - Math.random() * 0.02);
    
    // Whale transactions (random spikes)
    const whale_transactions = Math.random() > 0.9 ? Math.floor(Math.random() * 5) + 1 : 0;
    
    data.push({
      timestamp: now - (days * 24 - i) * 3600 * 1000,
      price,
      market_cap,
      volume,
      rsi,
      ema_6h,
      ma_6h,
      bollinger_upper,
      bollinger_lower,
      whale_transactions
    });
  }
  
  return data;
}

// Calculate the "Boom or Doom" score (0-5 scale)
export function calculateBoomDoomScore(data: MemeCoinData[]): number {
  if (data.length < 24) return 0; // Not enough data
  
  // Take the last 24 hours of data
  const recentData = data.slice(-24);
  
  // Handle edge case where first data point has invalid values
  if (!recentData[0] || !recentData[recentData.length - 1]) return 0;
  
  try {
    // Factors to consider for the boom/doom score
    // 1. Price trend (up = good)
    const priceChange = recentData[0].price !== 0 ? 
      (recentData[recentData.length - 1].price - recentData[0].price) / recentData[0].price : 0;
    
    // 2. RSI (middle is good, extremes are bad)
    const latestRSI = recentData[recentData.length - 1].rsi || 50;
    const rsiScore = latestRSI > 70 || latestRSI < 30 ? -1 : 1;
    
    // 3. Volume trend (up = good)
    const volumeChange = recentData[0].volume !== 0 ?
      (recentData[recentData.length - 1].volume - recentData[0].volume) / recentData[0].volume : 0;
    
    // 4. Whale transactions (high = boom potential)
    const whaleActivity = recentData.reduce((sum, dataPoint) => sum + (dataPoint.whale_transactions || 0), 0);
    
    // 5. Price vs EMA (above EMA = good)
    const latestPrice = recentData[recentData.length - 1].price || 0;
    const latestEma = recentData[recentData.length - 1].ema_6h || 0;
    const emaRelation = (latestPrice > 0 && latestEma > 0) ? 
      (latestPrice > latestEma ? 1 : -1) : 0;

    // 6. Lifestage data if available
    const lifestageBonus = recentData[recentData.length - 1].lifestage?.includes('pump') ? 1 : 0;
    
    // Calculate weighted score
    let score = 0;
    score += priceChange * 2;  // Price trend is important
    score += rsiScore;
    score += volumeChange;
    score += whaleActivity * 0.2;
    score += emaRelation;
    score += lifestageBonus;
    
    // Normalize to 0-5 scale and ensure it's a valid number
    const normalizedScore = Math.max(0, Math.min(Math.round((score + 3) * 5/6), 5));
    
    return isNaN(normalizedScore) ? 0 : normalizedScore;
  } catch (error) {
    console.error("Error calculating Boom/Doom score:", error);
    return 0;
  }
}

// Format large numbers for display
export function formatNumber(num: number): string {
  if (num >= 1_000_000_000) {
    return `${(num / 1_000_000_000).toFixed(2)}B`;
  }
  if (num >= 1_000_000) {
    return `${(num / 1_000_000).toFixed(2)}M`;
  }
  if (num >= 1_000) {
    return `${(num / 1_000).toFixed(2)}K`;
  }
  return num.toFixed(2);
}

// Format price according to its magnitude
export function formatPrice(price: number): string {
  if (price < 0.00001) {
    return price.toExponential(2);
  }
  if (price < 0.001) {
    return price.toFixed(6);
  }
  if (price < 1) {
    return price.toFixed(4);
  }
  return price.toFixed(2);
}

// Get the percentage change between two values
export function getPercentageChange(oldValue: number, newValue: number): string {
  const change = ((newValue - oldValue) / oldValue) * 100;
  const sign = change >= 0 ? '+' : '';
  return `${sign}${change.toFixed(2)}%`;
}

// Get high and low prices from the last 24 hours
export function get24HHighLow(data: MemeCoinData[]): { high: number; low: number } {
  if (data.length === 0) return { high: 0, low: 0 };
  
  // If the data has rolling high/low values, use those
  if (data[data.length - 1].rolling_high_24h !== undefined && 
      data[data.length - 1].rolling_low_24h !== undefined) {
    return {
      high: data[data.length - 1].rolling_high_24h as number,
      low: data[data.length - 1].rolling_low_24h as number
    };
  }
  
  // Otherwise calculate from the data
  const last24h = data.slice(-24);
  const high = Math.max(...last24h.map(d => d.price));
  const low = Math.min(...last24h.map(d => d.price));
  
  return { high, low };
}
