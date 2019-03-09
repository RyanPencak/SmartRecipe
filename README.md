Initialization
-------------------------------------------------------------------------------------

[See React Native Getting Started](https://facebook.github.io/react-native/docs/getting-started.html)

* Install Xcode or Android Studio
* Install Xcode command line tools
    * Open Xcode, preferences, Locations panel, Choose most recent "Command Line Tools"


Required Packages
-------------------------------------------------------------------------------------

1.	node and npm
    * https://www.npmjs.com/get-npmnpm
    * With Homebrew, 'brew install node'
2.	watchman
    * https://facebook.github.io/watchman/
    * With Homebrew, 'brew install watchman'
3.  react-native
    * npm install -g react-native-cli


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
