import React from 'react';
import { View, Image } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/AppNavigator';

import { useSplash } from './useSplash';
import { styles } from './styles';

type Props = NativeStackScreenProps<RootStackParamList, 'Splash'>;

const SplashScreen = ({ navigation }: Props) => {
  useSplash(navigation.replace);

  return (
    <View style={styles.container}>
      <Image
        source={require('../../../assets/images/profile.jpeg')}
        style={styles.logo}
        resizeMode="contain"
      />
    </View>
  );
};

export default SplashScreen;
