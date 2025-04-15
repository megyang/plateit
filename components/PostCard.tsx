import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import FlipCard from './FlipCard';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AntDesign from '@expo/vector-icons/AntDesign';
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
};

export default function PostCard({ post }: { post: Post }) {
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [likeText, setLikeText] = useState("Liked by 27 others");
  const [showSavedPopup, setShowSavedPopup] = useState(false);

  const handleDoubleTap = () => {
    if (!liked) {
      setLiked(true);
      setLikeText("Liked by you and 27 others");
    }
  };

  const toggleSavePost = async (post: Post) => {
    try {
      const existingPosts = await AsyncStorage.getItem('savedPosts');
      let savedPosts = existingPosts ? JSON.parse(existingPosts) : [];
  
      if (saved) {
        savedPosts = savedPosts.filter((p: Post) => p.recipeName !== post.recipeName);
      } else {
        if (!savedPosts.some((p: Post) => p.recipeName === post.recipeName)) {
          savedPosts.push(post);
        }
      }
      await AsyncStorage.setItem('savedPosts', JSON.stringify(savedPosts));
    } catch (error) {
      console.error('Error updating saved posts:', error);
    }
  };  
  
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.topRow}>
          <Text style={styles.recipeName}>{post.recipeName}</Text>
          <View style={styles.rating}>
            <Text style={styles.ratingNumber}>4.9</Text>
            <AntDesign name="star" size={17} color="black" style={styles.starIcon} />
            <Text style={styles.ratingText}>(24)</Text>
          </View>
        </View>

        <View style={styles.bottomRow}>
          <Text>
            By <Text style={styles.username}>{post.username}</Text>
          </Text>
          <View style={styles.timeContainer}>
            <AntDesign name="clockcircle" size={16} style={styles.clockIcon} />
            <Text style={styles.timeText}>{post.recipeTime}</Text>
          </View>
        </View>
      </View>

      {/* ONLY the image flips */}

      <View style={{ position: 'relative' }}>
        <FlipCard
          onDoubleTap={handleDoubleTap}
          front={
            <View style={styles.imageContainer}>
              <Image source={post.image} style={styles.image} resizeMode="cover" />
              <AntDesign name="retweet" size={28} style={styles.retweetIcon}/>
            </View>
          }
          back={
            <View style={styles.recipe}>
              {/* <Image source={require('../assets/images/book_page.jpg')} style={styles.image} resizeMode="cover" /> */}
              <Text style={styles.title}>Ingredients</Text>
              {post.ingredients.map((item, idx) => (
                <Text key={idx}>• {item}</Text>
              ))}
              <Text style={styles.title}>Directions</Text>
              {post.directions.map((step, idx) => (
                <Text key={idx}>{idx + 1}. {step}</Text>
              ))}
              <AntDesign name="retweet" size={30} style={styles.retweetIcon}/>
            </View>
          }
        />

        {showSavedPopup && (
          <View style={styles.savedPopup}>
            <Image source={post.image} style={styles.popupImage} />
            <View style={styles.popupTextContainer}>
              <Text style={styles.savedText}>Saved</Text>
              <TouchableOpacity
                onPress={() => {
                  setShowSavedPopup(false);
                  router.push('/saved');
                }}
              >
                <Text style={styles.goText}>Go to Collection &gt;</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>

      <View style={styles.footer}>
        <View style={styles.likeContainer}>
          <TouchableOpacity
            onPress={() => {
              setLiked(!liked);
              setLikeText(prev => liked ? "Liked by 27 others" : "Liked by you and 27 others");
            }}
          >
            <AntDesign name={liked ? 'like1' : 'like2'} size={20} style={styles.likeIcon} />
          </TouchableOpacity>
          <Text style={{ marginLeft: 5 }}>{likeText}</Text>
        </View>
        <View>
          <Text style={styles.time}>{post.time}</Text>
        </View>
      </View>

      <View style={styles.actionsRow}>
        <View style={styles.saveContainer}>
          <TouchableOpacity
            onPress={async () => {
              const newSaved = !saved;
              setSaved(newSaved);
              await toggleSavePost(post);

              if (newSaved) {
                setShowSavedPopup(true);
                setTimeout(() => setShowSavedPopup(false), 3000);
              }
            }}
          >
            <Text>Save</Text>
            <Ionicons
              name={saved ? 'heart' : 'heart-outline'}
              size={22}
              color={saved ? '#e5472f' : colors.darkPrimary}
              // style={styles.icon}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.rateContainer}>
          <TouchableOpacity>
            <Text>Rate</Text>
            <AntDesign name="star" size={17} color="black" style={styles.starIcon} />
          </TouchableOpacity>
        </View>
        <View style={styles.discussionContainer}>
          <TouchableOpacity>
            <Text>View Discussion</Text>
            <Ionicons name="chatbubble-outline" size={22} style={styles.discussionIcon} />
          </TouchableOpacity>
        </View>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  topRow: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },

  ratingNumber: {
    fontSize: 16,
    fontWeight: "bold"
  },

  ratingText: {
    fontSize: 16,
  },

  bottomRow: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  timeText: {
    fontSize: 14,
    marginLeft: 5
  },

  starIcon: {
    marginLeft: 3,
    marginRight: 3,
    color: colors.accentColor
  },

  clockIcon: {
    color: colors.darkPrimary
  },

  likeIcon: {
    color: colors.darkPrimary
  },

  savedPopup: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    backgroundColor: '#E0DCC5',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    zIndex: 10,
  },
  
  popupImage: {
    width: 40,
    height: 40,
    borderRadius: 8,
    marginRight: 10,
  },
  
  popupTextContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flex: 1,
  },
  
  savedText: {
    color: '#000',
    fontSize: 16,
  },
  
  goText: {
    fontSize: 16,
    color: colors.darkPrimary,
    fontWeight: '500',
  },

  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    marginTop: -10
  },

  likeContainer: {
    flexDirection: 'row',
  },
  
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
    marginTop: 10,
    marginLeft: 10,
    marginRight: 10,
    paddingHorizontal: 10
  },
  
  saveContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  rateContainer: {

  },

  discussionContainer: {

  },
  
  discussionIcon: {
    marginRight: 6,
  },

  card: {
    position: 'relative',
    backgroundColor: colors.lightPrimary,
    padding: 0,
    marginBottom: 30,
  },
  
  header: {
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
    width: '100%',
    paddingHorizontal: 10,
  },
  
  recipeName: {
    fontSize: 21,
    fontWeight: 500,
  },

  postAuthor: {
    width: "100%",
    justifyContent: "space-between",
    marginLeft: 10
  },
  
  username: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  
  time: {
    fontSize: 12,
    color: '#666',
    marginRight: 10
  },  

  image: {
    width: '100%',
    height: 350,
  },

  imageContainer: {
    position: 'relative',
    width: '100%',
    height: "auto",
  },

  retweetIcon: {
    position: 'absolute',
    top: 8,
    right: 8,
    color: "white", 
    padding: 4,
    borderRadius: 12,
    textShadowColor: 'white',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
  },

  recipe: {
    width: '100%',
    height: 350,
    backgroundColor: '#B6D7A8',
    paddingHorizontal: 8,
    paddingVertical: 12,
  },

  rating: {
    flexDirection: "row",
  },

  title: {
    fontWeight: 'bold',
    marginTop: 8,
    marginBottom: 5
  },

  saveButton: {
    marginTop: 60,
    backgroundColor: '#fff',
    paddingVertical: 6,
    paddingHorizontal: 20,
    borderRadius: 15,
    alignSelf: 'center',
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 3,
  },

  saveText: {
    fontWeight: '600',
    fontSize: 16,
    color: '#333',
  },
});
