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
import ViewPhotos from "../components/viewPhotos";

export default class WriteArticle extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: null,
      text: null,
      image: null,
      showPhotoGallery: false,
      photoArray: []
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
    console.log("Submitted " + this.state.text);
    this.props.navigation.goBack();
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
          style={{ borderColor: "gray", borderWidth: 0.3, fontSize: 24 }}
          onChangeText={title => this.setState({ title })}
          value={this.state.text}
          placeholderTextColor={"grey"}
          allowFontScaling={true}
          autoFocus={true}
          placeholder={"Title"}
          maxHeight={400}
          multiline={false}
        />
        <Divider style={{ height: 20, backgroundColor: "transparent" }} />
        <TextInput
          style={{ borderColor: "gray", borderWidth: 0.3 }}
          onChangeText={text => this.setState({ text })}
          value={this.state.text}
          placeholderTextColor={"grey"}
          allowFontScaling={true}
          placeholder={"Your text starts here ..."}
          maxHeight={400}
          multiline={true}
        />
        <Divider style={{ height: 20, backgroundColor: "transparent" }} />
        {
            this.state.showPhotoGallery === true ? (
              <ViewPhotos
               photoArray={this.state.photoArray} />
            ) : (
              <Button
                title={"Select Photo"}
                style={{ width: 200 }}
                onPress={() => {
                  this.getPhotosFromGallery();
                }}
              />
            )
          }
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
