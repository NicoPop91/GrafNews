import React, { Component } from 'react';
import { AppRegistry, Text, View, StyleSheet, TextInput, Alert, Dimensions, Image, ScrollView, RefreshControl, FlatList, Linking, TouchableOpacity, ActivityIndicator} from 'react-native';
import { List, ListItem, SearchBar, SocialIcon, Header, ButtonGroup, Button } from "react-native-elements";
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
        visible: false,
        pointer: '▶',
        loading: false,
        data: [],
        page: 1,
        seed: 1,
        error: null,
        refreshing: false,
        selectedIndex: 0
    };

    // Event Listener for orientation changes
    Dimensions.addEventListener('change', () => {
        this.setState({
            orientation: Orientation.isPortrait() ? 'portrait' : 'landscape'
        });
        dimensions = Dimensions.get('window');
        this.renderSeparator();
        this.forceUpdate();
    });

    this.updateIndex = this.updateIndex.bind(this)
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
    /*if(this.state.orientation == 'portrait'){
      return (
        <View
          style={{
            height: 1,
            width: "87%",
            backgroundColor: "#CED0CE",
            marginLeft: "13%"
          }}
        />
      );
    } else {
      return (
        <View
          style={{
            height: 1,
            width: "93%",
            backgroundColor: "#CED0CE",
            marginLeft: "7%"
          }}
        />
      );
    }*/
  };

  renderHeader = () => {
    return <View style={{flex:1, flexDirection:'row', justifyContent:'center'}}>
      <Text style={{fontWeight:'bold', fontSize:34, fontFamily:'Bodoni 72 Oldstyle'}}>GrafNews</Text>
    </View>

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

  // function to switch between the different arrow to read more or less
  showHideTextComponentView = () => {
      if(this.state.visible == true){
        this.setState({visible: false, pointer: '▶'})
      }else{
        this.setState({visible: true, pointer: '▼'})
      }
  }

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

  handleClick = () => {
    Linking.canOpenURL(this.props.url).then(supported => {
      if (supported) {
        Linking.openURL(this.props.url);
      } else {
        console.log("Don't know how to open URI: " + this.props.url);
      }
    })
  }

  updateIndex = (selectedIndex) => {
    this.setState({selectedIndex})
  }

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
    const buttons = ['📰 News', '⚙️ Settings', '📧 About']
    const selectedIndex = this.state.selectedIndex
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
                  <ListItem
                    roundAvatar
                    title={`${item.name.first} ${item.name.last}`}
                    subtitle={
                      <View style={{flexDirection:'column', paddingLeft: 10, paddingTop: 5}}>
                        <Text style={{color:'#808080'}}>
                          {item.email}
                        </Text>
                        <Text style={{color:'#808080'}}>
                          {days[currentdate.getDay()]} {currentdate.getDate()}. {months[currentdate.getMonth()]} {currentdate.getFullYear()} {currentdate.getHours()}:{currentdate.getMinutes()}
                        </Text>
                      </View>
                    }
                    avatar={{uri: item.picture.thumbnail}}
                    containerStyle={{ borderBottomWidth: 0 }}
                    onPress={() => this.openArticle(item)}
                  />
                  </View>
                )}
                keyExtractor={item => item.email}
                ItemSeparatorComponent={this.renderSeparator}
              //  ListHeaderComponent={this.renderHeader}
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

});
