/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */
import * as firebase from 'firebase';
import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View
} from 'react-native';

const firebaseConfig = {
  apiKey: "AIzaSyAs9jyA0Zt8hoqiwt7DlNgJk0wUsFNe0SE",
  authDomain: "walk-with-me-3790b.firebaseapp.com",
  databaseURL: "https://walk-with-me-3790b.firebaseio.com",
  storageBucket: "walk-with-me-3790b.appspot.com",
  messagingSenderId: "915034257013"
};
const firebaseApp = firebase.initializeApp(firebaseConfig);

export default class WalkWithMe extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>
          Welcome to React Native!
        </Text>
        <Text style={styles.instructions}>
          To get started, edit index.ios.js
        </Text>
        <Text style={styles.instructions}>
          Press Cmd+R to reload,{'\n'}
          Cmd+D or shake for dev menu
        </Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});

AppRegistry.registerComponent('WalkWithMe', () => WalkWithMe);
