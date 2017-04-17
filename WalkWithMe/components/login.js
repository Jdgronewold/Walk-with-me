import React, { Component } from 'react';
import { bindAll, merge, isEmpty } from 'lodash';
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
      user: {},
      accessToken: ''
    };

    bindAll(this,
      "_userLogin", '_saveToDataBaseAndPush',
      "_pushToMap", "_facebookResponseCallback");
  }

  _userLogin() {
    // only do this if we are actually on login page (prevents error when connection
    // is slow)
    if (this.props.navigator.navigationContext._currentRoute.title !== "map") {
      // check/get info about user
      // maybe implement a check here for if isEmpty(this.state.user)
      // if it isn't empty, we probably are already logged in and don't need
      // to refetch all the data
      AccessToken.getCurrentAccessToken().then(
        (data) => {
          if (data !== null) {
            let accessToken = data.accessToken;
            const credential = firebase.auth.FacebookAuthProvider.credential(data.accessToken);
            firebase.auth().signInWithCredential(credential);
            if(this.state.accessToken.length === 0) {
              this.setState({accessToken}, () => console.log("accessToken saved"));
            }
            return accessToken;
          } else {
            throw "I don't think you are logged in";
          }
        }).then((token) => {
          const infoRequest = new GraphRequest(
            '/me',
            {
              accessToken: token,
              parameters: {
                fields: {
                  string: 'name, gender'
                }
              }
            },
            this._facebookResponseCallback
          );
          // this is effectively calling this._facebookResponseCallback
          new GraphRequestManager().addRequest(infoRequest).start();
        }).catch(err => {
          console.log(err);
        });

      }
    }

  _facebookResponseCallback(error, result) {
    if(error){
      console.log(error);
      alert('Error fetching data: ' + error.toString());
    } else {
      if(result.gender === 'gazorpazorp'){
        LoginManager.logOut();
        firebase.auth().signOut();
        alert('Sorry, only women are currently allowed on Walk With Me.');
      }

      this._saveToDataBaseAndPush(result);
    }
  }

  _saveToDataBaseAndPush(result) {
    const user = {
      userID: result.id,
      name: result.name,
      gender: result.gender,
      // get from state -> only problem is if we get here before
      // the setState in the first .then has not returned
      // if need to force setState to be synchronous by passing function
      accessToken: this.state.accessToken
    };

    // if we don't need to save the user to state, then don't
    // this.setState({
    //   user: user
    // });

    // Save to DB
    let ref = firebase.database().ref('users/' + result.id);
    ref.once("value")
    .then(function(snapshot) {
      let exists = snapshot.exists();
      if (exists === false) {
        firebase.database().ref('users/' + result.id).set(user);
      }
    });

    // push Navigator
    this._pushToMap(user);
  }

  _pushToMap(user) {
    this.props.navigator.push({
      component: BasicMap,
      title: 'map',
      passProps: { user: user }
    });
  }


  render() {
    if (this.state.accessToken.length === 0) {
      this._userLogin();
    }
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
                console.log(res);
                if (err) {
                  alert("login has error: " + res.error);
                } else if (res.isCancelled) {
                  alert("login was cancelled.");
                } else {
                  this._userLogin();
                  }
                }
              }
              onLogoutFinished={() => alert("logout")}/>
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
