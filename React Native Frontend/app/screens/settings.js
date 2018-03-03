import React, { Component } from 'react';
import { AppRegistry, Text, View, StyleSheet, TextInput, Alert, Dimensions, Image, ScrollView, RefreshControl, FlatList, Linking, TouchableOpacity, ActivityIndicator, Platform} from 'react-native';
import { List, ListItem, SearchBar, SocialIcon, Header, ButtonGroup, Button } from "react-native-elements";
import { pixelDensity, width, height, isIos, isAndroid, isPhone, isTablet, isIphoneX} from "react-native-device-detection";
const Device = require('react-native-device-detection');
const Orientation = require('../config/orientation.js');

export default class Settings extends Component {

  constructor(props) {
    super(props);

    this.state = {
        orientation: Orientation.isPortrait() ? 'portrait' : 'landscape',
        pixelDensity: Device.pixelDensity,
        width: Dimensions.get('screen').width,
        height: Dimensions.get('screen').height,
        os: Device.isIos ? 'iOS' : 'Android',
        devicetype: Device.isPhone ? 'phone' : 'tablet',
        iPhoneX: Device.isIphoneX ? 'true' : 'false'
    };

    Dimensions.addEventListener('change', () => {
        this.setState({
            orientation: Orientation.isPortrait() ? 'portrait' : 'landscape',
            width: Dimensions.get('screen').width,
            height: Dimensions.get('screen').height,
        });
        dimensions = Dimensions.get('window');
        this.forceUpdate();
    });
  }

  render() {
    return (
      <View>
        <View style={{marginTop: 20, marginLeft: 20}}>
          <Text style={{paddingBottom:10, fontWeight:'bold', fontSize:26}}>
            systeminfo
          </Text>
          <Text>
            operating system: {this.state.os}
          </Text>
          <Text>
            device type: {this.state.devicetype}
          </Text>
          <Text>
            device orientation: {this.state.orientation}
          </Text>
          <Text>
            height: {this.state.height}
          </Text>
          <Text>
            width: {this.state.width}
          </Text>
          <Text>
            iPhoneX: {this.state.iPhoneX}
          </Text>
        </View>
      </View>
    )
  }
}
