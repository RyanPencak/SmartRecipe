import React, { Component, PropTypes } from 'react';
import {
  ScrollView,
  Animated,
  Button,
  Image,
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  FlatList,
  ListView
} from 'react-native';
import { defaultStyles } from './styles';
import Tts from 'react-native-tts';
import Voice from 'react-native-voice';
import InstructionCard from './InstructionCard';
import IngredientList from './IngredientList';
import Overview from './Overview';
import * as Progress from 'react-native-progress';

const { width, height } = Dimensions.get('window');

export default class Recipe extends Component {

  constructor(props) {
    super(props);

    this.state = {
      step: 0,
      recognized: '',
      started: '',
      results: [],
      position: new Animated.Value(this.props.isOpen ? 0 : height),
      visible: this.props.isOpen,
      ingredientsOpen: false,
      overviewOpen: false,
    };

    Voice.onSpeechStart = this.onSpeechStart.bind(this);
    Voice.onSpeechRecognized = this.onSpeechRecognized.bind(this);
    Voice.onSpeechResults = this.onSpeechResults.bind(this);
    Voice.onSpeechEnd = this.onSpeechEnd.bind(this);
  }

  // Function componentWillReceiveProps: React lifecycle function for handling animation
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

  // Function componentWillUnmount: React lifecycle function for stopping Voice
  componentWillUnmount() {
    Voice.destroy().then(Voice.removeAllListeners);
  }

  // Function onSpeechStart: store state for speech started
  onSpeechStart(e) {
    this.setState({
      started: '√',
    });
  }

  // Function onSpeechRecognized: store state for speech recognized
  onSpeechRecognized(e) {
    this.setState({
      recognized: '√',
    });
  }

  // Function onSpeechResults: log results to state and handle user requests
  onSpeechResults(e) {
    this.setState({
      results: e.value,
    });

    console.log(this.state.results);

    if (this.state.results[0] !== undefined)
    {
      if (this.state.results[0].includes("next")
            || this.state.results[0].includes("Next")
            || this.state.results[0].includes("done")
            || this.state.results[0].includes("Done")
            || this.state.results[0].includes("repeat")
            || this.state.results[0].includes("Repeat")
            || this.state.results[0].includes("last")
            || this.state.results[0].includes("Last")
            || this.state.results[0].includes("previous")
            || this.state.results[0].includes("Previous")
            || this.state.results[0].includes("how much")
            || this.state.results[0].includes("How much")
            || this.state.results[0].includes("How many")
            || this.state.results[0].includes("How many"))
      {
        Voice.stop()
      }
    }
  }

  // Function onSpeechEnd: handles user input and prompts voice assistant to respond
  onSpeechEnd(e) {
    if (this.state.results[0] !== undefined){
      if (this.state.results[0].includes("next") || this.state.results[0].includes("Next") || this.state.results[0].includes("done") || this.state.results[0].includes("Done")){
        this.pageRight();
        Voice.start('en-US');
      }
    }
    if (this.state.results[0] !== undefined){
      if (this.state.results[0].includes("repeat") || this.state.results[0].includes("Repeat")){
        this.speak(this.props.recipe.steps[0][this.state.step-1].instruction);
        Voice.start('en-US');
      }
    }
    if (this.state.results[0] !== undefined){
      if (this.state.results[0].includes("last") || this.state.results[0].includes("Last") || this.state.results[0].includes("previous") || this.state.results[0].includes("Previous")){
        this.pageLeft();
        Voice.start('en-US');
      }
    }
    if (this.state.results[0] !== undefined){
      if (this.state.results[0].includes("how much") || this.state.results[0].includes("How much")){
        let find = this.state.results[0].split("much");
        this.findIngredient(find[1]);
        Voice.start('en-US');
      }
    }
    if (this.state.results[0] !== undefined){
      if (this.state.results[0].includes("How many") || this.state.results[0].includes("How many")){
        let find = this.state.results[0].split("many");
        this.findIngredient(find[1]);
        Voice.start('en-US');
      }
    }
  }

  // Function findIngredient: searches for requested ingredients and speaks required amount
  findIngredient(find) {
    if (find.includes(" ")) {
      let ingredient = find.split(" ");
      if (ingredient[1]) {
        let ingredientToFind = ingredient[1];
        console.log(ingredientToFind);
        let i;
        for (i = 0; i < this.props.recipe.ingredients.length; i++) {
          let current = this.props.recipe.ingredients[i][1].toLowerCase()
          if (current.includes(ingredientToFind)) {
            this.speak(this.props.recipe.ingredients[i][0]);
          }
        }
      }
    }
  }

  // Function _startRecognition: runs speech recognition asynchronously
  async _startRecognition(e) {
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
    console.log(Voice.isRecognizing())
  }

  // Function parse: takes in a string and replaces %s with variables
  parse(str) {
    var args = [].slice.call(arguments, 1);
    var i = 0;
    return str.replace(/%s/g, () => args[i++]);
  }

  // Function animateOpen: handles animation for opening screens
  animateOpen() {
    this.setState({ visible: true }, () => {
      Animated.timing(
        this.state.position, { toValue: 0 }
      ).start();
    });
  }

  // Function animateClose: handles animation for closing screens
  animateClose() {
    Animated.timing(
      this.state.position, { toValue: height }
    ).start(() => this.setState({ visible: false }));
  }

  // Function speak: takes in a string input and speaks it
  speak(input) {
    Tts.setDefaultRate(0.45);
    Tts.setDefaultPitch(0.9);
    Tts.setDefaultVoice('com.apple.ttsbundle.Samantha-compact');
    Tts.speak(input);
  }

  // Function startRecipe: begins voice assistant and starts speech recognition
  startRecipe() {
    this.setState({
      step: this.state.step + 1
    }, () => {
      this.speak(this.parse("Lets start cooking %s. First, %s", this.props.recipe.title, this.props.recipe.steps[0][0].instruction));
      this._startRecognition();
    });
  }

  // Function showIngredients: sets ingredient visibility to true
  showIngredients() {
    this.setState({
      ingredientsOpen: true
    });
  }

  // Function hideIngredients: sets ingredient visibility to false
  hideIngredients() {
    this.setState({
      ingredientsOpen: false
    });
  }

  // Function showOverview: sets overview visibility to true
  showOverview() {
    this.setState({
      overviewOpen: true
    });
  }

  // Function hideOverview: sets overview visibility to false
  hideOverview() {
    this.setState({
      overviewOpen: false
    });
  }

  // Function pageLeft: decrements recipe step and speaks previous step
  pageLeft() {
    if (this.state.step > 1) {
      this.setState({
        step: this.state.step - 1
      }, () => {
        this.speak(this.props.recipe.steps[0][this.state.step-1].instruction);
      });
    }
  }

  // Function pageRight: increments recipe step and speaks next step
  pageRight() {
    if (this.state.step < this.props.recipe.steps[0].length) {
      this.setState({
        step: this.state.step + 1
      }, () => {
        this.speak(this.props.recipe.steps[0][this.state.step-1].instruction);
      });
    }
  }

  // Function handleTimer: called when timers end in InstructionCard
  handleTimer = (step) => {
    this.setState({
      step: step + 1
    }, () => {
      Voice.start('en-US');
      this.speak(this.props.recipe.steps[0][step].instruction);
    });
  }

  // Function generateCard: returns component for a recipe instruction card
  generateCard() {
    return (
      <View style={styles.card}>
        <InstructionCard
          recipe={this.props.recipe}
          title={this.parse('Step %s', this.state.step)}
          pic={this.props.recipe.steps[0][this.state.step - 1].img}
          time={this.props.recipe.steps[0][this.state.step - 1].time}
          instruction={this.props.recipe.steps[0][this.state.step - 1].instruction}
          ingredients={this.props.recipe.steps[0][this.state.step - 1].ingredients}
          step={this.state.step}
          totalSteps={this.props.recipe.steps[0].length}
          handleTimer={this.handleTimer}
          speak={this.speak}
          pageLeft={this.pageLeft}
          pageRight={this.pageRight}
          height={height}
          width={width}
        />
        {/* <View style={styles.navBar}>
          <TouchableOpacity style={styles.button} onPress={() => this.pageLeft()}>
          {
            this.state.step > 1
            ?
            <TouchableOpacity style={styles.button} onPress={() => this.pageLeft()}>
              <Image style={styles.navButtonImage} source={require('./assets/previous_icon.png')}/>
              <Text style={styles.startButtonText}>Previous</Text>
            </TouchableOpacity>
            :
            null
          }
          </TouchableOpacity> */}
          {/* <TouchableOpacity style={styles.button} onPress={() => this.showIngredients()}>
            <Image style={styles.ingredientButtonImage} source={require('./assets/list_icon.png')}/>
            <Text style={styles.startButtonText}>Ingredients</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => this.showOverview()}>
            <Image style={styles.overviewButtonImage} source={require('./assets/overview_icon.png')}/>
            <Text style={styles.startButtonText}>Overview</Text>
          </TouchableOpacity> */}
          {/* {
            this.state.step < this.props.recipe.steps[0].length
            ?
            <TouchableOpacity style={styles.button} onPress={() => this.pageRight()}>
              <Image style={styles.navButtonImage} source={require('./assets/next_icon.png')}/>
              <Text style={styles.startButtonText}>Next</Text>
            </TouchableOpacity>
            :
            null
          }
        </View> */}
      </View>
    )
  }

  // Function listIngredients: returns a listview of ingredients
  listIngredients() {
    let i;
    for (i = 0; i < this.props.recipe.ingredients.length; i++) {
      return(<IngredientList instruction={this.props.recipe.ingredients[i]}/>);
    }
  }

  // Function closeWindow: ends Voice and closes page
  closeWindow() {
    Voice.destroy().then(Voice.removeAllListeners);
    this.props.handleClose()
  }

  render() {
    const { recipe, handleClose } = this.props;

    if (!this.state.visible) {
      return null;
    }

    if (this.state.ingredientsOpen) {
      return (
        <View style={styles.container}>
          <Animated.View
            style={[styles.modal, {
              transform: [{ translateY: this.state.position }, { translateX: 0 }]
            }]}
          >
            <TouchableOpacity style={styles.closeButton} onPress={() => this.hideIngredients()}>
              <Image style={styles.closeButtonImage} source={require('./assets/close_icon.png')}/>
            </TouchableOpacity>
            <Text style={styles.header2} numberOfLines={1}>{this.props.recipe.title}</Text>
            <IngredientList
              color='rgb(255,255,255)'
              ingredients={this.props.recipe.ingredients}
            />
          </Animated.View>
        </View>
      );
    }
    else if (this.state.overviewOpen) {
      return (
        <View style={styles.container}>
          <Animated.View
            style={[styles.modal, {
              transform: [{ translateY: this.state.position }, { translateX: 0 }]
            }]}
          >
            <TouchableOpacity style={styles.closeButton} onPress={() => this.hideOverview()}>
              <Image style={styles.closeButtonImage} source={require('./assets/close_icon.png')}/>
            </TouchableOpacity>
            <Text style={styles.header2} numberOfLines={1}>{this.props.recipe.title}</Text>
            <Overview
              steps={this.props.recipe.steps[0]}
            />
          </Animated.View>
        </View>
      );
    }
    else {
      if (this.state.step === 0) {
        return (
          <View style={styles.container}>
            <Animated.View
              style={[styles.modal, {
                transform: [{ translateY: this.state.position }, { translateX: 0 }]
              }]}
            >
              <TouchableOpacity style={styles.closeButton} onPress={() => this.closeWindow()}>
                <Image style={styles.closeButtonImage} source={require('./assets/close_icon.png')}/>
              </TouchableOpacity>

              <View style={styles.card}>
                <Image source={{ uri: this.props.recipe.titleImg }} style={styles.stepImage} />
                <View style={styles.indent}>
                  <Text style={styles.header2}>{this.props.recipe.title}</Text>
                  <Text style={styles.header3}>{'Time: '}{this.props.recipe.time}</Text>
                  <Text style={styles.header3}>{'Author: '}{this.props.recipe.author}</Text>
                </View>
                <View style={styles.buttonBar}>
                  <TouchableOpacity style={styles.button} onPress={() => this.showIngredients()}>
                    <Image style={styles.ingredientButtonImage} source={require('./assets/list_icon.png')}/>
                    <Text style={styles.startButtonText}>Ingredients</Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.button} onPress={() => this.startRecipe()}>
                    <Image style={styles.startButtonImage} source={require('./assets/microphone_icon.png')}/>
                    <Text style={styles.startButtonText}>Start</Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.button} onPress={() => this.showOverview()}>
                    <Image style={styles.overviewButtonImage} source={require('./assets/overview_icon.png')}/>
                    <Text style={styles.startButtonText}>Overview</Text>
                  </TouchableOpacity>
                </View>
              </View>

            </Animated.View>
          </View>
        );
      }
      else {
        return (
          <View style={styles.container}>
            <Animated.View
              style={[styles.modal, {
                transform: [{ translateY: this.state.position }, { translateX: 0 }]
              }]}
            >
              <TouchableOpacity style={styles.closeButton} onPress={() => this.closeWindow()}>
                <Image style={styles.closeButtonImage} source={require('./assets/close_icon.png')}/>
              </TouchableOpacity>
              <View style={styles.smallnavbar}>
                {
                  this.state.step > 1
                  ?
                  <TouchableOpacity style={styles.smallnavbuttonleft} onPress={() => this.pageLeft()}>
                    <Image style={styles.smallnavbuttonimage} source={require('./assets/previous_icon.png')}/>
                  </TouchableOpacity>
                  :
                  null
                }
                {
                  this.state.step < this.props.recipe.steps[0].length
                  ?
                  <TouchableOpacity style={styles.smallnavbuttonright} onPress={() => this.pageRight()}>
                    <Image style={styles.smallnavbuttonimage} source={require('./assets/next_icon.png')}/>
                  </TouchableOpacity>
                  :
                  null
                }
              </View>

              {this.generateCard()}

            </Animated.View>
          </View>
        );
      }
    }
  }

}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    // justifyContent: 'flex-end',
    backgroundColor: 'transparent',
  },
  indent: {
    marginLeft: 20
  },
  modal: {
    height: height,
    backgroundColor: 'white',
    paddingTop: 10,
  },
  closeButton: {
    alignItems: 'flex-end',
    paddingRight: 20,
    paddingTop: 20
  },
  closeButtonImage: {
    height: 30,
    width: 30,
    marginTop: 10,
  },
  closeText: {
    fontSize: 20
  },
  buttonBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-around',
  },
  navBar: {
    flex: 1,
    height: 50,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    paddingLeft: 30,
    paddingRight: 30,
  },
  smallnavbar: {
    zIndex: 100
  },
  smallnavbuttonleft: {
    position: 'absolute',
    left: 15,
    top: 150,
  },
  smallnavbuttonright: {
    position: 'absolute',
    left: width-50,
    top: 150,
  },
  smallnavbuttonimage: {
    borderRadius: 10,
    height: 40,
    width: 40,
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    zIndex: 9999
  },
  ingredientButtonImage: {
    borderRadius: 0,
    height: 45,
    width: 55,
    marginTop: 20,
    marginBottom: 10,
  },
  startButtonImage: {
    borderRadius: 10,
    height: 50,
    width: 50,
    marginTop: 20,
    marginBottom: 10,
  },
  overviewButtonImage: {
    borderRadius: 10,
    height: 50,
    width: 80,
    marginTop: 20,
    marginBottom: 10,
  },
  navButtonImage: {
    borderRadius: 10,
    height: 40,
    width: 40,
    marginTop: 20,
    marginBottom: 10
  },
  startButtonText: {
    fontSize: 16,
    marginBottom: 10
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
    height: height,
    width: width
  },
  title: {
    ...defaultStyles.header,
  },
  header2: {
    marginLeft: 10,
    fontFamily: 'Avenir',
    fontSize: 30,
  },
  header3: {
    marginLeft: 10,
    fontFamily: 'Avenir',
    fontSize: 20,
  },
  scrollContent: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
});
