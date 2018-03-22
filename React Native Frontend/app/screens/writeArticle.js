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
import { gql } from 'graphql-tag';
import DatePicker from 'react-native-datepicker';
const { createApolloFetch } = require('apollo-fetch');
var moment = require('moment');
var validUrl = require('valid-url');
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
  url: t.String,
  category: Category,
  language: t.maybe(Language),
  country: t.maybe(Country),
  urlToImage: t.maybe(t.String)
});

const categories = ['general', 'business', 'entertainment', 'health', 'science', 'sports', 'technology'];
const countries = ['de', 'us', 'gb'];
const languages = ['de', 'en'];
const label_categories = ['General', 'Business', 'Entertainment', 'Health', 'Science', 'Sports', 'Technology'];
const label_countries = ['Germany', 'United States', 'Great Britain'];
const label_languages = ['German', 'English'];

const stylesheet = _.cloneDeep(t.form.Form.stylesheet);
stylesheet.textbox.normal.height = 150;

const options = {
  fields: {
    title: {
      error: 'Please provide a title'
    },
    text: {
      error: 'Please provide a text',
      multiline: true,
      stylesheet: stylesheet
    },
    author: {
      error: 'Please provide your name',
    },
    url: {
      error: 'Please provide the url to your article',
    },
    category: {
      error: 'Please select on of the categories',
    },
  },
};

let _this = null;
const testImage= 'https://upload.wikimedia.org/wikipedia/commons/b/bf/Test_card.png';

export default class WriteArticle extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value:null,
      image:testImage
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
            _this.onPress();
          }}
          color="#007AFF"
        />
      ),
      style: {
        marginTop: Platform.OS === "android" ? 24 : 0
      }
    };
  };

  componentDidMount() {
    _this = this;
    this.refs.form.getComponent('title').refs.input.focus();
  }

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
   // this.setState({ value });
    console.log(value);
    if(validUrl.isWebUri(value.urlToImage)){
      console.log('the image url was ok');
      this.setState({ value });
      this.setState({ image:value.urlToImage });
    } else {
      value.urlToImage = testImage;
      console.log('the image url was not ok');
      this.setState({ value });
    }
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

  /*drawImage() {
    if(this.state.value !== null) {
      if(validUrl.isUri(this.state.value.urlToImage)) {
        return (<Image
                source={{ uri: this.state.value.urlToImage }}
                style={{ resizeMode: 'cover', height: 200, width: 350, flex: 1, borderRadius:5}}
               />)
      }
    } else {
      return (<Image
              source={{ uri: testImage }}
              style={{ resizeMode: 'cover', height: 200, width: 350, flex: 1, borderRadius:5}}
            />)
    }
  };*/

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
          <Image
            source={{ uri: this.state.image }}
            style={{ resizeMode: 'cover', height: 200, flex: 1, borderRadius:5}}
          />
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
