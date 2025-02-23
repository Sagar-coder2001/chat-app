import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons'; // Make sure to install @expo/vector-icons

export default function Mainlayout() {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          }
          // Add more conditions for other tab screens

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#3B5249',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tabs.Screen name="Main" options={{ title: 'Home' }} />
      <Tabs.Screen name="UserProfile" options={{ title: 'UserProfile' }} />
      {/* Add more Tabs.Screen components for other tabs */}
    </Tabs>
  );
}