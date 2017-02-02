import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  AsyncStorage
} from 'react-native';
import FBSDK from 'react-native-fbsdk';
import BasicMap from './basic_map.js';

const { LoginButton, AccessToken, GraphRequest, GraphRequestManager, LoginManager} = FBSDK;

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
              if (error) {
                alert("login has error: " + result.error);
              } else if (result.isCancelled) {
                alert("login is cancelled.");
              } else {
                // AccessToken.getCurrentAccessToken().then(
                //   (data) => {
                //     alert(data.accessToken.toString());
                //   }
                // );
                AccessToken.getCurrentAccessToken().then(
                  (data) => {
                    let accessToken = data.accessToken;
                    alert(accessToken.toString());
                    const responseInfoCallback = (error, result) => {
                      if(error){
                        console.log(error);
                        alert('Error fetching data: ' + error.toString());
                      } else {
                        console.log(result);
                        if(result.gender === 'male'){
                          LoginManager.logOut();
                          alert('Sorry, only women are currently allowed on Walk With Me.');
                        }
                        alert('Success fetching data: ' + result.toString());
                      }
                    };
                    const infoRequest = new GraphRequest(
                      '/me',
                      {
                        accessToken: accessToken,
                        parameters: {
                          fields: {
                            string: 'name, gender'
                          }
                        }
                      },
                      responseInfoCallback
                    );
                    new GraphRequestManager().addRequest(infoRequest).start();
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
