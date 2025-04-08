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
} from 'recharts';
import { MemeCoinData } from '@/lib/meme-coin-utils';
import { VisualizationOptions } from './VisualizationControls';

interface RSIChartProps {
  data: MemeCoinData[];
  options: VisualizationOptions;
}

const RSIChart: React.FC<RSIChartProps> = ({ data, options }) => {
  // Skip some data points for better performance if too many points
  const chartData = data.length > 100 
    ? data.filter((_, i) => i % Math.floor(data.length / 100) === 0) 
    : data;
  
  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return `${date.getMonth() + 1}/${date.getDate()} ${date.getHours()}:00`;
  };

  const renderTooltip = (props: any) => {
    const { payload, label } = props;
    if (!payload || payload.length === 0) return null;
    
    const dataPoint = payload[0].payload;
    const rsi = dataPoint.rsi;
    let condition;
    
    if (rsi >= 70) condition = "Overbought";
    else if (rsi <= 30) condition = "Oversold";
    else condition = "Neutral";
    
    return (
      <div className="bg-background/95 border border-border p-3 rounded-md shadow-lg">
        <p className="font-medium">{new Date(dataPoint.timestamp).toLocaleString()}</p>
        <p>
          <span className="font-bold">RSI:</span> {rsi.toFixed(2)}
        </p>
        <p>
          <span className="font-bold">Condition:</span> {condition}
        </p>
        {options.showLifestage && dataPoint.lifestage && (
          <p>
            <span className="font-bold">Life Stage:</span> {dataPoint.lifestage}
          </p>
        )}
      </div>
    );
  };

  // Instead of using a function directly for the stroke,
  // we'll pre-process the data to include the color
  const chartDataWithColors = chartData.map(item => ({
    ...item,
    rsiColor: getRSIColor(item.rsi)
  }));

  function getRSIColor(value: number): string {
    if (value >= 70) return '#FF1493'; // Overbought - doom color
    if (value <= 30) return '#39FF14'; // Oversold - boom color
    return '#8A2BE2'; // Neutral - neutral color
  }

  if (!options.showRSI) {
    return null;
  }

  return (
    <div className="glass-card p-4 rounded-lg">
      <h3 className="text-lg font-semibold mb-4">RSI Chart</h3>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartDataWithColors}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="timestamp" 
              tickFormatter={formatDate}
              minTickGap={50}
            />
            <YAxis domain={[0, 100]} />
            <Tooltip content={renderTooltip} />
            <ReferenceLine y={70} stroke="#FF1493" strokeDasharray="3 3" />
            <ReferenceLine y={30} stroke="#39FF14" strokeDasharray="3 3" />
            <Area
              type="monotone"
              dataKey="rsi"
              name="RSI"
              stroke="#8A2BE2"
              fill="#8A2BE2"
              fillOpacity={0.3}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default RSIChart;
