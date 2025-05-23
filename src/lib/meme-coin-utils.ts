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
  lifestage_x?: string;
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
  { symbol: 'ACT', name: 'ACT', logo: '🎭' },
  { symbol: 'AI16Z', name: 'AI16Z', logo: '🤖' },
  { symbol: 'AMC', name: 'AMC', logo: '🎬' },
  { symbol: 'AVA', name: 'AVA', logo: '🌟' },
  { symbol: 'BABYDOGE', name: 'Baby Doge', logo: '🐕' },
  { symbol: 'BERTRAM', name: 'Bertram', logo: '🎩' },
  { symbol: 'BDFINK', name: 'BDFink', logo: '🎨' },
  { symbol: 'BHOLE', name: 'BHole', logo: '🕳️' },
  { symbol: 'BOME', name: 'Bome', logo: '💥' },
  { symbol: 'BONK', name: 'Bonk', logo: '🐕' },
  { symbol: 'CHILL', name: 'Chill', logo: '😎' },
  { symbol: 'COMEDIAN', name: 'Comedian', logo: '🎭' },
  { symbol: 'FART', name: 'Fart', logo: '💨' },
  { symbol: 'FARTBOY', name: 'Fart Boy', logo: '💨' },
  { symbol: 'FLOTUS', name: 'FLOTUS', logo: '👑' },
  { symbol: 'FWOG', name: 'Fwog', logo: '🐸' },
  { symbol: 'GIGACHAD', name: 'Gigachad', logo: '💪' },
  { symbol: 'GME', name: 'GameStop', logo: '🎮' },
  { symbol: 'GOAT', name: 'GOAT', logo: '🐐' },
  { symbol: 'HYSK', name: 'HYSK', logo: '🎯' },
  { symbol: 'KWEEN', name: 'Kween', logo: '👑' },
  { symbol: 'LIBRA', name: 'Libra', logo: '⚖️' },
  { symbol: 'MANEKI', name: 'Maneki', logo: '🐱' },
  { symbol: 'MCDULL', name: 'McDull', logo: '🐷' },
  { symbol: 'MGTX', name: 'MGTX', logo: '💎' },
  { symbol: 'MEW', name: 'MEW', logo: '🐱' },
  { symbol: 'MICHI', name: 'Michi', logo: '🐱' },
  { symbol: 'MOODENG', name: 'Moodeng', logo: '😊' },
  { symbol: 'MYRO', name: 'Myro', logo: '🐕' },
  { symbol: 'PAIN', name: 'Pain', logo: '😫' },
  { symbol: 'PEANUT', name: 'Peanut', logo: '🥜' },
  { symbol: 'PEPE', name: 'Pepe', logo: '🐸' },
  { symbol: 'PIPPIN', name: 'Pippin', logo: '🎭' },
  { symbol: 'PONKE', name: 'Ponke', logo: '🐒' },
  { symbol: 'POPCAT', name: 'Popcat', logo: '🐱' },
  { symbol: 'PWEASE', name: 'Pwease', logo: '🙏' },
  { symbol: 'QUACK', name: 'Quack', logo: '🦆' },
  { symbol: 'RETARDIO', name: 'Retardio', logo: '🤪' },
  { symbol: 'SAMO', name: 'Samoyedcoin', logo: '🐕' },
  { symbol: 'SIGMA', name: 'Sigma', logo: '💪' },
  { symbol: 'SLERF', name: 'Slerf', logo: '🦊' },
  { symbol: 'STONKS', name: 'Stonks', logo: '📈' },
  { symbol: 'TATE', name: 'Tate', logo: '🎭' },
  { symbol: 'TRUMP', name: 'Trump', logo: '👔' },
  { symbol: 'UFD', name: 'UFD', logo: '🎭' },
  { symbol: 'VINE', name: 'Vine', logo: '🍇' },
  { symbol: 'WEN', name: 'Wen', logo: '⏰' },
  { symbol: 'WIF', name: 'Wif', logo: '🐕' },
  { symbol: 'ZEREBRO', name: 'Zerebro', logo: '🧠' }
];

// Generate mock data for a given coin (fallback if CSV loading fails)
export function generateMockData(symbol: string, days = 180): MemeCoinData[] {
  const data: MemeCoinData[] = [];
  const now = Date.now();
  let price = Math.random() * (symbol === 'DOGE' ? 0.1 : 0.00001);
  let volume = Math.random() * 1000000000;
  let market_cap = price * volume * 10;
  
  // Create timestamps with proper interval distribution
  const hourInMillis = 3600 * 1000;
  const endTime = now;
  const startTime = now - (days * 24 * hourInMillis);
  
  // Create data points at hourly intervals
  for (let i = 0; i < days * 24; i++) {
    // Calculate timestamp for this data point (past to present)
    const timestamp = startTime + (i * hourInMillis);
    
    // Create some price volatility with trends over time
    // Use sine waves to simulate market cycles
    const cycle = Math.sin(i / (24 * 30)) * 0.3; // Monthly cycle
    const smallerCycle = Math.sin(i / 24) * 0.1; // Daily cycle
    const randomFactor = (Math.random() * 0.1 - 0.05);
    
    const volatilityFactor = 1 + (cycle + smallerCycle + randomFactor) * 0.1;
    
    price = price * volatilityFactor;
    volume = volume * (1 + (Math.random() * 0.2 - 0.1));
    market_cap = price * volume * 10;
    
    // Calculate technical indicators
    const ema_6h = price * (1 + (Math.random() * 0.03 - 0.015));
    const ma_6h = price * (1 + (Math.random() * 0.02 - 0.01));
    const ema_24h = price * (1 + (Math.random() * 0.04 - 0.02));
    const ma_24h = price * (1 + (Math.random() * 0.01 - 0.005));
    
    // Create some mood swings in RSI to simulate different market conditions
    // Higher frequency of changes for more realistic RSI movements
    const rsi = 30 + Math.sin(i / 20) * 20 + Math.cos(i / 7) * 10 + Math.random() * 20;
    
    // Bollinger bands
    const bollinger_upper = price * (1 + 0.05 + Math.random() * 0.02);
    const bollinger_lower = price * (1 - 0.05 - Math.random() * 0.02);
    
    // Whale transactions (random spikes)
    const whale_transactions = Math.random() > 0.9 ? Math.floor(Math.random() * 5) + 1 : 0;
    
    const point: MemeCoinData = {
      timestamp,
      price,
      market_cap,
      volume,
      rsi,
      ema_6h,
      ma_6h,
      ema_24h,
      ma_24h,
      bollinger_upper,
      bollinger_lower,
      whale_transactions,
      rolling_high_24h: price * 1.1,
      rolling_low_24h: price * 0.9,
    };
    
    // Add lifestage simulation for realistic market cycles
    const dayIndex = Math.floor(i / 24);
    if (dayIndex % 30 < 7) {
      point.lifestage = "pre-pump";
    } else if (dayIndex % 30 < 14) {
      point.lifestage = "pump";
    } else if (dayIndex % 30 < 21) {
      point.lifestage = "post-pump";
    } else {
      point.lifestage = "consolidation";
    }
    
    // Also add to lifestage_x for compatibility with the chart
    point.lifestage_x = point.lifestage;
    
    data.push(point);
  }
  
  // Sort by timestamp to ensure proper ordering
  return data.sort((a, b) => a.timestamp - b.timestamp);
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
