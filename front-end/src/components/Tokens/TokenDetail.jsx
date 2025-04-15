import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useLanguage } from '../Common/LanguageContext/Index';
import './Tokens.css';

const TokenDetail = () => {
  const { tokenId } = useParams();
  const { language } = useLanguage();
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 模拟API调用
    setTimeout(() => {
      // 这里为了演示，使用硬编码的代币数据
      const tokenData = {
        id: tokenId,
        symbol: tokenId === 'ethereum' ? 'ETH' : 
               tokenId === 'bitcoin' ? 'BTC' : 
               tokenId === 'tether' ? 'USDT' : 
               tokenId === 'bnb' ? 'BNB' : 
               tokenId === 'usd-coin' ? 'USDC' : 
               tokenId === 'xrp' ? 'XRP' : 
               tokenId === 'solana' ? 'SOL' : 
               tokenId === 'cardano' ? 'ADA' : 'UNKNOWN',
        name: tokenId === 'ethereum' ? 'Ethereum' : 
              tokenId === 'bitcoin' ? 'Bitcoin' : 
              tokenId === 'tether' ? 'Tether' : 
              tokenId === 'bnb' ? 'BNB' : 
              tokenId === 'usd-coin' ? 'USD Coin' : 
              tokenId === 'xrp' ? 'XRP' : 
              tokenId === 'solana' ? 'Solana' : 
              tokenId === 'cardano' ? 'Cardano' : 'Unknown Token',
        logo: tokenId === 'ethereum' ? 'https://assets.coingecko.com/coins/images/279/small/ethereum.png' :
              tokenId === 'bitcoin' ? 'https://assets.coingecko.com/coins/images/1/small/bitcoin.png' :
              tokenId === 'tether' ? 'https://assets.coingecko.com/coins/images/325/small/Tether.png' :
              tokenId === 'bnb' ? 'https://assets.coingecko.com/coins/images/825/small/bnb-icon2_2x.png' :
              tokenId === 'usd-coin' ? 'https://assets.coingecko.com/coins/images/6319/small/USD_Coin_icon.png' :
              tokenId === 'xrp' ? 'https://assets.coingecko.com/coins/images/44/small/xrp-symbol-white-128.png' :
              tokenId === 'solana' ? 'https://assets.coingecko.com/coins/images/4128/small/solana.png' :
              tokenId === 'cardano' ? 'https://assets.coingecko.com/coins/images/975/small/cardano.png' :
              '',
        price: tokenId === 'ethereum' ? 3245.67 : 
               tokenId === 'bitcoin' ? 42567.89 : 
               tokenId === 'tether' ? 1.00 : 
               tokenId === 'bnb' ? 345.67 : 
               tokenId === 'usd-coin' ? 0.99 : 
               tokenId === 'xrp' ? 0.58 : 
               tokenId === 'solana' ? 145.78 : 
               tokenId === 'cardano' ? 0.67 : 0,
        priceChange24h: tokenId === 'ethereum' ? 2.34 : 
                        tokenId === 'bitcoin' ? -1.23 : 
                        tokenId === 'tether' ? 0.01 : 
                        tokenId === 'bnb' ? 4.56 : 
                        tokenId === 'usd-coin' ? -0.02 : 
                        tokenId === 'xrp' ? 3.45 : 
                        tokenId === 'solana' ? 5.67 : 
                        tokenId === 'cardano' ? -2.34 : 0,
        marketCap: tokenId === 'ethereum' ? 389456789012 : 
                   tokenId === 'bitcoin' ? 789456123890 : 
                   tokenId === 'tether' ? 67890123456 : 
                   tokenId === 'bnb' ? 45678901234 : 
                   tokenId === 'usd-coin' ? 56789012345 : 
                   tokenId === 'xrp' ? 34567890123 : 
                   tokenId === 'solana' ? 67890123456 : 
                   tokenId === 'cardano' ? 23456789012 : 0,
        volume24h: tokenId === 'ethereum' ? 24567890123 : 
                   tokenId === 'bitcoin' ? 45678901234 : 
                   tokenId === 'tether' ? 78901234567 : 
                   tokenId === 'bnb' ? 12345678901 : 
                   tokenId === 'usd-coin' ? 23456789012 : 
                   tokenId === 'xrp' ? 12345678901 : 
                   tokenId === 'solana' ? 34567890123 : 
                   tokenId === 'cardano' ? 12345678901 : 0,
        circulatingSupply: tokenId === 'ethereum' ? 120000000 : 
                           tokenId === 'bitcoin' ? 19000000 : 
                           tokenId === 'tether' ? 82000000000 : 
                           tokenId === 'bnb' ? 155000000 : 
                           tokenId === 'usd-coin' ? 43000000000 : 
                           tokenId === 'xrp' ? 45000000000 : 
                           tokenId === 'solana' ? 345000000 : 
                           tokenId === 'cardano' ? 35000000000 : 0,
        description: tokenId === 'ethereum' ? 'Ethereum is a decentralized, open-source blockchain with smart contract functionality.' : 
                    tokenId === 'bitcoin' ? 'Bitcoin is a decentralized digital currency, without a central bank or single administrator.' : 
                    tokenId === 'tether' ? 'Tether is a stablecoin pegged to the US dollar.' : 
                    tokenId === 'bnb' ? 'BNB is the native token of the Binance ecosystem.' : 
                    tokenId === 'usd-coin' ? 'USD Coin is a digital stablecoin pegged to the United States dollar.' : 
                    tokenId === 'xrp' ? 'XRP is the native cryptocurrency of the XRP Ledger.' : 
                    tokenId === 'solana' ? 'Solana is a high-performance blockchain supporting smart contracts and decentralized applications.' : 
                    tokenId === 'cardano' ? 'Cardano is a proof-of-stake blockchain platform with multi-layer architecture.' : 'No description available.',
      };

      setToken(tokenData);
      setLoading(false);
    }, 1000);
  }, [tokenId]);

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

  if (loading) {
    return (
      <div className="tokens-container">
        <div className="loading-state">
          {language === 'en' ? 'Loading token data...' : '加载代币数据中...'}
        </div>
      </div>
    );
  }

  if (!token) {
    return (
      <div className="tokens-container">
        <div className="error-state">
          {language === 'en' ? 'Token not found.' : '找不到该代币。'}
          <Link to="/tokens" className="back-link">
            {language === 'en' ? 'Back to Tokens' : '返回代币列表'}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="tokens-container">
      <div className="tokens-header">
        <Link to="/tokens" className="back-link">
          ← {language === 'en' ? 'Back to Tokens' : '返回代币列表'}
        </Link>
      </div>

      <div className="token-detail-header">
        <div className="token-detail-info">
          <div className="token-detail-icon">
            <img 
              src={token.logo} 
              alt={token.name} 
              width="40" 
              height="40"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = `https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons/128/color/${token.symbol.toLowerCase()}.png`;
              }}
            />
          </div>
          <div className="token-detail-name">
            <h1>{token.name} ({token.symbol})</h1>
            <div className={`price-change ${token.priceChange24h >= 0 ? 'price-up' : 'price-down'}`}>
              ${token.price.toFixed(2)} 
              <span>
                {token.priceChange24h >= 0 ? '+' : ''}{token.priceChange24h.toFixed(2)}%
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="tokens-card token-detail-card">
        <h3>{language === 'en' ? 'Overview' : '概览'}</h3>
        
        <div className="token-stats">
          <div className="token-stat-item">
            <div className="stat-label">{language === 'en' ? 'Market Cap' : '市值'}</div>
            <div className="stat-value">{formatLargeNumber(token.marketCap)}</div>
          </div>
          <div className="token-stat-item">
            <div className="stat-label">{language === 'en' ? 'Volume (24h)' : '交易量 (24小时)'}</div>
            <div className="stat-value">{formatLargeNumber(token.volume24h)}</div>
          </div>
          <div className="token-stat-item">
            <div className="stat-label">{language === 'en' ? 'Circulating Supply' : '流通量'}</div>
            <div className="stat-value">{token.circulatingSupply.toLocaleString()}</div>
          </div>
        </div>

        <h3>{language === 'en' ? 'About' : '关于'}</h3>
        <p className="token-description">
          {token.description}
        </p>

        <div className="token-actions">
          <button className="token-action-button">
            {language === 'en' ? 'Trade' : '交易'} {token.symbol}
          </button>
          <button className="token-action-button secondary">
            {language === 'en' ? 'Add to Pool' : '添加到流动性池'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TokenDetail; 