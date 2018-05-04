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
  ImageBackground,
  AsyncStorage
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
import {
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
import SegmentedControlTab from 'react-native-segmented-control-tab';
import { Font, Notifications, Permissions } from 'expo';
import DropdownAlert from 'react-native-dropdownalert';
import { lang } from "moment";
import Storage from 'react-native-storage';
const Device = require("react-native-device-detection");
const Orientation = require("../config/orientation.js");
const { createApolloFetch } = require('apollo-fetch');

//------------------------------------------------------------------------------

const testImage = 'https://upload.wikimedia.org/wikipedia/commons/b/bf/Test_card.png';
const thumbnail = 'https://www.newsmediaalliance.org/wp-content/uploads/2017/08/SRNcircleavatar.png';
const thumbnail_fake = 'https://cdn0.tnwcdn.com/wp-content/blogs.dir/1/files/2017/04/fake-news-2127597_1280-796x796.png';

//global.catChanged = false;
//global.otherNewsArray = [];
//global.localNewsArray = [];

global.storage = new Storage({
	size: 1000,
	storageBackend: AsyncStorage,
	defaultExpires: null,
	enableCache: true,
	sync : {
	}
});

/*global.getCurrentCategories = () => {
  storage.load({
    key: 'subscriptions',
    autoSync: true,
    syncInBackground: true,
    syncParams: {
      extraFetchOptions: {
      },
      someFlag: true,
    },
  }).then(ret => {
    console.log(ret);
    global.categories = ret;
  }).catch(err => {
    global.categories = [
      {"id": 1, "cat": "general", "subscribed": true},
      {"id": 2, "cat": "business", "subscribed": false},
      {"id": 3, "cat": "entertainment", "subscribed": false},
      {"id": 4, "cat": "health", "subscribed": false},
      {"id": 5, "cat": "science", "subscribed": false},
      {"id": 6, "cat": "sports", "subscribed": false},
      {"id": 7, "cat": "technology", "subscribed": false}
      ];
  })
}*/

global.getCurrentCategory = () => {
  storage.load({
    key: 'category',
    autoSync: true,
    syncInBackground: true,
    syncParams: {
      extraFetchOptions: {
      },
      someFlag: true,
    },
  }).then(ret => {
    console.log(ret);
    global.category = ret;
  }).catch(err => {
    global.category = 'general';
  })
}

global.getCurrentLanguage = () => {
  storage.load({
    key: 'language',
    autoSync: true,
    syncInBackground: true,
    syncParams: {
      extraFetchOptions: {
      },
      someFlag: true,
    },
  }).then(ret => {
    console.log(ret);
    global.language = ret;
  }).catch(err => {
    global.language = "";
  })
}

global.getCurrentCountry = () => {
  storage.load({
    key: 'country',
    autoSync: true,
    syncInBackground: true,
    syncParams: {
      extraFetchOptions: {
      },
      someFlag: true,
    },
  }).then(ret => {
    console.log(ret);
    global.country = ret;
  }).catch(err => {
    global.country = "";
  })
}

if(global.category === undefined) {
  global.getCurrentCategory(); 
  global.getCurrentCountry();
  global.getCurrentLanguage();
}


export default class News extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: [],
      localData: [],
      otherData: [],
      orientation: Orientation.isPortrait() ? "portrait" : "landscape",
      devicetype: Device.isPhone ? "phone" : "tablet",
      refreshing: false,
      loading: false,
      error: null,
      latitude: null,
      longitude: null,
      geoError: null,
      componentDidMount: false,
      currentArticleURL: null,
      currentArticleDescription: null,
      currentArticleAuthor: null,
      currentArticleDate: null,
      currentArticlePublishedByUser: null,
      selectedTab: 0,
      notification: {},
      image: 'https://source.unsplash.com/random',
      geo: null,
      geoAvailable: false,
      lastUpdate: new Date,
      localLoaded: false,
      otherLoaded: false
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
  //  if(!Device.isIos && !Orientation.isPortrait()) {
  //    return {
  //      header: null

  //  }
    
  //} else {
    return {
      title: 'Write Article',
      headerRight: (
          <Icon
            name="message"
            onPress={() => navigation.navigate('WriteArticle')}
            color="#007AFF"
          />
      )
      
  }
  //}
  }
  
  async componentDidMount() {

    await this.getGeoLocation();
    await Font.loadAsync({
      'OldLondon': require('../../assets/fonts/OldLondon.ttf'),
    });
    await Font.loadAsync({
      'MoonGet': require('../../assets/fonts/moon_get-Heavy.ttf'),
    });
    this.reloadNews();
    this.setState({ componentDidMount: true });
  }

  async reloadNews () {
    await this.getGeoLocation();
    await this.makeRemoteRequest(true, global.category, global.country, global.language);
    await this.makeRemoteRequest(false, global.category, global.country, global.language);
  }

  componentWillMount() {
    //this.registerForPushNotificationsAsync();
    //this._notificationSubscription = Notifications.addListener(this._handleNotification);
  }

  _handleNotification = (notification) => {
    this.setState({notification: notification});
  };

  /*async registerForPushNotificationsAsync() {
    const { status: existingStatus } = await Permissions.getAsync(
      Permissions.NOTIFICATIONS
    );
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      return;
    }
    let token = await Notifications.getExpoPushTokenAsync();
    //console.log("Trying to submit " + token );
    const fetch = createApolloFetch({
      uri: global.serverurl,
    });
    fetch({
      query: 'mutation {push(token:"' + token + '") { status }}'
    })
    .then(respnse => {
      //console.log('Status ' + respnse.data.push.status)
    })
    .catch(error => {
      Alert.alert('Error', 'Error during registartion for notifications\n'+JSON.stringify(error)+'\n'+this.randomMessage(), 'OK');
      console.log('Error while submitting: ' + error);
    });  
  }*/

  makeRemoteRequest = (local, category, country, language, date, loadMore) => {
    if(date == undefined){
      date = new Date;
      date = date.toISOString();
    }else{
      date = date.toISOString();
    }
    if(category == undefined){
      category = 'null';
    }else{
      category = "\"" + category + "\"";
    }
    if(country == undefined || country === ""){
      country = 'null';
    }else{
      country = "\"" + country + "\"";
    }
    if(language == undefined || language === ""){
      language = 'null';
    }else{
      language = "\"" + language + "\"";
    }
    if(local){
      var query = '{articles(date:"'+date+'", publishedByUser:true, category:'+category+', country:'+country+', language:'+language+', lng:"'+ this.state.longitude +'", lat:"'+ this.state.latitude +'"){id author title description url urlToImage category language country publishedAt publishedByUser}}';
    }else{
      var query = '{articles(date:"'+date+'", publishedByUser:false, category:' + category + ', country:'+country+', language:'+language+'){id author title description url urlToImage category language country publishedAt publishedByUser}}';
    }
    console.log("make remote request query: " + query);
     const fetch = createApolloFetch({
       uri: global.serverurl,
     });
     fetch({
       query: query,
     })
     .then(res => {
       if(local){
        if(loadMore){
          this.setState({
            localData: [...this.state.localData, ...res.data.articles],
            loading: false,
            refreshing: false
          });
        }else{
          console.log(res);
          this.setState({
            localData: res.data.articles,
            loading: false,
            refreshing: false,
            lastUpdate: new Date,
            localLoaded: true
          });
        }
       }else{
        if(loadMore){
          this.setState({
            otherData: [...this.state.otherData, res.data.articles],
            loading: false,
            refreshing: false
          });
        }else{
          this.setState({
            otherData: res.data.articles,
            loading: false,
            refreshing: false,
            lastUpdate: new Date,
            otherLoaded: true
          });
        }
       }
     }).then(res => {
       console.log("Remote Request returned: " + JSON.stringify(res));
     })
     .catch(error => {
       Alert.alert('Error', 'Error during remote request\nStatus: '+JSON.stringify(error.response.status)+'\n'+this.randomMessage(), 'OK');
       this.setState({ error, loading: false });
       console.log(error);
     });
   };

   makeLocalRemoteRequest = () => {
    var date = new Date;
    var query = '{articles(date:"'+date.toISOString()+'", publishedByUser:true, lng:"'+ this.state.longitude +'", lat:"'+ this.state.latitude +'"){id author title description url urlToImage category language country publishedAt publishedByUser}}';
    console.log("makeLocalRemoteRequest query:" + query);
     const fetch = createApolloFetch({
       uri: global.serverurl,
     });
     fetch({
       query: query,
     })
     .then(res => {
       this.setState({
         localData: res.data.articles,
         loading: false,
         refreshing: false,
         lastUpdate: date
       });
     }).then(res => {
       //console.log(this.state.localData);
     })
     .catch(error => {
       this.setState({ error, loading: false });
       console.log(error);
     });
   };

   loadMoreMakeLocalRemoteRequest = (date) => {
    var query = '{articles(date:"'+date+'", publishedByUser:true, lng:"'+ this.state.longitude +'", lat:"'+ this.state.latitude +'"){id author title description url urlToImage category language country publishedAt publishedByUser}}';
    console.log("makeLocalRemoteRequest query:" + query);
     const fetch = createApolloFetch({
       uri: global.serverurl,
     });
     fetch({
       query: query,
     })
     .then(res => {
       this.setState({
         localData: [...this.state.localData, ...res.data.articles],
         loading: false,
         refreshing: false
       });
     }).then(res => {
       //console.log(this.state.localData);
     })
     .catch(error => {
       Alert.alert('Error', 'Error during remote request\nStatus: '+JSON.stringify(error.response.status)+'\n'+this.randomMessage(), 'OK');
       this.setState({ error, loading: false });
       console.log(error);
     });
   };

   makeOtherRemoteRequest = () => {
    var date = new Date;
    var query = '{articles(date:"'+date.toISOString()+'", publishedByUser:false){id author title description url urlToImage category language country publishedAt publishedByUser}}';
    console.log("makeOtherRemoteRequest query:" + query);
     const fetch = createApolloFetch({
       uri: global.serverurl,
     });
     fetch({
       query: query,
     })
     .then(res => {
       this.setState({
         otherData: res.data.articles,
         loading: false,
         refreshing: false,
         lastUpdate: date
       });
     }).then(res => {
       //console.log(this.state.otherData);
     })
     .catch(error => {
       this.setState({ error, loading: false });
       console.log(error);
     });
   };

   loadMoreMakeOtherRemoteRequest = (date) => {
    var query = '{articles(date:"'+date+'", publishedByUser:false){id author title description url urlToImage category language country publishedAt publishedByUser}}';
    console.log("makeOtherRemoteRequest query:" + query);
     const fetch = createApolloFetch({
       uri: global.serverurl,
     });
     fetch({
       query: query,
     })
     .then(res => {
       this.setState({
         otherData: [...this.state.otherData, res.data.articles],
         loading: false,
         refreshing: false
       });
     }).then(res => {
       //console.log(this.state.otherData);
     })
     .catch(error => {
       Alert.alert('Error', 'Error during remote request\nStatus: '+JSON.stringify(error.response.status)+'\n'+this.randomMessage(), 'OK');
       this.setState({ error, loading: false });
       console.log(error);
     });
   };

   makeGeoRemoteRequest = () => {
    var date = new Date;
    var query = '{geocode(lng:"' + this.state.longitude + '", lat:"' + this.state.latitude + '"){formattedAddress latitude longitude streetName city country country countryCode zipcode provider}}';
    console.log("makeGeoRemoteRequest query:" + query);
     const fetch = createApolloFetch({
       uri: global.serverurl,
     });
     fetch({
       query: query,
     })
     .then(res => {
       this.setState({
         geo: res.data.geocode,
         loading: false,
         refreshing: false,
         geoAvailable: true,
         lastUpdate: date
       });
     }).then(res => {
       //console.log(this.state.geo);
     })
     .catch(error => {
       Alert.alert('Error', 'Error during remote request\nStatus: '+JSON.stringify(error.response.status)+'\n'+this.randomMessage(), 'OK');
       this.setState({ error, loading: false });
       console.log(error);
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
        console.log("longitude: " + position.coords.longitude + " latitude: "+ position.coords.latitude);
        this.makeGeoRemoteRequest();
      },
      (error) => {this.setState({ geoError: error.message }), Alert.alert('Error', 'Error during geo determination\n'+JSON.stringify(error.response.status), 'OK')},
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 },
    );
  }

  randomMessage = () => {
    const messages = [
      'Ups, something went wrong',
      'I need healing!',
      'Have you tried turning it off and on again?',
      'Something does not seem to be working',
      'An error occured while displaying the previous error',
      'Its ok to have an error',
      'Task failed successfully!',
      'Run as fast as you can and dont look back!',
      'You really screwed up this time!',
      'Catastrophic failure',
      'Data packages went in the wrong direction',
      'Catastrophic byte storm',
      'Colateral collision'
    ]
    var number = Math.floor(Math.random() * (messages.length-1));
    //console.log('Message: ' + messages[number] + " " + number);
    return messages[number];
  }

  getTime = (publishedAt) => {
    var now = new Date().toISOString();
    var diffYears = null;
    var diffMonths = null;
    var diffDays = null;
    var diffHrs = null;
    var diffMins = null;
    var diffSecs = null;
    //console.log(now + " " + publishedAt);
    var nowSplit =  now.split("-");
    var paSplit =  publishedAt.split("-");
    if(nowSplit[0] >= paSplit[0]){
      diffYears = nowSplit[0]-paSplit[0]
    }
    if(nowSplit[1] >= paSplit[1]){
      diffMonths = nowSplit[1]-paSplit[1]
    }else{
      diffMonths = 12 - (paSplit[1]-nowSplit[1])
    }
    var nowSplit2 =  nowSplit[2].split("T");
    var paSplit2 =  paSplit[2].split("T");
    if(nowSplit2[0] >= paSplit2[0]){
      diffDays = nowSplit2[0]-paSplit2[0]
    }else{
      //Here we actually need to make a difference betwenn months with 28/30/31 days
      diffHrs = 30 - (paSplit2[0]-nowSplit2[0])
    }
    var nowSplit3 =  nowSplit2[1].split(":");
    var paSplit3 =  paSplit2[1].split(":");
    if(nowSplit3[0] >= paSplit3[0]){
      diffHrs = nowSplit3[0]-paSplit3[0]
    }else{
      diffHrs = 24 - (paSplit3[0]-nowSplit3[0])
    }
    if(nowSplit3[1] >= paSplit3[1]){
      diffMins = nowSplit3[1]-paSplit3[1]
    }else{
      diffMins = 60 - (paSplit3[1]-nowSplit3[1])
    }
    var difference = null;
    if(diffYears !== 0){
      difference = diffYears + " y "
    }
    if(diffMonths !== 0){
      difference = difference + diffMonths + " m "
    }
    if(diffDays !== 0){
      difference = difference + diffDays + " d "
    }
    if(diffHrs !== 0){
      difference = difference + diffHrs + " h "
    }
    difference = difference + diffMins + " m ago"
    //console.log(difference)
    return(difference);
  }

   handleRefresh = () => {
    this.setState(
      {
        refreshing: true,
        image: 'https://source.unsplash.com/random'
      },
      () => {
        this.reloadNews().then(()=>{this.setState({refreshing:false})});
      }
    );
  };

  /*handleLoadMore = (local) => {
    if(this.state.componentDidMount){
      if(local){
        if(this.state.localLoaded){
          var date = this.state.localData[this.state.localData.length-1].publishedAt;
        }else{
          return;
        }
        if(date == undefined){
          return;
        }
        date = new Date(date);
        date.setMinutes(date.getMinutes() - 1);
        date = new Date(date);
        date.toISOString();
        this.makeRemoteRequest(true, null, date, true);
      }else{
        if(this.state.otherLoaded){
          var date = this.state.otherData[this.state.otherData.length-1].publishedAt;
        }else{
          return;
        }
        if(date == undefined){
          return;
        }
        date = new Date(date);
        date.setMinutes(date.getMinutes() - 1);
        date = new Date(date);
        date.toISOString();
        this.makeRemoteRequest(false, null, date, true);
      }
    }
  };*/

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

  renderLisHeaderItem = (item) => {
    return (
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
                    <Thumbnail source={{ uri: thumbnail_fake }} />
                  )
                }
                <View style={{flexDirection:'column', flex:1, justifyContent:'space-between', paddingLeft:10}}>
                  <View style={{}}>
                    <Text style={{color:'white'}}>
                      {item.title || 'No title available'}
                    </Text>
                  </View>
                  <View style={{flexDirection:'row', justifyContent:'space-between'}}>
                    <Text note>{item.source || item.author || 'No publisher available'}</Text>
                    <Text note style={{}}>{this.getTime(item.publishedAt) || 'No time available'}</Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    )
  }

  renderListBodyItem = (item) => {
    return (
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
                    <Thumbnail source={{ uri: thumbnail }} />
                  ) : (
                    <Thumbnail source={{ uri: thumbnail }} />
                  )
                }
                <View style={{flexDirection:'column', flex:1, justifyContent:'space-between', paddingLeft:10}}>
                  <View style={{}}>
                    <Text style={{color:'white'}}>
                      {item.title || 'No title available'}
                    </Text>
                  </View>
                  <View style={{flexDirection:'row', justifyContent:'space-between'}}>
                    <Text note>{item.source || item.author || 'No publisher available'}</Text>
                    <Text note style={{}}>{this.getTime(item.publishedAt) || 'No time available'}</Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    )
  }

  renderHeader = () => {
    return (
      <View style={{}}>
        {
          this.state.componentDidMount ? (
            <View style={{flexDirection:'row', justifyContent:'space-between', paddingHorizontal: 3, paddingTop: 10}}>
              <View style={{backgroundColor:'rgba(0, 0, 0, 0.6)', borderRadius:5}}>
                <Text style={{ color:'white', fontWeight: "bold", fontFamily: "MoonGet", fontSize: 24, paddingHorizontal:10}}>
                  Fake News
                </Text>
              </View> 
            </View>
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
            data={this.state.localData}
            numColumns={1}
            renderItem={({ item }) => {
              if(item.publishedByUser === true){
                return(this.renderLisHeaderItem(item))
              } else {
                return(null)
              }
            }}
            horizontal={true}
            keyExtractor={item => item.id}
            //ItemSeparatorComponent={this.renderSeparator}
            ListFooterComponent={this.renderFooter}
            //onEndReached={this.handleLoadMore(true)}
            //onEndReachedThreshold={50}
          />
        </List>
        {
          this.state.componentDidMount ? (
            <View style={{flexDirection:'row', justifyContent:'space-between', paddingHorizontal: 3, paddingTop: 10}}>
              <View style={{backgroundColor:'rgba(0, 0, 0, 0.6)', borderRadius:5}}>
                <Text style={{ color:'white', fontWeight: "bold", fontFamily: "MoonGet", fontSize: 24, paddingHorizontal:10}}>
                  Real News
                </Text>
              </View> 
            </View>
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
        renderItem={({ item }) => {
          if(item.publishedByUser === false){
            return(this.renderListBodyItem(item))
          } else {
            return(null)
          }
        }}
        keyExtractor={item => item.id}
        //ItemSeparatorComponent={this.renderSeparator}
        ListHeaderComponent={
          this.state.orientation === 'portrait' ? (
            this.renderHeader
           ) : null
        }
        ListFooterComponent={this.renderFooter}
        //onRefresh={this.handleRefresh}
        refreshing={this.state.refreshing}
        refreshControl = {
        <RefreshControl
          refreshing = {this.state.refreshing}
          onRefresh = {this.handleRefresh.bind(this)}
        />
        }
        //onEndReached={this.handleLoadMore(false)}
        //onEndReachedThreshold={20}
      />
    </List>
    )
  }

  renderLandscapeList = (columns, data) => {

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
        renderItem={({ item }) => {
          if(item.publishedByUser === false){
            return(null)
          } else {
            return(this.renderListBodyItem(item))
          }
        }}
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
        //onEndReached={this.handleLoadMore(true)}
        //onEndReachedThreshold={50}
      />
    </List>
    )
  }

  renderFooter = () => {
    return null;
    /*if (!this.state.loading) return null;
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
    );*/
  };

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
    this.setState({ currentArticleURL: item.url, currentArticleDescription: item.description, currentArticleAuthor: item.author, currentArticleDate: item.publishedAt, currentArticlePublishedByUser: item.publishedByUser })
    //console.log('Status: ' + this.state.orientation);
    if(this.state.orientation === 'portrait'){
      item.longitude=this.state.longitude;
      item.latitude=this.state.latitude;
      console.log(JSON.stringify(item));
      this.props.navigation.navigate('Details', item);
    }
  };

  render() {
    return (
      <View>
        <ImageBackground source={{uri:this.state.image}} style={{width: '100%', height: '100%'}}>
          {/*<View style={{justifyContent: 'center', alignItems: 'center'}}>
            <Text>Origin: {this.state.notification.origin}</Text>
            <Text>Data: {JSON.stringify(this.state.notification.data)}</Text>
          </View>*/}
          {
          this.state.componentDidMount && this.state.geoAvailable && this.state.orientation === 'portrait' && this.state.lastUpdate && this.state.geo != null ? (
            <View style={{flexDirection:'row', justifyContent:'space-between', alignItems:'flex-start', padding: 5, backgroundColor:'rgba(220, 220, 220, 0.6)'}}>
              <Text style={{ color:'black', fontWeight: "bold", fontFamily: "MoonGet", fontSize: 16, paddingHorizontal:10}}>
                {this.state.geo[0].city}, {this.state.geo[0].countryCode}
              </Text>
              <Text style={{ color:'black', fontWeight: "bold", fontFamily: "MoonGet", fontSize: 16, paddingHorizontal:10}}>
                {this.state.lastUpdate.toLocaleTimeString()}
              </Text>
            </View>
            ) : (
              null
            )
          }
          {
          this.state.componentDidMount && this.state.geoAvailable && this.state.orientation === 'portrait' && this.state.lastUpdate && this.state.geo == null ? (
            <View style={{flexDirection:'row', justifyContent:'space-between', alignItems:'flex-start', padding: 5, backgroundColor:'rgba(220, 220, 220, 0.6)'}}>
              <Text style={{ color:'black', fontWeight: "bold", fontSize: 16, paddingHorizontal:10}}>
                Geo services are currently unavailable
              </Text>
              <Text style={{ color:'black', fontWeight: "bold", fontSize: 16, paddingHorizontal:10}}>
                {this.state.lastUpdate.toLocaleTimeString()}
              </Text>
            </View>
            ) : (
              null
            )
          }
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
                this.state.orientation === 'portrait' && this.state.devicetype === 'tablet' ? this.renderList(2, this.state.otherData) : null
              }
              {
                this.state.orientation === 'portrait' && this.state.devicetype === 'phone' ? this.renderList(1, this.state.otherData) : null
              }
              {
              this.state.orientation === 'landscape' ? (
                <SegmentedControlTab
                  values={['Fake News', 'Real News']}
                  selectedIndex={this.state.selectedTab}
                  onTabPress={this.handleIndexChange}
                  tabsContainerStyle={{padding:5}}
                />
                ) : null
              }
              {
                this.state.orientation === 'landscape' && this.state.selectedTab === 0 ? (
                    this.renderLandscapeList(1, this.state.localData)
                  ) : (
                    null
                  )
              }
              {
                this.state.orientation === 'landscape' && this.state.selectedTab === 1 ? (
                    this.renderList(1, this.state.otherData)
                  ) : (
                    null
                  )
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
              this.state.orientation === 'landscape' && this.state.currentArticleURL !== null && this.state.currentArticlePublishedByUser === true ? (
                <View style={{flex:1.5}}>
                  <View style={{flexDirection:'column', backgroundColor: "#CED0CE", opacity:0.6}}>
                    <View style={{flexDirection:'column'}}>
                      <Text style={{margin:10, fontSize:16}}>
                        {this.state.currentArticleDescription}
                      </Text>
                    </View>
                    <View style={{flexDirection:'row', justifyContent:'space-between'}}>
                      <Text style={{margin:10, color:'#696969', fontSize:12}}>
                        {this.state.currentArticleAuthor}
                      </Text>
                      <Text style={{margin:10, color:'#696969', fontSize:12}}>
                        {this.state.currentArticleDate.toLocaleString()}
                      </Text>
                    </View>
                  </View>
                  <WebView
                    source={{uri: this.state.currentArticleURL}}
                  />
                </View>
              ) : null
            }
            {
              this.state.orientation === 'landscape' && this.state.currentArticleURL !== null && this.state.currentArticlePublishedByUser === false ? (
                <View style={{flex:1.5}}>
                  <WebView
                    source={{uri: this.state.currentArticleURL}}
                  />
                </View>
              ) : null
            }
            {
              this.state.orientation === 'landscape' && this.state.currentArticleURL === null && this.state.componentDidMount ? (
                <View style={{flex: 1.5, flexDirection:'row', justifyContent:'center', paddingHorizontal: 3, paddingTop: 10, alignItems: 'center'}}>
                <View style={{backgroundColor:'rgba(0, 0, 0, 0.6)', borderRadius:5}}> 
                <Text style={{ color:'white', fontWeight: "bold", fontFamily: "MoonGet", fontSize: 16, paddingHorizontal:10, textAlign: 'center'}}>
                Select an article from the list to read it
                 </Text> 
                 </View> 
                 </View>
              ) : null
            }
          </View>   
        </ImageBackground>
        {/*<DropdownAlert
          ref={ref => this.dropdown = ref}
          containerStyle={{
            backgroundColor: MAIN_CUSTOM_COLOR,
          }}
          showCancel={true}
          onClose={data => this.handleClose(data)}
          onCancel={data => this.handleCancel(data)}
          imageSrc={'https://facebook.github.io/react-native/docs/assets/favicon.png'}
          renderImage={(props) => this.renderImage(props)}
          renderCancel={(props) => this.renderImage(props)}
        />*/}
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
