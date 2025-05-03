import React, { useRef, useState } from 'react';
import { ScrollView, View, Text, Image, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import AntDesign from '@expo/vector-icons/AntDesign';
import { router } from 'expo-router';
import { colors } from '@/constants/Colors';
import * as ImagePicker from 'expo-image-picker';

type Post = {
  username: string;
  time: string;
  avatar: string;
  image: any;
  recipeName: string;
  recipeTime: string;
  ingredients: string[];
  directions: string[];
  rating: string;
  ratingCount: number;
  likes: number;
  comments: string[];
};

export default function PostScreen() {
  const [recipeName, setRecipeName] = useState('');
  const [imageSource, setImageSource] = useState('');
  const [ingredients, setIngredients] = useState<string[]>([' ']);
  const [directions, setDirections] = useState<string[]>([' ']);
  const [recipeTime, setRecipeTime] = useState('');

  const ingredientRefs = useRef<Array<any>>([]);
  const directionRefs = useRef<Array<TextInput | null>>([]);

  const handleRecipeName = (text: string) => {
    setRecipeName(text);
  };

  const handleRecipeTime = (text: string) => {
    setRecipeTime(text);
  };

  const handlePost = async () => {
    const trimmedName = recipeName.trim();
    const trimmedTime = recipeTime.trim();

    if (
      !trimmedName || !trimmedTime
    ) {
      alert('Please fill out the recipe name and cooking time');
      return;
    }

    const newPost: Post = {
      username: "cindy_yang",
      time: "Today at 3:12PM",
      avatar: '',
      image: require('../../assets/images/breakfast-sandwich.png'),
      recipeName: recipeName.trim(),
      recipeTime: recipeTime.trim(),
      ingredients: ingredients.filter(ing => ing.trim() !== ''),
      directions: directions.filter(dir => dir.trim() !== ''),
      rating: "N/A",
      ratingCount: 0,
      likes: 0,
      comments: []
    };
  
    try {
      const existingData = await AsyncStorage.getItem('posts');
      const posts: Post[] = existingData ? JSON.parse(existingData) : [];
      const updatedPosts = [newPost, ...posts];
      await AsyncStorage.setItem('posts', JSON.stringify(updatedPosts));
  
      setRecipeName('');
      setRecipeTime('');
      setIngredients([' ']);
      setDirections([' ']);
      setImageSource('');
      router.push('/(tabs)#index');
    } catch (error) {
      console.error("Error saving post:", error);
    }
  };  
  
  return (
    <ScrollView style={styles.background}>
      <View style={styles.container}>
        <Text style={styles.title}>Share New Recipe</Text>
      </View>
      <TextInput
        style={styles.textField}
        placeholder= "Recipe Name"
        value={recipeName}
        onChangeText={handleRecipeName}
      />
      <TextInput
        style={styles.textField}
        placeholder= "Cooking Time"
        value={recipeTime}
        onChangeText={handleRecipeTime}
      />

      {imageSource !== '' && (
        <Image
          source={{ uri: imageSource }}
          style={{ width: '90%', height: 250, alignSelf: 'center', borderRadius: 10 }}
          resizeMode="cover"
        />
      )}

      <TouchableOpacity
        style={styles.imageUploadButton}
        onPress={async () => {
          const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

          if (permissionResult.granted === false) {
            alert("Permission to access camera roll is required!");
            return;
          }

          const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
          });

          if (!result.canceled && result.assets.length > 0) {
            setImageSource(result.assets[0].uri);
          }
        }}
        >
        <View style={styles.uploadButtonContent}>
          <Ionicons name="image-outline" size={20} color="#000" />
          <Text style={styles.uploadButtonText}>
            {imageSource ? "Change Image" : "Upload Image"}
          </Text>
        </View>
      </TouchableOpacity>

      <View style={styles.recipeText}>
        <View>
          <Text style={styles.ingredientHeader}>Ingredients</Text>
          {ingredients.map((item, idx) => (
              <View key={idx} style={{ flexDirection: 'row', alignItems: 'center'}}>
                <Text style={{ marginRight: 5 }}>•</Text>
                <TextInput
                  ref={(ref) => (ingredientRefs.current[idx] = ref)}
                  style={styles.editRecipeStep}
                  value={item}
                  onChangeText={(text) => {
                    if (text.endsWith('\n')) {
                      const trimmed = text.trim();
                      const newList = [...ingredients];
                      newList[idx] = trimmed;
                      newList.splice(idx + 1, 0, '');
                      setIngredients(newList);
                  
                      setTimeout(() => {
                        if (ingredientRefs.current[idx + 1]) {
                          ingredientRefs.current[idx + 1].focus(); 
                        }
                      }, 0);

                    } else {
                      const newList = [...ingredients];
                      newList[idx] = text;
                      setIngredients(newList);
                    }
                  }}
                  onKeyPress={({ nativeEvent }) => {
                    if (
                      nativeEvent.key === 'Backspace' &&
                      ingredients[idx] === '' &&
                      ingredients.length > 1
                    ) {
                      const newList = [...ingredients];
                      newList.splice(idx, 1);
                      setIngredients(newList);

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
            ))}
        </View>

        <View>
          <Text style={styles.directionHeader}>Directions</Text>
          {directions.map((step, idx) => (
              <View key={idx} style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={{ marginRight: 0 }}>{idx + 1}.</Text>
                <TextInput
                  ref={(ref) => (directionRefs.current[idx] = ref)}
                  style={styles.editRecipeStep}
                  value={step}
                  multiline
                  onChangeText={(text) => {
                    if (text.endsWith('\n')) {
                      const trimmed = text.trim();
                      const newList = [...directions];
                      newList[idx] = trimmed;
                      newList.splice(idx + 1, 0, '');
                      setDirections(newList);

                      setTimeout(() => {
                        if (directionRefs.current[idx + 1]) {
                          directionRefs.current[idx + 1]?.focus();
                        }
                      }, 0);

                    } else {
                      const newList = [...directions];
                      newList[idx] = text;
                      setDirections(newList);
                    }
                  }}
                  onKeyPress={({ nativeEvent }) => {
                    if (
                      nativeEvent.key === 'Backspace' &&
                      directions[idx] === '' &&
                      directions.length > 1
                    ) {
                      const newList = [...directions];
                      newList.splice(idx, 1);
                      setDirections(newList);

                      setTimeout(() => {
                        if (directionRefs.current[idx - 1]) {
                          directionRefs.current[idx - 1]?.focus();
                        }
                      }, 0);

                    }
                  }}
                />
              </View>
            ))}
        </View>
      </View>
      <TouchableOpacity
        style={styles.postButton}
        onPress={handlePost}
      >
        <View style={styles.postButtonContent}>
          <Ionicons name="add-circle" size={28} color={"white"} style={{ marginRight: 5 }} />
          <Text style={styles.postButtonText}>Post</Text>
        </View>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  background: {
    backgroundColor: colors.lightPrimary,
    height: "100%",
  },
  container: {
    backgroundColor: colors.lightPrimary,
    padding: 10,
  },
  title: {
    fontFamily: 'Cakecafe',
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
    marginLeft: 10
  },
  textField: {
    backgroundColor: '#fff',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 12,
    marginHorizontal: 16,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  postButton: {
    backgroundColor: colors.accentColor,
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginBottom: 20,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    width: '90%',
  },
  postButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  postButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: 800,
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
    marginBottom: 5
  },
  directionHeader: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 15,
    marginBottom: 5
  },
  editRecipeStep: {
    backgroundColor: "white",
    padding: 5,
    width: "94%",
  },
  imageUploadButton: {
    backgroundColor: "white",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#ccc',
    alignSelf: 'center',
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  uploadButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  uploadButtonText: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },  
});