import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AntDesign from '@expo/vector-icons/AntDesign';
import { router } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';

export default function RecipeScreen() {
  const [recipe, setRecipe] = useState<any>(null);
  const [ingredients, setIngredients] = useState([]);
  const [directions, setDirections] = useState([]);

  useFocusEffect(
    useCallback(() => {
      const fetchSavedRecipe = async () => {
        try {
          const data = await AsyncStorage.getItem('clickedPost');
          if (data) {
            const parsedData = JSON.parse(data);
            setRecipe(parsedData);
            setIngredients(parsedData.ingredients || []);
            setDirections(parsedData.directions || []);
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
                <Text style={styles.title} numberOfLines={2}>{recipe ? recipe.caption : ''}</Text>
            </View>
            
            <TouchableOpacity
                onPress={handleClear}
            >
                <View style={styles.clearView}>
                    <Text style={styles.clearText}>Clear</Text>
                </View>
            </TouchableOpacity>
        </View>
        <View style={styles.recipeText}>
            <Text style={styles.ingredientHeader}>Ingredients</Text>
            {ingredients?.map((item:any, idx:any) => (
            <Text key={idx} style={styles.recipeStep}>• {item}</Text>
            ))}
            <Text style={styles.directionHeader}>Directions</Text>
            {directions?.map((step:any, idx:any) => (
            <Text key={idx} style={styles.recipeStep}>{idx + 1}. {step}</Text>
            ))}
        </View>
    </View>
  );
}

const styles = StyleSheet.create({
  background: {
    backgroundColor: '#FEFADF',
    height: "100%",
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
    paddingLeft: 20
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
  }
})