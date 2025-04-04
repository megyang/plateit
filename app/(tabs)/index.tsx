import { ScrollView, View, SafeAreaView, StyleSheet } from 'react-native';
import PostCard from '../../components/PostCard';
import Header from '../../components/Header';

const samplePosts = [
  {
    username: 'cindy',
    time: 'Today at 8:34PM',
    avatar: '',
    image: require('../../assets/images/cheesecake.jpg'),
    caption: 'blueberry cheesecake!',
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
    username: 'megan',
    time: 'Yesterday at 1:51PM',
    avatar: '',
    image: require('../../assets/images/spaghetti.jpg'),
    caption: 'spaghetti with garlic butter 🍝',
    ingredients: ['Spaghetti', 'Garlic', 'Butter'],
    directions: ['Boil pasta', 'Sauté garlic in butter', 'Combine and serve'],
  },
  {
    username: 'yinqi',
    time: 'Yesterday at 10:08AM',
    avatar: '',
    image: require('../../assets/images/pancake-breakfast.jpg'),
    caption: 'pancake breakfast :)',
    ingredients: [],
    directions: [],
  },
];

export default function HomeFeed() {
  return (
    <SafeAreaView style={styles.safe}>
      <Header />
      <ScrollView contentContainerStyle={styles.container}>
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
    backgroundColor: '#FEFADF', 
  },

  container: {
    padding: 0,
    paddingBottom: 100,
  },
});
