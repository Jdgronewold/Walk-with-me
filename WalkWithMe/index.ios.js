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

// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDiDp0eq75WK0MAeVAQL3aA9EptcIyWL2U",
  authDomain: "walk-with-me-6cf40.firebaseapp.com",
  databaseURL: "https://walk-with-me-6cf40.firebaseio.com",
  storageBucket: "",
  messagingSenderId: "199658348422"
};

const firebaseApp = firebase.initializeApp(firebaseConfig);

export default class WalkWithMe extends Component {
  render() {
    return (
      <View style={styles.container}>
        <MapView
          provider={MapView.PROVIDER_GOOGLE}
          initialRegion={{
            latitude: 37.78825,
            longitude: -122.4324,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
          />
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
