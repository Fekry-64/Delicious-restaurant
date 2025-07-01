import { createContext } from 'react';

const LanguageContext = createContext({
  language: 'en',
  toggleLanguage: () => {},
});

export default LanguageContext; 