import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../Common/Button/Index';
import './SelectTokens.css';

const SelectTokens = () => {
  const navigate = useNavigate();
  const [token0, setToken0] = useState('');
  const [token1, setToken1] = useState('');

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
      if (token1 && token.symbol === token1.symbol) {
        setToken1('');
      }
    } else {
      setToken1(token);
      if (token0 && token.symbol === token0.symbol) {
        setToken0('');
      }
    }
  };

  const handleContinue = () => {
    if (token0 && token1) {
      // 创建新的池子ID（在实际应用中，这里应该使用合约地址）
      const poolId = `${token0.symbol}-${token1.symbol}`;
      navigate(`/pool/${poolId}/add`);
    }
  };

  return (
    <div className="select-tokens-container">
      <div className="select-tokens-header">
        <Button 
          variant="outline" 
          onClick={() => navigate('/pool')}
          className="back-button"
        >
          ← Back to Pools
        </Button>
        <h2>Select Tokens</h2>
      </div>

      <div className="select-tokens-content">
        <div className="token-selection">
          <div className="token-input-section">
            <h3>Token 1</h3>
            <div className="token-list">
              {tokens.map((token) => (
                <div
                  key={token.symbol}
                  className={`token-item ${token0?.symbol === token.symbol ? 'selected' : ''}`}
                  onClick={() => handleTokenSelect(token, true)}
                >
                  <div className="token-info">
                    <span className="token-symbol">{token.symbol}</span>
                    <span className="token-name">{token.name}</span>
                  </div>
                  <span className="token-address">{token.address}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="token-input-section">
            <h3>Token 2</h3>
            <div className="token-list">
              {tokens.map((token) => (
                <div
                  key={token.symbol}
                  className={`token-item ${token1?.symbol === token.symbol ? 'selected' : ''}`}
                  onClick={() => handleTokenSelect(token, false)}
                >
                  <div className="token-info">
                    <span className="token-symbol">{token.symbol}</span>
                    <span className="token-name">{token.name}</span>
                  </div>
                  <span className="token-address">{token.address}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="action-buttons">
          <Button 
            variant="primary" 
            onClick={handleContinue}
            disabled={!token0 || !token1}
          >
            Continue
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SelectTokens; 