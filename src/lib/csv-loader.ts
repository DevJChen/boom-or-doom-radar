
import { MemeCoinData } from './meme-coin-utils';

/**
 * Loads and parses CSV file data for a specific meme coin
 */
export const loadCsvData = async (symbol: string): Promise<MemeCoinData[]> => {
  try {
    // Load the CSV file for the specified symbol
    const response = await fetch(`/src/data/ticker_data/${symbol}.csv`);
    if (!response.ok) {
      throw new Error(`Failed to fetch ${symbol} data`);
    }
    
    const csvText = await response.text();
    const rows = csvText.trim().split('\n');
    
    // Skip the header row
    const dataRows = rows.slice(1);
    
    // Parse each row into a MemeCoinData object
    return dataRows.map(row => {
      try {
        const columns = row.split(',');
        
        // Ensure we have enough columns
        if (columns.length < 30) {
          console.warn(`Skipping row with insufficient columns: ${row}`);
          return null;
        }
        
        // Parse the timestamp (first column)
        const timestamp = new Date(columns[0]).getTime();
        
        // Parse numeric values with fallbacks to prevent NaN
        const parseNumeric = (value: string, fallback = 0): number => {
          const parsed = parseFloat(value);
          return isNaN(parsed) ? fallback : parsed;
        };
        
        const price = parseNumeric(columns[1]);
        const market_cap = parseNumeric(columns[2]);
        const volume = parseNumeric(columns[3]);
        const ema_6h = parseNumeric(columns[18]);
        const ema_24h = parseNumeric(columns[19]);
        const ma_6h = parseNumeric(columns[20]);
        const ma_24h = parseNumeric(columns[21]);
        const rsi = parseNumeric(columns[29], 50); // Default RSI to 50 if not available
        const volatility = parseNumeric(columns[26], 0.01);
        const bollinger_upper = price + volatility * 2;
        const bollinger_lower = price - volatility * 2;
        const whale_transactions = columns[32] === 'True' ? 1 : 0;
        
        // Check if forecast data exists (not empty)
        const forecast_price = columns[36] && columns[36] !== '' ? parseNumeric(columns[36]) : null;
        
        // Get life stage data
        const lifestage = columns[37] || '';
        
        // Parse rolling highs and lows with validation
        let rolling_high_24h = columns[34] ? parseNumeric(columns[34]) : undefined;
        let rolling_low_24h = columns[35] ? parseNumeric(columns[35]) : undefined;
        
        // Validate the high is actually higher than low
        if (rolling_high_24h !== undefined && rolling_low_24h !== undefined && rolling_high_24h < rolling_low_24h) {
          // Swap them if incorrectly ordered
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
    return [];
  }
};
