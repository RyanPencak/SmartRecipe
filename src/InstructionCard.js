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
import CountDown from 'react-native-countdown-component';

const { width, height } = Dimensions.get('window');

export default class InstructionCard extends Component {
  static propTypes = {
    title: PropTypes.object.isRequired,
    pic: PropTypes.object.isRequired,
    instruction: PropTypes.object.isRequired,
    step: PropTypes.object.isRequired,
    time: PropTypes.object,
    handleTimer: PropTypes.func.isRequired
  }

  componentWillReceiveProps(nextProps) {
    if(JSON.stringify(this.props.step) !== JSON.stringify(nextProps.step))
    {
      this.props.step = nextProps.step;
    }
  }

  // shouldComponentUpdate(nextProps){
  //   return nextProps.pic != this.props.pic;
  // }

  getTime(){
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

  render() {
    // const { title, pic, instruction, step, time, handleTimer } = this.props;
    return (
      <View style={styles.container} key={this.props.step}>
        <Text style={styles.title} numberOfLines={1}>{this.props.title}</Text>
        {
          (this.props.instruction.includes("minute") || this.props.instruction.includes("second"))
          ?
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
          :
          <Image key={this.props.step} source={{ uri: this.props.pic }} style={styles.image} />
        }
        {/* <Image key={this.props.step} source={{ uri: this.props.pic }} style={styles.image} /> */}
        <View style={styles.textContainer}>
          <Text style={styles.step}>{this.props.instruction.replace(/\. /g,'.\n\n')}</Text>
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
    marginLeft: 10,
    marginRight: 10,
    flex: 1,
    flexWrap: 'wrap'
  },
  timer: {
    marginTop: 50,
  }
});
