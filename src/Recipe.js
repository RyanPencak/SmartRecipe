import React, { Component, PropTypes } from 'react';
import {
  Animated,
  Image,
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

const { width, height } = Dimensions.get('window');

export default class Recipe extends Component {

  static propTypes = {
    recipe: PropTypes.object.isRequired,
    isOpen: PropTypes.object.isRequired,
    handleClose: PropTypes.func.isRequired,
  }

  state = {
    position: new Animated.Value(this.props.isOpen ? 0 : height),
    visible: this.props.isOpen,
  };

  componentWillReceiveProps(nextProps) {
    if (!this.props.isOpen && nextProps.isOpen) {
      this.animateOpen();
    }
    else if (this.props.isOpen && !nextProps.isOpen) {
      this.animateClose();
    }
  }

  animateOpen() {
    this.setState({ visible: true }, () => {
      Animated.timing(
        this.state.position, { toValue: 0 }
      ).start();
    });
  }

  animateClose() {
    Animated.timing(
      this.state.position, { toValue: height }
    ).start(() => this.setState({ visible: false }));
  }

  render() {
    const { recipe, handleClose } = this.props;

    if (!this.state.visible) {
      return null;
    }
    return (
      <View style={styles.container}>
        <Animated.View
          style={[styles.modal, {
            transform: [{ translateY: this.state.position }, { translateX: 0 }]
          }]}
        >
          <View style={styles.recipeHome}>
            <TouchableOpacity onPress={() => handleClose()}>
              <Text>Close</Text>
            </TouchableOpacity>
            <View style={styles.imageContainer}>
              <Image source={{ uri: recipe.pic }} style={styles.image} />
            </View>
            <Text>{recipe.title}</Text>
          </View>
        </Animated.View>
      </View>
    );
  }

}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    backgroundColor: 'transparent',
  },
  imageContainer: {
    flex: 1,
  },
  image: {
    borderRadius: 10,
    ...StyleSheet.absoluteFillObject,
  },
  modal: {
    height: height*.8,
    backgroundColor: 'white',
    paddingTop: 10,
  },
  closeButton: {

  }
});
