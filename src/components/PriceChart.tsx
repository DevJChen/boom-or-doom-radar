import React from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  Legend,
  Bar,
  ComposedChart,
  Line,
} from 'recharts';
import { MemeCoinData, formatPrice, formatNumber } from '@/lib/meme-coin-utils';
import { VisualizationOptions } from './VisualizationControls';

interface PriceChartProps {
  data: MemeCoinData[];
  symbol: string;
  logo: string;
  options: VisualizationOptions;
}

const PriceChart: React.FC<PriceChartProps> = ({ data, symbol, logo, options }) => {
  // Skip some data points for better performance if too many points
  let filteredData = data.length > 100 
    ? data.filter((_, i) => i % Math.floor(data.length / 100) === 0) 
    : [...data];
  
  // Process data to prevent zero prices when forecast exists
  const processedChartData = filteredData.map((point, index, array) => {
    // If current point has zero price but has forecast, find last valid price
    if (point.price === 0 && point.forecast_price && index > 0) {
      // Look backwards to find the last valid price
      let lastValidPrice = 0;
      for (let i = index - 1; i >= 0; i--) {
        if (array[i].price > 0) {
          lastValidPrice = array[i].price;
          break;
        }
      }
      
      // Return a new object with the valid price
      return {
        ...point,
        price: lastValidPrice > 0 ? lastValidPrice : point.price
      };
    }
    return point;
  });
  
  const chartData = processedChartData;
  
  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return `${date.getMonth() + 1}/${date.getDate()} ${date.getHours()}:00`;
  };

  const renderTooltip = (props: any) => {
    const { payload, label } = props;
    if (!payload || payload.length === 0) return null;
    
    const dataPoint = payload[0].payload;
    
    return (
      <div className="bg-background/95 border border-border p-3 rounded-md shadow-lg">
        <p className="font-medium">{new Date(dataPoint.timestamp).toLocaleString()}</p>
        
        {options.showPrice && (
          <p>
            <span className="font-bold">Price:</span> {formatPrice(dataPoint.price)}
          </p>
        )}
        
        {options.showForecast && dataPoint.forecast_price && (
          <p>
            <span className="font-bold">Forecast:</span> {formatPrice(dataPoint.forecast_price)}
          </p>
        )}
        
        {options.showVolume && (
          <p>
            <span className="font-bold">Volume:</span> {formatNumber(dataPoint.volume)}
          </p>
        )}
        
        {options.showMarketCap && (
          <p>
            <span className="font-bold">Market Cap:</span> {formatNumber(dataPoint.market_cap)}
          </p>
        )}
        
        {options.showWhaleTransactions && (
          <p>
            <span className="font-bold">Whale Transactions:</span> {dataPoint.whale_transactions}
          </p>
        )}
        
        {options.showLifestage && dataPoint.lifestage && (
          <p>
            <span className="font-bold">Life Stage:</span> {dataPoint.lifestage}
          </p>
        )}
      </div>
    );
  };

  // Determine which chart to use based on selected options
  const useComposedChart = options.showVolume || options.showMarketCap || options.showWhaleTransactions;
  
  return (
    <div className="glass-card p-4 rounded-lg">
      <h3 className="text-lg font-semibold mb-4">Price Chart</h3>
      <div className="h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          {useComposedChart ? (
            <ComposedChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="timestamp" 
                tickFormatter={formatDate}
                minTickGap={50}
              />
              <YAxis 
                yAxisId="left"
                orientation="left"
                tickFormatter={formatPrice}
              />
              <YAxis 
                yAxisId="right"
                orientation="right"
                tickFormatter={formatNumber}
              />
              <Tooltip content={renderTooltip} />
              <Legend />
              
              {options.showPrice && (
                <Area
                  yAxisId="left"
                  type="monotone"
                  dataKey="price"
                  name="Price"
                  stroke="#8884d8"
                  fill="#8884d8"
                  fillOpacity={0.3}
                />
              )}
              
              {options.showForecast && (
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="forecast_price"
                  name="Forecast"
                  stroke="#82ca9d"
                  strokeDasharray="5 5"
                />
              )}
              
              {options.showVolume && (
                <Bar
                  yAxisId="right"
                  dataKey="volume"
                  name="Volume"
                  fill="#8884d8"
                  fillOpacity={0.3}
                />
              )}
              
              {options.showMarketCap && (
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="market_cap"
                  name="Market Cap"
                  stroke="#ffc658"
                />
              )}
              
              {options.showWhaleTransactions && (
                <Bar
                  yAxisId="right"
                  dataKey="whale_transactions"
                  name="Whale Transactions"
                  fill="#ff7300"
                  fillOpacity={0.5}
                />
              )}
            </ComposedChart>
          ) : (
            <AreaChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="timestamp" 
                tickFormatter={formatDate}
                minTickGap={50}
              />
              <YAxis 
                tickFormatter={formatPrice}
              />
              <Tooltip content={renderTooltip} />
              <Legend />
              
              {options.showPrice && (
                <Area
                  type="monotone"
                  dataKey="price"
                  name="Price"
                  stroke="#8884d8"
                  fill="#8884d8"
                  fillOpacity={0.3}
                />
              )}
              
              {options.showForecast && (
                <Area
                  type="monotone"
                  dataKey="forecast_price"
                  name="Forecast"
                  stroke="#82ca9d"
                  fill="#82ca9d"
                  fillOpacity={0.3}
                />
              )}
            </AreaChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default PriceChart;
