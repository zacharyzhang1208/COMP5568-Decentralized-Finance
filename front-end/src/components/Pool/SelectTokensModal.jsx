import React, { useState } from 'react';
import { useLanguage } from '../Common/LanguageContext/Index';
import './SelectTokensModal.css';

const SelectTokensModal = ({ isOpen, onClose, onConfirm }) => {
  const { language } = useLanguage();
  const [token0, setToken0] = useState(null);
  const [token1, setToken1] = useState(null);
  const [isDropdown0Open, setIsDropdown0Open] = useState(false);
  const [isDropdown1Open, setIsDropdown1Open] = useState(false);

  // 模拟代币列表
  const tokens = [
    { symbol: 'ETH', name: 'Ethereum', address: '0x...' },
    { symbol: 'USDT', name: 'Tether USD', address: '0x...' },
    { symbol: 'USDC', name: 'USD Coin', address: '0x...' },
    { symbol: 'DAI', name: 'Dai Stablecoin', address: '0x...' },
    { symbol: 'WBTC', name: 'Wrapped Bitcoin', address: '0x...' }
  ];

  const handleTokenSelect = (token, isToken0) => {
    if (isToken0) {
      setToken0(token);
      setIsDropdown0Open(false);
      if (token1 && token.symbol === token1.symbol) {
        setToken1(null);
      }
    } else {
      setToken1(token);
      setIsDropdown1Open(false);
      if (token0 && token.symbol === token0.symbol) {
        setToken0(null);
      }
    }
  };

  const handleConfirm = () => {
    if (token0 && token1) {
      onConfirm(token0, token1);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={() => {
      setIsDropdown0Open(false);
      setIsDropdown1Open(false);
    }}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{language === 'en' ? 'Select Tokens' : '选择代币'}</h2>
          <button className="close-button" onClick={onClose}>&times;</button>
        </div>
        
        <div className="token-selection">
          <div className="token-dropdown-container">
            <h3>{language === 'en' ? 'Token 1' : '代币 1'}</h3>
            <div className="token-dropdown">
              <div 
                className="token-dropdown-header" 
                onClick={(e) => {
                  e.stopPropagation();
                  setIsDropdown0Open(!isDropdown0Open);
                  setIsDropdown1Open(false);
                }}
              >
                {token0 ? (
                  <div className="selected-token">
                    <span className="token-symbol">{token0.symbol}</span>
                    <span className="token-name">{token0.name}</span>
                  </div>
                ) : (
                  <span className="placeholder">
                    {language === 'en' ? 'Select token' : '选择代币'}
                  </span>
                )}
                <span className="dropdown-arrow">▼</span>
              </div>
              {isDropdown0Open && (
                <div className="dropdown-list">
                  {tokens.map((token) => (
                    <div
                      key={token.symbol}
                      className={`dropdown-item ${token0?.symbol === token.symbol ? 'selected' : ''}`}
                      onClick={() => handleTokenSelect(token, true)}
                    >
                      <span className="token-symbol">{token.symbol}</span>
                      <span className="token-name">{token.name}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="token-dropdown-container">
            <h3>{language === 'en' ? 'Token 2' : '代币 2'}</h3>
            <div className="token-dropdown">
              <div 
                className="token-dropdown-header" 
                onClick={(e) => {
                  e.stopPropagation();
                  setIsDropdown1Open(!isDropdown1Open);
                  setIsDropdown0Open(false);
                }}
              >
                {token1 ? (
                  <div className="selected-token">
                    <span className="token-symbol">{token1.symbol}</span>
                    <span className="token-name">{token1.name}</span>
                  </div>
                ) : (
                  <span className="placeholder">
                    {language === 'en' ? 'Select token' : '选择代币'}
                  </span>
                )}
                <span className="dropdown-arrow">▼</span>
              </div>
              {isDropdown1Open && (
                <div className="dropdown-list">
                  {tokens.map((token) => (
                    <div
                      key={token.symbol}
                      className={`dropdown-item ${token1?.symbol === token.symbol ? 'selected' : ''}`}
                      onClick={() => handleTokenSelect(token, false)}
                    >
                      <span className="token-symbol">{token.symbol}</span>
                      <span className="token-name">{token.name}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button 
            className="cancel-button" 
            onClick={onClose}
          >
            {language === 'en' ? 'Cancel' : '取消'}
          </button>
          <button
            className="confirm-button"
            onClick={handleConfirm}
            disabled={!token0 || !token1}
          >
            {language === 'en' ? 'Continue' : '继续'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SelectTokensModal; 