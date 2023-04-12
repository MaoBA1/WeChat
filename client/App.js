import React, { useEffect, useState, useCallback } from 'react';
import * as Font from 'expo-font';
import { RootStack } from './src/navigation/index';
import { NavigationContainer } from '@react-navigation/native';



const loadFontsFromAssets = () => {
  return Font.loadAsync({
    'bold' : require('./assets/fonts/bold.ttf'),
    'boldItalic' : require('./assets/fonts/bolditalic.ttf'),
    'italic' : require('./assets/fonts/italic.ttf'),
    'regular' : require('./assets/fonts/regular.ttf'),
  });
}

export default function App() {
  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        // Pre-load fonts, make any API calls you need to do here
        await loadFontsFromAssets();
        // Artificially delay for two seconds to simulate a slow loading
        // experience. Please remove this if you copy and paste the code!
        await new Promise(resolve => setTimeout(resolve, 2000));
      } catch (e) {
        console.warn(e);
      } finally {
        // Tell the application to render
        setAppIsReady(true);
      }
    }
    
    prepare();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      await SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  if (!appIsReady) {
    return null;
  }


  return (
    <NavigationContainer>
      <RootStack/>
    </NavigationContainer>
  );
}


