// React Native
import { StyleSheet, Text, View, StatusBar } from 'react-native';
// Components
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
    <View style={styles.container}>
      <Text style={styles.text}>Open up App.tsx to start working on your app!</Text>
      {/* StatusBar do React Native */}
      <StatusBar barStyle={'light-content'} backgroundColor="transparent" translucent/>
    </View>
  );
}

// Styled Components

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#09090A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: '#fff',
    fontFamily: 'Inter_800ExtraBold'
  }
});
