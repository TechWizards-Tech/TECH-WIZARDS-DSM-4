import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

// Import your screens
import Um from "./screens/Um";
import Dois from "./screens/Dois";

export type RootStackParamList = {
  FirstScreen: undefined;
  Dois: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="FirstScreen"
        screenOptions={{ headerShown: false }} // hides top header
      >
        <Stack.Screen name="FirstScreen" component={Um} />
        <Stack.Screen name="Dois" component={Dois} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}