
import React from 'react';
import { Rocket } from 'lucide-react';
import { MemeCoinData, formatNumber, formatPrice, getPercentageChange, get24HHighLow, calculateBoomDoomScore } from '@/lib/meme-coin-utils';

interface StatsPanelProps {
  data: MemeCoinData[];
  symbol: string;
}

const StatsPanel: React.FC<StatsPanelProps> = ({ data, symbol }) => {
  if (data.length === 0) return null;

  // Get latest data point
  const latestData = data[data.length - 1];
  
  // Get data from 24 hours ago (24 points assuming hourly data)
  const yesterday = data.length > 24 ? data[data.length - 25] : data[0];
  
  // Calculate 24-hour high and low
  const { high, low } = get24HHighLow(data);
  
  // Calculate volume change
  const volumeChange = getPercentageChange(yesterday.volume, latestData.volume);
  
  // Calculate marketcap change
  const marketCapChange = getPercentageChange(yesterday.market_cap, latestData.market_cap);
  
  // Count whale transactions in last 24h
  const whaleTransactions = data
    .slice(-24)
    .reduce((sum, point) => sum + point.whale_transactions, 0);
  
  // Calculate boom/doom score
  const boomDoomScore = calculateBoomDoomScore(data);
  
  // Generate rockets based on score
  const rockets = Array(boomDoomScore)
    .fill(0)
    .map((_, i) => (
      <Rocket 
        key={i} 
        className={`text-boom animate-pulse-boom`} 
        size={20} 
        style={{ animationDelay: `${i * 0.3}s` }}
      />
    ));

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Key Stats */}
      <div className="glass-card p-4 rounded-lg">
        <h3 className="font-bold mb-3">Key Stats</h3>
        <div className="grid grid-cols-2 gap-y-3">
          <div>
            <p className="text-xs text-muted-foreground">24H High</p>
            <p className="font-medium">${formatPrice(high)}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">24H Low</p>
            <p className="font-medium">${formatPrice(low)}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Market Cap</p>
            <p className="font-medium">${formatNumber(latestData.market_cap)}</p>
            <p className={`text-xs ${marketCapChange.includes('+') ? 'text-boom' : 'text-doom'}`}>
              {marketCapChange}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Volume (24H)</p>
            <p className="font-medium">${formatNumber(latestData.volume)}</p>
            <p className={`text-xs ${volumeChange.includes('+') ? 'text-boom' : 'text-doom'}`}>
              {volumeChange}
            </p>
          </div>
        </div>
      </div>
      
      {/* Whale Activity */}
      <div className="glass-card p-4 rounded-lg">
        <h3 className="font-bold mb-3">Whale Activity (24H)</h3>
        <div className="flex items-center justify-center h-[80%]">
          <div className="text-center">
            <p className="text-4xl font-bold mb-2">{whaleTransactions}</p>
            <p className="text-sm text-muted-foreground">
              {whaleTransactions > 3 
                ? "High whale activity! 🐋" 
                : whaleTransactions > 0 
                  ? "Some whales moving 🐋" 
                  : "No whale activity 🦐"}
            </p>
          </div>
        </div>
      </div>
      
      {/* Boom or Doom Score */}
      <div className="glass-card p-4 rounded-lg">
        <h3 className="font-bold mb-3">Boom or Doom Score</h3>
        <div className="flex flex-col items-center justify-center h-[80%]">
          <div className="flex items-center justify-center mb-2">
            {rockets.length > 0 
              ? rockets 
              : <p className="text-xl text-doom">DOOM</p>}
          </div>
          <p className="text-sm text-muted-foreground">
            {boomDoomScore === 5 ? "🚀 TO THE MOON!" : 
             boomDoomScore === 4 ? "Looking very bullish!" :
             boomDoomScore === 3 ? "Cautiously optimistic" :
             boomDoomScore === 2 ? "Neutral territory" :
             boomDoomScore === 1 ? "Proceed with caution" :
             "Danger zone! ⚠️"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default StatsPanel;
