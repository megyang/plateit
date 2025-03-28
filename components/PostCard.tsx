import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import FlipCard from './FlipCard';
import { router } from 'expo-router';

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
    
  return (
    <View style={styles.card}>
      {/* Header */}
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
            <Image source={post.image} style={styles.image} resizeMode="cover" />
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
              color={liked ? 'red' : 'black'}
              style={styles.icon}
            />
          </TouchableOpacity>
          <Text style={styles.likeCount}>{likes}</Text>

          <TouchableOpacity>
            <Ionicons name="chatbubble-outline" size={22} style={styles.icon} />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          onPress={() => {
            const newSaved = !saved;
            setSaved(newSaved);

            if (newSaved) {
              setShowSavedPopup(true);
              setTimeout(() => setShowSavedPopup(false), 2000);
            }
          }}
        >
          <Ionicons
            name={saved ? 'bookmark' : 'bookmark-outline'}
            size={22}
          />
        </TouchableOpacity>
      </View>

      {/* Caption */}
      <Text style={styles.caption}>
        <Text style={styles.username}>{post.username}</Text> {post.caption}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  savedPopup: {
    position: 'absolute',
    bottom: 0,
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
    fontWeight: 'bold',
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
    marginTop: 8,
    marginBottom: 4,
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
    padding: 16,
    marginBottom: 20,
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
  },
  
  avatarCircle: {
    backgroundColor: '#8DA86E',
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
  },  
  image: {
    width: '100%',
    height: 200,
    marginBottom: 8,
  },
  recipe: {
    width: '100%',
    height: 200,
    backgroundColor: '#B6D7A8',
    justifyContent: 'center',
    paddingHorizontal: 8,
    paddingVertical: 12,
  },
    caption: {
    marginTop: 4,
  },
  title: {
    fontWeight: 'bold',
    marginTop: 8,
  },
});
