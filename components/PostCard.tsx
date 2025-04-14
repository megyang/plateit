import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import FlipCard from './FlipCard';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AntDesign from '@expo/vector-icons/AntDesign';

type Post = {
  username: string;
  time: string;
  avatar: string;
  image: any;
  caption: string;
  ingredients: string[];
  directions: string[];
};

export default function PostCard({ post }: { post: Post }) {
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [likes, setLikes] = useState(27);
  const [showSavedPopup, setShowSavedPopup] = useState(false);

  const handleDoubleTap = () => {
    if (!liked) {
      setLiked(true);
      setLikes(prev => prev + 1);
    }
  };

  const toggleSavePost = async (post: Post) => {
    try {
      const existingPosts = await AsyncStorage.getItem('savedPosts');
      let savedPosts = existingPosts ? JSON.parse(existingPosts) : [];
  
      if (saved) {
        savedPosts = savedPosts.filter((p: Post) => p.caption !== post.caption);
      } else {
        if (!savedPosts.some((p: Post) => p.caption === post.caption)) {
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
        <View style={styles.userInfo}>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarText}>{post.username.slice(0, 2).toUpperCase()}</Text>
          </View>
          <Text style={styles.username}>{post.username}</Text>
        </View>
        <Text style={styles.time}>{post.time}</Text>
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
              <Text style={styles.title}>Ingredients</Text>
              {post.ingredients.map((item, idx) => (
                <Text key={idx}>• {item}</Text>
              ))}
              <Text style={styles.title}>Directions</Text>
              {post.directions.map((step, idx) => (
                <Text key={idx}>{idx + 1}. {step}</Text>
              ))}
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
                <View style={styles.saveButton}>
                  <Text style={styles.saveText}>Save</Text>
                </View>
              </TouchableOpacity>
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

      <View style={styles.actionsRow}>
        <View style={styles.leftActions}>
          <TouchableOpacity
            onPress={() => {
              setLiked(!liked);
              setLikes(prev => liked ? prev - 1 : prev + 1);
            }}
          >
            <Ionicons
              name={liked ? 'heart' : 'heart-outline'}
              size={22}
              color={liked ? '#e5472f' : 'black'}
              style={styles.icon}
            />
          </TouchableOpacity>
          <Text style={styles.likeCount}>{likes}</Text>

          <TouchableOpacity>
            <Ionicons name="chatbubble-outline" size={22} style={styles.icon} />
          </TouchableOpacity>
        </View>

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
          <Ionicons
            name={saved ? 'folder' : 'folder-outline'}
            size={22}
            color={saved ? '#9F5549' : 'black'}
          />
        </TouchableOpacity>
      </View>

      <Text style={styles.caption}>
        <Text style={styles.username}>{post.username}</Text> {post.caption}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
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
    color: '#55A831',
    fontWeight: '500',
  },
  
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: -10,
    marginBottom: 4,
    marginLeft: 10,
    marginRight: 10
  },
  
  leftActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  
  icon: {
    marginRight: 6,
  },
  
  likeCount: {
    fontWeight: 'bold',
    marginRight: 10,
  },  

  card: {
    position: 'relative',
    backgroundColor: '#FEFADF',
    padding: 0,
    marginBottom: 30,
  },
  
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 10,
  },
  
  avatarCircle: {
    backgroundColor: '#6aa84fff',
    borderRadius: 50,
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  
  avatarText: {
    color: '#fff',
    fontWeight: 'bold',
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
    marginBottom: 0,
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

  caption: {
    marginTop: 4,
    marginLeft: 10
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
    // fontWeight: "bold",
    // fontSize: 18,
    fontWeight: '600',
    fontSize: 16,
    color: '#333',
  },
});
