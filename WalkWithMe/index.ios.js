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
  apiKey: "AIzaSyDiDp0eq75WK0MAeVAQL3aA9EptcIyWL2U",
  authDomain: "walk-with-me-6cf40.firebaseapp.com",
  databaseURL: "https://walk-with-me-6cf40.firebaseio.com",
  storageBucket: "walk-with-me-6cf40.appspot.com",
  messagingSenderId: "199658348422"
};
const firebaseApp = firebase.initializeApp(firebaseConfig);
var provider = new firebase.auth.FacebookAuthProvider();
provider.addScope('public_profile');

export default class WalkWithMe extends Component {
  handleLogin(e){
    console.log("this is working");
    console.log(e);
    firebase.auth().signInWithRedirect(provider);
  }

  handleLogout(e){
    firebase.auth().signOut().then(function() {
    // Sign-out successful.
    }, function(error) {
      // An error happened.
    });
  }

  componentDidMount(){
    firebase.auth().getRedirectResult()
      .then(function(result) {
        if (result.credential) {
          // This gives you a Facebook Access Token. You can use it to access the Facebook API.
          var token = result.credential.accessToken;
          this.setState({token: token});
          // ...
        }
        // The signed-in user info.
        var user = result.user;
        this.setState({user: user});
      }).catch(function(error) {
        console.log(error);
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // The email of the user's account used.
        var email = error.email;
        // The firebase.auth.AuthCredential type that was used.
        var credential = error.credential;
        // ...
      });
  }

  render() {
    return (
      <View style={styles.container}>
        <button color="#841584" onPress={this.handleLogin}>Login with Facebook</button>
        <Text style={styles.welcome}>
          Your name is {JSON.stringify(this.state.user)}
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
