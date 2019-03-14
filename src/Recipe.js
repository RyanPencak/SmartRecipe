import React, { Component, PropTypes } from 'react';
import {
  Animated,
  Button,
  Image,
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  FlatList
} from 'react-native';
import { defaultStyles } from './styles';
// import Carousel from 'react-native-snap-carousel';
import Tts from 'react-native-tts';
import Voice from 'react-native-voice';
import Dialogflow from "react-native-dialogflow";
import InstructionCard from './InstructionCard';

const { width, height } = Dimensions.get('window');

export default class Recipe extends Component {

  constructor(props) {
    super(props);

    this.state = {
      step: 0,
      step_images: ["https://cdn3.iconfinder.com/data/icons/kitchen-universe-2/140/29_oven-512.png"],
      recognized: '',
      started: '',
      results: [],
      position: new Animated.Value(this.props.isOpen ? 0 : height),
      visible: this.props.isOpen,
    };

    Dialogflow.setConfiguration(
      "b572c2f657df43098fc73e8ce901e081", Dialogflow.LANG_ENGLISH
    );

    Voice.onSpeechStart = this.onSpeechStart.bind(this);
    Voice.onSpeechRecognized = this.onSpeechRecognized.bind(this);
    Voice.onSpeechResults = this.onSpeechResults.bind(this);
  }

  // static propTypes = {
  //   recipe: PropTypes.object.isRequired,
  //   isOpen: PropTypes.object.isRequired,
  //   handleClose: PropTypes.func.isRequired,
  // }

  // _renderItem ({item, index}) {
  //   return (
  //     <View style={styles.card}>
  //       <View>
  //         <Text style={styles.title}>{ item.title }</Text>
  //       </View>
  //       <View>
  //         <Image source={{ uri: item.pic }} style={styles.image} />
  //       </View>
  //       <View>
  //         <Text style={styles.step}>{ item.instruction }</Text>
  //       </View>
  //     </View>
  //   );
  // }

  componentWillReceiveProps(nextProps) {
    if (!this.props.isOpen && nextProps.isOpen) {
      this.setState({
        step: 0
      })
      this.animateOpen();
    }
    else if (this.props.isOpen && !nextProps.isOpen) {
      this.animateClose();
    }
  }

  componentWillUnmount() {
    Voice.destroy().then(Voice.removeAllListeners);
  }

  onSpeechStart(e) {
    this.setState({
      started: '√',
    });
  }

  onSpeechRecognized(e) {
    this.setState({
      recognized: '√',
    });
  }

  onSpeechResults(e) {
    this.setState({
      results: e.value,
    });
  }

  async _startRecognition(e) {
    this.speak(this.parse('Lets start cooking %s', this.props.recipe.title));
    this.setState({
      recognized: '',
      started: '',
      results: [],
    });
    try {
      await Voice.start('en-US');
    } catch (e) {
      console.error(e);
    }
  }

  parse(str) {
    var args = [].slice.call(arguments, 1);
    var i = 0;
    return str.replace(/%s/g, () => args[i++]);
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
    Tts.setDefaultRate(0.5);
    Tts.setDefaultPitch(0.9);
    Tts.setDefaultVoice('com.apple.ttsbundle.Samantha-compact');
    Tts.speak(input);
  }

  startRecipe() {
    this.setState({
      step: this.state.step + 1
    }, () => {
      this.speak(this.parse("Lets start cooking %s. First, %s", this.props.recipe.title, this.props.recipe.steps[0]));
    });
  }

  pageLeft() {
    this.setState({
      step: this.state.step - 1
    }, () => {
      this.speak(this.props.recipe.steps[this.state.step-1]);
    });
  }

  pageRight() {
    this.setState({
      step: this.state.step + 1
    }, () => {
      this.speak(this.props.recipe.steps[this.state.step-1]);
    });
  }

  generateCard() {
    return (
      <View style={styles.card}>
        <InstructionCard
          title={this.parse('Step %s', this.state.step)}
          pic={this.state.step_images[this.state.step - 1]}
          instruction={this.props.recipe.steps[this.state.step - 1]}
        />
        <View style={styles.buttonBar}>
          <TouchableOpacity style={styles.startButton} onPress={() => this.pageLeft()}>
            <Text style={styles.startButtonText}>Previous</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.startButton} onPress={() => this.pageRight()}>
            <Text style={styles.startButtonText}>Next</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
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
          <TouchableOpacity style={styles.closeButton} onPress={() => handleClose()}>
            <Text style={styles.closeText}>X</Text>
          </TouchableOpacity>

          {
            this.state.step === 0
            ?
            <View style={styles.card}>
              <Image source={{ uri: this.props.recipe.pic }} style={styles.stepImage} />
              <View>
                <Text style={styles.header2}>{this.props.recipe.title}</Text>
                <Text style={styles.header3}>{this.props.recipe.time}</Text>
                {/* {this.props.recipe.ingredients.map((quantity,ingredient) => <Text>{quantity}:{ingredient}</Text>)} */}
              </View>
              <View style={styles.buttonBar}>
                <TouchableOpacity style={styles.startButton} onPress={() => this.showIngredients()}>
                  <Image style={styles.startButtonImage} source={{uri: "https://cdn3.iconfinder.com/data/icons/text/100/list-512.png"}}/>
                  <Text style={styles.startButtonText}>Ingredients</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.startButton} onPress={() => this.startRecipe()}>
                  <Image style={styles.startButtonImage} source={{uri: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/75/Microphone-outlined-circular-button.svg/1024px-Microphone-outlined-circular-button.svg.png"}}/>
                  <Text style={styles.startButtonText}>Start</Text>
                </TouchableOpacity>
              </View>
            </View>
            :
            this.generateCard()
          }

        </Animated.View>
      </View>
    );
  }

}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    // justifyContent: 'flex-end',
    backgroundColor: 'transparent',
  },
  modal: {
    height: height,
    backgroundColor: 'white',
    paddingTop: 10,
  },
  closeButton: {
    alignItems: 'flex-end',
    paddingRight: 20,
    paddingTop: 20,
  },
  closeText: {
    fontSize: 20
  },
  buttonBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  startButton: {
    alignItems: 'center',
    justifyContent: 'center',
    margin: 60
  },
  startButtonImage: {
    borderRadius: 10,
    height: 50,
    width: 50,
    marginTop: 20,
    marginBottom: 10,
  },
  startButtonText: {
    fontSize: 16
  },
  transcript: {
    textAlign: 'center',
    color: '#B0171F',
    marginBottom: 1,
  },
  imageContainer: {
    flex: 1,
  },
  image: {
    borderRadius: 10,
    ...StyleSheet.absoluteFillObject,
  },
  stepImage: {
    borderRadius: 10,
    height: height*.4,
    width: width,
    marginTop: 20,
    marginBottom: 10,
  },
  card: {
    flex: 1,
    flexDirection: 'column',
    height: height*0.8,
    width: width
  },
  title: {
    ...defaultStyles.header,
  },
  header2: {
    fontFamily: 'Avenir',
    fontSize: 30,
  },
  header3: {
    fontFamily: 'Avenir',
    fontSize: 20,
  },
});
