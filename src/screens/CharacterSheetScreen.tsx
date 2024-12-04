//@ts-nocheck
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  ScrollView,
  Dimensions,
  SafeAreaView,
  Alert,
  TouchableOpacity,
  Modal,
  FlatList,
  StatusBar,
} from "react-native";
import { Icon } from "react-native-elements";
import AsyncStorage from "@react-native-async-storage/async-storage";

const { width } = Dimensions.get("window");

const diceTypes = [
  { label: "d4", sides: 4 },
  { label: "d6", sides: 6 },
  { label: "d8", sides: 8 },
  { label: "d10", sides: 10 },
  { label: "d12", sides: 12 },
  { label: "d20", sides: 20 },
  { label: "d100", sides: 100 },
];

const CharacterSheetScreen = ({ route, navigation }) => {
  const { characterId } = route.params;
  const [character, setCharacter] = useState(null);
  const [isDiceModalVisible, setDiceModalVisible] = useState(false);

  useEffect(() => {
    loadCharacterData();
  }, []);

  const loadCharacterData = async () => {
    try {
      const storedCharacters = await AsyncStorage.getItem("characters");
      const parsedCharacters = storedCharacters ? JSON.parse(storedCharacters) : [];
      const characterData = parsedCharacters.find((char) => char.id === characterId);

      if (characterData) {
        setCharacter(characterData);
      } else {
        Alert.alert("Error", "Character not found.");
        navigation.goBack();
      }
    } catch (error) {
      console.error("Failed to load character data:", error);
    }
  };

  const handleInputChange = (field, value, isAbility = false, abilityField = "") => {
    if (isAbility) {
      setCharacter((prevState) => ({
        ...prevState,
        abilities: {
          ...prevState.abilities,
          [field]: {
            ...prevState.abilities[field],
            [abilityField]: value,
          },
        },
      }));
    } else {
      setCharacter((prevState) => ({
        ...prevState,
        [field]: value,
      }));
    }
  };

  const handleSaveCharacter = async () => {
    try {
      const storedCharacters = await AsyncStorage.getItem("characters");
      const parsedCharacters = storedCharacters ? JSON.parse(storedCharacters) : [];

      const updatedCharacters = parsedCharacters.map((item) => (item.id === character.id ? character : item));

      await AsyncStorage.setItem("characters", JSON.stringify(updatedCharacters));
      Alert.alert("Success", "Character saved!");
    } catch (error) {
      console.error("Failed to save character data:", error);
      Alert.alert("Error", "Failed to save character data.");
    }
  };

  const rollDice = (sides) => {
    const result = Math.floor(Math.random() * sides) + 1;
    Alert.alert("Dice Roll Result", `You rolled a d${sides}: ${result}`);
    setDiceModalVisible(false);
  };

  if (!character) {
    return <Text style={{ color: "#fff", textAlign: "center", marginTop: 20 }}>Loading...</Text>;
  }

  return (
    <SafeAreaView style={{paddingTop: StatusBar.currentHeight}, styles.container}>
      {/* Dice Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isDiceModalVisible}
        onRequestClose={() => setDiceModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select a Dice Type</Text>
            <FlatList
              data={diceTypes}
              keyExtractor={(item) => item.label}
              renderItem={({ item }) => (
                <TouchableOpacity style={styles.diceOption} onPress={() => rollDice(item.sides)}>
                  <Text style={styles.diceOptionText}>{item.label}</Text>
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity style={styles.closeButton} onPress={() => setDiceModalVisible(false)}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Top Bar with Dice Icon */}
        <View style={styles.topBar}>
          <TouchableOpacity onPress={() => setDiceModalVisible(true)}>
            <Icon name="casino" type="material" color="#fff" />
          </TouchableOpacity>
          <View style={styles.healthContainer}>
            <TextInput
              style={[styles.healthText, !character.hitPoints && styles.inputError]}
              value={character.hitPoints}
              onChangeText={(text) => handleInputChange("hitPoints", text)}
              placeholder="Hit Points"
              placeholderTextColor="#FF6666"
            />
            <Text style={styles.healthSubText}>HIT POINTS</Text>
          </View>
          <TouchableOpacity onPress={handleSaveCharacter}>
            <Icon name="save" type="material" color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Character Info */}
        <View style={styles.characterInfo}>
          <TextInput
            style={[styles.characterName, !character.name && styles.inputError]}
            value={character.name}
            onChangeText={(text) => handleInputChange("name", text)}
            placeholder="Character Name"
            placeholderTextColor="#FF6666"
          />
          <TextInput
            style={[styles.characterClass, !character.raceClass && styles.inputError]}
            value={character.raceClass}
            onChangeText={(text) => handleInputChange("raceClass", text)}
            placeholder="Race | Class"
            placeholderTextColor="#FF6666"
          />
          <Image style={styles.characterImage} source={{ uri: "https://via.placeholder.com/80" }} />
        </View>

        {/* Main Stats */}
        <View style={styles.mainStats}>
          <EditableStatCard
            label="PROF. BONUS"
            value={character.profBonus}
            onChange={(value) => handleInputChange("profBonus", value)}
          />
          <EditableStatCard
            label="WLK. SPEED"
            value={character.walkSpeed}
            onChange={(value) => handleInputChange("walkSpeed", value)}
          />
          <EditableStatCard
            label="INITIATIVE"
            value={character.initiative}
            onChange={(value) => handleInputChange("initiative", value)}
          />
          <EditableStatCard
            label="ARMOR CLASS"
            value={character.armorClass}
            onChange={(value) => handleInputChange("armorClass", value)}
          />
        </View>

        {/* Abilities Section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionHeaderText}>Abilities, Saves, Senses</Text>
        </View>

        <View style={styles.abilitiesContainer}>
          {Object.keys(character.abilities).map((ability) => (
            <AbilityCard
              key={ability}
              label={ability.toUpperCase()}
              score={character.abilities[ability].score}
              modifier={character.abilities[ability].modifier}
              onScoreChange={(value) => handleInputChange(ability, value, true, "score")}
              onModifierChange={(value) => handleInputChange(ability, value, true, "modifier")}
            />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const EditableStatCard = ({ label, value, onChange }) => (
  <View style={styles.statCard}>
    <TextInput
      style={[styles.statValue, !value && styles.inputError]}
      value={value}
      onChangeText={onChange}
      placeholder={label}
      placeholderTextColor="#FF6666"
    />
    <Text style={styles.statLabel}>{label}</Text>
  </View>
);

const AbilityCard = ({ label, score, modifier, onScoreChange, onModifierChange }) => (
  <View style={styles.abilityCard}>
    <TextInput
      style={[styles.abilityModifier, !modifier && styles.inputError]}
      value={modifier}
      onChangeText={onModifierChange}
      placeholder="Mod"
      placeholderTextColor="#FF6666"
    />
    <Text style={styles.abilityLabel}>{label}</Text>
    <TextInput
      style={[styles.abilityScore, !score && styles.inputError]}
      value={score}
      onChangeText={onScoreChange}
      placeholder="Score"
      placeholderTextColor="#FF6666"
    />
  </View>
);

const SavingThrow = ({ label, modifier, onChange }) => (
  <View style={styles.savingThrow}>
    <Text style={styles.savingThrowLabel}>{label}</Text>
    <TextInput
      style={[styles.savingThrowModifier, !modifier && styles.inputError]}
      value={modifier}
      onChangeText={onChange}
      placeholder="Mod"
      placeholderTextColor="#FF6666"
    />
  </View>
);

const styles = StyleSheet.create({
  inputError: {
    borderColor: "#FF6666",
    borderWidth: 1,
  },
  scrollContainer: {
    padding: 10,
  },
  saveButton: {
    backgroundColor: "#444",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
  },
  container: {
    marginTop: 25,
    flexGrow: 1,
    backgroundColor: "#1E1E1E",
    padding: 10,
  },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: "#333",
    borderRadius: 10,
    marginBottom: 10,
  },
  time: {
    color: "#fff",
    fontSize: 18,
  },
  healthContainer: {
    alignItems: "center",
  },
  healthText: {
    color: "#fff",
    fontSize: 18,
  },
  healthSubText: {
    color: "#999",
    fontSize: 12,
  },
  characterInfo: {
    alignItems: "center",
    marginBottom: 20,
  },
  characterName: {
    color: "#fff",
    fontSize: 22,
  },
  characterClass: {
    color: "#bbb",
    fontSize: 16,
  },
  characterImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginVertical: 10,
  },
  mainStats: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  statCard: {
    alignItems: "center",
    width: width * 0.22,
    backgroundColor: "#444",
    padding: 10,
    borderRadius: 10,
  },
  statLabel: {
    color: "#bbb",
    fontSize: 12,
  },
  statValue: {
    color: "#fff",
    fontSize: 18,
    textAlign: "center",
  },
  sectionHeader: {
    backgroundColor: "#333",
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
  },
  sectionHeaderText: {
    color: "#fff",
    fontSize: 16,
  },
  abilitiesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  abilityCard: {
    alignItems: "center",
    width: width * 0.3,
    backgroundColor: "#444",
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
  },
  abilityModifier: {
    color: "#fff",
    fontSize: 18,
    textAlign: "center",
  },
  abilityLabel: {
    color: "#bbb",
    fontSize: 12,
  },
  abilityScore: {
    color: "#999",
    fontSize: 14,
    textAlign: "center",
  },
  savingThrowsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  savingThrow: {
    width: width * 0.44,
    backgroundColor: "#444",
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  savingThrowLabel: {
    color: "#bbb",
    fontSize: 14,
  },
  savingThrowModifier: {
    color: "#fff",
    fontSize: 14,
    textAlign: "center",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "#333",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
  },
  modalTitle: {
    color: "#fff",
    fontSize: 20,
    marginBottom: 20,
  },
  diceOption: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#444",
    width: "100%",
    alignItems: "center",
  },
  diceOptionText: {
    color: "#fff",
    fontSize: 18,
  },
  closeButton: {
    backgroundColor: "#444",
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
  },
  closeButtonText: {
    color: "#fff",
    fontSize: 16,
  },
});

export default CharacterSheetScreen;
