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
  TouchableWithoutFeedback,
  Image,
  Picker,
  ScrollView,
  Alert
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
import { ImagePicker } from 'expo';
const Device = require("react-native-device-detection");

let _this = null;
const testImage = 'https://source.unsplash.com/random';
const testSite = 'https://en.wikipedia.org/wiki/Special:Random';

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
  url: t.maybe(t.String),
  longitude: t.Number,
  latitude: t.Number,
  adress: t.String,
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
      <View style={{flexDirection: 'row'}}>
        <View style={{flex: 4}}>
          {locals.inputs.adress}
        </View>
        <View style={{flex: 1, justifyContent:'center', alignItems:'center'}}>
          <TouchableWithoutFeedback onPress={()=>_this.handleGeo()}>
            <View>
             <Text style={{fontSize:48}}>🌍</Text>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </View>
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
    date:{
      mode: 'date',
      config: {
        format: (date) => moment(date).format('MMMM Do YYYY'),
      },
    }
  },
};

export default class WriteArticle extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value:null,
      image:testImage,
      latitude:null,
      longitude:null,
      location:null,
      easterEggCounter:0,
      easterEggActive:false,
      error:null,
      adress:null,
      site:testSite,
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
    await this.getGeoLocation();
  }

  makeGeoRemoteRequest = (adress, longitude, latitude) => {
    console.log("Granted values: " + adress + ", " + longitude + ", " + latitude);
    if(adress){
      var query = '{geocode(address:"' + adress + '"){formattedAddress latitude longitude streetName city country country countryCode zipcode provider}}';
    } else if(longitude && latitude){
      var query = '{geocode(lng:"' + longitude + '", lat:"' + latitude + '"){formattedAddress latitude longitude streetName city country country countryCode zipcode provider}}';
    } else if(!adress){
      var query = '{geocode(lng:"' + this.state.longitude + '", lat:"' + this.state.latitude + '"){formattedAddress latitude longitude streetName city country country countryCode zipcode provider}}';
    }
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
         adress: res.data.geocode[0].formattedAddress,
         longitude: res.data.geocode[0].longitude,
         latitude: res.data.geocode[0].latitude,
         value: {
          "adress": res.data.geocode[0].formattedAddress,
          "longitude": res.data.geocode[0].longitude,
          "latitude": res.data.geocode[0].latitude,
          "title": this.state.value.title,
          "text": this.state.value.text,
          "author": this.state.value.author,
          "date": this.state.value.date,
          "url": this.state.value.url,
          "category": this.state.value.category,
          "language": this.state.value.language,
          "country": this.state.value.country,
          "urlToImage": this.state.value.urlToImage
         },
       });
     }).then(res => {
       console.log("Returned values: " + this.state.adress + ", " + this.state.longitude + ", " + this.state.latitude);
       /*var value = this.state.value;
       value.adress = this.state.adress;
       value.longitude = this.state.longitude;
       value.latitude = this.state.latitude;
       console.log("Value: "+value);
       this.onChange(value);
       return this.state.adress;*/
     })
     .catch(error => {
       this.setState({error});
       console.log(error);
     });
   };

  sumbit = (value) => {
    console.log("Trying to submit " + value.author + "; " + value.title + "; " + value.text + "; " + this.state.site + "; " + this.state.image + "; " + value.category + "; " + value.language + "; " + value.country + "; " + value.date.toISOString() );
    const fetch = createApolloFetch({
      uri: global.serverurl,
    });
    fetch({
      query: 'mutation {addArticle(author:"' + value.author + '" title:"' + value.title + '" description:"' + value.text +  '" url:"' + this.state.site + '" urlToImage:"' + this.state.image + '" category:"' + value.category + '" language:"' + value.language + '" country:"' + value.country + '" publishedAt:"' + value.date.toISOString() + '" publishedByUser:true geotype:"Point" lat:"' + value.latitude + '" lng:"' + value.longitude + '") { id }}'
    })
    .then(respnse => {
      console.log('Article was generated with id ', respnse.data);
    })
    .catch(error => {
      console.log('Error while submitting article: ' + error);
    });
  };

  async getGeoLocation() {
    await navigator.geolocation.getCurrentPosition(
      (position) => {
        //console.log('Geo determination: ' + position.coords.latitude + ' ' + position.coords.longitude)
        this.setState({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          value: {
            "longitude": position.coords.longitude,
            "latitude": position.coords.latitude,
          },
          geoError: null,
        });
      },
      (error) => this.setState({ geoError: error.message }),
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 },
    );
    await this.handleGeo();
  };

  async handleGeo() {
    //await this.getGeoLocation();
    await this.makeGeoRemoteRequest(this.state.value.adress||null,this.state.value.longitude||null,this.state.value.latitude||null);
    console.log("Geo Information: \n adress: " + this.state.adress + "\n longitude: " + this.state.longitude + "\n latitude: " + this.state.latitude);
  }

  async onChange(value) {
    if(value.text){
      value.text = value.text.replace(/[\r\n]+/g," ");
    }
    /*value.adress = this.state.adress;
    value.longitude = this.state.longitude;
    value.latitude = this.state.latitude;
    if(value.adress != this.state.adress){
      await this.makeGeoRemoteRequest(value.adress);
    }*/
    //value.adress = this.state.adress;
    //value.longitude = this.state.longitude;
    //value.latitude = this.state.latitude;
    if(validUrl.isWebUri(value.urlToImage)){
      if(validUrl.isWebUri(value.url)){
        this.setState({ value });
        this.setState({ image:value.urlToImage, site:value.url });
      } else {
        this.setState({ value });
        this.setState({ image:value.urlToImage });
      }
    } else {
      if(validUrl.isWebUri(value.url)){
        this.setState({ value });
        this.setState({ site:value.url });
      }else{
        this.setState({ value });
      }  
    }
    console.log("Value: "+JSON.stringify(value));
    console.log("Image: "+this.state.image+" Site: "+this.state.site);
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

  activateEasterEgg = () => {
    this.setState({easterEggCounter: this.state.easterEggCounter+1});
    if(this.state.easterEggCounter >= 10){
      this.setState({easterEggActive: true});
    }
  }

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
          <TouchableHighlight onPress={() => this.activateEasterEgg()}>
            <Image
              source={{ uri: this.state.image }}
              style={{ alignSelf:'center', resizeMode: 'cover', height: Device.height/4, width:'100%', flex: 1, borderRadius:5}}
            />
          </TouchableHighlight>
          {this.state.easterEggActive ? (
            <View style={{flexDirection:'row', justifyContent:'center'}}>
              <TouchableHighlight style={styles.button} onPress={() => this.props.navigation.navigate('Camera')} underlayColor='#99d9f4'>
                <Text style={styles.buttonText}>Take a picture</Text>
              </TouchableHighlight>
              <TouchableHighlight style={styles.button} onPress={this._pickImage} underlayColor='#99d9f4'>
                <Text style={styles.buttonText}>Pick an image</Text>
              </TouchableHighlight>
            </View>
          ):(
            null
          )}
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
