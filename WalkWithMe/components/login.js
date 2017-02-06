import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Image,
  AsyncStorage
} from 'react-native';
import * as firebase from 'firebase';
import FBSDK from 'react-native-fbsdk';
import BasicMap from './basic_map.js';

const { LoginButton, AccessToken, GraphRequest, GraphRequestManager, LoginManager} = FBSDK;

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: {}
    };

    this.checkLogin = this.checkLogin.bind(this);
  }

  checkLogin() {
    if (this.props.navigator.navigationContext._currentRoute.title !== "map") {
      AccessToken.getCurrentAccessToken().then(
        (data) => {
          if (data !== null) {
            firebase.database().ref('users/' + data.userID).once("value")
            .then( (snapshot) => {
              // Operating on the assumption that if data exists
              // then the user will also exist in the database with all
              // the appropriate data`
              return snapshot.val();
            }).then( (user) => {
              this.props.navigator.push({
                component: BasicMap,
                title: 'map',
                passProps: { user: user }
              });
            }).catch(err => console.log(err));
          } else {
            console.log("Data was null, timing seemed to be off.");
          }
        }
      );
    }
  }

  render() {
    this.checkLogin();
    return (
      <Image source={require('./street-background.png')}
             style={styles.image}>
      <View style={styles.container}>
        <Text style={styles.welcome}>
          Walk With Me
        </Text>
        <Text style={styles.instructions}>
          Find someone to walk with now!
        </Text>
        <Text style={styles.instructions}>
          Login with Facebook to get started
        </Text>
        <View style={styles.button}>
          <LoginButton
            onLoginFinished={
              (err, res) => {
                if (err) {
                  alert("login has error: " + res.error);
                } else if (res.isCancelled) {
                  alert("login is cancelled.");
                } else {

                  AccessToken.getCurrentAccessToken().then(
                    (data) => {
                      let accessToken = data.accessToken;
                      const credential = firebase.auth.FacebookAuthProvider.credential(data.accessToken);

                      const responseInfoCallback = (error, result) => {
                        if(error){
                          console.log(error);
                          alert('Error fetching data: ' + error.toString());
                        } else {
                          if(result.gender === 'boop'){
                            LoginManager.logOut();
                            firebase.auth().signOut();
                            alert('Sorry, only women are currently allowed on Walk With Me.');
                          }

                          const user = {
                            userID: result.id,
                            name: result.name,
                            gender: result.gender,
                            accessToken: accessToken
                          };

                          this.setState({
                            user: user
                          });
                          let ref = firebase.database().ref('users/' + result.id);
                          ref.once("value")
                          .then(function(snapshot) {
                            let exists = snapshot.exists();
                            if (exists === false) {
                              firebase.database().ref('users/' + result.id).set(user);
                            }
                          });
                          console.log("hit redirect");
                          this.checkLogin();
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
                      console.log(firebase.auth().currentUser);
                      new GraphRequestManager().addRequest(infoRequest).start();
                      return firebase.auth().signInWithCredential(credential);
                    });
                  }
                }
              }
              onLogoutFinished={() => alert("logout.")}/>
          </View>
        </View>
      </Image>
    );
  }
}

const styles = StyleSheet.create({
  image: {
    flex: 2,
    width: null,
    height: null,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center'
  },
  container: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
  },
  welcome: {
    fontFamily: 'GillSans-UltraBold',
    fontSize: 24,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    fontFamily: 'Gill Sans',
    fontSize: 18,
    textAlign: 'center',
    color: '#000000',
    marginBottom: 5,
    paddingLeft: 10,
    paddingRight: 10
  },
  button: {
    padding: 10
  }
});

export default Login;
