import { MemeCoinData } from './meme-coin-utils';

/**
 * Loads and parses CSV file data for a specific meme coin
 */
export const loadCsvData = async (symbol: string): Promise<MemeCoinData[]> => {
  try {
    // Load from public directory instead of src
    const response = await fetch(`/data/ticker_data/${symbol.toUpperCase()}.csv`);
    
    if (!response.ok) {
      console.error(`Failed to fetch ${symbol} data with status ${response.status}`);
      throw new Error(`Failed to fetch ${symbol} data`);
    }
    
    const csvText = await response.text();
    console.log(`CSV data for ${symbol} loaded successfully, length: ${csvText.length}`);
    
    if (csvText.length < 10) {
      throw new Error("CSV data is too short or empty");
    }
    
    const rows = csvText.trim().split('\n');
    
    // Skip the header row
    const dataRows = rows.slice(1);
    
    console.log(`Loaded ${dataRows.length} rows for ${symbol}`);
    
    // Parse each row into a MemeCoinData object
    return dataRows.map(row => {
      try {
        const columns = row.split(',');
        
        // Ensure we have enough columns
        if (columns.length < 5) {
          console.warn(`Skipping row with insufficient columns: ${row}`);
          return null;
        }
        
        // Parse the timestamp (first column) - handle different date formats
        let timestamp;
        try {
          // Try to parse as ISO format first
          timestamp = new Date(columns[0]).getTime();
          
          // If timestamp is invalid, try alternative formats
          if (isNaN(timestamp)) {
            // Try to extract date/time parts
            const dateStr = columns[0].trim();
            const parts = dateStr.split(/[- :]/);
            if (parts.length >= 3) {
              // Reconstruct in a format JavaScript likes better
              const formattedDate = `${parts[0]}-${parts[1]}-${parts[2]}`;
              timestamp = new Date(formattedDate).getTime();
            }
          }
        } catch (e) {
          console.error("Error parsing date:", columns[0], e);
          return null;
        }
        
        if (isNaN(timestamp)) {
          console.warn(`Invalid timestamp in row: ${columns[0]}`);
          return null;
        }
        
        // Parse numeric values with fallbacks to prevent NaN
        const parseNumeric = (value: string, fallback = 0): number => {
          const parsed = parseFloat(value);
          return isNaN(parsed) ? fallback : parsed;
        };
        
        // Parse essential data
        const price = parseNumeric(columns[1]);
        const market_cap = parseNumeric(columns[2]);
        const volume = parseNumeric(columns[3]);
        
        // Get RSI - look for it in different possible columns
        let rsi = 50; // Default value
        for (let i = 29; i < Math.min(36, columns.length); i++) {
          const val = parseNumeric(columns[i], -1);
          if (val >= 0 && val <= 100) {
            rsi = val;
            break;
          }
        }
        
        // Get EMA values - typically in columns 19-22
        const ema_6h = parseNumeric(columns[19] || '', price);
        const ema_24h = parseNumeric(columns[20] || '', price);
        const ma_6h = parseNumeric(columns[21] || '', price);
        const ma_24h = parseNumeric(columns[22] || '', price);
        
        // Find volatility - could be in different columns
        let volatility = 0.01;
        for (let i = 25; i < Math.min(30, columns.length); i++) {
          const val = parseNumeric(columns[i], -1);
          if (val > 0 && val < 1) {
            volatility = val;
            break;
          }
        }
        
        // Calculate Bollinger bands based on price and volatility
        const bollinger_upper = price + (volatility * 2);
        const bollinger_lower = price - (volatility * 2);
        
        // Find whale transactions indicator
        let whale_transactions = 0;
        for (let i = 32; i < Math.min(36, columns.length); i++) {
          const val = columns[i];
          if (val === 'True' || val === '1' || val?.toLowerCase() === 'true') {
            whale_transactions = 1;
            break;
          }
        }
        
        // Look for forecast data
        let forecast_price = null;
        for (let i = 35; i < Math.min(40, columns.length); i++) {
          if (columns[i] && columns[i] !== '') {
            const val = parseNumeric(columns[i], -1);
            if (val > 0) {
              forecast_price = val;
              break;
            }
          }
        }
        
        // Find lifestage data
        let lifestage = '';
        for (let i = columns.length - 1; i > columns.length - 5; i--) {
          if (columns[i] && columns[i] !== '' && 
              (columns[i].includes('pump') || columns[i].includes('dump') || 
               columns[i].includes('growth') || columns[i].includes('decline'))) {
            lifestage = columns[i];
            break;
          }
        }
        
        // Get high/low values
        let rolling_high_24h = parseNumeric(columns[columns.length - 3] || '', price * 1.05);
        let rolling_low_24h = parseNumeric(columns[columns.length - 2] || '', price * 0.95);
        
        // Validate high/low
        if (rolling_high_24h <= rolling_low_24h) {
          rolling_high_24h = price * 1.05;
          rolling_low_24h = price * 0.95;
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
    throw error;
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
