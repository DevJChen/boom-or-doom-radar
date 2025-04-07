
import React, { useState, useEffect } from 'react';
import SearchBar from './SearchBar';
import PriceChart from './PriceChart';
import RSIChart from './RSIChart';
import StatsPanel from './StatsPanel';
import { availableCoins, generateMockData } from '@/lib/meme-coin-utils';
import { loadCsvData } from '@/lib/csv-loader';
import { toast } from "@/components/ui/use-toast";

const Dashboard = () => {
  const [currentCoin, setCurrentCoin] = useState(availableCoins[0]);
  const [coinData, setCoinData] = useState(generateMockData(currentCoin.symbol));
  const [loading, setLoading] = useState(false);

  const loadCoinData = async (symbol: string) => {
    setLoading(true);
    try {
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
      
      // Try to load real CSV data
      const csvData = await loadCsvData(symbol);
      
      if (csvData && csvData.length > 0) {
        setCurrentCoin(coin);
        setCoinData(csvData);
        toast({
          title: "Data loaded",
          description: `${coin.name} (${coin.symbol}) data loaded successfully.`,
        });
      } else {
        // Fallback to mock data
        setCurrentCoin(coin);
        setCoinData(generateMockData(coin.symbol));
        toast({
          title: "Using mock data",
          description: `Could not load real data for ${coin.symbol}, using generated data instead.`,
          variant: "default"
        });
      }
    } catch (error) {
      console.error("Error loading coin data:", error);
      toast({
        title: "Error loading data",
        description: "Failed to load coin data. Using mock data instead.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (symbol: string) => {
    loadCoinData(symbol);
  };

  // Load default coin on initial render
  useEffect(() => {
    loadCoinData(currentCoin.symbol);
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
