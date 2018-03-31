# react-native-boilerplate

### A Boilerplate for Scalable Cross-Platform Mobile Apps 

[React Native](https://facebook.github.io/react-native/) application boilerplate fully integrating [React Navigation](https://reactnavigation.org/) into [Redux](https://github.com/reactjs/redux), and [Realm](https://realm.io/docs/javascript/latest) for an offline-first app.

### Contents

1. [About this project](#about-this-project)
   - [Why this boilerplate](#why-this-boilerplate)
   - [What's inside](#whats-inside)
   - [Realm JS as the database](#realm-js-as-the-database)
   - [React Navigation with Redux integration](#react-navigation-with-redux-integration)
   - [Device type (mobile or tablet)](#device-type-mobile-or-tablet)
   - [Things to consider](#things-to-consider)
2. [Installation and Usage](#installation-and-usage)
3. [Contribute](#contribute)
4. [Todo](#todo)

## About this project

It is a very basic Todo app to act as a skeleton (or a template if you'd prefer) providing some configuration that can easily be changed to fit the needs of any app. 

#### Why this boilerplate

Mostly because I like to have a consistency between my projects, and having a basic skeleton to start a project with will ensure a similar structure in every project. I believe this makes switching between projects less intimidating. Also, as a developer who deals with this great platform daily, I find my self in situations where I have to search for how certain things are done. By searching and reading around on issues, and comments, etc, I've come to realise that there is a great lot of people who are new to react-native, and providing them with a solution in the form of an issue comment sometimes just doesn't cut it because you never know how they will implement your solution. This is where an example showcasing multiple techniques would be perfect to help people figure out how certain things are done.

#### What's inside

It uses the obvious option (at least to me) [React Navigation](https://reactnavigation.org/) for its navigation needs, and [Redux](https://github.com/reactjs/redux) to manage its state as well as each navigator's state individually through any action available. I chose [Realm](https://realm.io/docs/javascript/latest) for its database, mostly because it was the first database i tried with react-native, but I immediately fell in love with it as it is very efficient, makes for a great persistence layer that can easily be extended and is very easy to learn. If you don't like Realm, or you just prefer another approach, you could easily remove the Realm part, and proceed with whatever it is you'd like to use. It also uses Reactotron since it lets you log stuff without the need to enter debug mode in the app.

#### Realm JS as the database

As I mentioned in the [What's inside](#whats-inside) section, I chose Realm because of several Reasons. What I like the most about it is that its implementation is completely native which makes it fast, and it accesses the Javascript thread directly, bypassing the bridge coms which makes it even faster. This ofcourse has its drawbacks like making debugging with chrome super super slow due to the JS not running in the device but inside a chrome worker. Not being able to use the full suite of debugging tools currently available for react-native the only reason I see why someone would want to go with another solution. 

#### React Navigation with Redux integration

The app consist of four navigators: 

`AppNavigator`, `AuthNavigator`, `MobileNavigator` , and `TabletNavigator`

- `AppNavigator` is a `SwitchNavigator` that will show our `LaunchScreen` when the app starts, then depending on the session status will either show our `AuthNavigator` or the actual app content.
  It is fully integrated with Redux, so we manage its state manually through a reducer.
- `AuthNavigator` is a `StackNavigator` that will handle all the Authentication screens. It is not ingetrated with Redux as its only job is to only show one screen. By having only one auth screen ( `common/Login.js` ) we could omit the navigator completely and just put the Login Screen as a route inside the `AppNavigator`, but for demonstration purposes Im using a navigator, which you can extend as you'd like.
- `MobileNavigator` is a `StackNavigator` that will handle all the application content through screens
  that are created either specifically for mobile devices like `mobile/EditTodo.js`, or to be common screens like `Home` which will determine their device-type-based logic through props like `isTablet`.
  It is fully integrated with Redux, so we manage its state manually through a reducer.
- `TabletNavigator` is a `StackNavigator` that will handle all the application content through screens
  that are created either specifically for tablets like `tablet/Todos.js`, or to be common screens like `Home` which will determine their device-type-based logic through props like `isTablet`.
  It is fully integrated with Redux, so we manage its state manually through a reducer.

The project structure makes it easy to add as many navigators as you want. For example, in tablets where the screen estate is big enough for such UIs, you might want to add a side panel to a specific screen and make that side panel a different navigator with its own screens ultimately having two navigators showing at the same time. (I have an app with 3 that works awesome)

#### Device type (mobile or tablet)

The app is provided with an `isTablet` boolean property coming from the native initialProps, which will help us determine different layouts, different navigations, even different redux stores.

#### Things to consider

- Using Realm will make it almost impossible to run the app in debug mode with chrome, because of the way Realm communicates with JavaScript. This is one more reason to use Reactotron for simple logging since you don't need to run in debug mode. You can track the progress of this issue [here](https://github.com/realm/realm-js/issues/491#issuecomment-350718316).

The project is structured in a way that makes clear of what the responsibility of each file is, so it is easy to find your way around and figure out where to put new components, or navigators, or screens, etc.

Hopefully my documentation will be clear enough to help anyone, who might need it, find their way around the project and start creating without the hussle of trying to understand and figure out complex techiniques.

## Installation and Usage

First you have to clone the project repo and install it.

```bash
    git clone https://github.com/jakallergis/react-native-boilerplate.git your-path-name
    cd your-path-name
    yarn ## or npm install
```
As with every react-native project, running `yarn start` or `npm start` on a terminal inside the project's folder will start the bundler up.

To run the app in the simulator, either open up the xCode project form the ios folder, and run it from there if you are on a Mac and want to use the iOS simulator, or fire up an Android simulator and run `react-native run-android` in the terminal to install it to the simulator. This is pretty straightforward like every react-native project.

## Contribute

Im no coding God so if you see that I should change something in this project, or that something is completely off and shouldn't be done the way I've done it, or you want me to add a feature you feel is basic enough to be included in a boilerplate or generally if you want to contribute you are SO SO very welcome and PLEASE PLEASE feel free to pull some requests :)

## Todo:

- [ ] documentation on how to change the project's name.
- [ ] documentation with images on how everything works.
- [x] create unit tests.

**License**

MIT @ [J. A. Kallergis](https://github.com/jakallergis)