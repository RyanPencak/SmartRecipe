import React, { Component, PropTypes } from 'react';
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView
} from 'react-native';
import { defaultStyles } from './styles';
import CountDown from 'react-native-countdown-component';
import IngredientList from './IngredientList';
import Overview from './Overview';
import * as Progress from 'react-native-progress';

const { width, height } = Dimensions.get('window');

export default class InstructionCard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      overviewVisible: false,
      ingredientsVisible: false,
      multitaskVisible: false
    };
  }

  toggleOverview() {
    this.setState({
      overviewVisible: !this.state.overviewVisible,
      ingredientsVisible: false,
      multitaskVisible: false
    });
  }

  toggleIngredients() {
    this.setState({
      ingredientsVisible: !this.state.ingredientsVisible,
      multitaskVisible: false,
      overviewVisible: false
    });
  }

  toggleMultitask() {
    this.setState({
      multitaskVisible: !this.state.multitaskVisible,
      ingredientsVisible: false,
      overviewVisible: false
    });
  }

  multitaskOff() {
    this.setState({
      multitaskVisible: false,
    });
  }

  getTimeFromStep() {
    let total_seconds = 0
    if (this.props.instruction.includes("minute")) {
      let min_split = this.props.instruction.split("minute");
      let minutes = min_split[0]
      minutes = minutes.split(" ")
      minutes = minutes[minutes.length - 2]
      total_seconds = total_seconds + (minutes*60)
    }
    if (this.props.instruction.includes("second")) {
      let sec_split = this.props.instruction.split("second");
      let seconds = sec_split[0]
      seconds = seconds.split(" ")
      seconds = seconds[seconds.length - 2]
      total_seconds = total_seconds + seconds
    }

    return total_seconds;
  }

  getTime(t) {
    let total_seconds = 0;
    let split_time = t.split(":");
    total_seconds += parseInt(split_time[0],10)*60*60;
    total_seconds += parseInt(split_time[2],10);
    total_seconds += parseInt(split_time[1],10)*60;
    return total_seconds;
  }

  getTimeNotice(t) {
    let seconds = this.getTime(t);
    if (seconds < 120) {
      return 10;
    }
    else {
      return seconds-60;
    }
  }

  getSlicedArrays() {
    var slicedArrays = []
    for (let i = this.props.currentStepThread; i < this.props.numStepThreads; i++) {
      if (i === this.props.currentStepThread) {
        slicedArrays.push(this.props.recipe.steps[i].slice(this.props.stepProgress[i]+1,this.props.recipe.steps[i].length));
      }
      else {
        slicedArrays.push(this.props.recipe.steps[i].slice(this.props.stepProgress[i],this.props.recipe.steps[i].length));
      }
    }
    return slicedArrays;
  }

  isRemainingTask() {
    for (let i = 0; i < this.props.numStepThreads; i++) {
      if (this.props.stepProgress[i] !== this.props.recipe.steps[i].length-1) {
        return true;
      }
    }
    return false;
  }

  isRemainingMultitask() {
    if (this.props.currentStepThread < this.props.numStepThreads-1) {
      for (let i = this.props.currentStepThread+1; i < this.props.numStepThreads; i++) {
        if (this.props.stepProgress[i] !== this.props.recipe.steps[i].length) {
          return true;
        }
      }
    }
    return false;
  }

  getNextStepThread() {
    for (let i = this.state.currentStepThread+1; i < this.state.numStepThreads; i++) {
      if (this.state.stepProgress[i] < this.props.recipe.steps[i].length) {
        return (i);
      }
    }
  }

  generateMenuComponents() {
    var stepArrays = this.getSlicedArrays();
    var isTask = this.isRemainingTask();
    var isMultitask = this.isRemainingMultitask();

    if (isTask) {
      if (this.props.ingredients.length > 0) {
        if (isMultitask) {
          return (
            <View style={styles.menuContainer}>
              <TouchableOpacity style={styles.menuItem} onPress={() => this.toggleOverview()}>
                <Text style={styles.menuText}>Coming Up</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.menuItem} onPress={() => this.toggleIngredients()}>
                <Text style={styles.menuText}>Ingredients</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.menuItem} onPress={() => this.toggleMultitask()}>
                <Text style={styles.menuText}>Multitask</Text>
              </TouchableOpacity>
            </View>
          );
        }
        else {
          return (
            <View style={styles.menuContainer}>
              <TouchableOpacity style={styles.menuItem} onPress={() => this.toggleOverview()}>
                <Text style={styles.menuText}>Coming Up</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.menuItem} onPress={() => this.toggleIngredients()}>
                <Text style={styles.menuText}>Ingredients</Text>
              </TouchableOpacity>
            </View>
          );
        }
      }
      else {
        if (isMultitask) {
          return (
            <View style={styles.menuContainer}>
              <TouchableOpacity style={styles.menuItem} onPress={() => this.toggleOverview()}>
                <Text style={styles.menuText}>Coming Up</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.menuItem} onPress={() => this.toggleMultitask()}>
                <Text style={styles.menuText}>Multitask</Text>
              </TouchableOpacity>
            </View>
          );
        }
        else {
          return (
            <View style={styles.menuContainer}>
              <TouchableOpacity style={styles.menuItem} onPress={() => this.toggleOverview()}>
                <Text style={styles.menuText}>Coming Up</Text>
              </TouchableOpacity>
            </View>
          );
        }
      }
    }
    else {
      if (this.props.ingredients.length > 0) {
        if (isMultitask) {
          return (
            <View style={styles.menuContainer}>
              <TouchableOpacity style={styles.menuItem} onPress={() => this.toggleIngredients()}>
                <Text style={styles.menuText}>Ingredients</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.menuItem} onPress={() => this.toggleMultitask()}>
                <Text style={styles.menuText}>Multitask</Text>
              </TouchableOpacity>
            </View>
          );
        }
        else {
          return (
            <View style={styles.menuContainer}>
              <TouchableOpacity style={styles.menuItem} onPress={() => this.toggleIngredients()}>
                <Text style={styles.menuText}>Ingredients</Text>
              </TouchableOpacity>
            </View>
          );
        }
      }
      else {
        if (isMultitask) {
          return (
            <View style={styles.menuContainer}>
              <TouchableOpacity style={styles.menuItem} onPress={() => this.toggleMultitask()}>
                <Text style={styles.menuText}>Multitask</Text>
              </TouchableOpacity>
            </View>
          );
        }
        else {
          return (
            null
          );
        }
      }
    }
  }

  render() {
    console.log(this.state.multitaskVisible);
    return (
      <View style={styles.container} key={this.props.stepCounter}>
        <Progress.Bar progress={this.props.stepCounter / this.props.totalSteps} width={200} />
        {
          (this.props.time)
          ?
          <View>
            <CountDown
              until={this.getTimeNotice(this.props.time)}
              onFinish={() => this.props.speak("Get ready.")}
              size={0}
              timeToShow={[]}
              timeLabels={{}}
            />
            <CountDown
              style={styles.timer}
              until={this.getTime(this.props.time)}
              onFinish={() => this.props.handleTimer(this.props.stepCounter)}
              size={35}
              digitStyle={{backgroundColor: '#000'}}
              digitTxtStyle={{color: '#FFF'}}
              timeToShow={['M', 'S']}
              timeLabels={{m: 'MM', s: 'SS'}}
            />
          </View>
          :
          <Image key={this.props.stepCounter} style={styles.image} source={{ uri: this.props.img }} />
        }
        <View style={styles.textContainer}>
          <Text style={styles.step}>{this.props.instruction.replace(/\. /g,'.\n\n')}</Text>
        </View>
        {this.generateMenuComponents()}
        <View>
          {
            this.state.ingredientsVisible
            ?
            <ScrollView style={styles.dropdown}>
              <IngredientList
                color='rgb(255,255,255)'
                ingredients={this.props.ingredients}
              />
            </ScrollView>
            :
            null
          }
          {
            this.state.overviewVisible
            ?
            <Overview
              steps={this.getSlicedArrays()}
            />
            :
            null
          }
          {
            this.state.multitaskVisible && (this.props.currentStepThread < this.props.numStepThreads-1)
            ?
            <ScrollView contentContainerStyle={styles.multitaskContent} style={styles.multitaskContainer}>
              <View style={styles.multitasknav}>
                {
                  this.props.stepProgress[this.props.currentStepThread+1] > 0
                  ?
                  <TouchableOpacity style={styles.multitasknavbuttonleft} onPress={() => this.props.multitaskLeft(this.props.currentStepThread+1)}>
                    <Image style={styles.multitasknavbuttonimage} source={require('./assets/previous_icon.png')}/>
                  </TouchableOpacity>
                  :
                  null
                }
                {
                  this.props.stepProgress[this.props.currentStepThread+1] < this.props.recipe.steps[this.props.currentStepThread+1].length-1
                  ?
                  <TouchableOpacity style={styles.multitasknavbuttonright} onPress={() => this.props.multitaskRight(this.props.currentStepThread+1)}>
                    <Image style={styles.multitasknavbuttonimage} source={require('./assets/next_icon.png')}/>
                  </TouchableOpacity>
                  :
                  null
                }
                {/* {
                  this.props.stepProgress[this.props.currentStepThread+1] == this.props.recipe.steps[this.props.currentStepThread+1].length-1
                  ?
                  <TouchableOpacity style={styles.multitasknavbuttonright} onPress={() => this.props.multitaskRight(this.props.currentStepThread+1)}>
                    <Image style={styles.multitasknavbuttonimage} source={require('./assets/next_icon.png')}/>
                  </TouchableOpacity>
                  :
                  null
                } */}
              </View>
              {
                (this.props.recipe.steps[this.props.currentStepThread+1][this.props.stepProgress[this.props.currentStepThread+1]].time)
                ?
                <View>
                  <CountDown
                    until={this.getTimeNotice(this.props.recipe.steps[this.props.currentStepThread+1][this.props.stepProgress[this.props.currentStepThread+1]].time)}
                    onFinish={() => this.props.speak("Get ready.")}
                    size={0}
                    timeToShow={[]}
                    timeLabels={{}}
                  />
                  <CountDown
                    style={styles.timer}
                    until={this.getTime(this.props.recipe.steps[this.props.currentStepThread+1][this.props.stepProgress[this.props.currentStepThread+1]].time)}
                    onFinish={() => this.props.handleTimer(this.props.stepCounter)}
                    size={35}
                    digitStyle={{backgroundColor: '#000'}}
                    digitTxtStyle={{color: '#FFF'}}
                    timeToShow={['M', 'S']}
                    timeLabels={{m: 'MM', s: 'SS'}}
                  />
                </View>
                :
                <Image key={this.props.stepCounter} style={styles.smallImage} source={{ uri: this.props.recipe.steps[this.props.currentStepThread+1][this.props.stepProgress[this.props.currentStepThread+1]].img }} />
              }
              <View style={styles.scrollTextContainer}>
                <Text style={styles.subStep}>{this.props.recipe.steps[this.props.currentStepThread+1][this.props.stepProgress[this.props.currentStepThread+1]].instruction.replace(/\. /g,'.\n\n')}</Text>
              </View>
            </ScrollView>
            :
            null
          }
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginLeft: 10,
    marginBottom: 10,
    height: height,
    width: width,
  },
  multitaskContainer: {
    width: width
  },
  multitaskContent: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  textContainer: {
    flexDirection: 'row',
  },
  scrollTextContainer: {
    flexDirection: 'row',
    justifyContent: 'center'
  },
  menuContainer: {
    marginTop: 10,
    flexDirection: 'row',
    width: width,
    alignItems: 'flex-end',
    justifyContent: 'space-around',
  },
  menuItem: {
    backgroundColor: "#E8E8E8",
  },
  menuText: {
    fontSize: 18,
    color: "#252728",
    padding: 5,
  },
  image: {
    alignItems: 'center',
    justifyContent: 'center',
    height: height*0.25,
    width: width*0.5,
    marginTop: 20,
    resizeMode:'contain'
  },
  smallImage: {
    alignItems: 'center',
    justifyContent: 'center',
    height: height*0.25,
    width: width*0.5,
    resizeMode:'contain'
  },
  title: {
    ...defaultStyles.header2,
    marginTop: 4,
  },
  step: {
    ...defaultStyles.header4,
    marginTop: 25,
    marginBottom: 20,
    marginLeft: 10,
    marginRight: 10,
    flex: 1,
    flexWrap: 'wrap'
  },
  subStep: {
    flex: 1,
    flexWrap: 'wrap',
    fontFamily: 'Avenir',
    fontSize: 16,
  },
  timer: {
    marginTop: 50,
  },
  ingredientHeader: {
    marginLeft: 10,
    fontFamily: 'Avenir',
    fontSize: 25,
    textAlign: 'center',
  },
  dropdown: {
    height: height
  },
  multitasknav: {
  },
  multitasknavbuttonleft: {
    position: 'absolute',
    left: -125,
    top: 80,
  },
  multitasknavbuttonright: {
    position: 'absolute',
    left: 100,
    top: 80,
  },
  multitasknavbuttonimage: {
    height: 25,
    width: 25,
  },
});
