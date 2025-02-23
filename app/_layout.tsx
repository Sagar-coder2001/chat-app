import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View, ActivityIndicator, StyleSheet } from 'react-native';

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  return (
    <View style={{ flex: 1 }}>
      <StatusBar translucent={true} style="light" backgroundColor="#3B5249" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: '#3B5249' },
          headerTintColor: '#fff',
          headerTitleAlign: 'center',
        }}
      >
        <Stack.Screen name="index" options={{ headerShown: false }} />

        <Stack.Screen name="opentext" options={{ headerShown: false }} />

        <Stack.Screen
          name="main"
          options={{
            headerTitle: 'New Chat Title',
            headerShown: true // Ensure the header is visible
          }}
        />

        <Stack.Screen name="userprofile" options={{ headerShown: false }} />



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