import React, {Component} from 'react';
import {
  Modal,
  Text,
  TouchableHighlight,
  View
} from 'react-native';

class optionsModal extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Modal
        animationType={"slide"}
        transparent={false}
        visible={this.props.visible}

      >

      </Modal>
    );
  }
}
