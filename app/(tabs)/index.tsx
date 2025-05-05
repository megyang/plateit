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
    time: 'Yesterday at 11:34PM',
    avatar: '',
    image: require('../../assets/images/cheesecake.jpg'),
    recipeName: 'Blueberry Cheesecake',
    recipeTime: '1hr 45min',
    rating: "4.9",
    ratingCount: 24,
    likes: 27,
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
    comments: [
        { username: 'megan.pdf',
          text: 'I substituted the graham cracker crumbs with cookie crumbs, and my cheesecake turned out great!' },
        { username: 'yinqi',
          text: 'I had to bake my cheescake for 1 hour and 20 minutes for it to fully set.' },
    ]
  },
  {
    username: 'megan.pdf',
    time: 'Yesterday at 1:51PM',
    avatar: '',
    image: require('../../assets/images/spaghetti.jpg'),
    recipeName: 'Spaghetti with Garlic Butter',
    recipeTime: '40min',
    rating: "3.8",
    ratingCount: 12,
    likes: 15,
    ingredients: ['Spaghetti', 'Garlic', 'Butter'],
    directions: ['Boil pasta', 'Sauté garlic in butter', 'Combine and serve'],
    comments: [
      { username: 'dilini_1',
        text: 'Love this recipe! I\'ve also made it with different noddle types, like rigatoni, and it\'s always been delicious.' }
    ]
  },
  {
    username: 'yinqi',
    time: 'Yesterday at 10:08AM',
    avatar: '',
    image: require('../../assets/images/pancake-breakfast.jpg'),
    recipeName: 'Pancake Breakfast',
    recipeTime: '1hr 10min',
    rating: "4.2",
    ratingCount: 8,
    likes: 19,
    ingredients: ["pancakes", "berries", "yogurt"],
    directions: ["Prepare pancakes", "Garnish with berries", "Serve with yogurt"],
    comments: []
  },
  {
    username: 'cindy_yang',
    time: 'May 3 at 7:59PM',
    avatar: '',
    image: require('../../assets/images/cc_cookie.jpg'),
    recipeName: 'Chocolate Chip Cookies',
    recipeTime: '1hr 10min',
    rating: "4.7",
    ratingCount: 9,
    likes: 31,
    ingredients: [],
    directions: [],
    comments: []
  },
  {
    username: 'dilini_1',
    time: 'May 3 at 3:59PM',
    avatar: '',
    image: require('../../assets/images/pizza.jpg'),
    recipeName: 'Mushroom Pizza',
    recipeTime: '1hr 30 min',
    rating: "4.7",
    ratingCount: 5,
    likes: 22,
    ingredients: [],
    directions: [],
    comments: []
  },
  {
    username: 'megan.pdf',
    time: 'May 3 at 3:01PM',
    avatar: '',
    image: require('../../assets/images/mousse.jpg'),
    recipeName: 'Chocolate Mousse',
    recipeTime: '3hr',
    rating: "4.9",
    ratingCount: 13,
    likes: 28,
    ingredients: [],
    directions: [],
    comments: []
  },
  {
    username: 'cindy_yang',
    time: 'May 2 at 6:24PM',
    avatar: '',
    image: require('../../assets/images/chicken.jpg'),
    recipeName: 'Sheet Pan Chicken Dinner',
    recipeTime: '1hr',
    rating: "4.5",
    ratingCount: 11,
    likes: 23,
    ingredients: [],
    directions: [],
    comments: []
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
  };

  const combinedPosts = [...userPosts, ...samplePosts];
  const filteredPosts = combinedPosts.filter((post) =>
    post.recipeName.toLowerCase().includes(searchText.toLowerCase())
  );
  
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

        {filteredPosts.map((post, idx) => (
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
    paddingBottom: 50,
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
