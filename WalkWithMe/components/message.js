import React from 'react';

import {
  Text, View, Navigator,
  Dimensions, TouchableOpacity,
  Button, Image, Alert,
  Modal, ActivityIndicator
} from 'react-native';
import * as firebase from 'firebase';


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

}
