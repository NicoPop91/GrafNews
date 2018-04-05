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
const { createApolloFetch } = require('apollo-fetch');
const Orientation = require("../config/orientation.js");

export default class ArticleDetail extends Component {

  constructor(props) {
    super(props);

    this.state = {
      adress: null
    };
  }

  renderText = (author, description, publishedAt) => {
    var date = new Date(publishedAt);
    return(
      <View style={{flexDirection:'column'}}>
        <View style={{flexDirection:'column'}}>
          <Text style={{margin:10, fontSize:16}}>
            {description}
          </Text>
        </View>
        <View style={{flexDirection:'row', justifyContent:'space-between'}}>
          <Text style={{margin:10, color:'#696969', fontSize:12}}>
            {author}
          </Text>
          <Text style={{margin:10, color:'#696969', fontSize:12}}>
            {date.toLocaleString()}
          </Text>
        </View>
        {/*<View style={{flexDirection:'row', justifyContent:'flex-end'}}>
          <Text style={{marginBottom:10, marginHorizontal:10, color:'#696969', fontSize:12}}>
            {this.state.adress}
          </Text>
        </View>*/}
      </View>
    )
  }

  makeGeoRemoteRequest = (longitude, latitude) => {
    console.log("Granted values: " + longitude + ", " + latitude);
    var query = '{geocode(lng:"' + longitude + '", lat:"' + latitude + '"){formattedAddress latitude longitude streetName city country country countryCode zipcode provider}}';
    console.log("makeGeoRemoteRequest query:" + query);
     const fetch = createApolloFetch({
       uri: global.serverurl,
     });
     fetch({
       query: query,
     })
     .then(res => {
       console.log('Formatted Address: ' + res.data.geocode[0].formattedAddress);
       this.setState({
        adress: res.data.geocode[0].formattedAddress,
       });
     })
     .catch(error => {
       this.setState({error});
       console.log(error);
     });
   };

   /*async componentDidMount() {
    const {longitude, latitude}= this.props.navigation.state.params; 
    this.makeGeoRemoteRequest(longitude,latitude);
   }*/

  render() {
    const {url, publishedByUser, description, author, publishedAt, longitude, latitude}= this.props.navigation.state.params;
    return (
      <View style={{flex:1.5}}>
        { 
          publishedByUser === true ? (
            this.renderText(author, description, publishedAt)
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
