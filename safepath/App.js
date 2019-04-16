import React from 'react';
import {
  ActivityIndicator,
  Button,
  Clipboard,
  FlatList,
  Image,
  Share,
  StyleSheet,
  Text,
  ScrollView,
  View
} from 'react-native';
import MapView from 'react-native-maps'
import { 
  ImagePicker, 
  Permissions,
  Location
} from 'expo';

import uuid from 'uuid';
import Environment from './config/environment';
import firebase from './config/firebase';



export default class App extends React.Component {
  
  // constructor(props) {
  //   super(props)
  //   this.state = {
  //     titleText: "safemap"
  //   };
  // }  

  state = {
    image: null,
    uploading: false,
    googleResponse: null,
    mapRegion: { latitude: 37.78825, longitude: -122.4324, latitudeDelta: 0.0922, longitudeDelta: 0.0421 },
    locationResult: null,
    location: {coords: { latitude: 37.78825, longitude: -122.4324}},
  };

  async componentDidMount() {
    await Permissions.askAsync(Permissions.CAMERA_ROLL);
    await Permissions.askAsync(Permissions.CAMERA);
    this._getLocationAsync();
  }
  
  _handleMapRegionChange = mapRegion => {
    this.setState({ mapRegion });
  };

  _getLocationAsync = async () => {
   let { status } = await Permissions.askAsync(Permissions.LOCATION);
   if (status !== 'granted') {
     this.setState({
       locationResult: 'Permission to access location was denied',
       location,
     });
   }

   let location = await Location.getCurrentPositionAsync({});
   this.setState({ locationResult: JSON.stringify(location), location, });
 };



  render() {
    let { image } = this.state;

    return (
      <View style={styles.container}>
    
      <MapView
          style={{ alignSelf: 'stretch', height: 550 }}
          region={{ latitude: this.state.location.coords.latitude, longitude: this.state.location.coords.longitude, latitudeDelta: 0.0922, longitudeDelta: 0.0421 }}
          onRegionChange={this._handleMapRegionChange}
        >
          <MapView.Marker
            coordinate={this.state.location.coords}
            title="My Marker"
            description="This is where you are"
            pinColor='#335EFF'
          />
          <MapView.Marker
            coordinate={{latitude: 34.073190,
            longitude: -118.453010}}
            title={"High Danger"}
            description={"Shooter"}
            pinColor = '#FF0000'
          />
          <MapView.Marker
            coordinate={{latitude: 34.064190,
            longitude: -118.453010}}
            title={"Low Danger"}
            description={"Underage drinking"}
            pinColor = '#FFC500'            
          />
          <MapView.Marker
            coordinate={{latitude: 34.09420,
            longitude: -118.43320}}
            title={"High Danger"}
            description={"Fire"}
            pinColor = '#FF0000'
          />
          <MapView.Marker
            coordinate={{latitude: 34.02920,
            longitude: -118.44320}}
            title={"High Danger"}
            description={"Major accident"}
            pinColor = '#FF0000'
          />
          <MapView.Marker
            coordinate={{latitude: 34.05190,
            longitude: -118.4823010}}
            title={"Low Danger"}
            description={"Public nudity"}
            pinColor = '#FFC500'                        
          />    
          <MapView.Marker
            coordinate={{latitude: 34.033190,
            longitude: -118.423010}}
            title={"Low Danger"}
            description={"Object in road"}
            pinColor = '#FFC500'            
          />
          <MapView.Marker
            coordinate={{latitude: 34.063190,
            longitude: -118.4435010}}
            title={"Medium Danger"}
            description={"Police acitivity"}
            pinColor = '#DE7B05'
          />   
          <MapView.Marker
            coordinate={{latitude: 34.042390,
            longitude: -118.484210}}
            title={"Medium Danger"}
            description={"Burglar"}
            pinColor = '#DE7B05'
          />
          <MapView.Marker
            coordinate={{latitude: 34.058190,
            longitude: -118.4135010}}
            title={"Low Danger"}
            description={"Minor collision"}
            pinColor = '#FFC500'            
          />                               
        </MapView>
        
        {/* TODO: SEND THESE TO THE DATABASE */}
        <View style={styles.getStartedContainer}>
            {image ? null : (
              <Text style={styles.titleText}>safemap</Text>
            )}
          </View>
      

        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.contentContainer}
        >
          

          <View style={styles.helpContainer}>
            <Button
              onPress={this._pickImage}
              title="Select from camera roll"
              color='#C3D2D5'
            />
          </View>

          <View style={styles.helpContainer}>
            <Button 
              onPress={this._takePhoto}
              fontFamily='Zapfino'
              title="Take a photo" 
              color='#C3D2D5'
            />
            
            {this.state.googleResponse && (
              <FlatList
                data={this.state.googleResponse.responses[0].labelAnnotations}
                extraData={this.state}
                keyExtractor={this._keyExtractor}
                // TODO: SEND THESE TO THE DATABASE
                renderItem={({ item }) => <Text style ={{marginTop: 7, color: '#C3D2D5', marginBottom: 20, fontSize: 25, textAlign: 'center'}}>{item.description}</Text>}
              />
            )}


            {this.state.googleResponse && (
              <Text style={{color: '#C3D2D5', marginBottom: 20, fontSize: 27, textAlign: 'center'}}> 
                {/* adult: {this.state.googleResponse.responses[0].safeSearchAnnotation.adult} {"\n"}
                spoof: {this.state.googleResponse.responses[0].safeSearchAnnotation.spoof} {"\n"}           
                medical: {this.state.googleResponse.responses[0].safeSearchAnnotation.medical}  {"\n"}             */}
                Violence: {this.state.googleResponse.responses[0].safeSearchAnnotation.violence} {"\n"}           
                {/* racy: {this.state.googleResponse.responses[0].safeSearchAnnotation.racy} {"\n"}  */}
              </Text>    
            )}                         
            {this._maybeRenderImage()}
            {this._maybeRenderUploadingOverlay()}
          </View>
        </ScrollView>
      </View>
    );
  }

  organize = array => {
    return array.map(function(item, i) {
      return (
        <View key={i}>
          <Text>{item}</Text>
        </View>
      );
    });
  };

  _maybeRenderUploadingOverlay = () => {
    if (this.state.uploading) {
      return (
        <View
          style={[
            StyleSheet.absoluteFill,
            {
              backgroundColor: 'rgba(0,0,0,0.4)',
              alignItems: 'center',
              justifyContent: 'center'
            }
          ]}
        >
          <ActivityIndicator color="#fff" animating size="large" />
        </View>
      );
    }
  };

  _maybeRenderImage = () => {
    let { image, googleResponse } = this.state;
    if (!image) {
      return;
    }

    return (
      <View
        style={{
          marginTop: 10,
          width: 250,
          borderRadius: 3,
          elevation: 2
        }}
      >
        <Button
          style={{ marginBottom: 10}}
          onPress={() => this.submitToGoogle()}
          title="Submit:"
          color = '#C3D2D5' 
        />

        <View
          style={{
            borderTopRightRadius: 3,
            borderTopLeftRadius: 3,
            shadowColor: 'rgba(0,0,0,1)',
            shadowOpacity: 0.2,
            shadowOffset: { width: 4, height: 4 },
            shadowRadius: 5,
            overflow: 'hidden'
          }}
        >
          <Image source={{ uri: image }} style={{ width: 250, height: 250 }} />
        </View>
        <Text
          onPress={this._copyToClipboard}
          onLongPress={this._share}
          style={{ paddingVertical: 10, paddingHorizontal: 10 }}
        />

       
      </View>
    );
  };

  _keyExtractor = (item) => item.id;

  _renderItem = item => {
    <Text>response: {JSON.stringify(item)}</Text>;
  };

  _share = () => {
    Share.share({
      message: JSON.stringify(this.state.googleResponse.responses),
      title: 'Check it out',
      url: this.state.image
    });
  };

  _copyToClipboard = () => {
    Clipboard.setString(this.state.image);
    alert('Copied to clipboard');
  };

  _takePhoto = async () => {
    let pickerResult = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3]
    });

    this._handleImagePicked(pickerResult);
  };

  _pickImage = async () => {
    let pickerResult = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [4, 3]
    });

    this._handleImagePicked(pickerResult);
  };

  _handleImagePicked = async pickerResult => {
    try {
      this.setState({ uploading: true });

      if (!pickerResult.cancelled) {
        uploadUrl = await uploadImageAsync(pickerResult.uri);
        this.setState({ image: uploadUrl });
      }
    } catch (e) {
      console.log(e);
      alert('Upload failed, sorry 😞');
    } finally {
      this.setState({ uploading: false });
    }
  };

  submitToGoogle = async () => {
    try {
      this.setState({ uploading: true });
      let { image } = this.state;
      let body = JSON.stringify({
        requests: [
          {
            features: [
              { type: 'LABEL_DETECTION', maxResults: 5 },
              // { type: 'LANDMARK_DETECTION', maxResults: 5 },
              // { type: 'FACE_DETECTION', maxResults: 5 },
              // { type: 'LOGO_DETECTION', maxResults: 5 },
              // { type: 'TEXT_DETECTION', maxResults: 5 },
              // { type: 'DOCUMENT_TEXT_DETECTION', maxResults: 5 },
              { type: 'SAFE_SEARCH_DETECTION', maxResults: 5 }
              // { type: 'IMAGE_PROPERTIES', maxResults: 5 },
              // { type: 'CROP_HINTS', maxResults: 5 },
              // { type: 'WEB_DETECTION', maxResults: 5 }
            ],
            image: {
              source: {
                imageUri: image
              }
            }
          }
        ]
      });
      let response = await fetch(
        'https://vision.googleapis.com/v1/images:annotate?key=' +
          Environment['GOOGLE_CLOUD_VISION_API_KEY'],
        {
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
          },
          method: 'POST',
          body: body
        }
      );
      let responseJson = await response.json();
      console.log(responseJson);
      this.setState({
        googleResponse: responseJson,
        uploading: false
      });
    } catch (error) {
      console.log(error);
    }
  };
}

async function uploadImageAsync(uri) {
  const blob = await new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.onload = function() {
      resolve(xhr.response);
    };
    xhr.onerror = function(e) {
      console.log(e);
      reject(new TypeError('Network request failed'));
    };
    xhr.responseType = 'blob';
    xhr.open('GET', uri, true);
    xhr.send(null);
  });

  const ref = firebase
    .storage()
    .ref()
    .child(uuid.v4());
  const snapshot = await ref.put(blob);

  blob.close();

  return await snapshot.ref.getDownloadURL();
}

const styles = StyleSheet.create({
   baseText: {
     fontFamily: 'Cochin',
   },
   titleText: {
    marginTop: 15,
    fontFamily: 'Futura', //futura
     fontSize: 50,
     //fontWeight: 'bold',
     color: '#C3D2D5',
   },

  container: {
    flex: 1,
    backgroundColor: '#363449',
    paddingBottom: 10,
    textAlign: 'center'

  },
  developmentModeText: {
    marginBottom: 20,
    color: 'red',
    fontSize: 14,
    lineHeight: 19,
    textAlign: 'center'
  },
  contentContainer: {
    paddingTop: 10,
    textAlign: 'center'
  },

  getStartedContainer: {
    alignItems: 'center',
    marginHorizontal: 50,
    textAlign: 'center'

  },

  getStartedText: {
    fontSize: 17,
    color: 'red',
    lineHeight: 24,
    textAlign: 'center'
  },

  helpContainer: {
    marginTop: 15,
    marginHorizontal: 40,
    fontFamily: 'Futura',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#824670',
    shadowColor: '#BDA0BC',
    color: '#BDA0BC'

  }

});