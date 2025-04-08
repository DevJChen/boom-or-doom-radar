
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
  const timeFrames = ['1D', '1W', '1M', '3M', '1Y', 'ALL'];
  
  return (
    <div className="flex space-x-2">
      {timeFrames.map(timeFrame => (
        <Button
          key={timeFrame}
          variant={currentTimeFrame === timeFrame ? "default" : "outline"}
          size="sm"
          onClick={() => onTimeFrameChange(timeFrame)}
          className={currentTimeFrame === timeFrame ? "bg-primary" : ""}
        >
          {timeFrame}
        </Button>
      ))}
    </div>
  );
};

export default TimeFrameSelector;
