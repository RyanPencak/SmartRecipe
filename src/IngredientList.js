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

export default class IngredientList extends Component {
  constructor(props) {
    super(props);
  }

  getData(){
    this.data = []
    let i;
    for (i = 0; i < this.props.ingredients.length; i++) {
      this.data.push({
        title: "\u2022 " + this.props.ingredients[i][0] + " " + this.props.ingredients[i][1],
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
            circleSize={0}
            circleColor={this.props.color}
            lineColor={this.props.color}
            showTime={false}
            descriptionStyle={{color:'black'}}
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
  scrollContent: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
});
