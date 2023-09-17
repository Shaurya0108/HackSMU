import React, { useState } from 'react';
import { StyleSheet, View, SafeAreaView, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import FlipCard from 'react-native-flip-card';

const Separator = () => <View style={styles.separator} />;

const App = () => {
  const [cardData, setCardData] = useState([
    { id: 1, frontText: 'Amazon Card', backText: 'Description:                         Use this card for amazon purchases                            Transaction History:                               $80 - 09/17/2023' },
    { id: 2, frontText: 'Netflix Card', backText: 'Card 2 Back' },
    { id: 3, frontText: 'Aliexpress Card', backText: 'Card 3 Back' },
  ]);

  const deleteCard = (id) => {
    const updatedCards = cardData.filter((card) => card.id !== id);
    setCardData(updatedCards);
  };

  const addCard = () => {
    Alert.prompt(
      'Add Card',
      'Enter the name of this card',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Add',
          onPress: (inputText) => {
            if (inputText) {
              const newCardId = cardData.length + 1;
              const newCard = {
                id: newCardId,
                frontText: inputText,
                backText: `Back of ${inputText}`,
              };
              setCardData([...cardData, newCard]);
            }
          },
        },
      ],
      'plain-text'
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <Text style={styles.header}>Wallet</Text>

      <ScrollView
        horizontal
        contentContainerStyle={[styles.cardScrollView, { marginTop: 10 }]}
      >
        {cardData.map((card) => (
          <View key={card.id} style={styles.cardContainer}>
            <FlipCard style={styles.card} friction={6} perspective={1000} flipHorizontal={true}>
              {/* Card Front */}
              <View style={[styles.cardContent, styles.cardFront]}>
                <Text style={styles.title}>{card.frontText}</Text>
              </View>
              
              {/* Card Back */}
              <View style={[styles.cardContent, styles.cardBack]}>
                <Text style={styles.title}>{card.backText}</Text>
              </View>
            </FlipCard>
            <TouchableOpacity style={styles.deleteButton} onPress={() => deleteCard(card.id)}>
              <Text style={styles.deleteButtonLabel}>Delete</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
      <TouchableOpacity style={styles.addButton} onPress={addCard}>
        <Text style={styles.addButtonLabel}>Add Card</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 150,
    color: 'white',
  },
  cardScrollView: {
    flexDirection: 'row',
  },
  cardContainer: {
    marginHorizontal: 16,
  },
  card: {
    width: 250,
    height: 100,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    padding: 16,
    borderWidth: 2,
    borderColor: 'white',
    backgroundColor: 'black',
    shadowColor: 'rgba(0, 0, 0, 0.1)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    elevation: 3,
  },
  cardContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardFront: {
    backgroundColor: 'black',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: 'white',
  },
  separator: {
    marginVertical: 8,
    borderBottomColor: '#737373',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  addButton: {
    backgroundColor: '#3498db',
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
  },
  addButtonLabel: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  deleteButton: {
    backgroundColor: 'red',
    padding: 5,
    borderRadius: 5,
    marginTop: 5,
    alignItems: 'center',
  },
  deleteButtonLabel: {
    color: 'white',
  },
});

export default App;