import React from 'react';
import Navigator from '../../Navigator/Index';
import './Layout.css';

const Layout = ({ children }) => {
  return (
    <div className="layout">
      <Navigator />
      <main className="layout-content">
        {children}
      </main>
    </div>
  );
};

export default Layout; 