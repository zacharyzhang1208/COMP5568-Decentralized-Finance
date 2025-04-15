import React, { createContext, useState, useContext, useEffect } from 'react';
import { ethers } from 'ethers';
import { useWallet } from '../WalletContext/Index';

const ContractContext = createContext();

export const useContract = () => useContext(ContractContext);

// Sepolia测试网上的合约地址
const CONTRACT_ADDRESS = "0x6987e95e0a87b46427da690afa3d2e305dca2bd9";

// Uniswap V2 Router ABI
const CONTRACT_ABI = [
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_factory",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "_WETH",
        "type": "address"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "inputs": [],
    "name": "WETH",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "factory",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "amountIn",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "amountOutMin",
        "type": "uint256"
      },
      {
        "internalType": "address[]",
        "name": "path",
        "type": "address[]"
      },
      {
        "internalType": "address",
        "name": "to",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "deadline",
        "type": "uint256"
      }
    ],
    "name": "swapExactTokensForTokens",
    "outputs": [
      {
        "internalType": "uint256[]",
        "name": "amounts",
        "type": "uint256[]"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "amountOutMin",
        "type": "uint256"
      },
      {
        "internalType": "address[]",
        "name": "path",
        "type": "address[]"
      },
      {
        "internalType": "address",
        "name": "to",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "deadline",
        "type": "uint256"
      }
    ],
    "name": "swapExactETHForTokens",
    "outputs": [
      {
        "internalType": "uint256[]",
        "name": "amounts",
        "type": "uint256[]"
      }
    ],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "amountIn",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "amountOutMin",
        "type": "uint256"
      },
      {
        "internalType": "address[]",
        "name": "path",
        "type": "address[]"
      },
      {
        "internalType": "address",
        "name": "to",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "deadline",
        "type": "uint256"
      }
    ],
    "name": "swapExactTokensForETH",
    "outputs": [
      {
        "internalType": "uint256[]",
        "name": "amounts",
        "type": "uint256[]"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "amountIn",
        "type": "uint256"
      },
      {
        "internalType": "address[]",
        "name": "path",
        "type": "address[]"
      }
    ],
    "name": "getAmountsOut",
    "outputs": [
      {
        "internalType": "uint256[]",
        "name": "amounts",
        "type": "uint256[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "tokenA",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "tokenB",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "amountADesired",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "amountBDesired",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "amountAMin",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "amountBMin",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "to",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "deadline",
        "type": "uint256"
      }
    ],
    "name": "addLiquidity",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "amountA",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "amountB",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "liquidity",
        "type": "uint256"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];

export const ContractProvider = ({ children }) => {
  const { provider, account } = useWallet();
  const [contract, setContract] = useState(null);
  const [signer, setSigner] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const initializeContract = async () => {
      console.log('Initializing contract...');
      console.log('Provider:', provider);
      console.log('Account:', account);

      if (!provider) {
        console.log('Provider not available yet, waiting...');
        return;
      }

      if (!account) {
        console.log('Account not available yet, waiting...');
        return;
      }

      try {
        console.log('Creating ethers provider...');
        const ethersProvider = new ethers.BrowserProvider(provider);
        
        console.log('Getting signer...');
        const ethersSigner = await ethersProvider.getSigner();
        setSigner(ethersSigner);

        console.log('Creating contract instance...');
        const contractInstance = new ethers.Contract(
          CONTRACT_ADDRESS,
          CONTRACT_ABI,
          ethersSigner
        );
        setContract(contractInstance);
        setIsInitialized(true);
        setError(null);
        
        console.log('Contract initialized successfully');
      } catch (error) {
        console.error('Error initializing contract:', error);
        setError(error.message);
        setIsInitialized(false);
      }
    };

    initializeContract();
  }, [provider, account]);

  // 获取合约信息
  const getContractInfo = async () => {
    try {
      if (!contract) {
        throw new Error('Contract not initialized. Please connect your wallet first.');
      }
      console.log('Getting contract info...');
      
      // 获取 WETH 地址
      const wethAddress = await contract.WETH();
      console.log('WETH Address:', wethAddress);
      
      return { wethAddress };
    } catch (error) {
      console.error('Error getting contract info:', error);
      throw error;
    }
  };

  // 模拟交易（不会实际执行）
  const simulateSwap = async (amountIn, path) => {
    try {
      if (!contract) {
        return {
          success: false,
          message: 'Contract not initialized. Please connect your wallet first.',
          details: {
            provider: !!provider,
            account: !!account,
            isInitialized,
            error
          }
        };
      }

      console.log('Simulating swap...');
      console.log('Amount:', amountIn);
      console.log('Path:', path);
      
      // 获取预期输出金额
      const amounts = await contract.getAmountsOut(amountIn, path);
      console.log('Expected amounts:', amounts);
      
      return {
        success: true,
        message: 'Simulation successful',
        details: {
          amountIn: ethers.formatEther(amountIn),
          path: path,
          expectedAmounts: amounts.map(amount => ethers.formatEther(amount)),
          timestamp: new Date().toISOString(),
          network: await provider.getNetwork(),
          signer: await signer.getAddress()
        }
      };
    } catch (error) {
      console.error('Error simulating swap:', error);
      return {
        success: false,
        message: error.message,
        details: {
          error: error.toString()
        }
      };
    }
  };

  // 检查流动性池是否存在
  const checkPair = async (tokenA, tokenB) => {
    try {
      if (!contract) {
        throw new Error("Contract not initialized");
      }

      // 获取工厂合约地址
      const factoryAddress = await contract.factory();
      
      // 获取工厂合约实例
      const factoryContract = new ethers.Contract(
        factoryAddress,
        [
          "function getPair(address tokenA, address tokenB) external view returns (address pair)"
        ],
        provider
      );

      // 获取交易对地址
      const pairAddress = await factoryContract.getPair(tokenA, tokenB);
      
      return {
        success: true,
        exists: pairAddress !== "0x0000000000000000000000000000000000000000",
        pairAddress
      };
    } catch (error) {
      console.error('Check pair error:', error);
      return {
        success: false,
        message: error.message,
        details: { error: error.toString() }
      };
    }
  };

  // 添加流动性
  const addLiquidity = async (tokenA, tokenB, amountA, amountB) => {
    try {
      if (!contract || !signer) {
        throw new Error("Contract or signer not initialized");
      }

      // 获取工厂合约地址
      const factoryAddress = await contract.factory();
      
      // 获取工厂合约实例
      const factoryContract = new ethers.Contract(
        factoryAddress,
        [
          "function getPair(address tokenA, address tokenB) external view returns (address pair)",
          "function createPair(address tokenA, address tokenB) external returns (address pair)"
        ],
        signer
      );

      // 检查交易对是否已存在
      let pairAddress = await factoryContract.getPair(tokenA, tokenB);
      
      // 如果交易对不存在，创建新的交易对
      if (pairAddress === "0x0000000000000000000000000000000000000000") {
        const tx = await factoryContract.createPair(tokenA, tokenB);
        await tx.wait();
        pairAddress = await factoryContract.getPair(tokenA, tokenB);
      }

      // 获取交易对合约实例
      const pairContract = new ethers.Contract(
        pairAddress,
        [
          "function token0() external view returns (address)",
          "function token1() external view returns (address)",
          "function mint(address to) external returns (uint liquidity)"
        ],
        signer
      );

      // 获取代币合约实例
      const tokenAContract = new ethers.Contract(
        tokenA,
        [
          "function approve(address spender, uint amount) external returns (bool)",
          "function balanceOf(address owner) external view returns (uint)"
        ],
        signer
      );

      const tokenBContract = new ethers.Contract(
        tokenB,
        [
          "function approve(address spender, uint amount) external returns (bool)",
          "function balanceOf(address owner) external view returns (uint)"
        ],
        signer
      );

      // 检查代币余额
      const [balanceA, balanceB] = await Promise.all([
        tokenAContract.balanceOf(await signer.getAddress()),
        tokenBContract.balanceOf(await signer.getAddress())
      ]);

      if (balanceA < amountA || balanceB < amountB) {
        throw new Error("Insufficient token balance");
      }

      // 批准代币转移
      await Promise.all([
        tokenAContract.approve(pairAddress, amountA),
        tokenBContract.approve(pairAddress, amountB)
      ]);

      // 添加流动性
      const tx = await contract.addLiquidity(
        tokenA,
        tokenB,
        amountA,
        amountB,
        0, // amountAMin
        0, // amountBMin
        await signer.getAddress(),
        Math.floor(Date.now() / 1000) + 60 * 20 // 20分钟过期时间
      );

      const receipt = await tx.wait();

      return {
        success: true,
        transactionHash: receipt.hash,
        pairAddress
      };
    } catch (error) {
      console.error('Add liquidity error:', error);
      return {
        success: false,
        message: error.message,
        details: { error: error.toString() }
      };
    }
  };

  return (
    <ContractContext.Provider value={{
      contract,
      signer,
      getContractInfo,
      simulateSwap,
      checkPair,
      addLiquidity,
      isInitialized,
      error
    }}>
      {children}
    </ContractContext.Provider>
  );
}; 