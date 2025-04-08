
import React from 'react';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from '@/components/ui/tooltip';

interface TimeFrameSelectorProps {
  currentTimeFrame: string;
  onTimeFrameChange: (timeFrame: string) => void;
}

const TimeFrameSelector: React.FC<TimeFrameSelectorProps> = ({
  currentTimeFrame,
  onTimeFrameChange
}) => {
  const timeFrames = ['1D', '1W', '1M', '3M', '1Y', 'ALL'];
  
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
    <div className="flex space-x-2">
      {timeFrames.map(timeFrame => (
        <Tooltip key={timeFrame}>
          <TooltipTrigger asChild>
            <Button
              variant={currentTimeFrame === timeFrame ? "default" : "outline"}
              size="sm"
              onClick={() => onTimeFrameChange(timeFrame)}
              className={currentTimeFrame === timeFrame ? "bg-primary" : ""}
            >
              {timeFrame}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{getTimeFrameDescription(timeFrame)}</p>
          </TooltipContent>
        </Tooltip>
      ))}
    </div>
  );
};

export default TimeFrameSelector;
