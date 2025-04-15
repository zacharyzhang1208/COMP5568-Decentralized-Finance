import React, { createContext, useState, useContext, useEffect } from 'react';
import { ethers } from 'ethers';

const WalletContext = createContext();

export const useWallet = () => useContext(WalletContext);

export const WalletProvider = ({ children }) => {
  const [account, setAccount] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [chainId, setChainId] = useState('');
  const [provider, setProvider] = useState(null);

  const checkIfWalletIsConnected = async () => {
    try {
      if (window.ethereum) {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        if (accounts.length > 0 && localStorage.getItem('walletConnected') === 'true') {
          setAccount(accounts[0]);
          setIsConnected(true);
          const chainId = await window.ethereum.request({ method: 'eth_chainId' });
          setChainId(chainId);
          setProvider(window.ethereum);
        } else {
          setAccount('');
          setIsConnected(false);
          setChainId('');
          setProvider(null);
        }
      }
    } catch (error) {
      console.error('Error checking wallet connection:', error);
      setAccount('');
      setIsConnected(false);
      setChainId('');
      setProvider(null);
    }
  };

  const connectWallet = async () => {
    try {
      if (!window.ethereum) {
        alert('Please install MetaMask!');
        return;
      }

      // 请求用户授权
      const accounts = await window.ethereum.request({ 
        method: 'eth_requestAccounts',
        params: [{ eth_accounts: {} }]
      });

      if (accounts.length > 0) {
        setAccount(accounts[0]);
        setIsConnected(true);
        const chainId = await window.ethereum.request({ method: 'eth_chainId' });
        setChainId(chainId);
        setProvider(window.ethereum);
        
        localStorage.setItem('walletConnected', 'true');

        // 监听账户变化
        window.ethereum.on('accountsChanged', (accounts) => {
          if (accounts.length > 0) {
            setAccount(accounts[0]);
          } else {
            setAccount('');
            setIsConnected(false);
            setProvider(null);
            localStorage.removeItem('walletConnected');
          }
        });

        // 监听网络变化
        window.ethereum.on('chainChanged', (chainId) => {
          setChainId(chainId);
          window.location.reload();
        });
      }
    } catch (error) {
      console.error('Error connecting wallet:', error);
      if (error.code === 4001) {
        // 用户拒绝了连接请求
        alert('Please connect to MetaMask to continue.');
      } else {
        alert('An error occurred while connecting to MetaMask.');
      }
    }
  };

  const disconnectWallet = async () => {
    try {
      if (window.ethereum) {
        // 移除所有事件监听器
        window.ethereum.removeAllListeners('accountsChanged');
        window.ethereum.removeAllListeners('chainChanged');

        // 撤销所有权限
        await window.ethereum.request({
          method: 'wallet_revokePermissions',
          params: [{
            eth_accounts: {}
          }]
        });

        // 重置所有状态
        setAccount('');
        setIsConnected(false);
        setChainId('');
        setProvider(null);

        // 清除本地存储
        localStorage.removeItem('walletConnected');
        localStorage.removeItem('lastConnectedAccount');
        sessionStorage.removeItem('walletState');
      }
    } catch (error) {
      console.error('Error disconnecting wallet:', error);
      // 即使出错也重置状态
      setAccount('');
      setIsConnected(false);
      setChainId('');
      setProvider(null);
    }
  };

  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);

  return (
    <WalletContext.Provider value={{
      account,
      isConnected,
      chainId,
      provider,
      connectWallet,
      disconnectWallet
    }}>
      {children}
    </WalletContext.Provider>
  );
}; 