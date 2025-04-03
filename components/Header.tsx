import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function Header() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>PlateIt</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FEFADF',
    paddingTop: 10,
    alignItems: 'center',
  },
  title: {
    fontFamily: 'Cakecafe',
    fontSize: 28,
  },
});
