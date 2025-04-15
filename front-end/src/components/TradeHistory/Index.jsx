import React, { useState } from 'react';
import { useLanguage } from '../Common/LanguageContext/Index';
import './Index.css';

const TradeHistory = () => {
  const { language } = useLanguage();
  const [activeTab, setActiveTab] = useState('all');

  // 模拟交易历史数据
  const mockTrades = [
    {
      id: 1,
      type: 'swap',
      fromToken: 'ETH',
      toToken: 'WETH',
      fromAmount: '1.5',
      toAmount: '1.5',
      timestamp: '2024-03-20 14:30:00',
      status: 'completed'
    },
    {
      id: 2,
      type: 'swap',
      fromToken: 'WETH',
      toToken: 'USDT',
      fromAmount: '1.0',
      toAmount: '3000',
      timestamp: '2024-03-20 13:15:00',
      status: 'completed'
    }
  ];

  const getStatusText = (status) => {
    if (language === 'en') {
      return status.charAt(0).toUpperCase() + status.slice(1);
    }
    return status === 'completed' ? '已完成' : '进行中';
  };

  const getTypeText = (type) => {
    if (language === 'en') {
      return type.charAt(0).toUpperCase() + type.slice(1);
    }
    return type === 'swap' ? '兑换' : '添加流动性';
  };

  return (
    <div className="trade-history-container">
      <div className="trade-history-header">
        <h1>{language === 'en' ? 'Trade History' : '交易记录'}</h1>
        <div className="tabs">
          <button
            className={`tab ${activeTab === 'all' ? 'active' : ''}`}
            onClick={() => setActiveTab('all')}
          >
            {language === 'en' ? 'All' : '全部'}
          </button>
          <button
            className={`tab ${activeTab === 'swaps' ? 'active' : ''}`}
            onClick={() => setActiveTab('swaps')}
          >
            {language === 'en' ? 'Swaps' : '兑换'}
          </button>
          <button
            className={`tab ${activeTab === 'liquidity' ? 'active' : ''}`}
            onClick={() => setActiveTab('liquidity')}
          >
            {language === 'en' ? 'Liquidity' : '流动性'}
          </button>
        </div>
      </div>

      <div className="trade-list">
        {mockTrades.map(trade => (
          <div key={trade.id} className="trade-item">
            <div className="trade-info">
              <div className="trade-type">
                {getTypeText(trade.type)}
              </div>
              <div className="trade-amounts">
                <span>{trade.fromAmount} {trade.fromToken}</span>
                <span className="arrow">→</span>
                <span>{trade.toAmount} {trade.toToken}</span>
              </div>
              <div className="trade-timestamp">
                {trade.timestamp}
              </div>
            </div>
            <div className={`trade-status ${trade.status}`}>
              {getStatusText(trade.status)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TradeHistory; 