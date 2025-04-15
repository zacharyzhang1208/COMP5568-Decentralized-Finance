import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../Common/LanguageContext/Index';
import './Tokens.css';

const Tokens = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [tokens, setTokens] = useState([
    {
      id: 'ethereum',
      symbol: 'ETH',
      name: 'Ethereum',
      logo: 'https://assets.coingecko.com/coins/images/279/small/ethereum.png',
      price: 3245.67,
      priceChange24h: 2.34,
      marketCap: 389456789012,
      volume24h: 24567890123,
    },
    {
      id: 'bitcoin',
      symbol: 'BTC',
      name: 'Bitcoin',
      logo: 'https://assets.coingecko.com/coins/images/1/small/bitcoin.png',
      price: 42567.89,
      priceChange24h: -1.23,
      marketCap: 789456123890,
      volume24h: 45678901234,
    },
    {
      id: 'tether',
      symbol: 'USDT',
      name: 'Tether',
      logo: 'https://assets.coingecko.com/coins/images/325/small/Tether.png',
      price: 1.00,
      priceChange24h: 0.01,
      marketCap: 67890123456,
      volume24h: 78901234567,
    },
    {
      id: 'binancecoin',
      symbol: 'BNB',
      name: 'BNB',
      logo: 'https://assets.coingecko.com/coins/images/825/small/bnb-icon2_2x.png',
      price: 345.67,
      priceChange24h: 4.56,
      marketCap: 45678901234,
      volume24h: 12345678901,
    },
    {
      id: 'usd-coin',
      symbol: 'USDC',
      name: 'USD Coin',
      logo: 'https://assets.coingecko.com/coins/images/6319/small/USD_Coin_icon.png',
      price: 0.99,
      priceChange24h: -0.02,
      marketCap: 56789012345,
      volume24h: 23456789012,
    },
    {
      id: 'ripple',
      symbol: 'XRP',
      name: 'XRP',
      logo: 'https://assets.coingecko.com/coins/images/44/small/xrp-symbol-white-128.png',
      price: 0.58,
      priceChange24h: 3.45,
      marketCap: 34567890123,
      volume24h: 12345678901,
    },
    {
      id: 'solana',
      symbol: 'SOL',
      name: 'Solana',
      logo: 'https://assets.coingecko.com/coins/images/4128/small/solana.png',
      price: 145.78,
      priceChange24h: 5.67,
      marketCap: 67890123456,
      volume24h: 34567890123,
    },
    {
      id: 'cardano',
      symbol: 'ADA',
      name: 'Cardano',
      logo: 'https://assets.coingecko.com/coins/images/975/small/cardano.png',
      price: 0.67,
      priceChange24h: -2.34,
      marketCap: 23456789012,
      volume24h: 12345678901,
    }
  ]);

  // 格式化市值和交易量
  const formatLargeNumber = (num) => {
    if (num >= 1000000000) {
      return `$${(num / 1000000000).toFixed(2)}B`;
    } else if (num >= 1000000) {
      return `$${(num / 1000000).toFixed(2)}M`;
    } else {
      return `$${num.toFixed(2)}`;
    }
  };

  // 根据搜索词过滤代币
  const filteredTokens = tokens.filter(token => {
    return (
      token.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      token.symbol.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const handleTokenClick = (tokenId) => {
    navigate(`/tokens/${tokenId}`);
  };

  return (
    <div className="tokens-container">
      <div className="tokens-header">
        <h2>{language === 'en' ? 'Tokens' : '代币'}</h2>
      </div>

      <div className="search-container">
        <input
          type="text"
          className="search-input"
          placeholder={language === 'en' ? 'Search tokens...' : '搜索代币...'}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <span className="search-icon">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="10.5" cy="10.5" r="7" />
            <line x1="16.5" y1="16.5" x2="21" y2="21" /> {/* 调整手柄的起始位置 */}
          </svg>
        </span>
      </div>

      <div className="tokens-card">
        {filteredTokens.length > 0 ? (
          <table className="tokens-table">
            <thead>
              <tr>
                <th>#</th>
                <th>{language === 'en' ? 'Token' : '代币'}</th>
                <th>{language === 'en' ? 'Price' : '价格'}</th>
                <th>{language === 'en' ? '24h' : '24小时'}</th>
                <th className="market-cap-col">{language === 'en' ? 'Market Cap' : '市值'}</th>
                <th className="volume-col">{language === 'en' ? 'Volume (24h)' : '交易量 (24小时)'}</th>
              </tr>
            </thead>
            <tbody>
              {filteredTokens.map((token, index) => (
                <tr key={token.id} onClick={() => handleTokenClick(token.id)}>
                  <td>{index + 1}</td>
                  <td>
                    <div className="token-name-cell">
                      <div className="token-icon">
                        <img 
                          src={token.logo} 
                          alt={token.name} 
                          width="20" 
                          height="20"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = `https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons/128/color/${token.symbol.toLowerCase()}.png`;
                          }}
                        />
                      </div>
                      <div>
                        <div className="token-symbol">{token.symbol}</div>
                        <div className="token-name">{token.name}</div>
                      </div>
                    </div>
                  </td>
                  <td className="price-cell">${token.price.toFixed(2)}</td>
                  <td className={`price-change ${token.priceChange24h >= 0 ? 'price-up' : 'price-down'}`}>
                    {token.priceChange24h >= 0 ? '+' : ''}{token.priceChange24h.toFixed(2)}%
                  </td>
                  <td className="market-cap-col">{formatLargeNumber(token.marketCap)}</td>
                  <td className="volume-col">{formatLargeNumber(token.volume24h)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="empty-state">
            <div className="icon">🔍</div>
            <p>
              {language === 'en'
                ? 'No tokens found matching your search.'
                : '未找到匹配的代币。'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Tokens; 