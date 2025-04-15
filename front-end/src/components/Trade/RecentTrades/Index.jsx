import React from 'react';
import './RecentTrades.css';

const RecentTrades = () => {
  const trades = [
    {
      time: '10:30 AM',
      type: 'buy',
      amount: '0.5 ETH',
      price: '$2,500.00',
      total: '$1,250.00'
    },
    {
      time: '10:25 AM',
      type: 'sell',
      amount: '0.3 ETH',
      price: '$2,480.00',
      total: '$744.00'
    }
  ];

  return (
    <div className="trade-history">
      <h3>Recent Trades</h3>
      <div className="trade-list">
        {trades.map((trade, index) => (
          <div key={index} className="trade-item">
            <span className="trade-time">{trade.time}</span>
            <span className={`trade-type ${trade.type}`}>
              {trade.type.charAt(0).toUpperCase() + trade.type.slice(1)}
            </span>
            <span className="trade-amount">{trade.amount}</span>
            <span className="trade-price">{trade.price}</span>
            <span className="trade-total">{trade.total}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentTrades; 