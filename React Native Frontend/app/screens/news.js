import React, { Component } from "react";
import {
  AppRegistry,
  View,
  StyleSheet,
  TextInput,
  Alert,
  Dimensions,
  Image,
  ScrollView,
  TouchableHighlight,
  TouchableWithoutFeedback,
  RefreshControl,
  FlatList,
  Linking,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
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
import { RkCard, RkText, RkButton } from "react-native-ui-kitten";
import {
  DeckSwiper,
  CardItem,
  Card,
  Right,
  Left,
  Thumbnail,
  Body,
  Icon,
  Text
} from "native-base";
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
import { Font } from 'expo';
const Device = require("react-native-device-detection");
const Orientation = require("../config/orientation.js");

//------------------------------------------------------------------------------

export default class News extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: [],
      orientation: Orientation.isPortrait() ? "portrait" : "landscape",
      devicetype: Device.isPhone ? "phone" : "tablet",
      refreshing: false,
      loading: false,
      page: 1,
      seed: 1,
      error: null,
      latitude: null,
      longitude: null,
      geoError: null,
      componentDidMount: false,
      currentArticle: null
    };

    // Event Listener for orientation changes
    Dimensions.addEventListener("change", () => {
      this.setState({
        orientation: Orientation.isPortrait() ? "portrait" : "landscape"
      });
      dimensions = Dimensions.get("window");
      this.forceUpdate();
    });
  }

  async componentDidMount() {
    this.getLocation;
    this.makeRemoteRequest();
    await Font.loadAsync({
      'OldLondon': require('../../assets/fonts/OldLondon.ttf'),
    });
    await Font.loadAsync({
      'MoonGet': require('../../assets/fonts/moon_get-Heavy.ttf'),
    });
    this.setState({ componentDidMount: true });
  }

  makeRemoteRequest = () => {
    const { page, seed } = this.state;
    const url = `https://randomuser.me/api/?seed=${seed}&page=${page}&results=20`;
    this.setState({ loading: true });
    fetch(url)
      .then(res => res.json())
      .then(res => {
        this.setState({
          data: page === 1 ? res.results : [...this.state.data, ...res.results],
          error: res.error || null,
          loading: false,
          refreshing: false
        });
      })
      .catch(error => {
        this.setState({ error, loading: false });
      });
  };

  getGeoLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        this.setState({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          geoError: null,
        });
      },
      (error) => this.setState({ geoError: error.message }),
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 },
    );
  }

  handleRefresh = () => {
    this.setState(
      {
        page: 1,
        seed: this.state.seed + 1,
        refreshing: true
      },
      () => {
        this.makeRemoteRequest();
      }
    );
  };

  handleLoadMore = () => {
    this.setState(
      {
        page: this.state.page + 1
      },
      () => {
        this.makeRemoteRequest();
      }
    );
  };

  renderSeparator = () => {
    return (
      <View
        style={{
          height: '100%',
          width: 1,
          backgroundColor: "#CED0CE"
        }}
      />
    );
  };

  renderHeader = () => {
    return (
      <View style={{}}>
        {
          this.state.componentDidMount ? (
            <Text style={{ fontWeight: "bold", fontFamily: "MoonGet", fontSize: 24, paddingLeft: 10, paddingTop: 10 }}>
              Local News
            </Text>
          ) : null
        }
        <List
          containerStyle={{
            borderTopWidth: 0,
            borderBottomWidth: 0,
            flex: 1,
            marginTop: 0
          }}
        >
          <FlatList
            data={this.state.data}
            numColumns={1}
            renderItem={({ item }) => (
              <TouchableWithoutFeedback onPress={() => this.openArticle(item)} style={{}}>
                <Card style={{}}>
                  <CardItem>
                    <Left>
                      <Thumbnail source={{ uri: item.picture.thumbnail }} />
                      <Body>
                        <Text>
                          {item.name.first} {item.name.last}
                        </Text>
                        <Text note>{item.gender}</Text>
                      </Body>
                    </Left>
                  </CardItem>
                  <CardItem cardBody>
                    <Image
                      source={{ uri: item.picture.large }}
                      style={{ height: 150, width: null, flex: 1 }}
                    />
                  </CardItem>
                  <CardItem>
                    <Left />
                    <Body />
                    <Right>
                      <Text>{item.location.state}</Text>
                    </Right>
                  </CardItem>
                </Card>
              </TouchableWithoutFeedback>
            )}
            horizontal={true}
            keyExtractor={item => item.email}
            //ItemSeparatorComponent={this.renderSeparator}
            ListFooterComponent={this.renderFooter}
            onEndReached={this.handleLoadMore}
            onEndReachedThreshold={50}
          />
        </List>
        {
          this.state.componentDidMount ? (
            <Text style={{ fontWeight: "bold", fontFamily: "MoonGet", fontSize: 24, paddingLeft: 10, paddingTop: 20 }}>
              Other News
            </Text>
          ) : null
        }
      </View>
    );
  };

  renderList = columns => {
    return(
    <List
    containerStyle={{
      borderTopWidth: 0,
      borderBottomWidth: 0,
      flex: 1,
      marginTop: 0,
      marginHorizontal:3
    }}
    >
      <FlatList
        data={this.state.data}
        key={(this.state.orientation === 'portrait' ? 'portrait' : 'landscape')}
        numColumns={columns}
        renderItem={({ item }) => (
          <TouchableWithoutFeedback onPress={() => this.openArticle(item)} style={{}}>
            <View style={{flex:1, margin:3, borderRadius:20, shadowColor: '#000000', shadowOffset: {width: 0, height: 1}, shadowRadius: 2, shadowOpacity: 1.0}}>
              <Image
                source={{ uri: item.picture.large }}
                style={{ resizeMode: 'cover', height: 200, width: null, flex: 1, borderRadius:20}}
              />
              <View style={{ position: 'absolute', left:0, bottom: 0, right:0}}>
                <View style={{opacity:1, position: 'absolute', left: 0, bottom: 0, right:0, padding:5}}>
                  <View style={{opacity: 0.3, backgroundColor: 'black', position: 'absolute', left: 0, top: 0, bottom:0, right:0, borderBottomLeftRadius:20, borderBottomRightRadius:20}}/>
                  <View style={{flexDirection:'row', justifyContent:'flex-start'}}>
                    <Thumbnail source={{ uri: item.picture.thumbnail }} />
                    <View style={{flexDirection:'row', justifyContent:'flex-start', paddingLeft:10}}>
                      <View style={{flexDirection:'column', justifyContent:'space-between'}}>
                        <Text style={{color:'white'}}>
                          {item.name.first} {item.name.last}
                        </Text>
                        <View style={{flexDirection:'row', justifyContent:'space-between'}}>
                          <Text note>{item.gender}</Text>
                        </View>
                      </View>
                    </View>
                  </View>
                </View>
              </View>
            </View>
          </TouchableWithoutFeedback>
        )}
        keyExtractor={item => item.email}
        //ItemSeparatorComponent={this.renderSeparator}
        ListHeaderComponent={this.renderHeader}
        ListFooterComponent={this.renderFooter}
        onRefresh={this.handleRefresh}
        refreshing={this.state.refreshing}
        onEndReached={this.handleLoadMore}
        onEndReachedThreshold={50}
      />
    </List>
    )
  }

  renderFooter = () => {
    //if (!this.state.loading) return null;
    return (
      <View
        style={{
          paddingVertical: 20,
          borderTopWidth: 1,
          borderColor: "#CED0CE"
        }}
      >
        <ActivityIndicator animating size="large" />
      </View>
    );
  };

  //fetch data from url into json
  /*fetchData = async () => {
      const response = await fetch('');
      const json = response.json();
      this.setState({date: json});
  }

  //refresh the current view
  _onRefresh = () => {
    this.setState({ refreshing: true });
    this.fetchData().then(() => {
      this.setState({ refreshing: false });
    });
  };

  componentWillMount() {
    this.fetchData();
  }*/

  openLink = link => {
    Linking.canOpenURL(link).then(supported => {
      if (supported) {
        Linking.openURL(link);
      } else {
        console.log("Don't know how to open URI: " + link);
      }
    });
  };

  openArticle = item => {
    this.setState({ currentArticle: 'http://facebook.github.io/react-native/' })
    this.forceUpdate();
    if(this.state.orientation === 'portrait'){
      this.props.navigation.navigate("Details", item);
    }
  };

  random = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  render() {
    const currentdate = new Date();
    const days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday"
    ];
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December"
    ];
    return (
      <View
        style={{
          flexDirection: "row",
          justifyContent: "flex-start",
          flex: 1,
          backgroundColor: "white"
        }}
      >
        <View style={{ flex: 1 }}>
          {
            this.state.orientation === 'portrait' && this.state.devicetype === 'tablet' ? this.renderList(2) : null
          }
          {
            this.state.orientation === 'portrait' && this.state.devicetype === 'phone' ? this.renderList(1) : null
          }
          {
            this.state.orientation === 'landscape' ? this.renderList(1) : null
          }
        </View>
        {
          this.state.orientation === 'landscape' && this.state.currentArticle !== null ? (
            <View style={{flex:1.5}}>
              <WebView
                source={{uri: this.state.currentArticle}}
              />
            </View>
          ) : null
        }
        {
          this.state.orientation === 'landscape' ? (
            <View
              style={{
                height: '100%',
                width: 1,
                backgroundColor: "#CED0CE"
              }}
            />
          ) : null
        }
        {
          this.state.orientation === 'landscape' && this.state.currentArticle === null ? (
            <View style={{flex:1.5, justifyContent:'center'}}>
              <Text style={{textAlign:'center', justifyContent:'center', alignItems:'center'}}>
                Select an article from the list to read it
              </Text>
            </View>
          ) : null
        }
      </View>
    );
  }
}

//------------------------------------------------------------------------------

const styles = StyleSheet.create({
  screen: {
    backgroundColor: "#f0f1f5",
    padding: 12
  },
  buttonIcon: {
    marginRight: 7,
    fontSize: 19.7
  },
  footer: {
    marginHorizontal: 16
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    marginRight: 17
  },
  dot: {
    fontSize: 6.5,
    color: "#0000008e",
    marginLeft: 2.5,
    marginVertical: 10
  },
  floating: {
    width: 56,
    height: 56,
    position: "absolute",
    zIndex: 200,
    right: 16,
    top: 173
  },
  footerButtons: {
    flexDirection: "row"
  },
  overlay: {
    justifyContent: "flex-end",
    paddingVertical: 23,
    paddingHorizontal: 16
  }
});
