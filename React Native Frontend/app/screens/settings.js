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
  Platform,
  TouchableWithoutFeedback,
  AsyncStorage
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
import CheckBox from 'react-native-check-box'
import SegmentedControlTab from 'react-native-segmented-control-tab'
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
      geoError: null,
      selectedTab: 0
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

  handleIndexChange = (index) => {
    this.setState({
      ...this.state,
      selectedTab: index,
    });
  }

  _refreshStorageData = (data) => {
    try {
      AsyncStorage.setItem('subscriptions', data);
    } catch (error) {
      // Error saving data
    }
  }

  render() {
    const categories = [
      {"id": 1, "cat": "General", "subscribed": true},
      {"id": 2, "cat": "Business", "subscribed": true},
      {"id": 3, "cat": "Entertainment", "subscribed": true},
      {"id": 4, "cat": "Health", "subscribed": false},
      {"id": 5, "cat": "Science", "subscribed": false},
      {"id": 6, "cat": "Sports", "subscribed": true},
      {"id": 7, "cat": "Technology", "subscribed": true}
      ];
    return (
      <View>
      {
          this.state.componentDidMount ? (
            <Text style={{ fontWeight: "bold", fontFamily: "MoonGet", fontSize: 24, paddingLeft: 10, paddingTop: 20 }}>
              News Categories
            </Text>
          ) : null
        }
        <SegmentedControlTab
                values={['Subscriptions', 'Informations']}
                selectedIndex={this.state.selectedTab}
                onTabPress={this.handleIndexChange}
                tabsContainerStyle={{padding:5}}
              />
              {this.state.selectedTab === 0 ? (
        <List
          containerStyle={{
            borderTopWidth: 0,
            borderBottomWidth: 0,
            marginTop: 10,
            backgroundColor: 'transparent'
          }}
        >
          <FlatList
            data={categories}
            numColumns={1}
            renderItem={({ item }) => (
              <TouchableWithoutFeedback>
                 <View style={{flex:1, marginLeft:25, marginRight:25, marginVertical:10, flexDirection: 'column', borderRadius:5, shadowColor: '#000000', shadowOffset: {width: 0, height: 1}, shadowRadius: 2, shadowOpacity: 1.0}}>
                    <View style={{flex:1, justifyContent: 'center', paddingLeft: 10}}>
                    <CheckBox
                      style={{flex: 1, padding: 10}}
                      onClick={ function() {
                        item.subscribed = !item.subscribed;
                        console.log(categories);
                        //this._refreshStorageData(categories);
                      }}
                      isChecked={item.subscribed}
                      leftText={item.cat}
                    />
                    </View>
                    <View
                      style={{
                      paddingVertical: 5,
                      borderTopWidth: 1,
                      borderColor: "#CED0CE"
                    }}
                    >
                  </View>
                 </View>
              </TouchableWithoutFeedback>
            )}
            keyExtractor={item => item.id}
          />
        </List>
              ) : (
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
              )}

      </View>
    );
  }
}
