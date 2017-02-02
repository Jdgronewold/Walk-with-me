import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View
} from 'react-native';
import FBSDK from 'react-native-fbsdk';
import BasicMap from './basic_map.js';

const { LoginButton, AccessToken } = FBSDK;

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      position: ""
    };
  }
  render() {
    return (
      <View style={styles.container}>
        <LoginButton
          onLoginFinished={
            (error, result) => {
              console.log(result);
              if (error) {
                alert("login has error: " + result.error);
              } else if (result.isCancelled) {
                alert("login is cancelled.");
              } else {
                AccessToken.getCurrentAccessToken().then(
                  (data) => {
                    return data;
                  }).then( () => {
                  console.log(this.state.position);
                  this.props.navigator.push({
                    component: BasicMap,
                    title: 'map',
                    passProps: { position: this.state.position }
                  });
                });
              }
            }
          }
          onLogoutFinished={() => alert("logout.")}/>
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

export default Login;
