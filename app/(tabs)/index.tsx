import { ScrollView, View, SafeAreaView, StyleSheet } from 'react-native';
import PostCard from '../../components/PostCard';
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
    backgroundColor: colors.lightPrimary, 
  },

  container: {
    padding: 0,
    paddingBottom: 100,
  },
});
