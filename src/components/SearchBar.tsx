
import React, { useState, useEffect, useRef } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { availableCoins } from '@/lib/meme-coin-utils';

interface SearchBarProps {
  onSearch: (symbol: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [query, setQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState(availableCoins);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Filter suggestions based on query
    if (query) {
      const filtered = availableCoins.filter(coin => 
        coin.name.toLowerCase().includes(query.toLowerCase()) || 
        coin.symbol.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredSuggestions(filtered);
    } else {
      setFilteredSuggestions(availableCoins);
    }
  }, [query]);

  useEffect(() => {
    // Close suggestions when clicking outside
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    setShowSuggestions(true);
  };

  const handleSelectSuggestion = (symbol: string) => {
    setQuery(symbol);
    setShowSuggestions(false);
    onSearch(symbol);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query) {
      onSearch(query);
      setShowSuggestions(false);
    }
  };

  return (
    <div ref={wrapperRef} className="relative w-full max-w-md">
      <form onSubmit={handleSubmit} className="relative">
        <Input
          value={query}
          onChange={handleInputChange}
          placeholder="Search meme coins (e.g., DOGE, SHIB)"
          className="w-full bg-secondary/50 border-secondary pl-10 h-12 text-lg"
          onFocus={() => setShowSuggestions(true)}
        />
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
        <button 
          type="submit" 
          className="absolute right-3 top-1/2 transform -translate-y-1/2 px-2 py-1 bg-neutral text-white rounded text-sm"
        >
          Search
        </button>
      </form>
      
      {showSuggestions && filteredSuggestions.length > 0 && (
        <div className="absolute mt-1 w-full bg-background border border-border rounded-md shadow-lg z-10 max-h-60 overflow-auto">
          {filteredSuggestions.map((coin) => (
            <div
              key={coin.symbol}
              className="flex items-center px-4 py-2 cursor-pointer hover:bg-secondary"
              onClick={() => handleSelectSuggestion(coin.symbol)}
            >
              <span className="mr-2 text-xl">{coin.logo}</span>
              <span className="font-medium">{coin.symbol}</span>
              <span className="ml-2 text-muted-foreground">{coin.name}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
