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
import Polyline from '@mapbox/polyline';
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
     endPosition: {},
     polylineCoords: []
   };
   this.makeMarker = this.makeMarker.bind(this);
   this._openSearchModal = this._openSearchModal.bind(this);
   this._createRouteCoordinates = this._createRouteCoordinates.bind(this);
   this._saveRoute = this._saveRoute.bind(this);

   this.routeButton = this.routeButton.bind(this);
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
  // might need to also update the markers here if we move the start marker
  if (Object.keys(this.state.endPosition).length !== 0 &&
      Object.keys(this.state.startPosition).length !== 0) {
        this.map.fitToCoordinates(
          [this.state.startPosition,
          this.state.endPosition],{
            edgePadding: { top: 100, right: 100, bottom: 100, left: 100 },
            animated: true,
          });
      }
}

_openSearchModal() {
  RNGooglePlaces.openAutocompleteModal()
  .then((place) => {
    const endpos = {
      latitude: place.latitude,
      longitude: place.longitude
    };
    this.makeMarker(endpos, "endPosition", "Destination")
    return place;
  }).then((place) => {
    const opts = {
      fromCoords: this.state.startPosition,
      toCoords: this.state.endPosition
    }
    getDirections(opts)
    .then(data => this._createRouteCoordinates(data))
    .then(polylineCoords => {
      this.setState({polylineCoords})
    })
  })
  .catch(error => console.log(error.message));  // error is a Javascript Error object
}

_createRouteCoordinates(data) {
   if (data.status !== 'OK') {
     console.log("Directions did not work");
     return [];
   }

   let points = data.routes[0].overview_polyline.points;
   let steps = Polyline.decode(points);
   let polylineCoords = [];

   for (let i=0; i < steps.length; i++) {
     let tempLocation = {
       latitude : steps[i][0],
       longitude : steps[i][1]
     }
     polylineCoords.push(tempLocation);
   }
   return polylineCoords;
 }

 _saveRoute(){

 }

makeMarker(location, pos, title) {
  const selfMarker = {
    latlng: location,
    title: title
  };
  const markers = Object.assign([], this.state.markers);
  if(markers.length > 1) {
    markers.pop();
  }
  markers.push(selfMarker);
  this.setState({[pos]: location, markers: markers});
}

routeButton(){
  if (Object.keys(this.state.endPosition).length !== 0) {
    return(
      <TouchableOpacity
        style={styles.button, styles.bubble}
        onPress={() => this._saveRoute()}
        >
        <Text>Set Route</Text>
      </TouchableOpacity>
    )
  }
}


render() {
  console.log(this.state);
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
            customMapStyle={mapStyle}
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
          <MapView.Polyline
            coordinates={this.state.polylineCoords}
            strokeWidth={2}
            strokeColor="#ba0be0"
            />
          </MapView>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.button, styles.bubble}
              onPress={() => this._openSearchModal()}
              >
              <Text>Pick a destination</Text>
            </TouchableOpacity>

            {this.routeButton()}
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
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 40,
    backgroundColor: 'transparent',
  },
});

const mapStyle = [
  {
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#212121"
      }
    ]
  },
  {
    "elementType": "labels.icon",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#757575"
      }
    ]
  },
  {
    "elementType": "labels.text.stroke",
    "stylers": [
      {
        "color": "#212121"
      }
    ]
  },
  {
    "featureType": "administrative",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#757575"
      }
    ]
  },
  {
    "featureType": "administrative.country",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#9e9e9e"
      }
    ]
  },
  {
    "featureType": "administrative.land_parcel",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "administrative.locality",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#bdbdbd"
      }
    ]
  },
  {
    "featureType": "poi",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#757575"
      }
    ]
  },
  {
    "featureType": "poi.park",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#181818"
      }
    ]
  },
  {
    "featureType": "poi.park",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#616161"
      }
    ]
  },
  {
    "featureType": "poi.park",
    "elementType": "labels.text.stroke",
    "stylers": [
      {
        "color": "#1b1b1b"
      }
    ]
  },
  {
    "featureType": "road",
    "elementType": "geometry.fill",
    "stylers": [
      {
        "color": "#2c2c2c"
      }
    ]
  },
  {
    "featureType": "road",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#8a8a8a"
      }
    ]
  },
  {
    "featureType": "road.arterial",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#373737"
      }
    ]
  },
  {
    "featureType": "road.highway",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#3c3c3c"
      }
    ]
  },
  {
    "featureType": "road.highway.controlled_access",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#4e4e4e"
      }
    ]
  },
  {
    "featureType": "road.local",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#616161"
      }
    ]
  },
  {
    "featureType": "transit",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#757575"
      }
    ]
  },
  {
    "featureType": "water",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#000000"
      }
    ]
  },
  {
    "featureType": "water",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#3d3d3d"
      }
    ]
  }
]

export default BasicMap;
