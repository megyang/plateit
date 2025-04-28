import { ScrollView, View, Text, Image, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Octicons from '@expo/vector-icons/Octicons';
import { colors } from '@/constants/Colors';


export default function ProfileScreen() {
  const images = [
    require('../../assets/images/cheesecake.jpg'),
    require('../../assets/images/spaghetti.jpg'),
    require('../../assets/images/pancake-breakfast.jpg'),
    require('../../assets/images/breakfast-sandwich.png'),
    require('../../assets/images/spaghetti.jpg'),
    require('../../assets/images/cheesecake.jpg'),
  ];
  
  return (
    <View style={styles.container}>
      <View style={styles.header}></View>
      <View style={styles.avatar}>
        <Ionicons name={"person"} size={80} color={colors.lightSecondary} />
      </View> 
      <View style={styles.userText}>
        <Text style={styles.name}>Cindy Yang</Text>
        <Text style={styles.username}>cindy_yang</Text>
        <View style={styles.followerBox}>
          <Text style={styles.followerText}>37 followers</Text>
          <Octicons name="dot-fill" size={13} color="black" style={{ marginLeft: 7, marginRight: 7 }}/>
          <Text style={styles.followerText}>34 following</Text>
        </View>
      </View>
      <ScrollView style={styles.postContainer}>
        <View style={styles.postContainerHeader}>
          <View style={[styles.numberContainer, styles.numberBorder]}>
            <Text style={styles.number}>13</Text>
            <Text>recipes</Text>
          </View>
          <View style={[styles.numberContainer, styles.numberBorder]}>
            <Text style={styles.number}>137</Text>
            <Text>likes</Text>
          </View>
          <View style={styles.numberContainer}>
            <Text style={styles.number}>98</Text>
            <Text>reviews</Text>
          </View>
        </View>
        <View style={styles.imageGrid}>
          {images.map((imgSrc, index) => (
            <Image key={index} source={imgSrc} style={styles.image} />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center"
  },
  header: {
    width: "100%",
    height: 110,
    backgroundColor: colors.lightSecondary
  },
  avatar: {
    height: 110,
    width: 110,
    position: "absolute",
    borderRadius: 50,
    backgroundColor: colors.darkPrimary,
    alignItems: 'center',
    justifyContent: 'center',
    borderStyle: "solid",
    borderColor: colors.lightSecondary,
    top: 55,
    left: 150,
    borderWidth: 5,
  },
  userText: {
    marginTop: 65,
  },
  name: {
    textAlign: "center",
    fontFamily: 'Cakecafe',
    fontSize: 25,
  },
  username: {
    textAlign: "center",
  },
  followerBox: {
    flexDirection: 'row',
    alignItems: "center",
    justifyContent: "center",
    marginTop: 2
  },
  followerText: {
    fontSize: 14,
    fontWeight: 700
  },
  postContainer: {
    backgroundColor: "white",
    borderRadius: 30,
    width: "95%",
    marginTop: 15,
    paddingBottom: 15,
  },
  postContainerHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  numberContainer: {
    justifyContent: "center",
    alignItems: "center",
    width: "33%",
    marginTop: 10,
  },
  numberBorder: {
    borderRightWidth: 2,
    borderRightColor: colors.darkPrimary
  },
  number: {
    fontSize: 18,
    fontWeight: 700
  },
  imageGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    marginTop: 10,
  },
  image: {
    width: '32.5%', 
    aspectRatio: 1,
    marginBottom: 5,
  },
})