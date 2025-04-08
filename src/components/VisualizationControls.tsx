import React from 'react';
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

export interface VisualizationOptions {
  showPrice: boolean;
  showForecast: boolean;
  showRSI: boolean;
  showVolume: boolean;
  showMarketCap: boolean;
  showWhaleTransactions: boolean;
  showLifestage: boolean;
}

interface VisualizationControlsProps {
  options: VisualizationOptions;
  onOptionChange: (option: keyof VisualizationOptions, checked: boolean) => void;
}

const VisualizationControls: React.FC<VisualizationControlsProps> = ({ 
  options, 
  onOptionChange 
}) => {
  return (
    <div className="flex flex-wrap gap-4 p-4 glass-card rounded-lg">
      <div className="flex items-center space-x-2">
        <Checkbox 
          id="showPrice" 
          checked={options.showPrice} 
          onCheckedChange={(checked) => onOptionChange('showPrice', checked as boolean)}
        />
        <Label htmlFor="showPrice">Price</Label>
      </div>
      
      <div className="flex items-center space-x-2">
        <Checkbox 
          id="showForecast" 
          checked={options.showForecast} 
          onCheckedChange={(checked) => onOptionChange('showForecast', checked as boolean)}
        />
        <Label htmlFor="showForecast">Forecast</Label>
      </div>
      
      <div className="flex items-center space-x-2">
        <Checkbox 
          id="showRSI" 
          checked={options.showRSI} 
          onCheckedChange={(checked) => onOptionChange('showRSI', checked as boolean)}
        />
        <Label htmlFor="showRSI">RSI</Label>
      </div>
      
      <div className="flex items-center space-x-2">
        <Checkbox 
          id="showVolume" 
          checked={options.showVolume} 
          onCheckedChange={(checked) => onOptionChange('showVolume', checked as boolean)}
        />
        <Label htmlFor="showVolume">Volume</Label>
      </div>
      
      <div className="flex items-center space-x-2">
        <Checkbox 
          id="showMarketCap" 
          checked={options.showMarketCap} 
          onCheckedChange={(checked) => onOptionChange('showMarketCap', checked as boolean)}
        />
        <Label htmlFor="showMarketCap">Market Cap</Label>
      </div>
      
      <div className="flex items-center space-x-2">
        <Checkbox 
          id="showWhaleTransactions" 
          checked={options.showWhaleTransactions} 
          onCheckedChange={(checked) => onOptionChange('showWhaleTransactions', checked as boolean)}
        />
        <Label htmlFor="showWhaleTransactions">Whale Transactions</Label>
      </div>
      
      <div className="flex items-center space-x-2">
        <Checkbox 
          id="showLifestage" 
          checked={options.showLifestage} 
          onCheckedChange={(checked) => onOptionChange('showLifestage', checked as boolean)}
        />
        <Label htmlFor="showLifestage">Life Stage</Label>
      </div>
    </div>
  );
};

export default VisualizationControls; 