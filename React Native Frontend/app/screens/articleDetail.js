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
  WebView
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
const Orientation = require("../config/orientation.js");

export default class ArticleDetail extends Component {

  renderText = (description) => {
    return(
      <Text style={{margin:10}}>
        {description}
      </Text>
    )
  }

  render() {
    const {url, publishedByUser, description}= this.props.navigation.state.params;
    console.log(url);
    return (
      <View style={{flex:1.5}}>
        { 
          publishedByUser === true ? (
            this.renderText(description)
          ) : (
            null
          )
        }
        <WebView
          source={{uri: url}}
        />
      </View>
    );
  }
}
