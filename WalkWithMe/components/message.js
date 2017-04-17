import React from 'react';

import {
  Text, View, Navigator,
  Dimensions, TouchableOpacity,
  Button, Image, Alert,
  Modal, ActivityIndicator,
  TextInput
} from 'react-native';
import * as firebase from 'firebase';
import { basicStyles, mapStyle } from './styles';


class Message extends React.Component {
  constructor(props) {
    super(props);

    this.messages = firebase.database().ref('messages');
  }

  componentDidMount() {
    /// do something here to add a listener for new messages
    // still need to do the followers side of things to set it up to receive
    // messages
    // also need to set up the cancel match bits to clear messageKey
    // in here map through a bunch of views that justify the Text content either
    // to the left or the right depending on whether the message is from the
    // author or the follower --> probably need to pass the user through then
    // as well as props to be able to check and see
  }



  render() {

    let checkViewStyle = (key) => {
      return this.props.messages[key].author.username === this.props.user.username ?
        basicStyles.authorView : basicStyles.senderView;
    };

    let checkTextStyle = (key) => {
      return this.props.messages[key].author.username === this.props.user.username ?
        basicStyles.authorText : basicStyles.senderText;
    };

    let rows = this.props.messages.keys.map( (key ,i) => {
      return (
        <View key={ i } style={checkViewStyle(key)}>
          <Text style={checkTextStyle(key)}>
            {this.props.messages[key].text}
          </Text>
        </View>
      );
    });

    return (
      <View style={basicStyles.container}>
        <View style={basicStyles.textContainer}>
          {rows}
        </View>
        <View>
          // TextInput here and a button to submit that
          // calls this.props.updateFromChild(messages, text)
        </View>
      </View>
    );
  }

}
