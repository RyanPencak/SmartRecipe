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

export default class InstructionCard extends Component {
  static propTypes = {
    ingredients: PropTypes.object.isRequired,
  }
  render() {
    const { title, image, instruction } = this.props;
    return (
      <View style={styles.container}>
      <Text style={styles.title} numberOfLines={1}>{title}</Text>
        <View style={styles.imageContainer}>
          <Image source={{ uri: pic }} style={styles.image} />
        </View>
        <Text style={styles.genre} numberOfLines={1}>{instruction}</Text>
      </View>
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
