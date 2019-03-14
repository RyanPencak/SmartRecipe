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

export default class InstructionCard extends Component {
  static propTypes = {
    title: PropTypes.object.isRequired,
    pic: PropTypes.object.isRequired,
    instruction: PropTypes.object.isRequired,
  }
  render() {
    const { title, pic, instruction } = this.props;
    return (
      <View style={styles.container}>
        <Text style={styles.title} numberOfLines={1}>{title}</Text>
        <Image source={{ uri: pic }} style={styles.image} />
        <View style={styles.textContainer}>
          <Text style={styles.step} numberOfLines={1}>{instruction}</Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    marginLeft: 10,
    marginBottom: 10,
    height: height,
    width: width,
  },
  textContainer: {
    flexDirection: 'row'
  },
  image: {
    alignItems: 'center',
    borderRadius: 10,
    height: 300,
    width: 300,
    marginTop: 20
  },
  title: {
    ...defaultStyles.header2,
    marginTop: 4,
  },
  step: {
    ...defaultStyles.header2,
    marginTop: 50,
    marginBottom: 50,
    flex: 1,
    flexWrap: 'wrap'
  },
});
