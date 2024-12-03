import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";

const diceTypes = [
  { label: "d4", sides: 4 },
  { label: "d6", sides: 6 },
  { label: "d8", sides: 8 },
  { label: "d10", sides: 10 },
  { label: "d12", sides: 12 },
  { label: "d20", sides: 20 },
  { label: "d100", sides: 100 },
];

const DiceRollingScreen = ({ navigation }) => {
  const [result, setResult] = useState(null);

  const rollDice = (sides: any) => {
    const rolledNumber = Math.floor(Math.random() * sides) + 1;
    setResult({ sides, rolledNumber });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select a Dice to Roll</Text>

      <FlatList
        data={diceTypes}
        keyExtractor={(item) => item.label}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.diceOption}
            onPress={() => rollDice(item.sides)}
          >
            <Text style={styles.diceOptionText}>{item.label}</Text>
          </TouchableOpacity>
        )}
      />

      {result && (
        <View style={styles.resultContainer}>
          <Text style={styles.resultText}>
            Rolled a d{result.sides}: {result.rolledNumber}
          </Text>
        </View>
      )}

      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.backButtonText}>Go Back</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1E1E1E",
    padding: 20,
  },
  title: {
    color: "#FFFFFF",
    fontSize: 24,
    marginTop: 40,
    marginBottom: 20,
    fontWeight: "bold",
    textAlign: "center",
  },
  diceOption: {
    padding: 15,
    borderRadius: 10,
    backgroundColor: "#333",
    marginBottom: 10,
    alignItems: "center",
  },
  diceOptionText: {
    color: "#FFFFFF",
    fontSize: 16,
  },
  resultContainer: {
    marginTop: 20,
    padding: 15,
    borderRadius: 10,
    backgroundColor: "#444",
    alignItems: "center",
  },
  resultText: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "bold",
  },
  backButton: {
    padding: 15,
    borderRadius: 10,
    backgroundColor: "#555",
    alignItems: "center",
    marginTop: 20,
  },
  backButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
  },
});

export default DiceRollingScreen;
