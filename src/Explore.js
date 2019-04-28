import React, { Component } from 'react';
import {
  Text,
  ScrollView,
  StyleSheet,
  View,
  ActivityIndicator
} from 'react-native';
import { defaultStyles } from './styles';
import { recipes } from './data';
import TitleCard from './TitleCard';
import Recipe from './Recipe';

export default class Explore extends Component {
  state = {
    recipeOpen: false,
    recipe: null,
    recipe_list: [],
    loaded: false
  }

  componentWillMount() {
    fetch('https://smartrecipes.herokuapp.com/api', {method: 'GET'})
      .then(response => response.json())
      .then(data => this.setState({ recipe: data[0],recipe_list: data, loaded: true }))
      .catch(err => { console.log(err) });
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
    if (this.state.loaded) {
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
        {this.state.recipe_list.map((recipe, index) => <TitleCard
          recipe={recipe}
          handleOpen={this.openRecipe}
          key={index}
          />)}
          </ScrollView>
          <Recipe
          recipe={this.state.recipe}
          numStepThreads= {this.state.recipe.steps.length}
          stepProgress= {new Array(this.state.recipe.steps.length).fill(0)}
          isOpen={this.state.recipeOpen}
          handleClose={this.closeRecipe}
          />
          </View>
        );
    }
    else {
      return (
        <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color="#E33E24" />
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  header: {
    ...defaultStyles.header,
    paddingTop: 20,
    paddingBottom: 20
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    paddingTop: 20,
    backgroundColor: "#F7F7F7",
    flex: 1,
  },
  scrollContent: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
});
