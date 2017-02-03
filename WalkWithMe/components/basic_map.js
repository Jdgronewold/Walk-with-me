import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Navigator,
  Dimensions,
  TouchableOpacity
} from 'react-native';

import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import RNGooglePlaces from 'react-native-google-places';
import { getDirections, getLocation } from './utils';

const { width, height } = Dimensions.get('window');

const ASPECT_RATIO = width / height;
// const LATITUDE = 37.78825;
// const LONGITUDE = -122.4324;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;


class BasicMap extends React.Component {
 constructor(props) {
   super(props);

   this.state = {
     startPosition: {},
     markers: [],
     endPosition: {}
   };
   this.makeMarker = this.makeMarker.bind(this);
   this.openSearchModal = this.openSearchModal.bind(this);
 }

 componentDidMount() {
   navigator.geolocation.getCurrentPosition(
     (position) => {
       const initialPosition = JSON.stringify(position);
       const {latitude, longitude} = position.coords;
       const LatLng = { latitude, longitude };
       this.makeMarker(LatLng, "startPosition", "Start Position")
     },
     (geoError) => alert(JSON.stringify(geoError)),
     {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000}
   );
 }

componentDidUpdate() {
  if (Object.keys(this.state.endPosition).length !== 0 &&
      Object.keys(this.state.startPosition).length !== 0) {
        console.log([this.state.startPosition.latitude,
        this.state.endPosition.longitude]);
        this.map.fitToCoordinates(
          [this.state.startPosition,
          this.state.endPosition],{
            edgePadding: { top: 100, right: 100, bottom: 100, left: 100 },
            animated: true,
          });
      }
}

openSearchModal() {
    RNGooglePlaces.openAutocompleteModal()
    .then((place) => {
      const endpos = {
        latitude: place.latitude,
        longitude: place.longitude
      };
      console.log(endpos);
      this.makeMarker(endpos, "endPosition", "Destination")
    })
    .catch(error => console.log(error.message));  // error is a Javascript Error object
  }


makeMarker(location, pos, title) {
  const selfMarker = {
    latlng: location,
    title: title
  };
  const markers = Object.assign([], this.state.markers);
  markers.pop;
  markers.push(selfMarker);
  this.setState({[pos]: location, markers: markers});
}

render() {
  console.log(this.state.startPosition.latitude);
  if (Object.keys(this.state.startPosition).length === 0) {
    return (
      <View style={styles.container}></View>
    );
  } else {
    return (
        <View style={styles.container}>

          <MapView
            ref={ref => { this.map = ref; }}
            provider={PROVIDER_GOOGLE}
            style={styles.map}
            initialRegion={{
              latitude: this.state.startPosition.latitude,
              longitude: this.state.startPosition.longitude,
              latitudeDelta: LATITUDE_DELTA,
              longitudeDelta: LONGITUDE_DELTA,
            }}
          >
          {this.state.markers.map( (marker, idx) => (
            <MapView.Marker
            coordinate={marker.latlng}
            title={marker.title}
            key={idx}
            draggable
            />
          ))}
          </MapView>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.button, styles.bubble}
              onPress={() => this.openSearchModal()}
              >
              <Text>Pick a destination</Text>
            </TouchableOpacity>
        </View>
      </View>
    );
  }
}
}



const styles = StyleSheet.create({
 container: {
   ...StyleSheet.absoluteFillObject,
   justifyContent: 'flex-end',
   alignItems: 'center'
},
map: {
  ...StyleSheet.absoluteFillObject,
},
bubble: {
    backgroundColor: 'rgba(255,255,255,0.7)',
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 20,
  },
  button: {
    marginTop: 12,
    paddingHorizontal: 12,
    alignItems: 'center',
    marginHorizontal: 10,
  },
  buttonContainer: {
    flexDirection: 'column',
    marginVertical: 20,
    backgroundColor: 'transparent',
  },
});

export default BasicMap;
