import React, { Component, PropTypes } from 'react';
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { defaultStyles } from './styles';

const { width, height } = Dimensions.get('window');
const cols = 1, rows = 3;

export default class TitleCard extends Component {
  static propTypes = {
    recipe: PropTypes.object.isRequired,
    handleOpen: PropTypes.func.isRequired,
  }
  render() {
    const { recipe, recipe: { title, time, pic }, handleOpen } = this.props;
    return (
      <TouchableOpacity style={styles.container} onPress={() => handleOpen(recipe)}>
        <View style={styles.imageContainer}>
          <Image source={{ uri: pic }} style={styles.image} />
        </View>
        <Text style={styles.title} numberOfLines={1}>{title}</Text>
        <Text style={styles.genre} numberOfLines={1}>{time}</Text>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    marginLeft: 10,
    marginBottom: 10,
    height: height / rows,
    width: width*.95,
  },
  imageContainer: {
    flex: 1,
  },
  image: {
    borderRadius: 10,
    ...StyleSheet.absoluteFillObject,
  },
  title: {
    ...defaultStyles.text,
    fontSize: 16,
    marginTop: 4,
  },
  genre: {
    ...defaultStyles.text,
    color: '#BBBBBB',
    fontSize: 14,
    lineHeight: 18,
  },
});
