import React from 'react';
import { Button } from '@/components/ui/button';

interface TimeFrameSelectorProps {
  currentTimeFrame: string;
  onTimeFrameChange: (timeFrame: string) => void;
}

const TimeFrameSelector: React.FC<TimeFrameSelectorProps> = ({
  currentTimeFrame,
  onTimeFrameChange
}) => {
  const timeFrames = [
    { label: '1D', value: '1D' },
    { label: '1W', value: '1W' },
    { label: '1M', value: '1M' },
    { label: '3M', value: '3M' },
    { label: '1Y', value: '1Y' },
    { label: 'ALL', value: 'ALL' }
  ];
  
  const getTimeFrameDescription = (timeFrame: string): string => {
    switch (timeFrame) {
      case '1D': return 'Last 24 hours';
      case '1W': return 'Last 7 days';
      case '1M': return 'Last 30 days';
      case '3M': return 'Last 90 days';
      case '1Y': return 'Last 365 days';
      case 'ALL': return 'All available data';
      default: return '';
    }
  };
  
  return (
    <div className="flex flex-wrap gap-2 p-2 glass-card rounded-lg">
      {timeFrames.map((tf) => (
        <Button
          key={tf.value}
          variant={currentTimeFrame === tf.value ? "default" : "outline"}
          size="sm"
          onClick={() => onTimeFrameChange(tf.value)}
          className={currentTimeFrame === tf.value ? "bg-primary text-primary-foreground" : ""}
        >
          {tf.label}
        </Button>
      ))}
    </div>
  );
};

export default TimeFrameSelector;
