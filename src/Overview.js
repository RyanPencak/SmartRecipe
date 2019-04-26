import React, { Component, PropTypes } from 'react';
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  Animated
} from 'react-native';
import { defaultStyles } from './styles';
import Timeline from 'react-native-timeline-listview'

const { width, height } = Dimensions.get('window');

export default class Overview extends Component {
  constructor(props) {
    super(props);
  }

  getData(){
    this.data = []
    let i;
    let j;
    for (i = 0; i < this.props.steps.length; i++) {
      let tempList = []
      for (j = 0; j < this.props.steps[i].length; j++) {
        tempList.push({
          title: "" + this.props.steps[i][j].instruction
        })
      }
      this.data.push(tempList)
    }
  }

  renderTimelines() {
    this.timelineList = [];
    let i;
    for (i = 0; i < this.props.steps.length; i++) {
       this.timelineList.push(
         <Timeline
           data={this.data[i]}
           circleSize={10}
           circleColor='rgb(45,156,219)'
           lineColor='rgb(45,156,219)'
           titleStyle={{color:'black',fontSize: 16}}
           showTime={false}
           renderFullLine={false}
           options={{
             style:{paddingTop:10}
           }}
         />
       );
    }
  }

  render() {
    this.getData();
    this.renderTimelines();
    return (
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        >
        {this.timelineList}
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    marginLeft: 10,
    marginBottom: 10,
    height: height,
    width: width*.95,
  },
  scrollContent: {
    flexGrow: 1
  },
});
