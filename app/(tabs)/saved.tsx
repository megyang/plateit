import React, { useState, useCallback } from 'react';
import { View, Text, Image, FlatList, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import AntDesign from '@expo/vector-icons/AntDesign';
import { router } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import { colors } from '@/constants/Colors';

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

export default function SavedScreen() {
  const [savedPosts, setSavedPosts] = useState<Post[]>([]);
  const [searchText, setSearchText] = useState('');
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);

  useFocusEffect(
    useCallback(() => {    
      const fetchSavedPosts = async () => {
        const data = await AsyncStorage.getItem('savedPosts');
        if (data) {
          const parsedData = JSON.parse(data);
          setSavedPosts(parsedData);
          setFilteredPosts(parsedData);
        }
      };
  
      fetchSavedPosts();
    }, [])
  );

  const removeSavedPost = async (name: string) => {
    try {
      const updatedPosts = savedPosts.filter(post => post.recipeName !== name);
      setSavedPosts(updatedPosts);
      setFilteredPosts(updatedPosts);
      await AsyncStorage.setItem('savedPosts', JSON.stringify(updatedPosts));
    } catch (error) {
      console.error('Error removing saved post:', error);
    }
  };

  const handleSearch = (text: string) => {
    setSearchText(text);
    if (text === '') {
      setFilteredPosts(savedPosts);
    } else {
      const filtered = savedPosts.filter(post =>
        post.recipeName.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredPosts(filtered);
    }
  };

  const goToRecipe = async (post: Post) => {
    try {
      await AsyncStorage.setItem('clickedPost', JSON.stringify(post));
      router.push('/recipe');
    } catch (error) {
      console.error('Error fetching recipe:', error);
    }
  };

  return (
    <View style={styles.background}>
      <View style={styles.container}>
        <Text style={styles.title}>My Collection</Text>
      </View>
      <TextInput
        style={styles.searchBar}
        placeholder= "Search My Collection"
        value={searchText}
        onChangeText={handleSearch}
      />
      {filteredPosts.length === 0 ? (
        <Text style={styles.noPosts}>No matches found</Text>
      ) : (
        <FlatList
          data={filteredPosts}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => {
                goToRecipe(item);
              }}
            >
              <View style={styles.card}>
                <View style={styles.contentContainer}>
                  <TouchableOpacity onPress={() => removeSavedPost(item.recipeName)} style={styles.unsaveButton}>
                    <Ionicons name="trash-outline" size={20} color="#ac3030ff" />
                  </TouchableOpacity>
                  <Text style={styles.caption}>{item.recipeName}</Text>
                  
                  <View style={styles.imageContainer}>
                    <TouchableOpacity>
                      <AntDesign name="right" size={24} color="black" marginLeft={10} />
                    </TouchableOpacity>
                  </View>
                  
                </View>
              </View>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
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
  searchBar: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 15,
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
    marginLeft: 10,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  noPosts: {
    textAlign: 'center',
    fontSize: 16,
    marginTop: 20,
    color: 'gray',
  },
  card: {
    backgroundColor: colors.lightSecondary,
    padding: 15,
    marginTop: 10,
    marginLeft: 10,
    marginRight: 10,
    borderRadius: 15,
    display: "flex"
  },
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: "space-between",
    paddingLeft: 10,
    paddingRight: 10
  },
  imageContainer: {
    flexDirection: 'row',  
    alignItems: 'center',
  },
  image: {
    width: 40,
    height: 40,
  },
  caption: {
    fontWeight: "bold",
    fontSize: 18
  },
  icon: {

  },
  unsaveButton: {
   
  },
});