import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../LanguageContext/Index';
import './Index.css';

const tokens = [
  {
    symbol: 'ETH',
    name: 'Ethereum',
    icon: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/info/logo.png'
  },
  {
    symbol: 'WETH',
    name: 'Wrapped Ethereum',
    icon: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/info/logo.png'
  },
  {
    symbol: 'USDT',
    name: 'Tether USD',
    icon: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xdAC17F958D2ee523a2206206994597C13D831ec7/logo.png'
  },
  {
    symbol: 'DAI',
    name: 'Dai Stablecoin',
    icon: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x6B175474E89094C44Da98b954EedeAC495271d0F/logo.png'
  }
];

const TokenSelector = ({ selectedToken, onSelect }) => {
  const { language } = useLanguage();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const selectedTokenData = tokens.find(t => t.symbol === selectedToken);

  return (
    <div className="token-selector" ref={dropdownRef}>
      <div 
        className="token-selector-trigger"
        onClick={() => setShowDropdown(!showDropdown)}
      >
        <img src={selectedTokenData.icon} alt={selectedTokenData.symbol} className="token-icon" />
        <span className="token-symbol">{selectedTokenData.symbol}</span>
        <span className="dropdown-arrow">▼</span>
      </div>
      {showDropdown && (
        <div className="token-selector-dropdown">
          {tokens.map(token => (
            <div
              key={token.symbol}
              className="token-option"
              onClick={() => {
                onSelect(token.symbol);
                setShowDropdown(false);
              }}
            >
              <img src={token.icon} alt={token.symbol} className="token-icon" />
              <span className="token-symbol">{token.symbol}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TokenSelector; 