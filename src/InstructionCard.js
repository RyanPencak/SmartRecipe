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

  getTime() {
    let total_seconds = 0;
    let split_time = this.props.time.split(":");
    total_seconds += parseInt(split_time[0],10)*60*60;
    total_seconds += parseInt(split_time[2],10);
    total_seconds += parseInt(split_time[1],10)*60;
    return total_seconds;
  }

  getTimeNotice() {
    let seconds = this.getTime();
    if (seconds < 120) {
      return 10;
    }
    else {
      return seconds-60;
    }
  }

  getSlicedArrays() {
    var slicedArrays = []
    let i;
    for (i = 0; i < this.props.numStepThreads; i++) {
      slicedArrays.push(this.props.recipe.steps[i].slice(this.props.stepProgress[i] ,this.props.recipe.steps[i].length));
    }
    return slicedArrays;
  }

  isRemainingTask() {
    let i;
    for (i = 0; i < this.props.numStepThreads; i++) {
      if (this.props.stepProgress[i] !== this.props.recipe.steps[i].length) {
        return true;
      }
    }
    return false;
  }

  generateMenuComponents() {
    var stepArrays = this.getSlicedArrays();
    var isTask = this.isRemainingTask(stepArrays);

    if (isTask) {
      if (this.props.ingredients.length > 0) {
        if (this.props.numStepThreads > 1) {
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
        if (this.props.numStepThreads > 1) {
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
        if (this.props.numStepThreads > 1) {
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
        if (this.props.numStepThreads > 1) {
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
    return (
      <View style={styles.container} key={this.props.step}>
        <Progress.Bar progress={this.props.step / this.props.totalSteps} width={200} />
        {
          (this.props.time)
          ?
          <View>
            <CountDown
              until={this.getTimeNotice()}
              onFinish={() => this.props.speak("Get ready.")}
              size={0}
              timeToShow={[]}
              timeLabels={{}}
            />
            <CountDown
              style={styles.timer}
              until={this.getTime()}
              onFinish={() => this.props.handleTimer(this.props.step)}
              size={35}
              digitStyle={{backgroundColor: '#000'}}
              digitTxtStyle={{color: '#FFF'}}
              timeToShow={['M', 'S']}
              timeLabels={{m: 'MM', s: 'SS'}}
            />
          </View>
          :
          <Image key={this.props.step} source={{ uri: this.props.pic }} style={styles.image} />
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
              steps={[this.props.recipe.steps[0].slice(this.props.step, this.props.recipe.steps[0].length)]}
            />
            :
            null
          }
          {
            this.state.multitaskVisible
            ?
            <ScrollView style={styles.dropdown}>
              <Text>{this.props.recipe.steps[this.props.currentStepThread+1][0]}</Text>
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
  textContainer: {
    flexDirection: 'row',
  },
  menuContainer: {
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
    borderRadius: 10,
    height: height*0.25,
    width: width*0.5,
    marginTop: 20,
    resizeMode:'contain'
  },
  title: {
    ...defaultStyles.header2,
    marginTop: 4,
  },
  step: {
    ...defaultStyles.header4,
    marginTop: 50,
    marginBottom: 10,
    marginLeft: 10,
    marginRight: 10,
    flex: 1,
    flexWrap: 'wrap'
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
  }
});
