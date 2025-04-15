import React, { useState } from 'react';
import { Line, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  Filler
} from 'chart.js';
import { useLanguage } from '../Common/LanguageContext/Index';
import './Index.css';

// 注册Chart.js组件
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  Filler
);

const Transaction = () => {
  const { language } = useLanguage();
  const [timeRange, setTimeRange] = useState('24h');

  // 模拟交易数据
  const transactions = [
    {
      id: 1,
      type: 'swap',
      tokenIn: 'ETH',
      tokenOut: 'USDT',
      amountIn: '1.5',
      amountOut: '3000',
      price: '2000',
      timestamp: '2024-03-20 10:30:00',
      hash: '0x1234...5678'
    },
    {
      id: 2,
      type: 'add',
      tokenIn: 'ETH',
      tokenOut: 'USDT',
      amountIn: '2.0',
      amountOut: '4000',
      price: '2000',
      timestamp: '2024-03-20 09:15:00',
      hash: '0x8765...4321'
    },
    {
      id: 3,
      type: 'remove',
      tokenIn: 'ETH',
      tokenOut: 'USDT',
      amountIn: '1.0',
      amountOut: '2000',
      price: '2000',
      timestamp: '2024-03-20 08:45:00',
      hash: '0xabcd...efgh'
    }
  ];

  // 模拟24小时交易量数据
  const volumeData = {
    labels: Array.from({ length: 24 }, (_, i) => `${i}:00`),
    datasets: [
      {
        label: '交易量 (ETH)',
        data: Array.from({ length: 24 }, () => Math.random() * 100),
        borderColor: '#1976d2',
        backgroundColor: 'rgba(25, 118, 210, 0.1)',
        tension: 0.4,
        fill: true
      }
    ]
  };

  // 模拟交易类型分布数据
  const typeData = {
    labels: ['Swap', 'Add Liquidity', 'Remove Liquidity'],
    datasets: [
      {
        data: [65, 20, 15],
        backgroundColor: ['#6366f1', '#22c55e', '#f43f5e'],
        borderWidth: 0,
        hoverOffset: 4
      }
    ]
  };

  // 图表配置
  const volumeOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: false
      }
    },
    scales: {
      y: {
        beginAtZero: true
      }
    }
  };

  const typeOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 20,
          usePointStyle: true,
          pointStyle: 'circle',
          font: {
            size: 12
          }
        }
      },
      title: {
        display: false
      }
    },
    layout: {
      padding: {
        top: 10,
        bottom: 20,
        left: 20,
        right: 20
      }
    },
    cutout: '60%'
  };

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
    <div className="transaction-container">
      <div className="charts-container">
        <div className="chart-card">
          <div className="chart-header">
            <div className="chart-title">
              {language === 'en' ? 'Trading Volume' : '交易量'}
            </div>
            <div className="time-range-selector">
              <button
                className={`time-range-button ${timeRange === '24h' ? 'active' : ''}`}
                onClick={() => setTimeRange('24h')}
              >
                24H
              </button>
              <button
                className={`time-range-button ${timeRange === '7d' ? 'active' : ''}`}
                onClick={() => setTimeRange('7d')}
              >
                7D
              </button>
              <button
                className={`time-range-button ${timeRange === '30d' ? 'active' : ''}`}
                onClick={() => setTimeRange('30d')}
              >
                30D
              </button>
            </div>
          </div>
          <div className="chart-content">
            <Line options={volumeOptions} data={volumeData} />
          </div>
        </div>
        <div className="chart-card">
          <div className="chart-header">
            <div className="chart-title">
              {language === 'en' ? 'Transaction Types' : '交易类型'}
            </div>
          </div>
          <div className="chart-content">
            <Pie options={typeOptions} data={typeData} />
          </div>
        </div>
      </div>

      <div className="transaction-list">
        <div className="transaction-header-row">
          <span>{language === 'en' ? 'Type' : '类型'}</span>
          <span>{language === 'en' ? 'Pair' : '代币对'}</span>
          <span>{language === 'en' ? 'Amount' : '数量'}</span>
          <span>{language === 'en' ? 'Price' : '价格'}</span>
          <span>{language === 'en' ? 'Time' : '时间'}</span>
          <span>{language === 'en' ? 'Hash' : '交易哈希'}</span>
        </div>
        {transactions.map(transaction => (
          <div key={transaction.id} className="transaction-row">
            <span className={`transaction-type ${transaction.type}`}>
              {getTypeText(transaction.type)}
            </span>
            <span>{transaction.tokenIn}/{transaction.tokenOut}</span>
            <span>{transaction.amountIn} {transaction.tokenIn}</span>
            <span>${transaction.price}</span>
            <span>{transaction.timestamp}</span>
            <span className="transaction-hash">
              <a href={`https://etherscan.io/tx/${transaction.hash}`} target="_blank" rel="noopener noreferrer">
                {transaction.hash}
              </a>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Transaction; 