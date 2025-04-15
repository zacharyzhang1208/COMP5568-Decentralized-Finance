import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { WalletProvider } from '../Common/WalletContext/Index';
import { LanguageProvider } from '../Common/LanguageContext/Index';
import { ContractProvider } from '../Common/ContractContext/Index';
import Navigator from '../Navigator/Index';
import Trade from '../Trade/Index';
import Pool from '../Pool/Index';
import PoolDetail from '../Pool/PoolDetail';
import AddLiquidity from '../Pool/AddLiquidity';
import SelectTokens from '../Pool/SelectTokens';
import Settings from '../Settings/Index';
import Transaction from '../Transaction/Index';
import Tokens from '../Tokens/Index';
import TokenDetail from '../Tokens/TokenDetail';
import BubbleBackground from '../Common/BubbleBackground/Index';
import './App.css';

const App = () => {
  return (
    <Router basename="/">
      <LanguageProvider>
        <WalletProvider>
          <ContractProvider>
            <div className="app">
              <BubbleBackground />
              <Navigator />
              <main className="main-content">
                <Routes>
                  <Route path="/" element={<Trade />} />
                  <Route path="/pool" element={<Pool />} />
                  <Route path="/pool/add" element={<SelectTokens />} />
                  <Route path="/pool/:poolId/add" element={<AddLiquidity />} />
                  <Route path="/pool/:poolId" element={<PoolDetail />} />
                  <Route path="/tokens" element={<Tokens />} />
                  <Route path="/tokens/:tokenId" element={<TokenDetail />} />
                  <Route path="/settings" element={<Settings />} />
                  <Route path="/transactions" element={<Transaction />} />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </main>
            </div>
          </ContractProvider>
        </WalletProvider>
      </LanguageProvider>
    </Router>
  );
};

export default App;
