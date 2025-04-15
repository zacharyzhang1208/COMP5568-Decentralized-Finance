import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWallet } from '../Common/WalletContext/Index';
import { useLanguage } from '../Common/LanguageContext/Index';
import SelectTokensModal from './SelectTokensModal';
import './Pool.css';

const Pool = () => {
  const navigate = useNavigate();
  const { account, isConnected, connectWallet } = useWallet();
  const { language } = useLanguage();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [positions, setPositions] = useState([
    {
      pair: 'ETH/WETH',
      liquidity: '100.00',
      share: '0.5%',
      value: '$1,000.00'
    },
    {
      pair: 'ETH/USDT',
      liquidity: '500.00',
      share: '1.2%',
      value: '$5,000.00'
    }
  ]);

  const pools = [
    {
      id: 1,
      name: 'ETH/USDT',
      liquidity: '$1,234,567',
      volume24h: '$456,789',
      apy: '12.5%',
    },
    {
      id: 2,
      name: 'ETH/DAI',
      liquidity: '$987,654',
      volume24h: '$234,567',
      apy: '10.2%',
    }
  ];

  const handleConnect = async () => {
    try {
      await connectWallet();
    } catch (error) {
      console.error('Error connecting wallet:', error);
    }
  };

  const handleCreatePosition = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleTokensSelected = (token0, token1) => {
    // 创建池子ID
    const poolId = `${token0.symbol}-${token1.symbol}`;
    // 直接导航到添加流动性页面
    navigate(`/pool/${poolId}/add`);
  };

  const handlePoolClick = (poolId) => {
    navigate(`/pool/${poolId}`);
  };

  return (
    <div className="pool-container">
      {/* Your Positions Card */}
      <div className="pool-card">
        <div className="pool-header">
          <h2>{language === 'en' ? 'Your Positions' : '你的持仓'}</h2>
          {!isConnected && (
            <button className="connect-button" onClick={handleConnect}>
              {language === 'en' ? 'Connect Wallet' : '连接钱包'}
            </button>
          )}
        </div>

        {isConnected ? (
          positions.length > 0 ? (
            <div className="positions-list">
              {positions.map((position, index) => (
                <div key={index} className="position-item">
                  <div className="shimmer"></div>
                  <div className="position-content">
                    <div className="position-pair">{position.pair}</div>
                    <div className="position-details">
                      <div className="detail-item">
                        <span className="detail-label">{language === 'en' ? 'Liquidity' : '流动性'}</span>
                        <span className="detail-value">{position.liquidity}</span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">{language === 'en' ? 'Share' : '份额'}</span>
                        <span className="detail-value">{position.share}</span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">{language === 'en' ? 'Value' : '价值'}</span>
                        <span className="detail-value">{position.value}</span>
                      </div>
                    </div>
                  </div>
                  <div className="position-actions">
                    <button 
                      className="action-button add"
                      onClick={() => {
                        // 将配对名称格式化为URL参数格式
                        const pairSymbols = position.pair.split('/');
                        const formattedPair = pairSymbols.join('-');
                        navigate(`/pool/${formattedPair}/add`);
                      }}
                    >
                      {language === 'en' ? 'Add' : '添加'}
                    </button>
                    <button 
                      className="action-button remove"
                      onClick={() => console.log('Remove liquidity')}
                    >
                      {language === 'en' ? 'Remove' : '移除'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-positions">
              <p>{language === 'en' ? 'No positions found' : '暂无持仓'}</p>
              <button 
                className="action-button add"
                onClick={handleCreatePosition}
              >
                {language === 'en' ? 'Create a position' : '创建持仓'}
              </button>
            </div>
          )
        ) : (
          <div className="connect-prompt">
            <p>{language === 'en' ? 'Connect your wallet to view your positions' : '连接钱包查看你的持仓'}</p>
          </div>
        )}
      </div>

      {/* Liquidity Pools Card */}
      <div className="liquidity-pool-section">
        <div className="section-header">
          <h2>{language === 'en' ? 'Liquidity Pools' : '流动性池'}</h2>
        </div>
        <table className="pool-table">
          <thead>
            <tr>
              <th>{language === 'en' ? 'Pool' : '池子'}</th>
              <th>{language === 'en' ? 'Liquidity' : '流动性'}</th>
              <th>{language === 'en' ? '24h Volume' : '24小时交易量'}</th>
              <th>{language === 'en' ? 'APY' : '年化收益率'}</th>
            </tr>
          </thead>
          <tbody>
            {pools.map((pool) => (
              <tr key={pool.id} onClick={() => handlePoolClick(pool.id)}>
                <td className="pool-name">{pool.name}</td>
                <td className="pool-value">{pool.liquidity}</td>
                <td className="pool-value">{pool.volume24h}</td>
                <td className="pool-apy">{pool.apy}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <SelectTokensModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onConfirm={handleTokensSelected}
      />
    </div>
  );
};

export default Pool;
