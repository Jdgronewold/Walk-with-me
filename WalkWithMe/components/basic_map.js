import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Navigator,
  Dimensions,
  TouchableOpacity,
  Button,
  Image,
  Alert
} from 'react-native';

import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import RNGooglePlaces from 'react-native-google-places';
import Polyline from '@mapbox/polyline';
import { getDirections, getLocation, getFacebookPhoto } from './utils';
import * as firebase from 'firebase';
import CustomCallout from './CustomCallout';

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
     polylineCoords: [],
     nearbyRoutes: {} ,
     selectRouteMarkers: [],
     selectRoutePolylineCoords: [],
     matchedRoute: false,
     disableButtons: false,
     routeKey: '',
     matchedRouteKey: ''
   };

   // if lodash works in react native we should definitely use
   // bindAll(this, ...)
   this.makeMarker = this.makeMarker.bind(this);
   this.destinationButton = this.destinationButton.bind(this);
   this.searchButtons = this.searchButtons.bind(this);
   this.matchButtons = this.matchButtons.bind(this);
   this.renderButtons = this.renderButtons.bind(this);
   this.haversine = this.haversine.bind(this);
   this.getRouteByStartAndHaversine = this.getRouteByStartAndHaversine.bind(this);
   this.getRoutByChildValue = this.getRoutByChildValue.bind(this);
   this._openSearchModal = this._openSearchModal.bind(this);
   this._createRouteCoordinates = this._createRouteCoordinates.bind(this);
   this._saveRoute = this._saveRoute.bind(this);
   this._showSelectedRoute =  this._showSelectedRoute.bind(this);
   this._fitScreen = this._fitScreen.bind(this);
   this._nearbyRoutesCallback = this._nearbyRoutesCallback.bind(this);
   this._setListenersOnNewRoute = this._setListenersOnNewRoute.bind(this);
   this._matchedRoutesCallback = this._matchedRoutesCallback.bind(this);
   this._sendMatchRequest = this._sendMatchRequest.bind(this);
   this._setListenersOnNewMatchRequest = this._setListenersOnNewMatchRequest.bind(this);
   this._completedMatchCallback = this._completedMatchCallback.bind(this);
   this._rejectedMatchCallback = this._rejectedMatchCallback.bind(this);
   this._approveMatch = this._approveMatch.bind(this);
   this._denyMatch = this._denyMatch.bind(this);
   this._alertAuthorIncoming = this._alertAuthorIncoming.bind(this);
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
        this._fitScreen()
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
  .catch(error => console.log(error.message));
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
   let routesRef = firebase.database().ref('routes');
   let newRouteRef = routesRef.push();
   let imgUrl;
   getFacebookPhoto({userID: this.props.user.userID, accessToken: this.props.user.accessToken}).then(
     (data) => {
       imgUrl = data.data.url;
       newRouteRef.set({
         userID: this.props.user.userID,
         name: this.props.user.name,
         startPosition: this.state.startPosition,
         endPosition: this.state.endPosition,
         routeKey: newRouteRef.key,
         routePoly: this.state.polylineCoords,
         imgUrl: imgUrl
       })
     })
   this.setState({routeKey: newRouteRef.key});
   this._setListenersOnNewRoute();
 }

 _setListenersOnNewRoute() {
   let routesRef = firebase.database().ref('routes');
   const startLat = this.state.startPosition.latitude - 0.01
   const endLat = this.state.startPosition.latitude + 0.01
   routesRef.orderByChild("startPosition/latitude")
   .startAt(startLat)
   .endAt(endLat)
   .on('child_added', this._nearbyRoutesCallback);
   routesRef.orderByChild("startPosition/latitude")
   .startAt(startLat)
   .endAt(endLat)
   .on('child_removed', this._nearbyRoutesCallback);
   let matchedRoutesRef = firebase.database().ref('matchedRoutes');
   matchedRoutesRef.orderByChild("follower/userID")
   .equalTo(this.props.user.userID)
   .on("child_added", this._matchedRoutesCallback)
 }

_nearbyRoutesCallback(data) {
    const newRoutes = Object.assign({}, this.state.nearbyRoutes);
    const dist = this.haversine(
      this.state.startPosition,
      data.val().startPosition
    );
    if( dist > 0 ) {
      const allHaversines = Object.keys(newRoutes).map(num => parseInt(num));
      if (allHaversines.length < 10 ) {
        newRoutes[dist] = data.val();
      } else {
        const max = Math.max(...allHaversines);
        if (max > dist) {
          delete newRoutes[max];
          newRoutes[dist] = data.val();
        }
      }
      this.setState({nearbyRoutes: newRoutes})
    }
}

_matchedRoutesCallback(data) {

  const authorName = data.val().author.username;
  Alert.alert(
    'You have a Match!',
    `${authorName} would like to walk with you`,
    [
      {text: 'View Route', onPress: () => this._showPotentialMatch(data)},
    ]
  )
}

_showPotentialMatch(data){
  //get the route out of the db that matches the author's routeKey
  //can't automatically rely on it being in this.state.nearbyRoutes
  //but should look there first to optimize things
  //come back and do that later
  console.log(data);
  firebase.database().ref('routes/' + data.val().author.routeKey)
    .once("value").then( (route) => {
      const tempRoutes = Object.assign({}, this.state.nearbyRoutes);
      const matchedHaversine = this.haversine(
        this.state.startPosition,
        route.val().startPosition
      );
      // add the found route so later in _approveMatch don't
      // have to hit db again
      tempRoutes[matchedHaversine] = route;

      this.setState({
        matchedRoutes: true,
        nearbyRoutes: tempRoutes,
        selectRouteMarkers: [route.startPosition, route.val().endPosition],
        selectRoutePolylineCoords: route.val().routePoly,
        matchedRouteKey: data.val().key
      });
    });
}

_showSelectedRoute(haversineKey) {
  if( !(haversineKey === 0 || this.state.nearbyRoutes[haversineKey] === 'undefined')) {
    const route = this.state.nearbyRoutes[haversineKey];

    this.setState({
      selectRouteMarkers: [route.startPosition, route.endPosition],
      selectRoutePolylineCoords: route.routePoly
    });
  }
}

_fitScreen() {
  let markers = [this.state.startPosition, this.state.endPosition];
  if (this.state.selectRouteMarkers.length > 0) {
    markers = markers.concat(this.state.selectRouteMarkers);
  }
  this.map.fitToCoordinates( markers,
    { edgePadding: { top: 100, right: 100, bottom: 100, left: 100 },
    animated: true,
    }
  );
}

_sendMatchRequest() {

  const route = this.getRouteByStartAndHaversine();
  let matchedRoutesRef = firebase.database().ref('matchedRoutes');
  let matchedRouteKey = matchedRoutesRef.push();
  matchedRouteKey.set({
    author: {
      userID: this.props.user.userID,
      routeKey: this.state.routeKey,
      username: this.props.user.name
    },
    follower: {
      userID: route.userID,
      routeKey: route.routeKey,
      username: route.name
    },
    key: matchedRouteKey.key
  })
  this.setState({disableButtons: true})
  this._setListenersOnNewMatchRequest()
}

_setListenersOnNewMatchRequest() {
  let routesRef = firebase.database().ref('routes');
  routesRef.off("child_added", this._nearbyRoutesCallback);
  routesRef.off("child_removed", this._nearbyRoutesCallback);
  let completedMatchesRef = firebase.database().ref('completedMatches');
  completedMatchesRef.orderByChild("author/userID")
    .equalTo(this.props.user.userID)
    .on("child_added", this._completedMatchCallback);
  let matchedRoutesRef = firebase.database().ref('matchedRoutes');
  matchedRoutesRef.orderByChild("author/userID")
    .equalTo(this.props.user.userID)
    .on("child_removed", this._rejectedMatchCallback);
  matchedRoutesRef.off("child_added", this._matchedRoutesCallback);
}

_completedMatchCallback(data){
  const route = this.getRoutByChildValue('name', data.val().follower.username);
  const opts = {
    fromCoords: this.state.startPosition,
    toCoords: route.startPosition
  }
  getDirections(opts)
  .then(data => this._createRouteCoordinates(data))
  .then(polylineCoords => {
    this.setState({
      nearbyRoutes: {},
      selectRouteMarkers: [this.state.startPosition, route.startPosition],
      selectRoutePolylineCoords: polylineCoords
    })
  })

  Alert.alert(
    'Match Successful!',
    `Follow the blue line to meet ${data.val().follower.username}`);

  firebase.database().ref('routes/' + data.val().author.routeKey).remove();
  firebase.database().ref('routes/' + data.val().follower.routeKey).remove();
  firebase.database().ref('matchedRoutes/' + data.val().matchedRouteKey).remove();

}

_rejectedMatchCallback(data){
  // Lazy way of doing things, creates extra google requests
  // Can be optimized
  Alert.alert(
    'Match was cancelled',
    'Would you like to make a new route or continue searching?',
    [
      {text: 'New Route', onPress: () => this._openSearchModal()},
      {text: 'Continue Searching', onPress: () => this._saveRoute()},
    ]
  )
}

_approveMatch(){
  let routesRef = firebase.database().ref('routes');
  let matchedRoutesRef = firebase.database().ref('matchedRoutes');
  routesRef.off("child_added", this._nearbyRoutesCallback);
  routesRef.off("child_removed", this._nearbyRoutesCallback);
  matchedRoutesRef.off("child_added", this._matchedRoutesCallback);
  matchedRoutesRef.orderByChild("follower/userID")
    .equalTo(this.props.user.userID)
    .on("child_removed", this._alertAuthorIncoming);
  this.setState({nearbyRoutes: {}})

  const route = this.getRouteByStartAndHaversine();
  let completedMatchesRef = firebase.database().ref('completedMatches');
  let completedMatchKey = matchedRoutesRef.push();
  // remember that the current user is the follower here!
  completedMatchKey.set({
    author: {
      userID: route.userID,
      routeKey: route.routeKey,
      username: route.name
    },
    follower: {
      userID: this.props.user.userID,
      routeKey: this.state.routeKey,
      username: this.props.user.name
    },
    matchedRouteKey: this.state.matchedRouteKey
  })
}

_alertAuthorIncoming(){
  const route = getRouteByStartAndHaversine();
  Alert.alert(`Success!`, `${route.name} is on her way!`)
}

_denyMatch(){
  firebase.database().ref('matchedRoutes/' + this.state.matchedRouteKey).remove();
  this.setState({
    matchedRoute: false,
    selectRouteMarkers: [],
    selectRoutePolylineCoords: []
  })
}


haversine(startLocation, testLocation) {
  function toRad(x) {
    return x * Math.PI / 180;
  }

  const lon1 = startLocation.longitude;
  const lat1 = startLocation.latitude;

  const lon2 = testLocation.longitude;
  const lat2 = testLocation.latitude;

  const R = 6371; // km

  const x1 = lat2 - lat1;
  const dLat = toRad(x1);
  const x2 = lon2 - lon1;
  const dLon = toRad(x2)
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  let d = R * c;

  d /= 1.60934;
  return d;
}

getRouteByStartAndHaversine(){
  const selectRouteStart = this.state.selectRouteMarkers[0];
  const selectHaversine = this.haversine(
                            this.state.startPosition,
                            selectRouteStart
                          )
  const route = this.state.nearbyRoutes[selectHaversine];
  return route;
}

getRoutByChildValue(child, value){
  const keys = Object.keys(this.state.nearbyRoutes);
  let route;
  keys.forEach( key => {
    if (this.state.nearbyRoutes.key[child] === value) {
      route = this.state.nearbyRoutes.key;
    }
  })
  return route;
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

destinationButton() {
  return(
    <TouchableOpacity
      style={styles.button, styles.bubble}
      disabled={this.state.disableButtons}
      onPress={() => this._openSearchModal()}
      >
      <Text>Pick a destination</Text>
    </TouchableOpacity>
  )
}


searchButtons(){
  if (Object.keys(this.state.endPosition).length !== 0) {
    if (this.state.selectRouteMarkers.length > 0 ) {
      return(
        <View style={styles.buttonContainer}>
          {this.destinationButton()}

          <TouchableOpacity
            style={styles.button, styles.bubble}
            disabled={this.state.disableButtons}
            onPress={() => this._sendMatchRequest()}
            >
            <Text>Match Route</Text>
          </TouchableOpacity>
      </View>
      )
    } else {
      return(
        <View style={styles.buttonContainer}>
          {this.destinationButton()}

          <TouchableOpacity
            style={styles.button, styles.bubble}
            onPress={() => this._saveRoute()}
            >
            <Text>Set Route</Text>
          </TouchableOpacity>
        </View>
      )
    }
  } else {
    return (
      <View style={styles.buttonContainer}>
        { this.destinationButton() }
      </View>
    )
  }
}

matchButtons(){
  return(
    <View style={styles.buttonContainer}>
      <TouchableOpacity
        style={styles.button, styles.bubble}
        onPress={() => this._approveMatch()}
        >
        <Text>Approve Match</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button, styles.bubble}
        onPress={() => this._denyMatch()}
        >
        <Text>Deny Match</Text>
      </TouchableOpacity>
  </View>
  )
}

renderButtons() {
  if (this.state.matchedRoutes) {
    return (
      this.matchButtons()
    )
  } else {
    return (
      this.searchButtons()
    )
  }
}


render() {
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
            showsBuildings={true}
            initialRegion={{
              latitude: this.state.startPosition.latitude,
              longitude: this.state.startPosition.longitude,
              latitudeDelta: LATITUDE_DELTA,
              longitudeDelta: LONGITUDE_DELTA,
            }}
          >

          {this.state.markers.map( (marker, idx) => (
            <Marker
            coordinate={marker.latlng}
            title={marker.title}
            key={idx}
            />
          ))}

          {
            Object.keys(this.state.nearbyRoutes).map( (key, idx) => (
              <Marker
                coordinate={this.state.nearbyRoutes[key].startPosition}
                key={key}
                title={this.state.nearbyRoutes[key].name}
                pinColor="#39FF14"
                onPress={() => {
                  const markerKey = key;
                  this._showSelectedRoute(markerKey);
                }}>
                <MapView.Callout tooltip style={styles.customView}>

                  <CustomCallout>
                    <Text>{this.state.nearbyRoutes[key].name}</Text>
                    <Image
                      style={styles.userLargeIcon}
                      source={{uri: this.state.nearbyRoutes[key].imgUrl}}
                      />
                  </CustomCallout>
                </MapView.Callout>

              <View>
                <Image
                  style={styles.userIcon}
                  source={{uri: this.state.nearbyRoutes[key].imgUrl}}
                  />
              </View>
            </Marker>
          ))
        }

        {this.state.selectRouteMarkers[1] &&
          <Marker
            coordinate={this.state.selectRouteMarkers[1]}
            pinColor={this.state.matchedRoute ? "#dd0048" : "#37fdfc"}
            />
        }

        <MapView.Polyline
          coordinates={this.state.polylineCoords}
          strokeWidth={3}
          strokeColor="#ba0be0"
        />

        <MapView.Polyline
          coordinates={this.state.selectRoutePolylineCoords}
          strokeWidth={3}
          strokeColor={this.state.matchedRoute ? "#dd0048" : "#37fdfc"}
        />
        </MapView>

        {this.renderButtons()}

      </View>

    );
  }
}
}


const styles = StyleSheet.create({
  customView: {
    width: 140,
    height: 140,
  },
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
  userIcon: {
    height: 30,
    width: 30,
    borderRadius: 20,
    borderWidth: 2.5,
    borderColor: 'rgba(255,255,255,0.7)',
  },
  userLargeIcon: {
    height: 80,
    width: 80,
    marginVertical: 5,
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
