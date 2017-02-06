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
      starCount: 5,
      user: this.props.user
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
      <View style={styles.container}>
        <View style={styles.textContainer}>
          <Text style={styles.header}>
            Rate Your Walk
          </Text>
          <Text style={styles.text}>How was your walk with {this.state.user.name}?</Text>
          <View style={styles.starContainer}>
            <StarRating
              disabled={false}
              maxStars={5}
              rating={this.state.starCount}
              selectedStar={(rating) => this.onStarRatingPress(rating) } />
          </View>
          <TouchableOpacity
            style={styles.button, styles.bubble}
            onPress={ () => this._saveRating() } >
            <Text>Save Rating</Text>
          </TouchableOpacity>
          <Text style={styles.text}>
            Click here to flag user.
          </Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
 container: {
   flex: 1,
   justifyContent: 'center',
   alignItems: 'center',
   backgroundColor: '#754576'
  },
  textContainer: {
    backgroundColor: 'white',
    borderRadius: 4,
    alignItems: 'center',
    padding: 20
  },
  starContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  header: {
    fontFamily: 'GillSans-UltraBold',
    fontSize: 24,
    textAlign: 'center',
    margin: 10
  },
  text: {
    fontFamily: 'Gill Sans',
    fontSize: 18,
    textAlign: 'center',
    padding: 10
  },
  bubble: {
    paddingHorizontal: 5,
    paddingVertical: 5,
    borderRadius: 4,
    borderWidth: 1,
    width: 150,
    alignItems: 'center',
  },
  button: {
    fontFamily: 'Gill Sans',
    fontSize: 18,
    marginTop: 12,
    paddingHorizontal: 5,
    alignItems: 'center',
    marginHorizontal: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 40,
    backgroundColor: 'transparent',
    padding: 10,
    margin: 10
  },
});

export default RatingsForm;
