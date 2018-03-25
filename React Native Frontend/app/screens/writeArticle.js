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
import RNGooglePlacePicker from 'react-native-google-place-picker';
import { ImagePicker } from 'expo';

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
  longitude: t.Number,
  latitude: t.Number,
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

function template(locals) {
  // in locals.inputs you find all the rendered fields
  return (
    <View>
      {locals.inputs.title}
      {locals.inputs.text}
      {locals.inputs.author}
      {locals.inputs.date}
      {locals.inputs.url}
      <View style={{flexDirection: 'row'}}>
        <View style={{flex: 1}}>
          {locals.inputs.longitude}
        </View>
        <View style={{flex: 1}}>
          {locals.inputs.latitude}
        </View>
      </View>
      {/*<TouchableHighlight style={styles.button} onPress={null} underlayColor='#99d9f4'>
          <Text style={styles.buttonText}>{}</Text>
  </TouchableHighlight>*/}
      {locals.inputs.category}
      {locals.inputs.language}
      {locals.inputs.country}
      {locals.inputs.urlToImage}
    </View>
  );
};

const stylesheet = _.cloneDeep(t.form.Form.stylesheet);

stylesheet.fieldset = {
  flexDirection: 'row'
};
stylesheet.formGroup.normal.flex = 1;
stylesheet.formGroup.error.flex = 1;

const options = {
  template: template,
  fields: {
    title: {
      error: 'Please provide a title'
    },
    text: {
      error: 'Please provide a text',
      multiline: true,
      stylesheet: {
        ...Form.stylesheet,
        textbox: {
            ...Form.stylesheet.textbox,
            normal: {
              ...Form.stylesheet.textbox.normal,
              height: 150
            },
            error: {
              ...Form.stylesheet.textbox.error,
              height: 150
          }
        }
      }
    },
    author: {
      error: 'Please provide your name',
    },
    url: {
      error: 'Please provide the url to your article',
    },
    longitude: {
      error: 'Please provide a valid longitude',
    },
    latitude: {
      error: 'Please provide a valid latitude',
    },
    category: {
      error: 'Please select on of the categories',
    },
  },
};

let _this = null;
const testImage= 'https://source.unsplash.com/random';

export default class WriteArticle extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value:null,
      image:testImage,
      latitude:null,
      longitude:null,
      location:null
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

  getInitialState() {
    return {
      value: {
        longitude: this.state.longitude,
        latitude: this.state.latitude
      }
    };
  };

  async componentDidMount() {
    _this = this;
    this.refs.form.getComponent('title').refs.input.focus();
    this.getGeoLocation();
  }

  sumbit = (value) => {
    console.log("Trying to submit " + value.author + "; " + value.title + "; " + value.text + "; " + value.url + "; " + value.urlToImage + "; " + value.category + "; " + value.language + "; " + value.country + "; " + value.date.toISOString() );
    const fetch = createApolloFetch({
      uri: 'http://9p7wpw3ppo75fifx.myfritz.net:4000/graphql',
    });
    fetch({
      query: 'mutation {addArticle(author:"' + value.author + '" title:"' + value.title + '" description:"' + value.text +  '" url:"' + value.url + '" urlToImage:"' + value.urlToImage + '" category:"' + value.category + '" language:"' + value.language + '" country:"' + value.country + '" publishedAt:"' + value.date.toISOString() + '" publishedByUser:true geotype:"Point" lat:"' + value.latitude + '" lng:"' + value.longitude + '") { id }}'
    })
    .then(respnse => {
      console.log('Article was generated with id ', respnse.data)
      console.log('Error ', respnse.errors)
    })
    .catch(error => {
      console.log('Error while submitting article: ' + error);
    });
  };

  showLocation() {
    RNGooglePlacePicker.show((response) => {
      if (response.didCancel) {
        console.log('User cancelled GooglePlacePicker');
      }
      else if (response.error) {
        console.log('GooglePlacePicker Error: ', response.error);
      }
      else {
        this.setState({
          location: response
        });
      }
    })
  }

  getGeoLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        console.log('Inside geo determination: ' + position.coords.latitude + ' ' + position.coords.longitude)
        this.setState({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          value: {
            "longitude": position.coords.longitude,
            "latitude": position.coords.latitude
          },
          geoError: null,
        });
      },
      (error) => this.setState({ geoError: error.message }),
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 },
    );
    console.log('Finish geo determination: ' + this.state.latitude + ' ' + this.state.longitude)
  };

  onChange(value) {
    if(value.text){
      value.text = value.text.replace(/[\r\n]+/g," ");
    }
    //console.log(value);
    if(validUrl.isWebUri(value.urlToImage)){
      this.setState({ value });
      this.setState({ image:value.urlToImage });
    } else {
      value.urlToImage = testImage;
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

  _pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [4, 3],
    });

    console.log(result);

    if (!result.cancelled) {
      this.setState({ image: result.uri });
    }
  };

  render() {
    let { image } = this.state;
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
            style={{ alignSelf:'center', resizeMode: 'cover', height: 150, width:267, flex: 1, borderRadius:5}}
          />
          {/*<TouchableOpacity onPress={() => this.showLocation(_this)}>
            <Text style={{fontSize: 20, fontWeight:'bold'}}>
              Click me to push Google Place Picker!
            </Text>
          </TouchableOpacity>
          <Text style={{color: 'black', fontSize: 15}}>
            {JSON.stringify(this.state.location)}
          </Text>*/}
          <View style={{flexDirection:'row', justifyContent:'center'}}>
            <TouchableHighlight style={styles.button} onPress={() => this.props.navigation.navigate('Camera')} underlayColor='#99d9f4'>
              <Text style={styles.buttonText}>Take a picture</Text>
            </TouchableHighlight>
            <TouchableHighlight style={styles.button} onPress={this._pickImage} underlayColor='#99d9f4'>
              <Text style={styles.buttonText}>Pick an image</Text>
            </TouchableHighlight>
          </View>
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
    alignSelf: 'center',
    paddingHorizontal: 10
  },
  button: {
    height: 36,
    backgroundColor: '#48BBEC',
    borderColor: '#48BBEC',
    borderWidth: 1,
    borderRadius: 8,
    margin:10,
    justifyContent: 'center'
  }
});
