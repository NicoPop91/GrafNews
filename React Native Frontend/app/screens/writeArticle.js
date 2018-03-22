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
import t from 'tcomb-form-native';

const Form = t.form.Form;

var Category = t.enums({
  general: 'General',
  business: 'Business',
  entertainment: 'Entertainment',
  health: 'Health',
  science: 'Science',
  sports: 'Sports',
  technology: 'Technology'
});

var Language = t.enums({
  de: 'German',
  en: 'English'
});

var Country = t.enums({
  de: 'Germany',
  us: 'United States',
  gb: 'Great Britain'
});

Form.stylesheet.dateValue.normal.borderColor = '#d0d2d3';
Form.stylesheet.dateValue.normal.borderRadius = 3;
Form.stylesheet.dateValue.normal.borderWidth = 1;

var Article = t.struct({
  title: t.String,
  text: t.String,
  author: t.String,
  date: t.Date,
  category: Category,
  language: t.maybe(Language),
  country: t.maybe(Country),
  url: t.maybe(t.String),
  urlToImage: t.maybe(t.String)
});

const categories = ['general', 'business', 'entertainment', 'health', 'science', 'sports', 'technology'];
const countries = ['de', 'us', 'gb'];
const languages = ['de', 'en'];
const label_categories = ['General', 'Business', 'Entertainment', 'Health', 'Science', 'Sports', 'Technology'];
const label_countries = ['Germany', 'United States', 'Great Britain'];
const label_languages = ['German', 'English'];

const options = {
  fields: {
    title: {
      error: 'Please provide a title'
    },
    text: {
      error: 'Please provide a text'
    },
    author: {
      error: 'Please provide your name',
    },
  },
};

export default class WriteArticle extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value:null
    };
    this.onPress = this.onPress.bind(this);
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

  sumbit = (value) => {
    /*if(this.state.text !== null){
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
    }*/
    console.log("Trying to submit " + value.author + "; " + value.title + "; " + value.text + "; " + value.url + "; " + value.urlToImage + "; " + value.category + "; " + value.language + "; " + value.country + "; " + value.date.toISOString() );
    const fetch = createApolloFetch({
      uri: 'http://9p7wpw3ppo75fifx.myfritz.net:4000/graphql',
    });
    fetch({
      query: 'mutation {addArticle(author:"' + value.author + '" title:"' + value.title + '" description:"' + value.text +  '" url:"' + value.url + '" urlToImage:"' + value.urlToImage + '" category:"' + value.category + '" language:"' + value.language + '" country:"' + value.country + '" publishedAt:"' + value.date.toISOString() + '") { id }}'
    })
    .then(respnse => {
      console.log('Article was generated with id ', respnse.data)
      console.log('Error ', respnse.errors)
    })
    .catch(error => {
      console.log('Error while submitting article: ' + error);
    });
  };

  getInitialState() {
    return { value: null };
  }

  onChange(value) {
    this.setState({ value });
  };

  clearForm() {
    this.setState({ value: null });
  };

  onPress() {
    var value = this.refs.form.getValue();
    if (value) {
      console.log(value);
      this.sumbit(value);
      this.clearForm();
    }
  };

  render() {
    return (
      <View style={styles.container2}>
        <ScrollView>
          <Form 
            ref="form"
            type={Article}
            options={options}
            value={this.state.value}
            onChange={this.onChange.bind(this)}
          />
          <TouchableHighlight style={styles.button} onPress={this.onPress} underlayColor='#99d9f4'>
            <Text style={styles.buttonText}>Submit</Text>
          </TouchableHighlight>
        </ScrollView>
      </View>   
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  container2: {
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#ffffff',
  },
  title: {
    fontSize: 30,
    alignSelf: 'center',
    marginBottom: 30
  },
  buttonText: {
    fontSize: 18,
    color: 'white',
    alignSelf: 'center'
  },
  button: {
    height: 36,
    backgroundColor: '#48BBEC',
    borderColor: '#48BBEC',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 10,
    alignSelf: 'stretch',
    justifyContent: 'center'
  }
});
