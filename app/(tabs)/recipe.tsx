import React, { useState, useCallback, useRef } from 'react';
import { ScrollView, View, Text, TextInput, Image, StyleSheet, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AntDesign from '@expo/vector-icons/AntDesign';
import { router } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import axios from 'axios';
import { colors } from '@/constants/Colors';

const generateRecipe = async (caption: string) => {
  try {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are an expert chef that generates simple and delicious recipes."
          },
          {
            role: "user",
            content: `Generate a recipe for "${caption}". 
            Provide a list of ingredients and step-by-step directions in JSON format with two keys: ingredients (array) and directions (array).
            Remember to format your response correctly so that there are no JSON Parse errors. There should be no trailing apostrophes!
            `
          }
        ],
        temperature: 0.7,
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.EXPO_PUBLIC_OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache'
        }
      }
    );

    const recipeData = response.data.choices[0].message.content;

    console.log(recipeData);

    return JSON.parse(recipeData);
  } catch (error) {
    console.error("Error generating recipe:", error);
    return { ingredients: [], directions: [] };
  }
};

export default function RecipeScreen() {
  const [recipe, setRecipe] = useState<any>(null);
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [directions, setDirections] = useState<string[]>([]);
  const [recipeImage, setRecipeImage] = useState<any>(null);
  const [generatePrompt, setGeneratePrompt] = useState('Not the recipe you\'re looking for? AI-generate a new one instead!');
  const [isEditing, setIsEditing] = useState(false);
  const [editedIngredients, setEditedIngredients] = useState<string[]>([]);
  const [editedDirections, setEditedDirections] = useState<string[]>([]);
  const ingredientRefs = useRef<Array<any>>([]);
  const directionRefs = useRef<Array<TextInput | null>>([]);

  useFocusEffect(
    useCallback(() => {
      const fetchSavedRecipe = async () => {
        try {
          const data = await AsyncStorage.getItem('clickedPost');
          if (data) {
            const parsedData = JSON.parse(data);

            if (!parsedData.ingredients.length || !parsedData.directions.length) {
                setGeneratePrompt("It looks like the recipe for this dish is either incomplete or missing. AI-generate one instead?");
            } else {
                setGeneratePrompt('Not the recipe you\'re looking for? AI-generate a new one instead!');
            }

            setRecipe(parsedData);
            setIngredients(parsedData.ingredients || []);
            setDirections(parsedData.directions || []);
            setRecipeImage(parsedData.image || null);
            setEditedIngredients(parsedData.ingredients || []);
            setEditedDirections(parsedData.directions || []);

          }
        } catch (error) {
          console.error('Error fetching saved recipe:', error);
        }
      };

      fetchSavedRecipe();
    }, [])
  );

  const handleClear = () => {
    setIngredients([" "]);
    setDirections([" "]);
    setEditedIngredients([" "]);
    setEditedDirections([" "]);
  };

  const handleGenerate = async () => {
    try {
        const data = await AsyncStorage.getItem('clickedPost');
        if (data) {
          const parsedData = JSON.parse(data);

          console.log("Generating missing recipe details...");
          const aiGenerated = await generateRecipe(parsedData.recipeName);
          parsedData.ingredients = aiGenerated.ingredients;
          parsedData.directions = aiGenerated.directions;

          setRecipe(parsedData);
          setIngredients(parsedData.ingredients || []);
          setDirections(parsedData.directions || []);
          setGeneratePrompt("Not the recipe you\'re looking for? AI-generate a new one instead!");
          setEditedIngredients(parsedData.ingredients || []);
          setEditedDirections(parsedData.directions || []);

        }
      } catch (error) {
        console.error('Error fetching saved recipe:', error);
      }
  };

  return (
    <View style={styles.background}>
        <View style={styles.titleContainer}>
            <TouchableOpacity
                onPress={() => {
                    router.push('/saved');
                }}
            >
              <AntDesign name="left" size={24} color="black" style={styles.icon} />
            </TouchableOpacity>

            <View style={styles.captionWrapper}>
              <Text style={styles.title} numberOfLines={2}>{recipe ? recipe.recipeName : ''}</Text>
            </View>
            
            <TouchableOpacity
                onPress={handleClear}
            >
              <View style={styles.clearView}>
                <Text style={styles.clearText}>Clear</Text>
              </View>
            </TouchableOpacity>
        </View>
        <Image source={recipeImage} style={styles.image} />
       
        <View style={styles.generatePrompt}>
          <Text style={styles.promptText}>{generatePrompt}</Text>
          <TouchableOpacity
            onPress={handleGenerate}
            style={styles.generateButton}
          >
            <Text style={styles.generateButtonText}>Generate</Text>
          </TouchableOpacity>
        </View>
      
        <ScrollView style={styles.recipeText}>
          <View>
            <Text style={styles.ingredientHeader}>Ingredients</Text>
            {isEditing ? (
              editedIngredients.map((item, idx) => (
                <View key={idx} style={{ flexDirection: 'row', alignItems: 'center'}}>
                  <Text style={{ marginRight: 5 }}>•</Text>
                  <TextInput
                    ref={(ref) => (ingredientRefs.current[idx] = ref)}
                    style={styles.editRecipeStep}
                    value={item}
                    onChangeText={(text) => {
                      if (text.endsWith('\n')) {
                        const trimmed = text.trim();
                        const newList = [...editedIngredients];
                        newList[idx] = trimmed;
                        newList.splice(idx + 1, 0, '');
                        setEditedIngredients(newList);
                    
                        setTimeout(() => {
                          if (ingredientRefs.current[idx + 1]) {
                            ingredientRefs.current[idx + 1].focus(); 
                          }
                        }, 0);

                      } else {
                        const newList = [...editedIngredients];
                        newList[idx] = text;
                        setEditedIngredients(newList);
                      }
                    }}
                    onKeyPress={({ nativeEvent }) => {
                      if (
                        nativeEvent.key === 'Backspace' &&
                        editedIngredients[idx] === '' &&
                        editedIngredients.length > 1
                      ) {
                        const newList = [...editedIngredients];
                        newList.splice(idx, 1);
                        setEditedIngredients(newList);

                        setTimeout(() => {
                          if (ingredientRefs.current[idx - 1]) {
                            ingredientRefs.current[idx - 1].focus();
                          }
                        }, 0);

                      }
                    }}
                    multiline
                  />
                </View>
              ))
            ) : (
              ingredients.map((item, idx) => (
                <TouchableOpacity key={idx} onPress={() => setIsEditing(true)}>
                  <Text style={styles.recipeStep}>• {item}</Text>
                </TouchableOpacity>
              ))
            )}
          </View>

          <View>
            <Text style={styles.directionHeader}>Directions</Text>
            {isEditing ? (
              editedDirections.map((step, idx) => (
                <View key={idx} style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Text style={styles.recipeStep}>{idx + 1}. </Text>
                  <TextInput
                    ref={(ref) => (directionRefs.current[idx] = ref)}
                    style={styles.editRecipeStep}
                    value={step}
                    multiline
                    onChangeText={(text) => {
                      if (text.endsWith('\n')) {
                        const trimmed = text.trim();
                        const newList = [...editedDirections];
                        newList[idx] = trimmed;
                        newList.splice(idx + 1, 0, '');
                        setEditedDirections(newList);

                        setTimeout(() => {
                          if (directionRefs.current[idx + 1]) {
                            directionRefs.current[idx + 1]?.focus();
                          }
                        }, 0);

                      } else {
                        const newList = [...editedDirections];
                        newList[idx] = text;
                        setEditedDirections(newList);
                      }
                    }}
                    onKeyPress={({ nativeEvent }) => {
                      if (
                        nativeEvent.key === 'Backspace' &&
                        editedDirections[idx] === '' &&
                        editedDirections.length > 1
                      ) {
                        const newList = [...editedDirections];
                        newList.splice(idx, 1);
                        setEditedDirections(newList);

                        setTimeout(() => {
                          if (directionRefs.current[idx - 1]) {
                            directionRefs.current[idx - 1]?.focus();
                          }
                        }, 0);

                      }
                    }}
                  />
                </View>
              ))
            ) : (
              directions.map((step, idx) => (
                <TouchableOpacity key={idx} onPress={() => setIsEditing(true)}>
                  <Text style={styles.recipeStep}>{idx + 1}. {step}</Text>
                </TouchableOpacity>
              ))
            )}
          </View>

          {isEditing && (
            <View style={{ alignItems: 'center'}}>
              <TouchableOpacity
                style={styles.saveButton}
                onPress={() => {
                  setIngredients(editedIngredients);
                  setDirections(editedDirections);
                  setIsEditing(false);
                }}
              >
                <Text style={styles.generateButtonText}>Save Changes</Text>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  background: {
    backgroundColor: colors.lightPrimary,
    height: "100%",
    alignItems: "center",
  },
  container: {
    padding: 10,
  },
  title: {
    fontFamily: 'Cakecafe',
    fontSize: 25,
    fontWeight: 'bold',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    marginTop: 10
  },
  icon: {
    marginRight: 10,
  },
  captionWrapper: {
    flex: 1, 
    flexShrink: 1,
  },
  image: {
    marginTop: 10,
    height: 150,
    width: 150
  },
  clearView: {
    borderStyle: "solid",
    borderColor: colors.lightSecondary,
    borderWidth: 3,
    borderRadius: 20,
    marginRight: 10,
    paddingTop: 3,
    paddingBottom: 3,
    paddingRight: 5,
    paddingLeft: 5
  },
  clearText: {
    fontSize: 14,
    color: colors.darkPrimary,
    fontWeight: "bold"
  },
  recipeText: {
    width: '100%',
    paddingHorizontal: 8,
    paddingVertical: 12,
    paddingLeft: 20,
    flex: 1,
    marginBottom: 10
  },
  ingredientHeader: {
    fontSize: 20,
    fontWeight: "bold",
  },
  directionHeader: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 15
  },
  recipeStep: {
    marginTop: 5
  },
  generatePrompt: {
    backgroundColor: colors.lightSecondary,
    width: "90%",
    borderRadius: 20,
    padding: 10,
    marginTop: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  promptText: {
    textAlign: 'center',
    marginBottom: 10,
    fontSize: 13,
    fontStyle: "italic"
  },
  generateButton: {
    backgroundColor: colors.darkPrimary,
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 10,
  },
  saveButton: {
    backgroundColor: colors.darkPrimary,
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 10,
    marginTop: 15
  },
  generateButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  editRecipeStep: {
    backgroundColor: "white",
    padding: 5,
    width: "90%",
  },
})