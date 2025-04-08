import React, { useState, useEffect } from 'react';
import SearchBar from './SearchBar';
import PriceChart from './PriceChart';
import RSIChart from './RSIChart';
import StatsPanel from './StatsPanel';
import TimeFrameSelector from './TimeFrameSelector';
import VisualizationControls, { VisualizationOptions } from './VisualizationControls';
import { availableCoins, generateMockData } from '@/lib/meme-coin-utils';
import { loadCsvData, filterDataByTimeFrame } from '@/lib/csv-loader';
import { toast } from "@/components/ui/use-toast";

const Dashboard = () => {
  const [currentCoin, setCurrentCoin] = useState(availableCoins[0]);
  const [coinData, setCoinData] = useState(generateMockData(currentCoin.symbol));
  const [filteredData, setFilteredData] = useState(coinData);
  const [loading, setLoading] = useState(true); // Start with loading state
  const [timeFrame, setTimeFrame] = useState('ALL'); // Default to ALL time data
  const [loadError, setLoadError] = useState<string | null>(null);
  const [usingMockData, setUsingMockData] = useState(false);
  
  // Visualization options state
  const [visualizationOptions, setVisualizationOptions] = useState<VisualizationOptions>({
    showPrice: true,
    showForecast: true,
    showRSI: true,
    showVolume: false,
    showMarketCap: false,
    showWhaleTransactions: false,
    showLifestage: false
  });

  const loadCoinData = async (symbol: string) => {
    setLoading(true);
    setLoadError(null);
    
    try {
      // Find the coin from available coins (case-insensitive search)
      const coin = availableCoins.find(c => 
        c.symbol.toLowerCase() === symbol.toLowerCase() ||
        c.name.toLowerCase() === symbol.toLowerCase()
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
      
      setCurrentCoin(coin);
      
      // Try to load real CSV data
      try {
        console.log(`Attempting to load data for ${coin.symbol} from CSV...`);
        const csvData = await loadCsvData(coin.symbol);
        
        if (csvData && csvData.length > 0) {
          // Ensure the data is sorted by timestamp
          const sortedData = [...csvData].sort((a, b) => a.timestamp - b.timestamp);
          
          setCoinData(sortedData);
          // Also update filtered data based on current time frame
          const filtered = filterDataByTimeFrame(sortedData, timeFrame);
          setFilteredData(filtered);
          
          setUsingMockData(false);
          
          toast({
            title: "Real Data Loaded",
            description: `${coin.name} (${coin.symbol}) data loaded with ${csvData.length} points.`,
          });
          console.log(`Successfully loaded ${csvData.length} data points for ${coin.symbol}`);
        } else {
          throw new Error("No data points were loaded");
        }
      } catch (error) {
        console.error("Error during CSV load:", error);
        setLoadError(`Failed to load data for ${coin.symbol}. ${error instanceof Error ? error.message : ''}`);
        
        // Fallback to mock data
        console.log(`Using mock data for ${coin.symbol}`);
        const mockData = generateMockData(coin.symbol, 180); // 6 months of mock data
        setCoinData(mockData);
        setFilteredData(filterDataByTimeFrame(mockData, timeFrame));
        setUsingMockData(true);
        
        toast({
          title: "Using mock data",
          description: `Could not load real data for ${coin.symbol}, using generated data instead.`,
          variant: "default"
        });
      }
    } catch (error) {
      console.error("Error loading coin data:", error);
      setLoadError(`General error loading data: ${error instanceof Error ? error.message : 'Unknown error'}`);
      
      // Set fallback mock data
      const mockData = generateMockData(currentCoin.symbol, 180); // 6 months
      setCoinData(mockData);
      setFilteredData(filterDataByTimeFrame(mockData, timeFrame));
      setUsingMockData(true);
      
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
    if (symbol) {
      loadCoinData(symbol);
    }
  };
  
  const handleTimeFrameChange = (newTimeFrame: string) => {
    setTimeFrame(newTimeFrame);
    setFilteredData(filterDataByTimeFrame(coinData, newTimeFrame));
  };
  
  const handleVisualizationOptionChange = (option: keyof VisualizationOptions, checked: boolean) => {
    setVisualizationOptions(prev => ({
      ...prev,
      [option]: checked
    }));
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
      
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <span className="text-2xl">{currentCoin.logo}</span>
            {currentCoin.name} ({currentCoin.symbol})
          </h2>
          {usingMockData && (
            <p className="text-sm text-doom font-medium mt-1">
              Using mock data - Real data could not be loaded
            </p>
          )}
        </div>
        <TimeFrameSelector 
          currentTimeFrame={timeFrame} 
          onTimeFrameChange={handleTimeFrameChange} 
        />
      </div>
      
      <VisualizationControls 
        options={visualizationOptions}
        onOptionChange={handleVisualizationOptionChange}
      />
      
      {loading ? (
        <div className="flex items-center justify-center h-[500px] glass-card rounded-lg">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-neutral mb-4"></div>
            <p className="text-lg">Loading {currentCoin.symbol} data...</p>
          </div>
        </div>
      ) : filteredData.length === 0 ? (
        <div className="flex items-center justify-center h-[500px] glass-card rounded-lg">
          <div className="text-center">
            <p className="text-xl mb-4">No data available for {currentCoin.symbol} in {timeFrame} timeframe</p>
            {loadError && (
              <p className="text-doom mb-4">{loadError}</p>
            )}
            <p className="text-lg text-muted-foreground">Try selecting a different time frame</p>
          </div>
        </div>
      ) : (
        <>
          <PriceChart 
            data={filteredData} 
            symbol={currentCoin.symbol} 
            logo={currentCoin.logo}
            options={visualizationOptions}
          />
          <RSIChart 
            data={filteredData} 
            options={visualizationOptions}
          />
          <StatsPanel data={filteredData} symbol={currentCoin.symbol} />
        </>
      )}
    </div>
  );
};

export default Dashboard;
