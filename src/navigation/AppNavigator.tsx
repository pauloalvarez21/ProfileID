import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import SplashScreen from '../screens/splash/SplashScreen';
import LoginScreen from '../screens/login/LoginScreen';
import EditProfileScreen from '../screens/editProfile/EditProfileScreen';
import ProfileDetailScreen from '../screens/profileDetail/ProfileDetailScreen';
import ForgotPasswordScreen from '../screens/forgotPassword/ForgotPasswordScreen';
import ResetPasswordScreen from '../screens/forgotPassword/ResetPasswordScreen';

export type RootStackParamList = {
  Splash: undefined;
  Login: undefined;
  EditProfile: { isEdit?: boolean } | undefined;
  ProfileDetail: undefined;
  ForgotPassword: undefined;
  ResetPassword: { email: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Splash"
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="EditProfile" component={EditProfileScreen} />
        <Stack.Screen name="ProfileDetail" component={ProfileDetailScreen} />
        <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
        <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
