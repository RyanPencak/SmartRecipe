import React, { Component, PropTypes } from 'react';
import {
  Animated,
  Button,
  Image,
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { Icon } from 'react-native-elements'
import Tts from 'react-native-tts';
import Dialogflow from "react-native-dialogflow";

const { width, height } = Dimensions.get('window');

export default class Recipe extends Component {

  constructor(props) {
        super(props);

        Dialogflow.setConfiguration(
          "b572c2f657df43098fc73e8ce901e081", Dialogflow.LANG_ENGLISH
        );
  }

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

  speak(input) {
    Tts.setDefaultRate(0.52);
    Tts.setDefaultVoice('com.apple.ttsbundle.Samantha-compact')
    Tts.speak(input);
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
              <Icon name="close" />
            </TouchableOpacity>
            <Button title="Dialogflow" onPress={() => {
              let spoke = false;
              Dialogflow.startListening(response=>{
                console.log(response)
                if (spoke == false) {
                  this.speak(response.result.fulfillment["speech"])
                  spoke = true
                }
              }, error=>{
                  console.log(error);
              });
            }} />
           <Button title="END" onPress={() => {
             Dialogflow.finishListening();
           }}
          />
          <Button title="COOK" onPress={() => {
           Dialogflow.requestQuery("Start Cooking.", response=>this.speak(response.result.fulfillment["speech"]), error=>console.log(error));
              }}
         />
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
