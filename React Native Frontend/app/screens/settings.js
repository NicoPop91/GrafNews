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
  AsyncStorage,
  Picker
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
import CheckBox from 'react-native-checkbox';
import SegmentedControlTab from 'react-native-segmented-control-tab';
import Storage from 'react-native-storage';
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
      selectedTab: 0,
      category: global.category,
      country: global.country,
      language: global.language
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

  /*refreshStorageData = (data) => {
    try {
      console.log(data);
      storage.save({
        key: 'subscriptions',
        data: data,
        expires: null
      });
    } catch (error) {
    }
  }*/

  refreshCategory = (data) => {
    try {
      storage.save({
        key: 'category',
        data: data,
        expires: null
      });
    } catch (error) {
    }
  }

  refreshLanguage = (data) => {
    try {
      storage.save({
        key: 'language',
        data: data,
        expires: null
      });
    } catch (error) {
    }
  }

  refreshCountry = (data) => {
    try {
      storage.save({
        key: 'country',
        data: data,
        expires: null
      });
    } catch (error) {
    }
  }

  renderDevInfo = () => {
    return(
      <ScrollView>
        <View style={{marginBottom: 50}}>
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

          <View style={{ marginTop: 20, marginLeft: 20 }}>
            <Text style={{ paddingBottom: 10, fontWeight: "bold", fontSize: 26 }}>
              serverdata
            </Text>
            <Text>url: {global.serverurl}</Text>
          </View>
          </View>
        </ScrollView>
    )
  }

  renderPickersTabletLandscape = () => {
    return(
      <ScrollView>
        <View style={{marginBottom: 50}}>
                <View style={{ marginTop: 10, marginLeft: 20, marginRight: 20}}>
                <View style={{flexDirection:'row', justifyContent:'space-between', paddingHorizontal: 5, paddingTop: 0}}>
              <Text style={{ color:'white', fontWeight: "bold", fontFamily: "MoonGet", fontSize: 24, paddingHorizontal:10, backgroundColor:'rgba(0, 0, 0, 0.6)'}}>
                Categories
              </Text>
            </View>
            <View>
                    <Picker
                      selectedValue={this.state.category}
                      onValueChange={(itemValue, itemIndex) => {
                        this.setState({category: itemValue});
                        global.category = itemValue;
                        this.refreshCategory(itemValue);
                      }}
                      style={{borderWidth: 0.4, borderRadius: 4, marginTop: 5, height: 100}}
                      itemStyle={{height: 100}}>
                      <Picker.Item label="General" value="general" />
                      <Picker.Item label="Business" value="business" />
                      <Picker.Item label="Entertainment" value="entertainment" />
                      <Picker.Item label="Health" value="health" />
                      <Picker.Item label="Science" value="science" />
                      <Picker.Item label="Sport" value="sport" />
                      <Picker.Item label="Technology" value="technology" />
                    </Picker>
                    </View>
                  </View>
                  <View style={{ marginTop: 20, marginLeft: 20, marginRight: 20 }}>
                  <View style={{flexDirection:'row', justifyContent:'space-between', paddingHorizontal: 5, paddingTop: 10}}>
              <Text style={{ color:'white', fontWeight: "bold", fontFamily: "MoonGet", fontSize: 24, paddingHorizontal:10, backgroundColor:'rgba(0, 0, 0, 0.6)'}}>
                Country
              </Text>
            </View>
            <View>
                    <Picker
                      selectedValue={this.state.country}
                      onValueChange={(itemValue, itemIndex) => {
                        this.setState({country: itemValue});
                        global.country = itemValue;
                        this.refreshCountry(itemValue);
                      }}
                      style={{borderWidth: 0.4, borderRadius: 4, marginTop: 5, height: 100}}
                      itemStyle={{height: 100}}>
                      <Picker.Item label="All" value="" />
                      <Picker.Item label="Germany" value="de" />
                      <Picker.Item label="England" value="en" />
                      <Picker.Item label="USA" value="us" />
                    </Picker>
                    </View>
                  </View>
                  <View style={{ marginTop: 20, marginLeft: 20, marginRight: 20 }}>
                  <View style={{flexDirection:'row', justifyContent:'space-between', paddingHorizontal: 5, paddingTop: 10}}>
              <Text style={{ color:'white', fontWeight: "bold", fontFamily: "MoonGet", fontSize: 24, paddingHorizontal:10, backgroundColor:'rgba(0, 0, 0, 0.6)'}}>
                Language
              </Text>
            </View>
            <View>
                    <Picker
                      selectedValue={this.state.language}
                      onValueChange={(itemValue, itemIndex) => {
                        this.setState({language: itemValue});
                        global.language = itemValue;
                        this.refreshLanguage(itemValue);
                      }}
                      style={{borderWidth: 0.4, borderRadius: 4, marginTop: 5, height: 100}}
                      itemStyle={{height: 100}}
                      mode='dropdown'>
                      <Picker.Item label="All" value="" />
                      <Picker.Item label="German" value="de" />
                      <Picker.Item label="English" value="en" />
                    </Picker>
                    </View>
                  </View>
                  </View>
              </ScrollView>
    )
  }

  renderPickers = () => {
    return(
      <ScrollView>
        <View style={{marginBottom: 50}}>
                <View style={{ marginTop: 5, marginLeft: 20, marginRight: 20}}>
                <View style={{flexDirection:'row', justifyContent:'space-between', paddingHorizontal: 5, paddingTop: 10}}>
              <Text style={{ color:'white', fontWeight: "bold", fontFamily: "MoonGet", fontSize: 24, paddingHorizontal:10, backgroundColor:'rgba(0, 0, 0, 0.6)'}}>
                Categories
              </Text>
            </View>
            <View>
                    <Picker
                      selectedValue={this.state.category}
                      onValueChange={(itemValue, itemIndex) => {
                        this.setState({category: itemValue});
                        global.category = itemValue;
                        this.refreshCategory(itemValue);
                      }}
                      style={{borderWidth: 0.4, borderRadius: 4, marginTop: 5}}
                      mode='dropdown'>
                      <Picker.Item label="General" value="general" />
                      <Picker.Item label="Business" value="business" />
                      <Picker.Item label="Entertainment" value="entertainment" />
                      <Picker.Item label="Health" value="health" />
                      <Picker.Item label="Science" value="science" />
                      <Picker.Item label="Sport" value="sport" />
                      <Picker.Item label="Technology" value="technology" />
                    </Picker>
                    </View>
                  </View>
                  <View style={{ marginTop: 20, marginLeft: 20, marginRight: 20 }}>
                  <View style={{flexDirection:'row', justifyContent:'space-between', paddingHorizontal: 5, paddingTop: 10}}>
              <Text style={{ color:'white', fontWeight: "bold", fontFamily: "MoonGet", fontSize: 24, paddingHorizontal:10, backgroundColor:'rgba(0, 0, 0, 0.6)'}}>
                Country
              </Text>
            </View>
            <View>
                    <Picker
                      selectedValue={this.state.country}
                      onValueChange={(itemValue, itemIndex) => {
                        this.setState({country: itemValue});
                        global.country = itemValue;
                        this.refreshCountry(itemValue);
                      }}
                      style={{borderWidth: 0.4, borderRadius: 4, marginTop: 5}}
                      mode='dropdown'>
                      <Picker.Item label="All" value="" />
                      <Picker.Item label="Germany" value="de" />
                      <Picker.Item label="England" value="en" />
                      <Picker.Item label="USA" value="us" />
                    </Picker>
                    </View>
                  </View>
                  <View style={{ marginTop: 20, marginLeft: 20, marginRight: 20 }}>
                  <View style={{flexDirection:'row', justifyContent:'space-between', paddingHorizontal: 5, paddingTop: 10}}>
              <Text style={{ color:'white', fontWeight: "bold", fontFamily: "MoonGet", fontSize: 24, paddingHorizontal:10, backgroundColor:'rgba(0, 0, 0, 0.6)'}}>
                Language
              </Text>
            </View>
            <View>
                    <Picker
                      selectedValue={this.state.language}
                      onValueChange={(itemValue, itemIndex) => {
                        this.setState({language: itemValue});
                        global.language = itemValue;
                        this.refreshLanguage(itemValue);
                      }}
                      style={{borderWidth: 0.4, borderRadius: 4, marginTop: 5}}
                      mode='dropdown'>
                      <Picker.Item label="All" value="" />
                      <Picker.Item label="German" value="de" />
                      <Picker.Item label="English" value="en" />
                    </Picker>
                    </View>
                  </View>
                  </View>
              </ScrollView>
    )
  }

  render() {
    if (this.state.orientation === 'portrait' || this.state.devicetype === 'phone') {
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
                  this.renderPickers()
              ) : (
                  this.renderDevInfo()
              )}

      </View>
    );} else {
      return (
      
        <View
            style={{
              flexDirection: "row",
              justifyContent: "flex-start",
              flex: 1,
              opacity: 1
            }}
          >
          <View style={{ flex: 1.5}}> {this.renderPickersTabletLandscape()} </View>
          
          <View
                      style={{
                      paddingVertical: 0,
                      borderRightWidth: 1,
                      borderColor: "#CED0CE"
                    }}
                    >
                  </View>
          
          <View style={{ flex: 1.0}}> 
          <View style={{flexDirection:'row', justifyContent:'space-between', paddingHorizontal: 5, paddingTop: 10}}>
              <Text style={{ color:'white', fontWeight: "bold", fontFamily: "MoonGet", fontSize: 24, paddingHorizontal:10, backgroundColor:'rgba(0, 0, 0, 0.6)'}}>
                DEV Informationen
              </Text>
            </View>
            {this.renderDevInfo()} 
            </View>   
          
        </View>
      );
    }
  }
}
