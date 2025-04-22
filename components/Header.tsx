import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '@/constants/Colors';

export default function Header() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>PlateIt</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.lightPrimary,
    paddingTop: 10,
    alignItems: 'center',
    marginBottom: 10
  },
  title: {
    fontFamily: 'Cakecafe',
    fontSize: 26,
  },
});
