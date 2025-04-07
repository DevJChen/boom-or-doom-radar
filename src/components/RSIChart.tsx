
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

interface RSIChartProps {
  data: MemeCoinData[];
}

const RSIChart: React.FC<RSIChartProps> = ({ data }) => {
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
      </div>
    );
  };

  const getRSIColor = (value: number) => {
    if (value >= 70) return '#FF1493'; // Overbought - doom color
    if (value <= 30) return '#39FF14'; // Oversold - boom color
    return '#8A2BE2'; // Neutral - neutral color
  };

  return (
    <div className="w-full h-[200px] rounded-lg glass-card p-4">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-bold">RSI Indicator</h3>
        <div className="flex space-x-4">
          <div className="flex items-center">
            <span className="w-3 h-3 bg-doom rounded-full mr-1"></span>
            <span className="text-sm text-muted-foreground">Overbought</span>
          </div>
          <div className="flex items-center">
            <span className="w-3 h-3 bg-neutral rounded-full mr-1"></span>
            <span className="text-sm text-muted-foreground">Neutral</span>
          </div>
          <div className="flex items-center">
            <span className="w-3 h-3 bg-boom rounded-full mr-1"></span>
            <span className="text-sm text-muted-foreground">Oversold</span>
          </div>
        </div>
      </div>
      
      <ResponsiveContainer width="100%" height="85%">
        <AreaChart data={chartData}>
          <defs>
            <linearGradient id="rsiGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8A2BE2" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#8A2BE2" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis 
            dataKey="timestamp" 
            tickFormatter={formatDate} 
            tick={{ fill: '#9ca3af' }} 
            tickLine={{ stroke: '#4b5563' }}
            domain={['dataMin', 'dataMax']}
            allowDataOverflow
            height={15}
          />
          <YAxis 
            domain={[0, 100]} 
            tick={{ fill: '#9ca3af' }} 
            tickLine={{ stroke: '#4b5563' }}
            width={35}
          />
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(75, 85, 99, 0.3)" />
          <Tooltip content={renderTooltip} />
          
          {/* Overbought line */}
          <ReferenceLine 
            y={70} 
            stroke="#FF1493" 
            strokeDasharray="3 3" 
            label={{ 
              value: "70", 
              position: "right", 
              fill: '#FF1493'
            }} 
          />
          
          {/* Oversold line */}
          <ReferenceLine 
            y={30} 
            stroke="#39FF14" 
            strokeDasharray="3 3" 
            label={{ 
              value: "30", 
              position: "right", 
              fill: '#39FF14'
            }} 
          />
          
          <Area 
            type="monotone" 
            dataKey="rsi" 
            stroke={(data) => getRSIColor(data.rsi)}
            fill="url(#rsiGradient)" 
            dot={false}
            activeDot={{ r: 4, fill: "#fff", stroke: "#8A2BE2" }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RSIChart;
