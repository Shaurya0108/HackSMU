import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const CardCount = ({ count }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Total Cards: {count}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginTop: 10,
  },
  text: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
});

export default CardCount;
