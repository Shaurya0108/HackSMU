import React, { useState } from 'react';
import { StyleSheet, View, SafeAreaView, Text, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import FlipCard from 'react-native-flip-card';

const Separator = () => <View style={styles.separator} />;

const App = () => {
  const [cardData, setCardData] = useState([
    { id: 1, frontText: 'Card 1 Front', backText: 'Card 1 Back' },
    { id: 2, frontText: 'Card 2 Front', backText: 'Card 2 Back' },
    { id: 3, frontText: 'Card 3 Front', backText: 'Card 3 Back' },
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [filteredCards, setFilteredCards] = useState(cardData);

  const deleteCard = (id) => {
    const updatedCards = cardData.filter((card) => card.id !== id);
    setCardData(updatedCards);
  };

  const addCard = () => {
    Alert.prompt(
      'Add Card',
      'Enter the Front Text and Back Text for the new card:',
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
              setSearchQuery(''); // Clear the search query when adding a card
            }
          },
        },
      ],
      'plain-text'
    );
  };

  const handleSearch = () => {
    const filtered = cardData.filter((card) =>
      card.frontText.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredCards(filtered);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <Text style={styles.header}>Wallet</Text>

      {/* Search Bar */}
      <TextInput
        style={styles.searchInput}
        placeholder="Search by Front Text"
        value={searchQuery}
        onChangeText={(text) => setSearchQuery(text)}
        onSubmitEditing={handleSearch}
      />

      <ScrollView
        horizontal
        contentContainerStyle={[styles.cardScrollView, { marginTop: 10 }]}
      >
        {filteredCards.map((card) => (
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
    marginBottom: 140,
    color: 'white',
  },
  searchInput: {
    width: '80%',
    height: 40,
    borderColor: 'white',
    borderWidth: 1,
    borderRadius: 5,
    paddingLeft: 10,
    color: 'white',
    marginBottom: 10,
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