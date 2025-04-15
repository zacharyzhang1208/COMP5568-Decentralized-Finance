import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Button from '../Common/Button/Index';
import './PoolDetail.css';

const PoolDetail = () => {
  const { poolId } = useParams();
  const navigate = useNavigate();

  // 模拟数据
  const poolData = {
    id: poolId,
    name: 'ETH/USDT',
    liquidity: '$1,234,567',
    volume24h: '$456,789',
    apy: '12.5%',
    token0: {
      symbol: 'ETH',
      amount: '500',
      value: '$1,000,000'
    },
    token1: {
      symbol: 'USDT',
      amount: '1,000,000',
      value: '$1,000,000'
    },
    fees24h: '$2,345',
    price: '2,000 USDT'
  };

  // 模拟交易记录数据
  const transactions = [
    {
      id: 1,
      type: 'swap',
      token0Amount: '-0.5 ETH',
      token1Amount: '+1000 USDT',
      price: '2000 USDT',
      timestamp: '2 minutes ago',
      txHash: '0x1234...5678'
    },
    {
      id: 2,
      type: 'add',
      token0Amount: '+1 ETH',
      token1Amount: '+2000 USDT',
      price: '2000 USDT',
      timestamp: '15 minutes ago',
      txHash: '0x8765...4321'
    },
    {
      id: 3,
      type: 'swap',
      token0Amount: '+0.3 ETH',
      token1Amount: '-600 USDT',
      price: '2000 USDT',
      timestamp: '1 hour ago',
      txHash: '0xabcd...efgh'
    }
  ];

  const getTransactionTypeClass = (type) => {
    switch (type) {
      case 'swap':
        return 'tx-type-swap';
      case 'add':
        return 'tx-type-add';
      case 'remove':
        return 'tx-type-remove';
      default:
        return '';
    }
  };

  return (
    <div className="pool-detail-container">
      <div className="pool-detail-header">
        <Button 
          variant="back" 
          onClick={() => navigate('/pool')}
        >
          ← Back to Pools
        </Button>
        <h2>{poolData.name} Pool</h2>
      </div>

      <div className="pool-detail-content">
        <div className="pool-stats-grid">
          <div className="stat-card">
            <h3>Liquidity</h3>
            <p className="stat-value">{poolData.liquidity}</p>
          </div>
          <div className="stat-card">
            <h3>24h Volume</h3>
            <p className="stat-value">{poolData.volume24h}</p>
          </div>
          <div className="stat-card">
            <h3>APY</h3>
            <p className="stat-value apy">{poolData.apy}</p>
          </div>
          <div className="stat-card">
            <h3>24h Fees</h3>
            <p className="stat-value">{poolData.fees24h}</p>
          </div>
        </div>

        <div className="pool-tokens">
          <h3>Pool Tokens</h3>
          <div className="token-grid">
            <div className="token-card">
              <div className="token-card-symbol">{poolData.token0.symbol}</div>
              <div className="token-card-amount">{poolData.token0.amount}</div>
            </div>
            <div className="token-card">
              <div className="token-card-symbol">{poolData.token1.symbol}</div>
              <div className="token-card-amount">{poolData.token1.amount}</div>
            </div>
          </div>
        </div>

        <div className="pool-transactions">
          <h3>Recent Transactions</h3>
          <table className="transaction-table">
            <thead>
              <tr>
                <th>Type</th>
                <th>Amount</th>
                <th>Price</th>
                <th>Time</th>
                <th>Hash</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map(tx => (
                <tr key={tx.id}>
                  <td>
                    <span className={`transaction-type ${getTransactionTypeClass(tx.type)}`}>
                      {tx.type.toUpperCase()}
                    </span>
                  </td>
                  <td>
                    <div>
                      <span className={tx.token0Amount.startsWith('-') ? 'amount-negative' : 'amount-positive'}>
                        {tx.token0Amount}
                      </span>
                      <br />
                      <span className={tx.token1Amount.startsWith('-') ? 'amount-negative' : 'amount-positive'}>
                        {tx.token1Amount}
                      </span>
                    </div>
                  </td>
                  <td>{tx.price}</td>
                  <td>{tx.timestamp}</td>
                  <td>
                    <a href={`https://etherscan.io/tx/${tx.txHash}`} target="_blank" rel="noopener noreferrer" className="tx-hash">
                      {tx.txHash}
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="pool-actions">
          <Button 
            variant="primary" 
            onClick={() => navigate(`/pool/${poolId}/add`)}
          >
            Add Liquidity
          </Button>
          <Button variant="outline">Remove Liquidity</Button>
          <Button variant="primary">Swap</Button>
        </div>
      </div>
    </div>
  );
};

export default PoolDetail; 