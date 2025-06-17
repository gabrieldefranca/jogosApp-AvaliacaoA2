import React, { createContext, useContext, useState } from 'react';
import { MD3DarkTheme, MD3LightTheme } from 'react-native-paper';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [isDarkTheme, setIsDarkTheme] = useState(false);

  const toggleTheme = () => setIsDarkTheme(prev => !prev);

  const theme = isDarkTheme ? MD3DarkTheme : MD3LightTheme;

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, isDarkTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useThemeContext = () => useContext(ThemeContext);