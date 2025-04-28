import React, { useState, useCallback } from 'react';
import { ScrollView, View, SafeAreaView, StyleSheet, TextInput, TouchableOpacity, Text } from 'react-native';
import PostCard from '../../components/PostCard';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import Header from '../../components/Header';
import { colors } from '@/constants/Colors';

const samplePosts = [
  {
    username: 'cindy_yang',
    time: 'Today at 8:34PM',
    avatar: '',
    image: require('../../assets/images/cheesecake.jpg'),
    recipeName: 'Blueberry Cheesecake',
    recipeTime: '1hr 45min',
    ingredients: [
      '1 cup graham cracker crumbs',
      '¾ cup melted butter',
      '2 packages cream cheese',
    ],
    directions: [
      'Preheat the oven to 325°F.',
      'Mix crust ingredients and press into pan.',
      'Beat cream cheese, then bake for 1 hour.',
    ],
  },
  {
    username: 'megan.pdf',
    time: 'Yesterday at 1:51PM',
    avatar: '',
    image: require('../../assets/images/spaghetti.jpg'),
    recipeName: 'Spaghetti with Garlic Butter',
    recipeTime: '40min',
    ingredients: ['Spaghetti', 'Garlic', 'Butter'],
    directions: ['Boil pasta', 'Sauté garlic in butter', 'Combine and serve'],
  },
  {
    username: 'yinqi',
    time: 'Yesterday at 10:08AM',
    avatar: '',
    image: require('../../assets/images/pancake-breakfast.jpg'),
    recipeName: 'Pancake Breakfast',
    recipeTime: '1hr 10min',
    ingredients: [],
    directions: [],
  },
];

export default function HomeFeed() {
  const [searchText, setSearchText] = useState('');
  const [userPosts, setUserPosts] = useState<any[]>([]);

  useFocusEffect(
    useCallback(() => {
      const loadPosts = async () => {
        try {
          const stored = await AsyncStorage.getItem('posts');
          if (stored) {
            const parsed = JSON.parse(stored);
            setUserPosts(parsed);
          } else {
            setUserPosts([]);
          }
        } catch (error) {
          console.error("Error loading saved posts:", error);
        }
      };

      loadPosts();
    }, [])
  );

  const handleSearch = (text: string) => {
    setSearchText(text);
    if (text === '') {
    } else {
      
    }
  };
  
  // To reset stuff
  const clearAllPosts = async () => {
    try {
      await AsyncStorage.removeItem('posts');
    } catch (error) {
      console.error("Error clearing posts:", error);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <Header />
      <ScrollView contentContainerStyle={styles.container}>

        {/* For testing and dev purposes, not part of final demo */}
        {/* <TouchableOpacity
          style={{ backgroundColor: '#ccc' }}
          onPress={clearAllPosts}
        >
          <Text style={{ color: '#000' }}>Undo Post</Text>
        </TouchableOpacity> */}

        <TextInput
          style={styles.searchBar}
          placeholder= "Search Feed"
          value={searchText}
          onChangeText={handleSearch}
        />

        {userPosts.map((post, idx) => (
          <PostCard key={idx} post={post} />
        ))}

        {samplePosts.map((post, idx) => (
          <PostCard key={idx} post={post} />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1, 
    backgroundColor: colors.lightPrimary, 
  },
  container: {
    padding: 0,
    paddingBottom: 100,
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
});
