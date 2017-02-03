import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Navigator,
  Dimensions,
  TouchableHighlight
} from 'react-native';

import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
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


makeMarker(location, pos, title) {
  const selfMarker = {
    latlng: location,
    title: title
  };
  const markers = Object.assign([], this.state.markers);
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
          <GooglePlacesAutocomplete
            placeholder='Enter Location'
            minLength={2}
            autoFocus={false}
            fetchDetails={true}
            query={{
              key: 'AIzaSyDUWVHvYA-psNWSTrpwIFlLM84soy3PxzA',
              language: 'en', // language of the results
              // types: '(cities)', // default: 'geocode'
            }}
            onPress={(data, details = true) => {
              getLocation(details.place_id).then( (data) => {
                const endpos = {
                  latitude: data.result.geometry.location.lat,
                  longitude: data.result.geometry.location.lng
                };
                console.log(endpos);
                this.makeMarker(endpos, "endPosition", "Destination")
              })
            }}
            styles={{
              container: {
                width: width,
                height: 50
              },
              textInputContainer: {
                backgroundColor: 'rgba(0,0,0,0)',
                borderTopWidth: 0,
                borderBottomWidth: 10
              },
              textInput: {
                marginLeft: 0,
                marginRight: 0,
                height: 38,
                color: '#5d5d5d',
                fontSize: 16
              },
              listView: {
                backgroundColor: 'rgba(255,255,255,1)'
              },
              predefinedPlacesDescription: {
                color: '#1faadb'
              },
            }}
            currentLocation={false}
            />
      </View>
    );
  }
}
}

const styles = StyleSheet.create({
 container: {
   ...StyleSheet.absoluteFillObject,
   top: 65,
   justifyContent: 'flex-start',
   alignItems: 'center'
},
map: {
  ...StyleSheet.absoluteFillObject,
},
});

export default BasicMap;
