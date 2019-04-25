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

  // toggleDropdowns() {
  //   this.setState({
  //     ingredientsVisible: !this.state.ingredientsVisible,
  //     multitaskVisible: !this.state.multitaskVisible
  //   });
  // }

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
      return 60;
    }
  }

  render() {
    if ((this.props.ingredients.length > 0) && (this.props.recipe.steps.length > 1)) {
      return (
        <View style={styles.container} key={this.props.step}>
          <Progress.Bar progress={this.props.step / this.props.totalSteps} width={200} />
          <Text style={styles.title} numberOfLines={1}>{this.props.title}</Text>
          {
            (this.props.time)
            ?
            <View>
              <CountDown
                until={this.getTimeNotice()}
                onFinish={() => this.props.speak("Get ready, timer ends soon.")}
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

          {
            this.props.ingredients.length > 0
            ?
            <View>
              {
                this.state.ingredientsVisible
                ?
                <View style={styles.dropdown}>
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
                  <IngredientList
                    color='rgb(255,255,255)'
                    ingredients={this.props.ingredients}
                  />
                </View>
                :
                <View style={styles.dropdown}>
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
                </View>
              }
              {
                this.state.overviewVisible
                ?
                <View style={styles.dropdown}>
                  <Overview
                    steps={this.props.recipe.steps[0].slice(this.props.step, this.props.recipe.steps[0].length)}
                  />
                </View>
                :
                <View style={styles.dropdown}>
                </View>
              }
            </View>
            :
            null
          }

          {/* {
            this.props.recipe.steps[0][this.props.step].ingredients.length > 0
            <View>
              {
                this.state.ingredientsVisible
                ?
                <View style={styles.dropdown}>
                  <IngredientList
                    color='rgb(255,255,255)'
                    ingredients={this.props.recipe.steps[0][this.props.step].ingredients}
                  />
                </View>
                :
                null
              }
            </View>
            :
            null
          } */}

          {/* {
            this.props.recipe.steps[0][this.props.step].ingredients.length > 0
            ?
            <View>
              {
                this.state.ingredientsVisible
                ?
                <View style={styles.dropdownDown}>
                  <TouchableOpacity onPress={() => this.toggleDropdowns()}>
                    <Text style={styles.ingredientHeader}>Ingredients</Text>
                  </TouchableOpacity>
                  <IngredientList
                    color='rgb(190,192,196)'
                    ingredients={this.props.recipe.steps[0][this.props.step].ingredients}
                  />
                </View>
                :
                <View style={styles.dropdownUp}>
                  <TouchableOpacity onPress={() => this.toggleDropdowns()}>
                    <Text style={styles.ingredientHeader}>Ingredients</Text>
                  </TouchableOpacity>
                </View>
              }
            </View>
            :
            null
          } */}
        </View>
      );
    }
    else if (this.props.recipe.steps.length > 1) {
      return (
        <View style={styles.container} key={this.props.step}>
          <Progress.Bar progress={this.props.step / this.props.totalSteps} width={200} />
          <Text style={styles.title} numberOfLines={1}>{this.props.title}</Text>
          {
            (this.props.time)
            ?
            <View>
              <CountDown
                until={this.getTimeNotice()}
                onFinish={() => this.props.speak("Get ready, timer ends soon.")}
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

          {
            this.props.ingredients.length > 0
            ?
            <View>
              {
                this.state.ingredientsVisible
                ?
                <View style={styles.dropdown}>
                  <View style={styles.menuContainer}>
                    <TouchableOpacity style={styles.menuItem} onPress={() => this.toggleOverview()}>
                      <Text style={styles.menuText}>Coming Up</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.menuItem} onPress={() => this.toggleIngredients()}>
                      <Text style={styles.menuText}>Ingredients</Text>
                    </TouchableOpacity>
                  </View>
                  <IngredientList
                    color='rgb(255,255,255)'
                    ingredients={this.props.ingredients}
                  />
                </View>
                :
                <View style={styles.dropdown}>
                  <View style={styles.menuContainer}>
                    <TouchableOpacity style={styles.menuItem} onPress={() => this.toggleOverview()}>
                      <Text style={styles.menuText}>Coming Up</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.menuItem} onPress={() => this.toggleIngredients()}>
                      <Text style={styles.menuText}>Ingredients</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              }
              {
                this.state.overviewVisible
                ?
                <View style={styles.dropdown}>
                  <Overview
                    steps={this.props.recipe.steps[0].slice(this.props.step, this.props.recipe.steps[0].length)}
                  />
                </View>
                :
                <View style={styles.dropdown}>
                </View>
              }
            </View>
            :
            null
          }
        </View>
      );
    }
    else if (this.props.ingredients.length > 0) {
      return (
        <View style={styles.container} key={this.props.step}>
          <Progress.Bar progress={this.props.step / this.props.totalSteps} width={200} />
          <Text style={styles.title} numberOfLines={1}>{this.props.title}</Text>
          {
            (this.props.time)
            ?
            <View>
              <CountDown
                until={this.getTimeNotice()}
                onFinish={() => this.props.speak("Get ready, timer ends soon.")}
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

          {
            this.props.ingredients.length > 0
            ?
            <View>
              {
                this.state.ingredientsVisible
                ?
                <View style={styles.dropdown}>
                  <View style={styles.menuContainer}>
                    <TouchableOpacity style={styles.menuItem} onPress={() => this.toggleOverview()}>
                      <Text style={styles.menuText}>Coming Up</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.menuItem} onPress={() => this.toggleIngredients()}>
                      <Text style={styles.menuText}>Ingredients</Text>
                    </TouchableOpacity>
                  </View>
                  <IngredientList
                    color='rgb(255,255,255)'
                    ingredients={this.props.ingredients}
                  />
                </View>
                :
                <View style={styles.dropdown}>
                  <View style={styles.menuContainer}>
                    <TouchableOpacity style={styles.menuItem} onPress={() => this.toggleOverview()}>
                      <Text style={styles.menuText}>Coming Up</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.menuItem} onPress={() => this.toggleIngredients()}>
                      <Text style={styles.menuText}>Ingredients</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              }
              {
                this.state.overviewVisible
                ?
                <View style={styles.dropdown}>
                  <Overview
                    steps={this.props.recipe.steps[0].slice(this.props.step, this.props.recipe.steps[0].length)}
                  />
                </View>
                :
                <View style={styles.dropdown}>
                </View>
              }
            </View>
            :
            null
          }
        </View>
      );
    }
    else {
      return (
        <View style={styles.container} key={this.props.step}>
          <Progress.Bar progress={this.props.step / this.props.totalSteps} width={200} />
          <Text style={styles.title} numberOfLines={1}>{this.props.title}</Text>
          {
            (this.props.time)
            ?
            <View>
              <CountDown
                until={this.getTimeNotice()}
                onFinish={() => this.props.speak("Get ready, timer ends soon.")}
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

          {
            this.props.recipe.steps[0].slice(this.props.step, this.props.recipe.steps[0].length).length > 0
            ?
            <View>
              {
                this.state.overviewVisible
                ?
                <View style={styles.dropdown}>
                  <View style={styles.menuContainer}>
                    <TouchableOpacity style={styles.menuItem} onPress={() => this.toggleOverview()}>
                      <Text style={styles.menuText}>Coming Up</Text>
                    </TouchableOpacity>
                  </View>
                  <Overview
                    steps={this.props.recipe.steps[0].slice(this.props.step, this.props.recipe.steps[0].length)}
                  />
                </View>
                :
                <View style={styles.dropdown}>
                  <View style={styles.menuContainer}>
                    <TouchableOpacity style={styles.menuItem} onPress={() => this.toggleOverview()}>
                      <Text style={styles.menuText}>Coming Up</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              }
            </View>
            :
            null
          }
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    marginLeft: 10,
    marginBottom: 10,
    height: height,
    width: width,
    zIndex: 2
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
    backgroundColor: "#D3D3D3",
    zIndex: 3
  },
  menuText: {
    fontSize: 20,
    padding: 5,
    zIndex: 3
  },
  image: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    height: 200,
    width: 220,
    marginTop: 20
  },
  title: {
    ...defaultStyles.header2,
    marginTop: 4,
  },
  step: {
    ...defaultStyles.header3,
    marginTop: 50,
    marginBottom: 50,
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
  buttonBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-around',
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20
  },
  // dropdown: {
  //   height: 20
  // },
  // dropdownDown: {
  //   height: 200,
  //   width: width-50,
  //   backgroundColor: "#fff",
  //   zIndex: 3
  // },
  // dropdownUp: {
  //   height: 50,
  //   width: width-50,
  //   backgroundColor: "#fff",
  //   zIndex: 3
  // }
});
