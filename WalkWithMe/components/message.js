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


class Messages extends React.Component {
  constructor(props) {
    super(props);

    this.state = {text: ''};
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
    this.messages = firebase.database().ref('messages').child(`${this.props.messageKey}`);
  }



  render() {
    debugger
    let checkViewStyle = (key) => {
      return this.props.messages[key].author === this.props.user.name ?
        basicStyles.authorView : basicStyles.senderView;
    };

    let checkTextStyle = (key) => {
      return this.props.messages[key].author === this.props.user.name ?
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
      <View style={basicStyles.messagesContainer}>
        <View style={basicStyles.textContainer}>
          {rows}
        </View>
        <View style={basicStyles.messageInput}>
          <TextInput
            style={basicStyles.messageText}
            placeholder="Enter message"
            onChangeText={(text) => this.setState({text})}
          />
          <Button style={basicStyles.messageButton}
           onPress={() => {
             let messageObj = {
               author: this.props.user.name,
               text: this.state.text
             };
             this.messages.push().set(messageObj);
           }}>
          Send
          </Button>
        </View>
      </View>
    );
  }

}

export default Messages;
