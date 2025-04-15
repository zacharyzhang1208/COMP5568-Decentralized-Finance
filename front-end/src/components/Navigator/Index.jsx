import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useWallet } from '../Common/WalletContext/Index';
import { useLanguage } from '../Common/LanguageContext/Index';
import LanguageSelector from '../Common/LanguageSelector/Index';
import './Index.css';

const Navigator = () => {
  const navigate = useNavigate();
  const { account, isConnected, connectWallet, disconnectWallet } = useWallet();
  const { language } = useLanguage();
  const location = useLocation();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleConnect = async () => {
    try {
      await connectWallet();
    } catch (error) {
      console.error('Failed to connect wallet:', error);
    }
  };

  const handleDisconnect = () => {
    disconnectWallet();
  };

  const formatAddress = (address) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <div className="nav-left">
          <Link to="/" className="logo">
            DeFi
          </Link>
          <div className="nav-links">
            <Link
              to="/"
              className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
            >
              {language === 'en' ? 'Trade' : '交易'}
            </Link>
            <div className="dropdown-container" ref={dropdownRef}
              onMouseEnter={() => setDropdownOpen(true)} // 鼠标悬停在下拉菜单时保持展开
              onMouseLeave={() => setDropdownOpen(false)} // 鼠标离开下拉菜单时收起
            >
              <button
                className={`dropdown-toggle ${dropdownOpen ? 'active' : ''} ${location.pathname.includes('/pool') || location.pathname.includes('/tokens') ? 'active' : ''}`}
                onMouseEnter={() => setDropdownOpen(true)} // 鼠标悬停时展开

                onClick={() => {
                  navigate('/pool'); // 点击时导航到 Pool 页面
                  setDropdownOpen(false); // 收起下拉菜单
                }}
              >
                {language === 'en' ? 'Explore' : '探索'}
              </button>
              {dropdownOpen && (
                <div className="dropdown-menu">
                  <Link
                    to="/pool"
                    className={`dropdown-item ${location.pathname.startsWith('/pool') ? 'active' : ''}`}
                    onClick={() => setDropdownOpen(false)}
                  >
                    {language === 'en' ? 'Pool' : '流动性池'}
                  </Link>
                  <Link
                    to="/tokens"
                    className={`dropdown-item ${location.pathname.startsWith('/tokens') ? 'active' : ''}`}
                    onClick={() => setDropdownOpen(false)}
                  >
                    {language === 'en' ? 'Tokens' : '代币'}
                  </Link>
                </div>
              )}
            </div>
            <Link
              to="/transactions"
              className={`nav-link ${location.pathname.startsWith('/transactions') ? 'active' : ''}`}
            >
              {language === 'en' ? 'Transactions' : '交易记录'}
            </Link>
            <Link
              to="/settings"
              className={`nav-link ${location.pathname.startsWith('/settings') ? 'active' : ''}`}
            >
              {language === 'en' ? 'Settings' : '设置'}
            </Link>
          </div>
        </div>
        <div className="nav-right">
          <LanguageSelector />
          {isConnected ? (
            <div className="wallet-info">
              <span className="wallet-address">{formatAddress(account)}</span>
              <button className="disconnect-button" onClick={handleDisconnect}>
                {language === 'en' ? 'Disconnect' : '断开连接'}
              </button>
            </div>
          ) : (
            <button className="connect-button" onClick={handleConnect}>
              {language === 'en' ? 'Connect Wallet' : '连接钱包'}
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navigator;
