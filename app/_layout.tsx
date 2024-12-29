import { useFonts} from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Button } from 'react-native';
import { View, ActivityIndicator, StyleSheet, Text } from 'react-native';

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  if (!loaded) {
    return (
      <View style={styles.centeredContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <StatusBar
        translucent={true}
        style="light"
        backgroundColor='#3B5249'
      />

      <Stack>
        <Stack.Screen
          name="index"
          options={{
            headerShown: false,
            headerStyle: {
              backgroundColor: 'lightblue', // Set header background color here
            },
          }}
        />

        <Stack.Screen name="main" options={{ headerShown: false }} />

        <Stack.Screen name="opentext" options={{ headerShown: false }} />

        <Stack.Screen name="UserProfile" options={{ headerShown: false }} />

      </Stack>
    </View>
  );
}

// Styles
const styles = StyleSheet.create({
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
