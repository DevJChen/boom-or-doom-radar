
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
} from 'recharts';
import { MemeCoinData, formatPrice } from '@/lib/meme-coin-utils';

interface PriceChartProps {
  data: MemeCoinData[];
  symbol: string;
  logo: string;
}

const PriceChart: React.FC<PriceChartProps> = ({ data, symbol, logo }) => {
  // Skip some data points for better performance if too many points
  const chartData = data.length > 100 
    ? data.filter((_, i) => i % Math.floor(data.length / 100) === 0) 
    : data;

  // Determine price precision based on the lowest price
  const minPrice = Math.min(...data.map(d => d.price));
  const yAxisPrecision = minPrice < 0.001 ? 8 : minPrice < 0.1 ? 4 : 2;
  
  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return `${date.getMonth() + 1}/${date.getDate()} ${date.getHours()}:00`;
  };
  
  const formatTooltipDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  };
  
  const renderTooltip = (props: any) => {
    const { payload, label } = props;
    if (!payload || payload.length === 0) return null;
    
    const dataPoint = payload[0].payload;
    
    return (
      <div className="bg-background/95 border border-border p-3 rounded-md shadow-lg">
        <p className="font-medium">{formatTooltipDate(dataPoint.timestamp)}</p>
        <p>
          <span className="font-bold">Price:</span> ${formatPrice(dataPoint.price)}
        </p>
        <div className="grid grid-cols-2 gap-2 mt-2">
          <p>
            <span className="text-boom">EMA 6H:</span> ${formatPrice(dataPoint.ema_6h)}
          </p>
          <p>
            <span className="text-neutral">MA 6H:</span> ${formatPrice(dataPoint.ma_6h)}
          </p>
          <p>
            <span className="text-gray-400">Upper Band:</span> ${formatPrice(dataPoint.bollinger_upper)}
          </p>
          <p>
            <span className="text-gray-400">Lower Band:</span> ${formatPrice(dataPoint.bollinger_lower)}
          </p>
          <p>
            <span className="text-orange-400">RSI:</span> {dataPoint.rsi.toFixed(2)}
          </p>
          <p>
            <span className="text-blue-400">Whales:</span> {dataPoint.whale_transactions}
          </p>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full h-[500px] rounded-lg glass-card p-4 relative overflow-hidden">
      {/* Background logo */}
      <div className="absolute inset-0 flex items-center justify-center opacity-5 text-9xl pointer-events-none">
        {logo}
      </div>
      
      <div className="flex items-center mb-4">
        <div className="text-4xl mr-3">{logo}</div>
        <div>
          <h2 className="text-2xl font-bold">{symbol} Price Chart</h2>
          <p className="text-muted-foreground">
            ${formatPrice(data[data.length - 1]?.price || 0)}
          </p>
        </div>
      </div>
      
      <ResponsiveContainer width="100%" height="85%">
        <AreaChart data={chartData}>
          <defs>
            <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#39FF14" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#39FF14" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis 
            dataKey="timestamp" 
            tickFormatter={formatDate} 
            tick={{ fill: '#9ca3af' }} 
            tickLine={{ stroke: '#4b5563' }}
            domain={['dataMin', 'dataMax']}
            allowDataOverflow
          />
          <YAxis 
            tickFormatter={(value) => formatPrice(value)} 
            tick={{ fill: '#9ca3af' }} 
            tickLine={{ stroke: '#4b5563' }}
            domain={['auto', 'auto']}
          />
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(75, 85, 99, 0.3)" />
          <Tooltip content={renderTooltip} />
          <Legend verticalAlign="top" />
          
          {/* Main Price Area */}
          <Area 
            type="monotone" 
            dataKey="price" 
            stroke="#39FF14" 
            fillOpacity={1}
            fill="url(#priceGradient)" 
            strokeWidth={2}
            name="Price"
          />
          
          {/* Technical Indicators */}
          <Area 
            type="monotone" 
            dataKey="ema_6h" 
            stroke="#FF1493" 
            fill="none"
            strokeWidth={1.5}
            name="EMA 6H"
          />
          
          <Area 
            type="monotone" 
            dataKey="ma_6h" 
            stroke="#8A2BE2" 
            fill="none"
            strokeWidth={1.5}
            name="MA 6H"
          />
          
          <Area 
            type="monotone" 
            dataKey="bollinger_upper" 
            stroke="#4b5563" 
            fill="none"
            strokeDasharray="3 3"
            strokeWidth={1}
            name="Upper Band"
          />
          
          <Area 
            type="monotone" 
            dataKey="bollinger_lower" 
            stroke="#4b5563" 
            fill="none"
            strokeDasharray="3 3"
            strokeWidth={1}
            name="Lower Band"
          />
          
          {/* Line when price crosses above/below EMA */}
          {data.map((point, i) => {
            if (i === 0) return null;
            const prevPoint = data[i-1];
            if ((prevPoint.price < prevPoint.ema_6h && point.price >= point.ema_6h) ||
                (prevPoint.price > prevPoint.ema_6h && point.price <= point.ema_6h)) {
              return (
                <ReferenceLine 
                  key={`cross-${i}`}
                  x={point.timestamp} 
                  stroke="#FF1493" 
                  strokeDasharray="5 5" 
                />
              );
            }
            return null;
          })}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PriceChart;
