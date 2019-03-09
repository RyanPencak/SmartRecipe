Required Packages
-------------------------------------------------------------------------------------

1.	node and npm
    * https://www.npmjs.com/get-npmnpm
    * With Homebrew, 'brew install node'
2.	watchman
    * https://facebook.github.io/watchman/
    * With Homebrew, 'brew install watchman'


Download Web App Source Files
-------------------------------------------------------------------------------------

In Linux Terminal:
1.	git clone https://github.com/RyanPencak/SmartRecipe.git
2.	cd SmartRecipe


Run Mobile App Locally
-------------------------------------------------------------------------------------

In Linux Terminal:
1.	npm install
2.  react-native run-ios


System Architecture
-------------------------------------------------------------------------------------

### Front-End

* src
    * app.js is the main file handling page navigation and layout
    * Each component has its own js file, by convention these components are capitalized in the form "Recipes.js"
    * Temporary data file data.js contains makeshift database for testing
    * Style sheet is contained in styles.js


### Back-End

* server (To Be Developed)
