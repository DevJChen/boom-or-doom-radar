
import React, { useState, useEffect } from 'react';
import SearchBar from './SearchBar';
import PriceChart from './PriceChart';
import RSIChart from './RSIChart';
import StatsPanel from './StatsPanel';
import { availableCoins, generateMockData } from '@/lib/meme-coin-utils';
import { toast } from "@/components/ui/use-toast";

const Dashboard = () => {
  const [currentCoin, setCurrentCoin] = useState(availableCoins[0]);
  const [coinData, setCoinData] = useState(generateMockData(currentCoin.symbol));
  const [loading, setLoading] = useState(false);

  const handleSearch = (symbol: string) => {
    setLoading(true);
    // Find the coin from available coins
    const coin = availableCoins.find(c => 
      c.symbol.toLowerCase() === symbol.toLowerCase()
    );
    
    if (!coin) {
      toast({
        title: "Coin not found",
        description: `${symbol} is not available. Try one of the suggested coins.`,
        variant: "destructive"
      });
      setLoading(false);
      return;
    }
    
    // Mock loading API data
    setTimeout(() => {
      setCurrentCoin(coin);
      // Generate mock data for the selected coin
      setCoinData(generateMockData(coin.symbol));
      toast({
        title: "Data loaded",
        description: `${coin.name} (${coin.symbol}) data loaded successfully.`
      });
      setLoading(false);
    }, 800);
  };

  // Load default coin on initial render
  useEffect(() => {
    handleSearch(currentCoin.symbol);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <h1 className="text-3xl font-bold flex items-center">
          <span className="text-boom mr-2">Boom</span> or <span className="text-doom ml-2">Doom</span> Radar
        </h1>
        <SearchBar onSearch={handleSearch} />
      </div>
      
      {loading ? (
        <div className="flex items-center justify-center h-[500px] glass-card rounded-lg">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-neutral mb-4"></div>
            <p className="text-lg">Loading {currentCoin.symbol} data...</p>
          </div>
        </div>
      ) : (
        <>
          <PriceChart 
            data={coinData} 
            symbol={currentCoin.symbol} 
            logo={currentCoin.logo} 
          />
          <RSIChart data={coinData} />
          <StatsPanel data={coinData} symbol={currentCoin.symbol} />
        </>
      )}
    </div>
  );
};

export default Dashboard;
