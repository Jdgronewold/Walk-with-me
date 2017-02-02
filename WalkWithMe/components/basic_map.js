import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Navigator,
  Dimensions
} from 'react-native';

import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';

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
     position: 'unknown'
   };
 }

 componentDidMount() {
   navigator.geolocation.getCurrentPosition(
     (position) => {
       const initialPosition = JSON.stringify(position);
       this.setState({position});
     },
     (geoError) => alert(JSON.stringify(geoError)),
     {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000}
   );
 }


render() {
  if (this.state.position === "unknown") {
    return (
      <View style={{ flex: 1 }}></View>
    );
  } else {
    return (
      <View style={{ flex: 1 }}>
        <View style={styles.container}>
          <MapView
            provider={PROVIDER_GOOGLE}
            style={styles.map}
            initialRegion={{
              latitude: this.state.position.coords.latitude,
              longitude: this.state.position.coords.longitude,
              latitudeDelta: LATITUDE_DELTA,
              longitudeDelta: LONGITUDE_DELTA,
            }}
          />
        </View>
      </View>
    );
  }
}
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  map: {
    width: width,
    height: height
  },
});

export default BasicMap;
