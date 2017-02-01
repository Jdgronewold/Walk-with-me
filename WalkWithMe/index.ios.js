/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */
import * as firebase from 'firebase';
import MapView from 'react-native-maps';
import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View
} from 'react-native';
import FBSDK from 'react-native-fbsdk';

const { LoginManager } = FBSDK;

// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDiDp0eq75WK0MAeVAQL3aA9EptcIyWL2U",
  authDomain: "walk-with-me-6cf40.firebaseapp.com",
  databaseURL: "https://walk-with-me-6cf40.firebaseio.com",
  storageBucket: "walk-with-me-6cf40.appspot.com",
  messagingSenderId: "199658348422"
};

const firebaseApp = firebase.initializeApp(firebaseConfig);

LoginManager.logInWithReadPermissions(['public_profile']).then(
  function(result) {
    if (result.isCancelled) {
      alert('Login was cancelled');
    } else {
      alert('Login was successful with permissions: '
        + result.grantedPermissions.toString());
    }
  },
  function(error) {
    alert('Login failed with error: ' + error);
  }
);

export default class WalkWithMe extends Component {

  render() {
    return (
      <View style={styles.container}>
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
