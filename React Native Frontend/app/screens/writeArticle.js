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
  Image
} from "react-native";
import { Divider, Icon, Button } from "react-native-elements";
import ViewPhotos from "./viewPhotos";
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
const { createApolloFetch } = require('apollo-fetch');

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
      language: null,
      category: null,
      country: null,
      date: null,
      photos: null
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
            console.log("xxx");
          }}
        />
      ),
      style: {
        marginTop: Platform.OS === "android" ? 24 : 0
      }
    };
  };

  sumbit = () => {
    console.log("Trying to submit " + this.state.author + "; " + this.state.title + "; " + this.state.text + "; " + this.state.url + "; " + this.state.image + "; " + this.state.category + "; " + this.state.language + "; " + this.state.country + "; " + this.state.date );
    const fetch = createApolloFetch({
      uri: 'http://9p7wpw3ppo75fifx.myfritz.net:4000/graphql',
    });
    fetch({
      query: 'mutation {addArticle(author: ${this.state.author || undefined} title: ${this.state.title || undefined} description: ${this.state.text || undefined} url: ${this.state.url || undefined} urlToImage: ${this.state.image || undefined} category: ${this.state.category || undefined} language: ${this.state.language || undefined} country: ${this.state.country || undefined} publishedAt: ${this.state.date || undefined}) { id }}'
    })
    .then(respnse => {
      console.log('Article was generated with id ' + respnse.data.addArticle.id)
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

  render() {
    return (
      <View style={{ padding: 20 }}>
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
          onChangeText={author => this.setState({ author })}
          value={this.state.author}
          placeholderTextColor={"grey"}
          allowFontScaling={true}
          placeholder={"Author ..."}
          maxHeight={400}
          multiline={false}
        />
        <Divider style={{ height: 20, backgroundColor: "transparent" }} />
        <TextInput
          style={{ borderColor: "gray", borderWidth: 0}}
          onChangeText={image => this.setState({ image })}
          value={this.state.image}
          placeholderTextColor={"grey"}
          allowFontScaling={true}
          placeholder={"URL to image ..."}
          maxHeight={400}
          multiline={false}
        />
        <Divider style={{ height: 20, backgroundColor: "transparent" }} />
        <Button
          title={"Submit"}
          onPress={() => {this.sumbit()}}
        />
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
