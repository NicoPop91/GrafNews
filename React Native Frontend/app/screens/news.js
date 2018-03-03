import React, { Component } from 'react';
import { AppRegistry, View, StyleSheet, TextInput, Alert, Dimensions, Image, ScrollView, TouchableHighlight, RefreshControl, FlatList, Linking, TouchableOpacity, ActivityIndicator, Platform} from 'react-native';
import { List, ListItem, SearchBar, SocialIcon, Header, ButtonGroup, Button } from "react-native-elements";
import { RkCard, RkText, RkButton } from "react-native-ui-kitten";
import { DeckSwiper, CardItem, Card, Right, Left, Thumbnail, Body, Icon, Text } from "native-base"
const Orientation = require('../config/orientation.js');

//------------------------------------------------------------------------------

export default class News extends Component {

  constructor(props) {
    super(props);

    this.state = {
        data: [],
        orientation: Orientation.isPortrait() ? 'portrait' : 'landscape',
        devicetype: Orientation.isTablet() ? 'tablet' : 'phone',
        refreshing: false,
        loading: false,
        data: [],
        page: 1,
        seed: 1,
        error: null,
        refreshing: false
    };

    // Event Listener for orientation changes
    Dimensions.addEventListener('change', () => {
        this.setState({
            orientation: Orientation.isPortrait() ? 'portrait' : 'landscape'
        });
        dimensions = Dimensions.get('window');
        this.forceUpdate();
    });
  }

  componentDidMount() {
    this.makeRemoteRequest();
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
          height: 1,
          backgroundColor: "#CED0CE",
        }}
      />
    );
  };

  renderHeader = () => {
    return(
    <View style={{}}>
      <Text style={{fontWeight:'bold', fontSize:26, paddingLeft:10}}>
        Local News
      </Text>
      <List containerStyle={{ borderTopWidth: 0, borderBottomWidth: 0, flex:1, marginTop:0}}>
        <FlatList
          data={this.state.data}
          renderItem={({ item }) => (
            <TouchableHighlight onPress={()=>this.openArticle(item)}>
              <Card>
                <CardItem>
                  <Left>
                    <Thumbnail source={{uri: item.picture.thumbnail}} />
                    <Body>
                      <Text>{item.name.first} {item.name.last}</Text>
                      <Text note>{item.gender}</Text>
                    </Body>
                  </Left>
                </CardItem>
                <CardItem cardBody>
                  <Image source={{uri: item.picture.large}} style={{height: 150, width: null, flex: 1}}/>
                </CardItem>
                <CardItem>
                  <Left>
                  </Left>
                  <Body>
                  </Body>
                  <Right>
                    <Text>{item.location.state}</Text>
                  </Right>
                </CardItem>
              </Card>
            </TouchableHighlight>
          )}
          horizontal={true}
          keyExtractor={item => item.email}
          ItemSeparatorComponent={this.renderSeparator}
          ListFooterComponent={this.renderFooter}
          onEndReached={this.handleLoadMore}
          onEndReachedThreshold={50}
        />
      </List>
      <Text style={{fontWeight:'bold', fontSize:26, paddingLeft:10}}>
        Other News
      </Text>
    </View>
    )
  };

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
  }*/

  //refresh the current view
  _onRefresh = () => {
      this.setState({refreshing: true});
      this.fetchData().then(() => {
      this.setState({refreshing: false});
    })
  }

  /*componentWillMount() {
    this.fetchData();
  }*/

  openLink = (link) => {
    Linking.canOpenURL(link).then(supported => {
      if (supported) {
        Linking.openURL(link);
      } else {
        console.log("Don't know how to open URI: " + link);
      }
    });
  }

  openArticle = (item) => {
    this.props.navigation.navigate('Details', item);
  }

  random = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  render() {
    const currentdate = new Date()
    const days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday']
    const months = ['January','February','March','April','May','June','July','August','September','October','November','December']
    return(
      <View style={{flexDirection:'column', justifyContent:'flex-start', flex:1, backgroundColor:'white'}}>
        <View style={{flex:1}}>
          <List containerStyle={{ borderTopWidth: 0, borderBottomWidth: 0, flex:1, marginTop:0}}>
              <FlatList
                data={this.state.data}
                renderItem={({ item }) => (
                  <View>
                    <RkCard rkType='heroImage shadowed'>
                        <View>
                          <Image rkCardImg source={{uri:item.picture.large}}/>
                          <View rkCardImgOverlay style={styles.overlay}>
                            <View style={{marginBottom: 20}}>
                              <RkText rkType='header xxlarge' style={{color: 'white'}}>{item.name.first} {item.name.last}</RkText>
                              <RkText rkType='subtitle' style={{color: 'white'}}>Subtitle</RkText>
                            </View>
                            <View style={styles.footerButtons}>
                              <RkButton rkType='clear' style={{marginRight: 16}}>share</RkButton>
                              <RkButton rkType='clear ' onPress={()=>this.openArticle(item)}>read more</RkButton>
                            </View>
                          </View>
                        </View>
                      </RkCard>
                  </View>
                )}
                keyExtractor={item => item.email}
                ItemSeparatorComponent={this.renderSeparator}
                ListHeaderComponent={this.renderHeader}
                ListFooterComponent={this.renderFooter}
                onRefresh={this.handleRefresh}
                refreshing={this.state.refreshing}
                onEndReached={this.handleLoadMore}
                onEndReachedThreshold={50}
              />
          </List>
        </View>
      </View>
    );
  }
}

//------------------------------------------------------------------------------

const styles = StyleSheet.create({
  screen: {
    backgroundColor: '#f0f1f5',
    padding: 12
  },
  buttonIcon: {
    marginRight: 7,
    fontSize: 19.7,
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
    color: '#0000008e',
    marginLeft: 2.5,
    marginVertical: 10,
  },
  floating: {
    width: 56,
    height: 56,
    position: 'absolute',
    zIndex: 200,
    right: 16,
    top: 173,
  },
  footerButtons: {
    flexDirection: 'row'
  },
  overlay: {
    justifyContent: 'flex-end',
    paddingVertical: 23,
    paddingHorizontal: 16
  }
});