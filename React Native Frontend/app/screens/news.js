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
  WebView,
  Slider,
  ImageBackground
} from "react-native";
import {
  List,
  ListItem,
  SearchBar,
  SocialIcon,
  Header,
  ButtonGroup,
  Button,
  Icon
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
import SegmentedControlTab from 'react-native-segmented-control-tab'
import { Font } from 'expo';
const Device = require("react-native-device-detection");
const Orientation = require("../config/orientation.js");
const { createApolloFetch } = require('apollo-fetch');

//------------------------------------------------------------------------------

const testImage= 'https://upload.wikimedia.org/wikipedia/commons/b/bf/Test_card.png';

export default class News extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: [],
      orientation: Orientation.isPortrait() ? "portrait" : "landscape",
      devicetype: Device.isPhone ? "phone" : "tablet",
      refreshing: false,
      loading: false,
      error: null,
      latitude: null,
      longitude: null,
      geoError: null,
      componentDidMount: false,
      currentArticle: null,
      selectedTab: 0,
      sliderPosition: 0
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

  static navigationOptions = ({ navigation }) => {
    return {
        title: 'Write Article',
        headerRight: (
            <Icon
              name="message"
              onPress={() => navigation.navigate('WriteArticle')}
              color="#007AFF"
            />
        ),
    }
  };

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
   var date = new Date;
   var query = '{articles(date:"'+date.toISOString()+'"){id author title description url urlToImage category language country publishedAt}}';
   console.log(query);

    const fetch = createApolloFetch({
      uri: 'http://9p7wpw3ppo75fifx.myfritz.net:4000/graphql',
    });
    fetch({
      query: query,
    })
    .then(res => {
      this.setState({
        data: res.data.articles,
        loading: false,
        refreshing: false
      });
    }).then(res => {
      //console.log(this.state.data);
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

  handleIndexChange = (index) => {
    this.setState({
      ...this.state,
      selectedTab: index,
    });
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
            marginTop: 0,
            backgroundColor: 'transparent'
          }}
        >
          <FlatList
            data={this.state.data}
            numColumns={1}
            renderItem={({ item }) => (
              <TouchableWithoutFeedback onPress={() => this.openArticle(item)} style={{}}>
                <View style={{flex:1, margin:3, borderRadius:5, shadowColor: '#000000', shadowOffset: {width: 0, height: 1}, shadowRadius: 2, shadowOpacity: 1.0}}>
                  {
                    item.urlToImage === null || item.urlToImage === "" ? (
                      <Image
                        source={{ uri: testImage }}
                        style={{ resizeMode: 'cover', height: 200, width: 350, flex: 1, borderRadius:5}}
                      />
                    ) : (
                      <Image
                        source={{ uri: item.urlToImage }}
                        style={{ resizeMode: 'cover', height: 200, width: 350, flex: 1, borderRadius:5}}
                      />
                    )
                  }
                  <View style={{ position: 'absolute', left:0, bottom: 0, right:0}}>
                    <View style={{opacity:1, position: 'absolute', left: 0, bottom: 0, right:0, padding:5}}>
                      <View style={{opacity: 0.6, backgroundColor: 'black', position: 'absolute', left: 0, top: 0, bottom:0, right:0, borderBottomLeftRadius:5, borderBottomRightRadius:5}}/>
                      <View style={{flexDirection:'row', justifyContent:'flex-start'}}>
                        {
                          item.urlToImage === null || item.urlToImage === "" ? (
                            <Thumbnail source={{ uri: testImage }} />
                          ) : (
                            <Thumbnail source={{ uri: item.urlToImage }} />
                          )
                        }
                        <View style={{flexDirection:'row', flex:1, justifyContent:'flex-start', paddingLeft:10}}>
                          <View style={{flexDirection:'column', justifyContent:'space-between'}}>
                            <View style={{}}>
                              <Text style={{color:'white'}}>
                                {item.title || 'No title available'}
                              </Text>
                            </View>
                            <View style={{flexDirection:'row', justifyContent:'space-between'}}>
                              <Text note>{item.source || item.author || 'No publisher available'}</Text>
                            </View>
                          </View>
                        </View>
                      </View>
                    </View>
                  </View>
                </View>
              </TouchableWithoutFeedback>
            )}
            horizontal={true}
            keyExtractor={item => item.id}
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

  renderList = (columns, data) => {
    return(
    <List
      containerStyle={{
      borderTopWidth: 0,
      borderBottomWidth: 0,
      flex: 1,
      marginTop: 0,
      marginHorizontal:3,
      backgroundColor:'transparent',
    }}
    >
      <FlatList
        data={data}
        key={(this.state.orientation === 'portrait' ? 'portrait' : 'landscape')}
        numColumns={columns}
        renderItem={({ item }) => (
          <TouchableWithoutFeedback onPress={() => this.openArticle(item)} style={{}}>
            <View style={{flex:1, margin:3, borderRadius:5, shadowColor: '#000000', shadowOffset: {width: 0, height: 1}, shadowRadius: 2, shadowOpacity: 1.0}}>
              {
                item.urlToImage === null || item.urlToImage === "" ? (
                  <Image
                    source={{ uri: testImage }}
                    style={{ resizeMode: 'cover', height: 200, width: null, flex: 1, borderRadius:5}}
                  />
                ) : (
                  <Image
                    source={{ uri: item.urlToImage }}
                    style={{ resizeMode: 'cover', height: 200, width: null, flex: 1, borderRadius:5}}
                  />
                )
              }
              <View style={{ position: 'absolute', left:0, bottom: 0, right:0}}>
                <View style={{opacity:1, position: 'absolute', left: 0, bottom: 0, right:0, padding:5}}>
                  <View style={{opacity: 0.6, backgroundColor: 'black', position: 'absolute', left: 0, top: 0, bottom:0, right:0, borderBottomLeftRadius:5, borderBottomRightRadius:5}}/>
                  <View style={{flexDirection:'row', justifyContent:'flex-start'}}>
                    {
                      item.urlToImage === null || item.urlToImage === "" ? (
                        <Thumbnail source={{ uri: testImage }} />
                      ) : (
                        <Thumbnail source={{ uri: item.urlToImage }} />
                      )
                    }
                    <View style={{flexDirection:'row', flex:1, justifyContent:'flex-start', paddingLeft:10}}>
                      <View style={{flexDirection:'column', justifyContent:'space-between'}}>
                        <View style={{}}>
                          <Text style={{color:'white'}}>
                            {item.title || 'No title available'}
                          </Text>
                        </View>
                        <View style={{flexDirection:'row', justifyContent:'space-between'}}>
                          <Text note>{item.source || item.publishedAt || 'No time available'}</Text>
                        </View>
                      </View>
                    </View>
                  </View>
                </View>
              </View>
            </View>
          </TouchableWithoutFeedback>
        )}
        keyExtractor={item => item.id}
        //ItemSeparatorComponent={this.renderSeparator}
        ListHeaderComponent={
          this.state.orientation === 'portrait' ? (
            this.renderHeader
           ) : null
        }
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
    this.setState({ currentArticle: item.url })
    console.log('Status: ' + this.state.orientation);
    if(this.state.orientation === 'portrait'){
      console.log(item.url)
      this.props.navigation.navigate('Details', item);
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
      <ImageBackground source={{uri:'https://images.pexels.com/photos/255379/pexels-photo-255379.jpeg?w=1260&h=750&dpr=2&auto=compress&cs=tinysrgb'}} style={{width: '100%', height: '100%'}}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "flex-start",
            flex: 1,
            opacity: 1
          }}
        >
          <View style={{ flex: 1 }}>
            {
              this.state.orientation === 'portrait' && this.state.devicetype === 'tablet' ? this.renderList(2, this.state.data) : null
            }
            {
              this.state.orientation === 'portrait' && this.state.devicetype === 'phone' ? this.renderList(1, this.state.data) : null
            }
            {
            this.state.orientation === 'landscape' ? (
              <SegmentedControlTab
                values={['Local News', 'Other News']}
                selectedIndex={this.state.selectedTab}
                onTabPress={this.handleIndexChange}
                tabsContainerStyle={{padding:5}}
              />
              ) : null
            }
            {
              this.state.orientation === 'landscape' ? (
                this.renderList(1, this.state.data)
                ) : null
            }
          </View>
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
            this.state.orientation === 'landscape' && this.state.currentArticle !== null ? (
              <View style={{flex:1.5}}>
                <WebView
                  source={{uri: this.state.currentArticle}}
                />
              </View>
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
      </ImageBackground>        
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
