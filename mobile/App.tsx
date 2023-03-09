// React Native
import { StyleSheet, Text, View, StatusBar } from 'react-native';
// Components
import { Home } from './src/screens/Home';
import { Loading } from './src/components/Loading';
// Font Import
import { 
  useFonts, 
  Inter_400Regular, 
  Inter_600SemiBold, 
  Inter_700Bold, 
  Inter_800ExtraBold 
} from '@expo-google-fonts/inter';


export default function App() {

  const [ fontsLoaded ] = useFonts({
    Inter_400Regular, 
    Inter_600SemiBold, 
    Inter_700Bold, 
    Inter_800ExtraBold 
  });

  if (!fontsLoaded) {
    return (
      <Loading />
    );
  };

  return (
    <>
      <Home />
      {/* StatusBar do React Native */}
      <StatusBar barStyle={'light-content'} backgroundColor="transparent" translucent/>
    </>
  );
}