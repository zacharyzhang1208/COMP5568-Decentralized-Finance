import React, { createContext, useState, useContext, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

const LanguageContext = createContext();

export const useLanguage = () => useContext(LanguageContext);

export const LanguageProvider = ({ children }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [language, setLanguage] = useState(() => {
    // 从 localStorage 获取保存的语言设置
    const savedLanguage = localStorage.getItem('language');
    // 如果有保存的语言设置，使用它
    if (savedLanguage) {
      return savedLanguage;
    }
    // 否则从 URL 参数获取
    const lang = searchParams.get('lang');
    return lang || 'en';
  });

  useEffect(() => {
    // 保存语言设置到 localStorage
    localStorage.setItem('language', language);
    // 更新 URL 参数
    const newParams = new URLSearchParams(searchParams);
    newParams.set('lang', language);
    setSearchParams(newParams);
  }, [language, searchParams, setSearchParams]);

  const changeLanguage = (newLang) => {
    setLanguage(newLang);
  };

  return (
    <LanguageContext.Provider value={{ language, changeLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}; 