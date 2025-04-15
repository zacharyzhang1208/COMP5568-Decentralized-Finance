import React, { useState, useEffect } from 'react';
import { useContract } from '../Common/ContractContext/Index';
import { useWallet } from '../Common/WalletContext/Index';
import { ethers } from 'ethers';
import { useLanguage } from '../Common/LanguageContext/Index';
import './Settings.css';

const Settings = () => {
  const { getContractInfo, simulateSwap, checkPair, addLiquidity, error: contractError } = useContract();
  const { provider, account, isConnected, connectWallet } = useWallet();
  const [contractInfo, setContractInfo] = useState(null);
  const [testResult, setTestResult] = useState(null);
  const [error, setError] = useState(null);
  const [isCreatingPool, setIsCreatingPool] = useState(false);
  const [tokenBalances, setTokenBalances] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [ethBalance, setEthBalance] = useState(null);
  const [amountToAdd, setAmountToAdd] = useState({
    weth: "0.1",
    duffy: "1000"
  });
  const { language } = useLanguage();

  useEffect(() => {
    if (isConnected && provider) {
      checkBalances();
    }
  }, [isConnected, provider, account]);

  const checkBalances = async () => {
    try {
      setIsLoading(true);
      setError(null);

      if (!provider || !account) {
        throw new Error('Provider or account not available');
      }

      // Get ETH balance using BrowserProvider
      const web3Provider = new ethers.BrowserProvider(window.ethereum);
      const ethBalance = await web3Provider.getBalance(account);
      setEthBalance(ethBalance);

      const info = await getContractInfo();
      if (!info || !info.wethAddress) {
        throw new Error('Failed to get contract info');
      }

      const wethAddress = info.wethAddress;
      const duffyAddress = "0xd6cb746dbbfdf7b6a6522a784bc2a9e52d61c768";

      const balances = await checkTokenBalances(wethAddress, duffyAddress);
      setTokenBalances(balances);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const checkTokenBalances = async (wethAddress, duffyAddress) => {
    try {
      if (!provider || !account) {
        throw new Error('Provider or account not available');
      }

      // Create a new provider instance if needed
      const web3Provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await web3Provider.getSigner();

      const wethContract = new ethers.Contract(wethAddress, [
        "function balanceOf(address) view returns (uint256)",
        "function decimals() view returns (uint8)"
      ], signer);

      const duffyContract = new ethers.Contract(duffyAddress, [
        "function balanceOf(address) view returns (uint256)",
        "function decimals() view returns (uint8)"
      ], signer);

      const [wethBalance, wethDecimals, duffyBalance, duffyDecimals] = await Promise.all([
        wethContract.balanceOf(account),
        wethContract.decimals(),
        duffyContract.balanceOf(account),
        duffyContract.decimals()
      ]);

      const requiredWeth = ethers.parseEther("0.1");
      const requiredDuffy = ethers.parseEther("1000");

      return {
        weth: {
          balance: wethBalance,
          decimals: wethDecimals,
          required: requiredWeth,
          hasEnough: wethBalance >= requiredWeth
        },
        duffy: {
          balance: duffyBalance,
          decimals: duffyDecimals,
          required: requiredDuffy,
          hasEnough: duffyBalance >= requiredDuffy
        }
      };
    } catch (err) {
      console.error('Token balance check error:', err);
      throw new Error(`Failed to check token balances: ${err.message}`);
    }
  };

  const wrapEth = async () => {
    try {
      setIsLoading(true);
      setError(null);

      if (!provider || !account) {
        throw new Error('Provider or account not available');
      }

      const info = await getContractInfo();
      if (!info || !info.wethAddress) {
        throw new Error('Failed to get contract info');
      }

      const wethContract = new ethers.Contract(info.wethAddress, [
        "function deposit() payable",
        "function balanceOf(address) view returns (uint256)"
      ], provider.getSigner());

      const amount = ethers.parseEther("0.1"); // Wrap 0.1 ETH
      const tx = await wethContract.deposit({ value: amount });
      await tx.wait();

      // Refresh balances
      await checkBalances();
      setTestResult('Successfully wrapped 0.1 ETH to WETH');
    } catch (err) {
      setError(`Failed to wrap ETH: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const getDuffyTokens = async () => {
    try {
      setIsLoading(true);
      setError(null);

      if (!provider || !account) {
        throw new Error('Provider or account not available');
      }

      const duffyAddress = "0xd6cb746dbbfdf7b6a6522a784bc2a9e52d61c768";
      const duffyContract = new ethers.Contract(duffyAddress, [
        "function mint(address,uint256)",
        "function balanceOf(address) view returns (uint256)"
      ], provider.getSigner());

      const amount = ethers.parseEther("1000"); // Mint 1000 Duffy tokens
      const tx = await duffyContract.mint(account, amount);
      await tx.wait();

      // Refresh balances
      await checkBalances();
      setTestResult('Successfully minted 1000 Duffy tokens');
    } catch (err) {
      setError(`Failed to get Duffy tokens: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const testContractConnection = async () => {
    try {
      setError(null);
      setTestResult('Testing contract connection...');

      if (!isConnected) {
        throw new Error('Please connect your wallet first');
      }

      if (!provider) {
        throw new Error('Provider not available');
      }

      if (!account) {
        throw new Error('Account not available');
      }

      // 测试读取合约信息
      const info = await getContractInfo();
      setContractInfo(info);
      console.log('WETH Address:', info.wethAddress);
      setTestResult('Successfully got contract info');

      // 测试模拟交易，使用获取到的 WETH 地址和 Duffy 地址
      const wethAddress = info.wethAddress;
      const duffyAddress = "0xd6cb746dbbfdf7b6a6522a784bc2a9e52d61c768";
      
      // 检查流动性池是否存在
      const pairCheck = await checkPair(wethAddress, duffyAddress);
      setTestResult(prev => prev + '\nChecking liquidity pool: ' + JSON.stringify(pairCheck, null, 2));

      if (!pairCheck.exists) {
        throw new Error('No liquidity pool found for WETH-Duffy pair. Please try another token pair or add liquidity to the pool.');
      }

      // 确保地址顺序正确（token0 < token1）
      const path = wethAddress < duffyAddress 
        ? [wethAddress, duffyAddress]
        : [duffyAddress, wethAddress];

      const result = await simulateSwap(
        ethers.parseEther("0.1"),
        path
      );
      setTestResult(prev => prev + '\n' + JSON.stringify(result, null, 2));
    } catch (err) {
      setError(err.message);
      setTestResult('Test failed');
    }
  };

  const createLiquidityPool = async () => {
    try {
      setIsCreatingPool(true);
      setError(null);
      setTestResult('Creating liquidity pool...');

      if (!isConnected) {
        throw new Error('Please connect your wallet first');
      }

      // 获取合约信息
      const info = await getContractInfo();
      const wethAddress = info.wethAddress;
      const duffyAddress = "0xd6cb746dbbfdf7b6a6522a784bc2a9e52d61c768";

      // 检查代币余额
      const balances = await checkTokenBalances(wethAddress, duffyAddress);
      setTokenBalances(balances);

      if (!balances.weth.hasEnough || !balances.duffy.hasEnough) {
        throw new Error(
          `Insufficient token balance. Required: ${ethers.formatEther(balances.weth.required)} WETH and ${ethers.formatEther(balances.duffy.required)} Duffy. ` +
          `Current: ${ethers.formatEther(balances.weth.balance)} WETH and ${ethers.formatEther(balances.duffy.balance)} Duffy.`
        );
      }

      // 添加流动性
      const result = await addLiquidity(
        wethAddress,
        duffyAddress,
        ethers.parseEther("0.1"), // 0.1 WETH
        ethers.parseEther("1000") // 1000 Duffy tokens
      );

      setTestResult(prev => prev + '\n' + JSON.stringify(result, null, 2));
    } catch (err) {
      setError(err.message);
      setTestResult('Failed to create liquidity pool');
    } finally {
      setIsCreatingPool(false);
    }
  };

  const addWethBalance = async () => {
    try {
      setIsLoading(true);
      setError(null);

      if (!provider || !account) {
        throw new Error('Provider or account not available');
      }

      const info = await getContractInfo();
      if (!info || !info.wethAddress) {
        throw new Error('Failed to get contract info');
      }

      // 使用 BrowserProvider 获取 signer
      const web3Provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await web3Provider.getSigner();

      const wethContract = new ethers.Contract(info.wethAddress, [
        "function deposit() payable",
        "function balanceOf(address) view returns (uint256)"
      ], signer);

      const amount = ethers.parseEther(amountToAdd.weth);
      const tx = await wethContract.deposit({ value: amount });
      await tx.wait();

      // Refresh balances
      await checkBalances();
      setTestResult(`Successfully added ${amountToAdd.weth} WETH to your balance`);
    } catch (err) {
      setError(`Failed to add WETH: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const addDuffyBalance = async () => {
    try {
      setIsLoading(true);
      setError(null);

      if (!provider || !account) {
        throw new Error('Provider or account not available');
      }

      const duffyAddress = "0xd6cb746dbbfdf7b6a6522a784bc2a9e52d61c768";
      
      // 使用 BrowserProvider 获取 signer
      const web3Provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await web3Provider.getSigner();

      const duffyContract = new ethers.Contract(duffyAddress, [
        "function mint(address,uint256)",
        "function balanceOf(address) view returns (uint256)"
      ], signer);

      const amount = ethers.parseEther(amountToAdd.duffy);
      const tx = await duffyContract.mint(account, amount);
      await tx.wait();

      // Refresh balances
      await checkBalances();
      setTestResult(`Successfully added ${amountToAdd.duffy} Duffy tokens to your balance`);
    } catch (err) {
      setError(`Failed to add Duffy tokens: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="settings-container">
      <h1>{language === 'en' ? 'Settings' : '设置'}</h1>
      <div className="settings-section">
        <h2>{language === 'en' ? 'Network Settings' : '网络设置'}</h2>
        <div className="settings-content">
          <p>{language === 'en' ? 'Current Network: Sepolia Testnet' : '当前网络：Sepolia 测试网'}</p>
        </div>
      </div>
      <div className="settings-section">
        <h2>{language === 'en' ? 'Wallet Settings' : '钱包设置'}</h2>
        <div className="settings-content">
          <p>{language === 'en' ? 'Connected Wallet: MetaMask' : '已连接钱包：MetaMask'}</p>
        </div>
      </div>
      <div className="settings-section">
        <h2>{language === 'en' ? 'Language Settings' : '语言设置'}</h2>
        <div className="settings-content">
          <p>{language === 'en' ? 'Current Language: English' : '当前语言：中文'}</p>
        </div>
      </div>
      <div className="settings-section">
        <h2>Contract Tests</h2>
        
        {!isConnected ? (
          <button 
            onClick={connectWallet}
            className="connect-wallet-button"
          >
            Connect Wallet
          </button>
        ) : (
          <div className="settings-content">
            <div className="test-section">
              <h3>Contract Tests</h3>
              
              {ethBalance && (
                <div className="balance-section">
                  <h4>ETH Balance:</h4>
                  <p>{ethers.formatEther(ethBalance)} ETH</p>
                </div>
              )}

              {tokenBalances && (
                <div className="balance-section">
                  <h4>Token Balances:</h4>
                  <div className="balance-info">
                    <p>WETH Balance: {ethers.formatEther(tokenBalances.weth.balance)}</p>
                    <p>Required: {ethers.formatEther(tokenBalances.weth.required)}</p>
                    <p>Duffy Balance: {ethers.formatEther(tokenBalances.duffy.balance)}</p>
                    <p>Required: {ethers.formatEther(tokenBalances.duffy.required)}</p>
                  </div>
                </div>
              )}

              <div className="action-buttons">
                <div className="input-group">
                  <label>Add WETH Amount:</label>
                  <input
                    type="number"
                    value={amountToAdd.weth}
                    onChange={(e) => setAmountToAdd({...amountToAdd, weth: e.target.value})}
                    placeholder="0.1"
                    min="0"
                    step="0.1"
                  />
                  <button 
                    onClick={addWethBalance}
                    className="action-button"
                    disabled={isLoading || !ethBalance || ethBalance < ethers.parseEther(amountToAdd.weth)}
                  >
                    Add WETH
                  </button>
                </div>

                <div className="input-group">
                  <label>Add Duffy Amount:</label>
                  <input
                    type="number"
                    value={amountToAdd.duffy}
                    onChange={(e) => setAmountToAdd({...amountToAdd, duffy: e.target.value})}
                    placeholder="1000"
                    min="0"
                    step="100"
                  />
                  <button 
                    onClick={addDuffyBalance}
                    className="action-button"
                    disabled={isLoading}
                  >
                    Add Duffy
                  </button>
                </div>

                <button 
                  onClick={testContractConnection}
                  className="test-button"
                  disabled={isLoading}
                >
                  Test Contract Connection
                </button>

                <button 
                  onClick={createLiquidityPool}
                  className="test-button"
                  disabled={isCreatingPool || isLoading}
                >
                  {isCreatingPool ? 'Creating Pool...' : 'Create WETH-Duffy Pool'}
                </button>
              </div>

              {isLoading && (
                <div className="loading-section">
                  <p>Loading token balances...</p>
                </div>
              )}

              {contractInfo && (
                <div className="result-section">
                  <h4>Contract Info:</h4>
                  <pre className="result">
                    {JSON.stringify(contractInfo, null, 2)}
                  </pre>
                </div>
              )}

              {testResult && (
                <div className="result-section">
                  <h4>Test Result:</h4>
                  <pre className="result">{testResult}</pre>
                </div>
              )}

              {(error || contractError) && (
                <div className="error-section">
                  <h4>Error:</h4>
                  <p className="error">{error || contractError}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Settings; 