import React, { useEffect, useState, useCallback } from 'react';
import { ScrollView, View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AntDesign from '@expo/vector-icons/AntDesign';
import { router } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import axios from 'axios';

const generateRecipe = async (caption: string) => {
    console.log(process.env.EXPO_PUBLIC_OPENAI_API_KEY);
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
        //   'Authorization': `Bearer ${key}`,
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache'
        }
      }
    );

    const recipeData = response.data.choices[0].message.content;

    console.log(recipeData);

    return JSON.parse(recipeData); // Should return { ingredients: [...], directions: [...] }
  } catch (error) {
    console.error("Error generating recipe:", error);
    return { ingredients: [], directions: [] };
  }
};

export default function RecipeScreen() {
  const [recipe, setRecipe] = useState<any>(null);
  const [ingredients, setIngredients] = useState([]);
  const [directions, setDirections] = useState([]);
  const [recipeImage, setRecipeImage] = useState<any>(null);
  const [generatePrompt, setGeneratePrompt] = useState('Not the recipe you\'re looking for? AI-generate a new one instead!');

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
          }
        } catch (error) {
          console.error('Error fetching saved recipe:', error);
        }
      };

      fetchSavedRecipe();
    }, [])
  );

  const handleClear = () => {
    setIngredients([]);
    setDirections([]);
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
            <Text style={styles.ingredientHeader}>Ingredients</Text>
            {ingredients?.map((item:any, idx:any) => (
            <Text key={idx} style={styles.recipeStep}>• {item}</Text>
            ))}
            <Text style={styles.directionHeader}>Directions</Text>
            {directions?.map((step:any, idx:any) => (
            <Text key={idx} style={styles.recipeStep}>{idx + 1}. {step}</Text>
            ))}
        </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  background: {
    backgroundColor: '#FEFADF',
    height: "100%",
    alignItems: "center",
  },
  container: {
    backgroundColor: '#FEFADF',
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
    borderColor: "#A4C18B",
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
    color: '#495340',
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
    backgroundColor: "#E0DCC5",
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
    backgroundColor: '#A4C18B',
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 10,
  },
  generateButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  }
})