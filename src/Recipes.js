import React, { Component } from 'react';
import {
  ScrollView,
  StyleSheet,
  View
} from 'react-native';
import { recipes } from './data';
import TitleCard from './TitleCard';

export default class Recipes extends Component {
  render() {
    return (
      <View style={styles.container}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
        >
          {recipes.map((recipe, index) => <TitleCard
            recipe={recipe}
            onOpen={this.openRecipe}
            key={index}
          />)}
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 50,
  },
  scrollContent: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
});
