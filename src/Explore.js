import React, { Component } from 'react';
import {
  Text,
  ScrollView,
  StyleSheet,
  View
} from 'react-native';
import { defaultStyles } from './styles';
import { recipes } from './data';
import TitleCard from './TitleCard';
import Recipe from './Recipe';

export default class Explore extends Component {
  state = {
    recipeOpen: false,
  }

  openRecipe = (recipe) => {
    this.setState({
      recipeOpen: true,
      recipe: recipe,
    });
  }

  closeRecipe = () => {
    this.setState({
      recipeOpen: false,
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.center}>
          <Text style={styles.header}>SmartRecipes</Text>
        </View>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          >
            {recipes.map((recipe, index) => <TitleCard
              recipe={recipe}
              handleOpen={this.openRecipe}
              key={index}
            />)}
        </ScrollView>
        <Recipe
          recipe={this.state.recipe}
          isOpen={this.state.recipeOpen}
          handleClose={this.closeRecipe}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  header: {
    ...defaultStyles.header,
    paddingTop: 5,
    paddingBottom: 20
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    paddingTop: 20,
  },
  scrollContent: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
});