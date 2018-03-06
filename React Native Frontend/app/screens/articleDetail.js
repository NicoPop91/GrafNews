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
  render() {
    return (
      <WebView source={{ uri: "https://github.com/facebook/react-native" }} />
    );
  }
}
