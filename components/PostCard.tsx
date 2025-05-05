import React, { useState, useEffect } from 'react';
import { ScrollView, Modal, View, Text, TextInput, Image, StyleSheet, TouchableOpacity, TouchableWithoutFeedback, KeyboardAvoidingView, Platform } from 'react-native';
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
  rating: string;
  ratingCount: number;
  likes: number;
  comments: any;
};

export default function PostCard({ post }: { post: Post }) {
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [likeText, setLikeText] = useState(`Liked by ${post.likes} others`);
  const [rated, setRated] = useState(false);
  const [showSavedPopup, setShowSavedPopup] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [comments, setComments] = useState(post.comments);
  const [newComment, setNewComment] = useState('');
  const [showRateModal, setShowRateModal] = useState(false);
  const [selectedRating, setSelectedRating] = useState(0);
  const [ratingCount, setRatingCount] = useState(post.ratingCount);

  useEffect(() => {
    setLikeText(`Liked by ${post.likes} others`);
    setComments(post.comments);
    setRatingCount(post.ratingCount);
  }, [post]);

  const handleDoubleTap = () => {
    if (!liked) {
      setLiked(true);
      setLikeText("Liked by you and 27 others");
    }
  };

  const handleRate = () => {
    setShowRateModal(true)
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
            <Text style={styles.ratingNumber}>{post.rating}</Text>
            <AntDesign name="star" size={17} color="black" style={styles.starIcon} />
            <Text style={styles.ratingText}>({ratingCount})</Text>
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
            <View style={styles.imageContainer}>
              <Image source={require('../assets/images/book_page.jpg')} style={styles.image} resizeMode="cover" />
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
              setLikeText(prev => liked ? `Liked by ${post.likes} others` : `Liked by you and ${post.likes} others`);
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
            style={styles.actionButton}
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
            <Text style={{ fontSize: 18, marginRight: 3 }}>Save</Text>
            <Ionicons
              name={saved ? 'heart' : 'heart-outline'}
              size={25}
              color={saved ? '#e5472f' : colors.darkPrimary}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.rateContainer}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleRate}
          >
            <Text style={{ fontSize: 18, marginRight: 3 }}>Rate</Text>
            <AntDesign 
              name={rated ? "star" : "staro"}
              size={25}
              color={rated ? colors.accentColor : colors.darkPrimary}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.discussionContainer}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => setIsModalVisible(true)}
          >
            <Text style={{ fontSize: 18, marginRight: 3 }}>View Discussion</Text>
            <Ionicons name="chatbubble-outline" size={23} style={styles.discussionIcon} />
          </TouchableOpacity>
        </View>
      </View>

      {isModalVisible && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={isModalVisible}
          onRequestClose={() => setIsModalVisible(false)}
        >
          <TouchableWithoutFeedback onPress={() => setIsModalVisible(false)}>
            <View style={styles.modalOverlay}>
              <TouchableWithoutFeedback>
                <KeyboardAvoidingView
                  style={styles.modalContainer}
                  behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                >
                  <View style={styles.modalHeader}>
                    <Text style={styles.modalTitle}>Discussion</Text>
                    <Ionicons name="chatbubble-outline" size={24} />
                  </View>

                  <ScrollView
                    style={styles.commentsScroll}
                    contentContainerStyle={styles.commentsContainer}
                    keyboardShouldPersistTaps="handled"
                  >
                    {comments.map((comment: any, index: any) => (
                      <Text key={index} style={styles.commentText}>
                        <Text style={styles.usernameText}>{comment.username} says: </Text>
                        {comment.text}
                      </Text>
                    ))}
                  </ScrollView>

                  <View style={styles.inputContainer}>
                    <TextInput
                      style={styles.input}
                      value={newComment}
                      onChangeText={setNewComment}
                      placeholder="Add a comment..."
                    />
                    <TouchableOpacity
                      onPress={() => {
                        if (newComment.trim() !== '') {
                          setComments([...comments, { username: 'cindy_yang', text: newComment.trim() }]);
                          setNewComment('');
                        }
                      }}
                    >
                      <Ionicons name="send" size={24} color={colors.darkPrimary} />
                    </TouchableOpacity>
                  </View>
                </KeyboardAvoidingView>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      )}

    {showRateModal && (
      <Modal
        transparent
        animationType="fade"
        visible={showRateModal}
        onRequestClose={() => setShowRateModal(false)}
      >
        <TouchableOpacity
          style={styles.rateModalOverlay}
          activeOpacity={1}
          onPressOut={() => setShowRateModal(false)}
        >
          <View style={styles.modalCenter}>
            <Text style={styles.rateModalTitle}>Rate this recipe</Text>
            <View style={styles.starRow}>
              {[1, 2, 3, 4, 5].map((star) => (
                <TouchableOpacity key={star} onPress={() => setSelectedRating(star)}>
                  <AntDesign
                    name={selectedRating >= star ? 'star' : 'staro'}
                    size={30}
                    color={colors.accentColor}
                    style={{ marginHorizontal: 4 }}
                  />
                </TouchableOpacity>
              ))}
            </View>
            <TouchableOpacity
              style={styles.rateButton}
              onPress={() => {
                // setRated(true);
                // setShowRateModal(false);
                if (!rated) {
                  setRated(true);
                  setRatingCount(prev => prev + 1);
                }
                setShowRateModal(false);
              }}
            >
              <Text style={styles.rateButtonText}>Rate</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    )}

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
    backgroundColor: colors.lightSecondary,
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
    paddingHorizontal: 10,
    paddingVertical: 5
  },
  saveContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  discussionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
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
    position: "absolute",
    marginLeft: 20,
    marginTop: 20,
  },
  rating: {
    flexDirection: "row",
  },
  title: {
    fontWeight: 'bold',
    marginTop: 8,
    marginBottom: 5
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.69)',
    justifyContent: 'flex-end',
  },  
  modalContainer: {
    backgroundColor: colors.lightPrimary,
    padding: 16,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    height: '60%',
  },  
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },  
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginRight: 8,
  },
  commentsScroll: {
    marginBottom: 10,
  },  
  commentsContainer: {
    paddingBottom: 10,
  },  
  commentText: {
    fontSize: 15,
    marginBottom: 15,
  }, 
  usernameText: {
    fontWeight: 'bold',
  },  
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: colors.darkPrimary,
    paddingTop: 8,
    marginBottom: 50
  },  
  input: {
    flex: 1,
    height: 40,
    borderColor: colors.darkPrimary,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginRight: 10,
    marginTop: 7
  }, 
  rateModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.69)',
    justifyContent: 'center',
    alignItems: 'center',
  }, 
  modalCenter: {
    backgroundColor: colors.lightPrimary,
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
    width: '70%',
  },
  rateModalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  }, 
  starRow: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  rateButton: {
    backgroundColor: colors.darkPrimary,
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  rateButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: "bold"
  }
});