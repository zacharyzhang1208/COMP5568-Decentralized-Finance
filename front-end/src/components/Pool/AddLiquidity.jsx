import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Navigate } from 'react-router-dom';
import { useLanguage } from '../Common/LanguageContext/Index';
import Button from '../Common/Button/Index';
import './AddLiquidity.css';

const AddLiquidity = () => {
  const navigate = useNavigate();
  const { poolId } = useParams();
  const { language } = useLanguage();
  const [selectedFeeTier, setSelectedFeeTier] = useState(null);
  const [token0Amount, setToken0Amount] = useState('');
  const [token1Amount, setToken1Amount] = useState('');

  // Redirect to pools page if no poolId is provided
  if (!poolId) {
    return <Navigate to="/pool" replace />;
  }

  const feeTiers = [
    {
      fee: '0.01%',
      description: language === 'en' 
        ? 'Best for very stable pairs' 
        : '最适合非常稳定的交易对',
      recommended: false
    },
    {
      fee: '0.05%',
      description: language === 'en'
        ? 'Best for stable pairs'
        : '最适合稳定的交易对',
      recommended: true
    },
    {
      fee: '0.3%',
      description: language === 'en'
        ? 'Best for most pairs'
        : '最适合大多数交易对',
      recommended: false
    },
    {
      fee: '1%',
      description: language === 'en'
        ? 'Best for exotic pairs'
        : '最适合波动较大的交易对',
      recommended: false
    }
  ];

  const handleBack = () => {
    navigate(`/pool/${poolId}`);
  };

  const handleAddLiquidity = () => {
    // TODO: Implement liquidity addition logic
    console.log('Adding liquidity...', {
      poolId,
      selectedFeeTier,
      token0Amount,
      token1Amount
    });
  };

  return (
    <div className="add-liquidity-container">
      <div className="add-liquidity-header">
        <Button 
          variant="back" 
          onClick={handleBack}
        >
          {language === 'en' ? 'Back' : '返回'}
        </Button>
        <h2>{language === 'en' ? 'Add Liquidity' : '添加流动性'}</h2>
      </div>

      <div className="add-liquidity-content">
        <section className="fee-tier-section">
          <h3>{language === 'en' ? 'Select Fee Tier' : '选择费率等级'}</h3>
          <div className="fee-tier-grid">
            {feeTiers.map((tier) => (
              <div
                key={tier.fee}
                className={`fee-tier-card ${selectedFeeTier === tier.fee ? 'selected' : ''} ${
                  tier.recommended ? 'recommended' : ''
                }`}
                onClick={() => setSelectedFeeTier(tier.fee)}
              >
                <div className="fee-tier-header">
                  <span className="fee-tier-label">{tier.fee}</span>
                  {tier.recommended && (
                    <span className="recommended-badge">
                      {language === 'en' ? 'Recommended' : '推荐'}
                    </span>
                  )}
                </div>
                <p className="fee-tier-description">{tier.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="price-info">
          <h3>{language === 'en' ? 'Current Price' : '当前价格'}</h3>
          <p>1 ETH = 1,800 USDC</p>
        </section>

        <section className="input-section">
          <div className="token-input">
            <div className="token-input-header">
              <h3>ETH</h3>
              <span className="balance">Balance: 1.5 ETH</span>
            </div>
            <div className="input-wrapper">
              <input
                type="number"
                value={token0Amount}
                onChange={(e) => setToken0Amount(e.target.value)}
                placeholder="0.0"
                min="0"
              />
              <span className="token-price">≈ $3,600</span>
            </div>
          </div>

          <div className="token-input">
            <div className="token-input-header">
              <h3>USDC</h3>
              <span className="balance">Balance: 5000 USDC</span>
            </div>
            <div className="input-wrapper">
              <input
                type="number"
                value={token1Amount}
                onChange={(e) => setToken1Amount(e.target.value)}
                placeholder="0.0"
                min="0"
              />
              <span className="token-price">≈ $3,600</span>
            </div>
          </div>
        </section>

        <section className="liquidity-info">
          <div className="info-item">
            <span>{language === 'en' ? 'Selected Fee Tier' : '已选费率'}</span>
            <span>{selectedFeeTier || '-'}</span>
          </div>
          <div className="info-item">
            <span>{language === 'en' ? 'Price Range' : '价格范围'}</span>
            <span>Full Range</span>
          </div>
          <div className="info-item">
            <span>{language === 'en' ? 'Estimated Pool Share' : '预计池占比'}</span>
            <span>{'< 0.01%'}</span>
          </div>
        </section>

        <div className="action-buttons">
          <Button
            variant="primary"
            onClick={handleAddLiquidity}
            disabled={!selectedFeeTier || !token0Amount || !token1Amount}
          >
            {language === 'en' ? 'Add Liquidity' : '添加流动性'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AddLiquidity; 