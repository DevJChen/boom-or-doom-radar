import { MemeCoinData } from './meme-coin-utils';

/**
 * Loads and parses CSV file data for a specific meme coin
 */
export const loadCsvData = async (symbol: string): Promise<MemeCoinData[]> => {
  try {
    // Updated path to point to the correct location in the public folder
    const response = await fetch(`/src/data/ticker_data/${symbol}.csv`);
    
    if (!response.ok) {
      console.error(`Failed to fetch ${symbol} data with status ${response.status}`);
      throw new Error(`Failed to fetch ${symbol} data`);
    }
    
    const csvText = await response.text();
    const rows = csvText.trim().split('\n');
    
    // Skip the header row
    const dataRows = rows.slice(1);
    
    console.log(`Loaded ${dataRows.length} rows for ${symbol}`);
    
    // Parse each row into a MemeCoinData object
    return dataRows.map(row => {
      try {
        const columns = row.split(',');
        
        // Ensure we have enough columns
        if (columns.length < 30) {
          console.warn(`Skipping row with insufficient columns: ${row}`);
          return null;
        }
        
        // Parse the timestamp (first column) - handle different date formats
        const timestamp = new Date(columns[0]).getTime();
        
        if (isNaN(timestamp)) {
          console.warn(`Invalid timestamp in row: ${row}`);
          return null;
        }
        
        // Parse numeric values with fallbacks to prevent NaN
        const parseNumeric = (value: string, fallback = 0): number => {
          const parsed = parseFloat(value);
          return isNaN(parsed) ? fallback : parsed;
        };
        
        const price = parseNumeric(columns[1]);
        const market_cap = parseNumeric(columns[2]);
        const volume = parseNumeric(columns[3]);
        
        // Find column indices based on header names or use fixed positions for essential data
        // These are the fixed positions for the primary indicators
        const ema_6h = parseNumeric(columns[19], price);
        const ema_24h = parseNumeric(columns[20], price);
        const ma_6h = parseNumeric(columns[21], price);
        const ma_24h = parseNumeric(columns[22], price);
        
        // Get RSI which is typically around column 29-30
        let rsi = 50; // Default
        for (let i = 29; i < 32; i++) {
          if (columns[i] && !isNaN(parseFloat(columns[i]))) {
            const val = parseNumeric(columns[i]);
            if (val >= 0 && val <= 100) {
              rsi = val;
              break;
            }
          }
        }
        
        // Find volatility - could be in different columns
        let volatility = 0.01;
        for (let i = 25; i < 28; i++) {
          if (columns[i] && !isNaN(parseFloat(columns[i]))) {
            const val = parseNumeric(columns[i]);
            if (val > 0 && val < 1) {
              volatility = val;
              break;
            }
          }
        }
        
        // Calculate Bollinger bands based on price and volatility
        const bollinger_upper = price + volatility * 2;
        const bollinger_lower = price - volatility * 2;
        
        // Find whale transactions indicator - search for boolean or numeric values
        let whale_transactions = 0;
        for (let i = 32; i < 35; i++) {
          const val = columns[i];
          if (val === 'True' || val === '1') {
            whale_transactions = 1;
            break;
          }
        }
        
        // Look for forecast data - scan last few columns
        let forecast_price = null;
        for (let i = 35; i < columns.length; i++) {
          if (columns[i] && columns[i] !== '' && !isNaN(parseFloat(columns[i]))) {
            forecast_price = parseNumeric(columns[i]);
            break;
          }
        }
        
        // Find lifestage data in last columns
        let lifestage = '';
        for (let i = columns.length - 1; i > columns.length - 4; i--) {
          if (columns[i] && columns[i] !== '' && 
              (columns[i].includes('pump') || columns[i].includes('dump') || 
              columns[i].includes('growth') || columns[i].includes('decline'))) {
            lifestage = columns[i];
            break;
          }
        }
        
        // Parse rolling highs and lows - search for reasonable values
        let rolling_high_24h: number | undefined = undefined;
        let rolling_low_24h: number | undefined = undefined;
        
        // Try to find high and low values in the correct columns based on the provided CSV structure
        if (columns[34] && !isNaN(parseFloat(columns[34]))) {
          rolling_high_24h = parseNumeric(columns[34]);
        }
        
        if (columns[35] && !isNaN(parseFloat(columns[35]))) {
          rolling_low_24h = parseNumeric(columns[35]);
        }
        
        // Fallback: if no explicit high/low values found, use price with a range
        if (rolling_high_24h === undefined) rolling_high_24h = price * 1.05;
        if (rolling_low_24h === undefined) rolling_low_24h = price * 0.95;
        
        // Validate the high is actually higher than low
        if (rolling_high_24h < rolling_low_24h) {
          [rolling_high_24h, rolling_low_24h] = [rolling_low_24h, rolling_high_24h];
        }
        
        return {
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
          forecast_price,
          lifestage,
          rolling_high_24h,
          rolling_low_24h,
        } as MemeCoinData;
      } catch (error) {
        console.error(`Error parsing row: ${row}`, error);
        return null;
      }
    }).filter(item => item !== null) as MemeCoinData[];
  } catch (error) {
    console.error(`Error loading data for ${symbol}:`, error);
    throw error; // Re-throw to handle in the UI layer
  }
};

/**
 * Filter data by time frame
 */
export const filterDataByTimeFrame = (data: MemeCoinData[], timeFrame: string): MemeCoinData[] => {
  if (!data || data.length === 0) return [];
  
  const now = Date.now();
  const oneDay = 24 * 60 * 60 * 1000;
  
  switch (timeFrame) {
    case '1D':
      return data.filter(item => item.timestamp >= now - oneDay);
    case '1W':
      return data.filter(item => item.timestamp >= now - 7 * oneDay);
    case '1M':
      return data.filter(item => item.timestamp >= now - 30 * oneDay);
    case '3M':
      return data.filter(item => item.timestamp >= now - 90 * oneDay);
    case '1Y':
      return data.filter(item => item.timestamp >= now - 365 * oneDay);
    case 'ALL':
    default:
      return data;
  }
};
