
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
      const columns = row.split(',');
      
      // Parse the timestamp (first column)
      const timestamp = new Date(columns[0]).getTime();
      
      // Parse numeric values
      const price = parseFloat(columns[1]);
      const market_cap = parseFloat(columns[2]);
      const volume = parseFloat(columns[3]);
      const ema_6h = parseFloat(columns[18]);
      const ema_24h = parseFloat(columns[19]);
      const ma_6h = parseFloat(columns[20]);
      const ma_24h = parseFloat(columns[21]);
      const rsi = parseFloat(columns[29]);
      const bollinger_upper = price + parseFloat(columns[26]) * 2; // Using volatility for Bollinger
      const bollinger_lower = price - parseFloat(columns[26]) * 2;
      const whale_transactions = columns[32] === 'True' ? 1 : 0;
      
      // Check if forecast data exists (not empty)
      const forecast_price = columns[36] && columns[36] !== '' ? parseFloat(columns[36]) : null;
      
      // Get life stage data
      const lifestage = columns[37] || '';
      
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
        rolling_high_24h: parseFloat(columns[34]),
        rolling_low_24h: parseFloat(columns[35]),
      } as MemeCoinData;
    });
  } catch (error) {
    console.error(`Error loading data for ${symbol}:`, error);
    return [];
  }
};
