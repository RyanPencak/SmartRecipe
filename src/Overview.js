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
    for (i = 0; i < this.props.steps.length; i++) {
      this.data.push({
        title: "" + this.props.steps[i],
        description: ''
      })
    }
  }

  render() {
    this.getData()
    return (
      <View style={styles.container}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          >
          <Timeline
            data={this.data}
            circleSize={20}
            circleColor='rgb(45,156,219)'
            lineColor='rgb(45,156,219)'
            descriptionStyle={{color:'gray'}}
            showTime={false}
            options={{
              style:{paddingTop:30}
            }}
          />
        </ScrollView>
      </View>
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
  imageContainer: {
    flex: 1,
  },
  image: {
    borderRadius: 10,
    ...StyleSheet.absoluteFillObject,
  },
  title: {
    ...defaultStyles.text,
    fontSize: 16,
    marginTop: 4,
  },
  genre: {
    ...defaultStyles.text,
    color: '#BBBBBB',
    fontSize: 14,
    lineHeight: 18,
  },
  scrollContent: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
});
