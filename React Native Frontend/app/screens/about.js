import React, { Component } from 'react';
import { AppRegistry, Text, View, StyleSheet, TextInput, Alert, Dimensions, Image, ScrollView, RefreshControl, FlatList, Linking, TouchableOpacity, ActivityIndicator} from 'react-native';
import { List, ListItem, SearchBar, SocialIcon, Header, ButtonGroup, Button, Divider } from "react-native-elements";
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
    return (
      <View style={{flexDirection:'column', margin:20}}>
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
              onPress={()=>this.openLink('https://github.com/MartinRippel')}
            />
            <SocialIcon
              type='twitter'
              onPress={()=>this.openLink('https://twitter.com/martin_rippel')}
            />
          </View>
        </View>
        <Divider style={{ height:20, backgroundColor:'transparent' }} />
        <View style={{borderBottomWidth:1, flexDirection:'row'}}>
          <View style={{flex:1, marginLeft:10}}>
            <View>
              <Text style={{fontSize:24}}>
                Jan Zimny
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
              onPress={()=>this.openLink('https://github.com/wucub')}
            />
            <SocialIcon
              type='steam'
              onPress={()=>this.openLink('http://steamcommunity.com/profiles/76561198060727849/')}
            />
          </View>
        </View>
        <Divider style={{ height:20, backgroundColor:'transparent' }} />
        <View style={{borderBottomWidth:1, flexDirection:'row'}}>
          <View style={{flex:1, marginLeft:10}}>
            <View>
              <Text style={{fontSize:24}}>
                Fabian Pulch
              </Text>
            </View>
            <View style={{flexDirection:'row'}}>
              <Text style={{fontSize:20, color:'#808080'}}>
                Lead Backend Designer
              </Text>
            </View>
          </View>
          <View style={{flex:1, flexDirection:'row', justifyContent:'flex-end', alignItems:'center'}}>
            <SocialIcon
              type='github'
              onPress={()=>this.openLink('https://github.com/fpulch')}
            />
            <SocialIcon
              type='xing'
              underlayColor='green'
              light='true'
              onPress={()=>this.openLink('https://www.xing.com/profile/Fabian_Pulch')}
            />
          </View>
        </View>
        <Divider style={{ height:20, backgroundColor:'transparent' }} />
        <View style={{borderBottomWidth:1, flexDirection:'row'}}>
          <View style={{flex:1, marginLeft:10}}>
            <View>
              <Text style={{fontSize:24}}>
                Nico Popiolek
              </Text>
            </View>
            <View style={{flexDirection:'row'}}>
              <Text style={{fontSize:20, color:'#808080'}}>
                Lead Backend Designer
              </Text>
            </View>
          </View>
          <View style={{flex:1, flexDirection:'row', justifyContent:'flex-end', alignItems:'center'}}>
            <SocialIcon
              type='github'
              onPress={()=>this.openLink('https://github.com/NicoPop91')}
            />
            <SocialIcon
              type='xing'
              underlayColor='green'
              light='true'
              onPress={()=>this.openLink('https://www.xing.com/profile/Nico_Popiolek')}
            />
          </View>
        </View>
      </View>
    );
  }
}
