import React from 'react';
import { StatusBar, useColorScheme } from 'react-native';
import AppNavigator from './src/navigation/AppNavigator';
import './src/i18n';

function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor="transparent"
        translucent
      />
      <AppNavigator />
    </>
  );
}

export default App;
