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
 View,
 NavigatorIOS
} from 'react-native';
import FBSDK from 'react-native-fbsdk';
import Login from './components/login';

// Initialize Firebase
const firebaseConfig = {
 apiKey: "AIzaSyDiDp0eq75WK0MAeVAQL3aA9EptcIyWL2U",
 authDomain: "walk-with-me-6cf40.firebaseapp.com",
 databaseURL: "https://walk-with-me-6cf40.firebaseio.com",
 storageBucket: "walk-with-me-6cf40.appspot.com",
 messagingSenderId: "199658348422"
};

const firebaseApp = firebase.initializeApp(firebaseConfig);

export default class WalkWithMe extends Component {

 render() {
   return (
     <NavigatorIOS
       initialRoute={{
         component: Login,
         title: 'Login'
       }}
       navigationBarHidden={true}
       style={{flex: 1}}
     />
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
