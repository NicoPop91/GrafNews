import React, { Component } from "react";
import {
  AppRegistry,
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput,
  Platform,
  CameraRoll,
  TouchableHighlight,
  Image,
  Picker,
  ScrollView
} from "react-native";
import { Divider, Icon, Button } from "react-native-elements";
import ViewPhotos from "./viewPhotos";
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import DatePicker from 'react-native-datepicker';
const { createApolloFetch } = require('apollo-fetch');
var moment = require('moment');

export default class WriteArticle extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: null,
      text: null,
      image: null,
      showPhotoGallery: false,
      photoArray: [],
      author: null,
      url: null,
      language: 'de',
      category: 'general',
      country: 'de',
      photos: null,
      date: null,
      activeMenu: null
    };
  }

  static navigationOptions = ({ navigation }) => {
    return {
      title: "Write Article",
      headerRight: (
        <Icon
          name="send"
          onPress={() => {
            this.sumbit;
          }}
          color="#007AFF"
        />
      ),
      style: {
        marginTop: Platform.OS === "android" ? 24 : 0
      }
    };
  };

  sumbit = () => {
    if(this.state.text !== null){
      var text = this.state.text.replace(/\n/g, " ");
    }
    var v1 = this.state.date;
    var v2 = v1.split(' ');
    var v3 = v2[1].split(':');
    var date = null;
    if(v2[2] == 'pm'){
      var hour = parseInt(v3[0])
      hour = hour+12;
      date = v2[0]+"T"+hour+":"+v3[1]+":"+v3[2]+".000Z";
    } else {
      date = v2[0]+"T"+hour+":"+v3[1]+":"+v3[2]+".000Z";
    }
    console.log("Trying to submit " + this.state.author + "; " + this.state.title + "; " + text + "; " + this.state.url + "; " + this.state.image + "; " + this.state.category + "; " + this.state.language + "; " + this.state.country + "; " + date );
    const fetch = createApolloFetch({
      uri: 'http://9p7wpw3ppo75fifx.myfritz.net:4000/graphql',
    });
    fetch({
      query: 'mutation {addArticle(author:"' + this.state.author + '" title:"' + this.state.title + '" description:"' + text +  '" url:"' + this.state.url + '" urlToImage:"' + this.state.image + '" category:"' + this.state.category + '" language:"' + this.state.language + '" country:"' + this.state.country + '" publishedAt:"' + date + '") { id }}'
    })
    .then(respnse => {
      console.log('Article was generated with id ', respnse.data)
      console.log('Error ', respnse.errors)
    })
    .catch(error => {
      console.log('Error while submitting article: ' + error);
    });
  };

  getPhotosFromGallery() {
    CameraRoll.getPhotos({ first: 1000000 })
      .then(res => {
        let photoArray = res.edges;
        this.setState({ showPhotoGallery: true, photoArray: photoArray })
      })
  }

  setActiveMenu = (menu) => {
    this.setState({activeMenu:menu});
  }

  render() {
    const categories = ['general', 'business', 'entertainment', 'health', 'science', 'sports', 'technology'];
    const countries = ['de', 'us', 'gb'];
    const languages = ['de', 'en'];
    const label_categories = ['General', 'Business', 'Entertainment', 'Health', 'Science', 'Sports', 'Technology'];
    const label_countries = ['Germany', 'United States', 'Great Britain'];
    const label_languages = ['German', 'English'];
    return (
      <View>
        <ScrollView style={{ flexDirection:'column', padding: 20 }}>
          <TextInput
            style={{ borderColor: "gray", borderWidth: 0, fontSize: 24 }}
            onChangeText={title => this.setState({ title })}
            value={this.state.title}
            placeholderTextColor={"grey"}
            allowFontScaling={true}
            autoFocus={true}
            placeholder={"Title ..."}
            maxHeight={400}
            multiline={false}
          />
          <Divider style={{ height: 20, backgroundColor: "transparent" }} />
          <TextInput
            style={{ borderColor: "gray", borderWidth: 0 }}
            onChangeText={text => this.setState({ text })}
            value={this.state.text}
            placeholderTextColor={"grey"}
            allowFontScaling={true}
            placeholder={"Your text starts here ..."}
            maxHeight={400}
            multiline={true}
          />
          <Divider style={{ height: 20, backgroundColor: "transparent" }} />
          <TextInput
            style={{ borderColor: "gray", borderWidth: 0}}
            onChangeText={author => this.setState({ author: author })}
            value={this.state.author}
            placeholderTextColor={"grey"}
            allowFontScaling={true}
            placeholder={"Author ..."}
            maxHeight={400}
            multiline={false}
          />
          <Divider style={{ height: 20, backgroundColor: "transparent" }} />
          <View style={{flexDirection:'row'}}>
            <Button
              title={"Category"}
              onPress={() => {this.setActiveMenu('Category')}}
            />
            <Button
              title={"Language"}
              onPress={() => {this.setActiveMenu('Language')}}
            />
            <Button
              title={"Country"}
              onPress={() => {this.setActiveMenu('Country')}}
            />
          </View>
          <Divider style={{ height: 20, backgroundColor: "transparent" }} />
          <TextInput
            style={{ borderColor: "gray", borderWidth: 0}}
            onChangeText={url => this.setState({ url: url })}
            value={this.state.url}
            placeholderTextColor={"grey"}
            allowFontScaling={true}
            placeholder={"URL ..."}
            maxHeight={400}
            multiline={false}
          />
          <Divider style={{ height: 20, backgroundColor: "transparent" }} />
          <TextInput
            style={{ borderColor: "gray"}}
            onChangeText={image => this.setState({ image: image })}
            value={this.state.image}
            placeholderTextColor={"grey"}
            allowFontScaling={true}
            placeholder={"URL to image ..."}
            maxHeight={400}
            multiline={false}
          />
          <Divider style={{ height: 20, backgroundColor: "transparent" }} />
          {
            this.state.image !== null ? (
              <Image
                source={{ uri: this.state.image}}
              />
            ):(
              null
            )
          }
          <DatePicker
            style={{width: '100%'}}
            date={this.state.date}
            mode="datetime"
            placeholder="select date"
            format="YYYY-MM-DD hh:mm:ss a"
            confirmBtnText="Confirm"
            cancelBtnText="Cancel"
            customStyles={{
              dateIcon: {
                position: 'absolute',
                left: 0,
                top: 4,
                marginLeft: 0
              },
              dateInput: {
                marginLeft: 36
              },
              btnTextConfirm: {
                color: '#007AFF'
              }
            }}
            onDateChange={(date) => {this.setState({date: date})}}
          />
          <Divider style={{ height: 20, backgroundColor: "transparent" }} />
          <Button
            title={"Submit"}
            onPress={() => {this.sumbit()}}
          />
          <Divider style={{ height: 20, backgroundColor: "transparent" }} />
        </ScrollView>
        <View style={{borderWidth:0, backgroundColor:'grey'}}>
            { this.state.activeMenu === 'Category' ? (
              <Picker
                style={{flex:1, backgroundColor:'transparent'}}
                selectedValue={this.state.category}
                onValueChange={(itemValue,itemIndex) => this.setState({category:itemValue})}
                mode={'dialog'}
                prompt={'category'}
              >
                <Picker.Item label={label_categories[0]} value={categories[0]} />
                <Picker.Item label={label_categories[1]} value={categories[1]} />
                <Picker.Item label={label_categories[2]} value={categories[2]} />
                <Picker.Item label={label_categories[3]} value={categories[3]} />
                <Picker.Item label={label_categories[4]} value={categories[4]} />
                <Picker.Item label={label_categories[5]} value={categories[5]} />
                <Picker.Item label={label_categories[6]} value={categories[6]} />
              </Picker>
            ):(
              null
            )}

            { this.state.activeMenu === 'Language' ? (
              <Picker
                style={{flex:1, backgroundColor:'transparent'}}
                selectedValue={this.state.language}
                onValueChange={(itemValue,itemIndex) => this.setState({language:itemValue})}
                mode={'dialog'}
                prompt={'language'}
              >
                <Picker.Item label={label_languages[0]} value={languages[0]} />
                <Picker.Item label={label_languages[1]} value={languages[1]} />
              </Picker>
            ):(
              null
            )}

            { this.state.activeMenu === 'Country' ? (
              <Picker
                style={{flex:1, backgroundColor:'transparent'}}
                selectedValue={this.state.country}
                onValueChange={(itemValue,itemIndex) => this.setState({country:itemValue})}
                mode={'dialog'}
                prompt={'country'}
              >
                <Picker.Item label={label_countries[0]} value={countries[0]} />
                <Picker.Item label={label_countries[1]} value={countries[1]} />
                <Picker.Item label={label_countries[2]} value={countries[2]} />
              </Picker>
            ):(
              null
            )}
          </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
});
