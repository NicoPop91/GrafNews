import React, { Component } from 'react';
import { AppRegistry, Text, View, StyleSheet, TextInput, Alert, Dimensions, Image, ScrollView, RefreshControl, FlatList, Linking, TouchableOpacity, ActivityIndicator} from 'react-native';
import { List, ListItem, SearchBar, SocialIcon, Header, ButtonGroup, Button } from "react-native-elements";
const Orientation = require('../config/orientation.js');

export default class About extends Component {

  openLink = (link) => {
    Linking.canOpenURL(link).then(supported => {
      if (supported) {
        Linking.openURL(link);
      } else {
        console.log("Don't know how to open URI: " + link);
      }
    });
  }

  render() {
    const data = [
      {
        "name": {
          "first": "Nico",
          "second": ""
        },

      },
    ]

    return (
      <View style={{flexDirection:'column'}}>
        <View style={{borderBottomWidth:1, flexDirection:'row'}}>
          <View style={{flex:1, marginLeft:10}}>
            <View>
              <Text style={{fontSize:24}}>
                Martin Rippel
              </Text>
            </View>
            <View style={{flexDirection:'row'}}>
              <Text style={{fontSize:20, color:'#808080'}}>
                Lead UI Designer
              </Text>
            </View>
          </View>
          <View style={{flex:1, flexDirection:'row', justifyContent:'flex-end', alignItems:'center'}}>
            <SocialIcon
              type='github'
              onPress={()=>this.openLink('https://github.com/Blaupanzer')}
            />
            <SocialIcon
              type='twitter'
              onPress={()=>this.openLink('https://twitter.com/martin_rippel')}
            />
          </View>
        </View>
      </View>
    );
  }
}
