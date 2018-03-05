import React, { Component } from "react";
import {
  AppRegistry,
  Text,
  View,
  StyleSheet,
  TextInput,
  Alert,
  Dimensions,
  Image,
  ScrollView,
  RefreshControl,
  FlatList,
  Linking,
  TouchableOpacity,
  ActivityIndicator,
  Platform
} from "react-native";
import {
  List,
  ListItem,
  SearchBar,
  SocialIcon,
  Header,
  ButtonGroup,
  Button
} from "react-native-elements";
import {
  pixelDensity,
  width,
  height,
  isIos,
  isAndroid,
  isPhone,
  isTablet,
  isIphoneX
} from "react-native-device-detection";
import Geocoder from 'react-native-geocoder';
const Device = require("react-native-device-detection");
const Orientation = require("../config/orientation.js");

export default class Settings extends Component {
  constructor(props) {
    super(props);

    this.state = {
      orientation: Orientation.isPortrait() ? "portrait" : "landscape",
      pixelDensity: Device.pixelDensity,
      width: Dimensions.get("screen").width,
      height: Dimensions.get("screen").height,
      os: Device.isIos ? "iOS" : "Android",
      devicetype: Device.isPhone ? "phone" : "tablet",
      iPhoneX: Device.isIphoneX ? "true" : "false",
      latitude: null,
      longitude: null,
      geolocation: null,
      geoError: null
    };

    Dimensions.addEventListener("change", () => {
      this.setState({
        orientation: Orientation.isPortrait() ? "portrait" : "landscape",
        width: Dimensions.get("screen").width,
        height: Dimensions.get("screen").height
      });
      dimensions = Dimensions.get("window");
      this.forceUpdate();
    });
  }

  async componentDidMount() {
    await this.getGeoLocation();
    await this.getPosition();
  }

  getGeoLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        console.log('Inside geo determination: ' + position.coords.latitude + ' ' + position.coords.longitude)
        this.setState({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          geoError: null,
        });
      },
      (error) => this.setState({ geoError: error.message }),
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 },
    );
    console.log('Finish geo determination: ' + this.state.latitude + ' ' + this.state.longitude)
  }

  getPosition = () => {
    var coords = {
      lat: 40.7809261,
      lng: -73.9637594
    };
    console.log('Coords: ' + coords.lat + ' ' + coords.lng)
    Geocoder.geocodePosition(coords).then(res => {
      console.log('Results: ' + res)
      this.setState({geolocation: res});
    })
    .catch(err => console.log(err))
  }

  render() {
    return (
      <View>
        <View style={{ marginTop: 20, marginLeft: 20 }}>
          <Text style={{ paddingBottom: 10, fontWeight: "bold", fontSize: 26 }}>
            systeminfo
          </Text>
          <Text>operating system: {this.state.os}</Text>
          <Text>device type: {this.state.devicetype}</Text>
          <Text>device orientation: {this.state.orientation}</Text>
          <Text>height: {this.state.height}</Text>
          <Text>width: {this.state.width}</Text>
          <Text>iPhoneX: {this.state.iPhoneX}</Text>
        </View>

        <View style={{ marginTop: 20, marginLeft: 20 }}>
          <Text style={{ paddingBottom: 10, fontWeight: "bold", fontSize: 26 }}>
            geolocation
          </Text>
          <Text>latitude: {this.state.latitude}</Text>
          <Text>longitude: {this.state.longitude}</Text>
          <Text>address: {this.state.geolocation}</Text>
        </View>
      </View>
    );
  }
}
