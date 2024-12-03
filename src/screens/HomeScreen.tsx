import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import { Swipeable } from "react-native-gesture-handler";
import { Icon } from "react-native-elements";

const characterTemplate = {
  id: null, // Vai ser botado automaticamente
  name: "",
  raceClass: "",
  hitPoints: "",
  profBonus: "",
  walkSpeed: "",
  initiative: "",
  armorClass: "",
  abilities: {
    strength: { score: "", modifier: "" },
    dexterity: { score: "", modifier: "" },
    constitution: { score: "", modifier: "" },
    intelligence: { score: "", modifier: "" },
    wisdom: { score: "", modifier: "" },
    charisma: { score: "", modifier: "" },
  },
  savingThrows: {
    strength: "",
    dexterity: "",
    constitution: "",
    intelligence: "",
    wisdom: "",
    charisma: "",
  },
};

const HomeScreen = ({ navigation }) => {
  const [characters, setCharacters] = useState([]);

  useFocusEffect(
    React.useCallback(() => {
      loadCharacters();
    }, [])
  );

  const loadCharacters = async () => {
    const storedCharacters = await AsyncStorage.getItem("characters");
    const parsedCharacters = storedCharacters ? JSON.parse(storedCharacters) : [];
    setCharacters(parsedCharacters);
  };

  const handleCreateCharacter = async () => {
    const newCharacter = {
      ...characterTemplate,
      id: Date.now(), 
    };

    const updatedCharacters = [...characters, newCharacter];
    setCharacters(updatedCharacters);

    try {
      await AsyncStorage.setItem("characters", JSON.stringify(updatedCharacters));
      Alert.alert("Success", "New character created");
    } catch (error) {
      console.error("Failed to save character:", error);
      Alert.alert("Error", "Failed to save character data.");
    }
  };

  const handleDeleteCharacter = async (characterId) => {
    const updatedCharacters = characters.filter((char) => char.id !== characterId);
    setCharacters(updatedCharacters);

    try {
      await AsyncStorage.setItem("characters", JSON.stringify(updatedCharacters));
      Alert.alert("Deleted", "Character has been deleted");
    } catch (error) {
      console.error("Failed to delete character:", error);
      Alert.alert("Error", "Failed to delete character data.");
    }
  };

  const renderRightActions = (characterId) => (
    <TouchableOpacity
      style={styles.deleteButton}
      onPress={() => handleDeleteCharacter(characterId)}
    >
      <Text style={styles.deleteButtonText}>Delete</Text>
    </TouchableOpacity>
  );

  const navigateToCharacter = (character) => {
    navigation.navigate("CharacterSheet", { characterId: character.id });
  };

  const handleDiceNavigation = () => {
    navigation.navigate("DiceRolling");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Character Sheets</Text>
      <FlatList
        data={characters}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <Swipeable
            renderRightActions={() => renderRightActions(item.id)}
          >
            <TouchableOpacity
              style={styles.characterItem}
              onPress={() => navigateToCharacter(item)}
            >
              <Text style={styles.characterText}>{item.name || "Unnamed Character"}</Text>
            </TouchableOpacity>
          </Swipeable>
        )}
      />
      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={styles.iconButton}
          onPress={handleDiceNavigation}
        >
          <Icon name="casino" type="material" color="#fff" size={20} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.createButton} onPress={handleCreateCharacter}>
          <Text style={styles.buttonText}>Create New Character</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1E1E1E",
    padding: 20,
  },
  iconButton: {
    flex: 1,
    padding: 15,
    borderRadius: 10,
    backgroundColor: "#444",
    marginRight: 10,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 20,
  },
  createButton: {
    flex: 3,
    padding: 15,
    borderRadius: 10,
    backgroundColor: "#444",
    alignItems: "center",
  },
  title: {
    color: "#FFFFFF",
    fontSize: 24,
    marginTop: 40,
    marginBottom: 20,
    fontWeight: "bold",
    textAlign: "center",
  },
  characterItem: {
    padding: 15,
    borderRadius: 10,
    backgroundColor: "#333",
    marginBottom: 10,
  },
  characterText: {
    color: "#FFFFFF",
    fontSize: 16,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  deleteButton: {
    backgroundColor: "#FF6666",
    justifyContent: "center",
    alignItems: "center",
    width: 80,
    borderRadius: 10,
    marginBottom: 10,
  },
  deleteButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default HomeScreen;
