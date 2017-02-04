import React, { Component } from 'react';
import {
  Text,
  View,
  Navigator,
  StyleSheet,
  TouchableOpacity } from 'react-native';
import * as firebase from 'firebase';
import StarRating from 'react-native-star-rating';

class RatingsForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      starCount: 5
    };
    //
    // this.onStarRatingPress = this.onStarRatingPress.bind(this);
    // this._saveRating = this.saveRating.bind(this);

  }

  getRating() {
    let ratingsRef = firebase.databse().ref('ratings/');
    ratingsRef.orderByKey().equalTo(1).on
  }

  _saveRating() {
    let ratingsRef = firebase.database().ref('ratings');
    let newRatingRef = ratingsRef.push();
    newRatingRef.set ({
      writer_id: 1,
      receiver_id: 2,
      rating: this.state.starCount
    });
  }

  onStarRatingPress(rating) {
    this.setState({
      starCount: rating
    });
  }

  render() {
    return (
      <View>
        <Text>How was your walk?</Text>
        <StarRating
          disabled={false}
          maxStars={5}
          rating={this.state.starCount}
          selectedStar={(rating) => this.onStarRatingPress(rating) } />
        <TouchableOpacity
          style={styles.button, styles.bubble}
          onPress={ () => this._saveRating() } >
          <Text>Save Rating</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
 container: {
   ...StyleSheet.absoluteFillObject,
   justifyContent: 'flex-end',
 },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  bubble: {
      backgroundColor: 'rgba(255,255,255,0.7)',
      paddingHorizontal: 18,
      paddingVertical: 12,
      borderRadius: 20,
      borderWidth: 1
    },
  button: {
    marginTop: 12,
    paddingHorizontal: 12,
    alignItems: 'center',
    marginHorizontal: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 40,
    backgroundColor: 'transparent',
  },
});

export default RatingsForm;
