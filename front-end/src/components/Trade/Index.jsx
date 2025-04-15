import React, { useState, useEffect, useRef } from 'react';
import { useWallet } from '../Common/WalletContext/Index';
import { useLanguage } from '../Common/LanguageContext/Index';
import TokenSelector from '../Common/TokenSelector/Index';
import './Index.css';

const Trade = () => {
  const { account, isConnected, connectWallet } = useWallet();
  const { language } = useLanguage();
  const [fromToken, setFromToken] = useState('ETH');
  const [toToken, setToToken] = useState('WETH');
  const [fromAmount, setFromAmount] = useState('');
  const [toAmount, setToAmount] = useState('');
  const [slippage, setSlippage] = useState(0.5);
  const [deadline, setDeadline] = useState(20);
  const [showFromDropdown, setShowFromDropdown] = useState(false);
  const [showToDropdown, setShowToDropdown] = useState(false);
  const fromDropdownRef = useRef(null);
  const toDropdownRef = useRef(null);

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

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (fromDropdownRef.current && !fromDropdownRef.current.contains(event.target)) {
        setShowFromDropdown(false);
      }
      if (toDropdownRef.current && !toDropdownRef.current.contains(event.target)) {
        setShowToDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSwap = async () => {
    if (!isConnected) {
      await connectWallet();
      return;
    }
    // 处理交易逻辑
    console.log('Swapping', fromAmount, fromToken, 'to', toAmount, toToken);
  };

  const handleSwapTokens = () => {
    // 交换 token
    const tempToken = fromToken;
    setFromToken(toToken);
    setToToken(tempToken);
    
    // 交换 amount
    const tempAmount = fromAmount;
    setFromAmount(toAmount);
    setToAmount(tempAmount);
  };

  return (
    <div className="trade-container">
      <div className="trade-header">
        <h1>{language === 'en' ? 'Swap' : '兑换'}</h1>
        <p>{language === 'en' ? 'Trade tokens in an instant' : '即时兑换代币'}</p>
      </div>
      <div className="swap-section">
        <div className="swap-content">
          <div className="token-input">
            <div className="token-input-header">
              <span>{language === 'en' ? 'From' : '从'}</span>
              <span>{language === 'en' ? 'Balance: 0.0' : '余额: 0.0'}</span>
            </div>
            <div className="token-input-content">
              <input
                type="number"
                className="token-amount"
                placeholder="0.0"
                value={fromAmount}
                onChange={(e) => setFromAmount(e.target.value)}
              />
              <TokenSelector
                selectedToken={fromToken}
                onSelect={setFromToken}
              />
            </div>
          </div>
          <div className="swap-arrow" onClick={handleSwapTokens}>
            ⇅
          </div>
          <div className="token-input">
            <div className="token-input-header">
              <span>{language === 'en' ? 'To' : '到'}</span>
              <span>{language === 'en' ? 'Balance: 0.0' : '余额: 0.0'}</span>
            </div>
            <div className="token-input-content">
              <input
                type="number"
                className="token-amount"
                placeholder="0.0"
                value={toAmount}
                onChange={(e) => setToAmount(e.target.value)}
              />
              <TokenSelector
                selectedToken={toToken}
                onSelect={setToToken}
              />
            </div>
          </div>
        </div>
        <button 
          className="swap-button"
          onClick={handleSwap}
          disabled={!isConnected}
        >
          {isConnected 
            ? (language === 'en' ? 'Swap' : '兑换')
            : (language === 'en' ? 'Connect Wallet' : '连接钱包')}
        </button>
      </div>
    </div>
  );
};

export default Trade; 