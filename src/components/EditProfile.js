import React, {Component} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  Image,
  ImageBackground,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Feather from 'react-native-vector-icons/Feather';
import {connect} from 'react-redux';
import Axios from 'axios';
import BottomSheet from 'reanimated-bottom-sheet';
import Animated from 'react-native-reanimated';
import ImagePicker from 'react-native-image-crop-picker';
import TextInputField from './InputTexFieldNew';
import {BASE_URL} from '../service/base_url';
import Loader from './Loader';

class EditProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      image: 'https://api.adorable.io/avatars/80/abott@adorable.png',
      data: [],
      first_name: '',
      last_name: '',
      email: '',
      kota: '',
      negara: '',
      no_hp: '',
      isLoading: false,
    };
  }

  takePhotoFromCamera = async () => {
    ImagePicker.openCamera({
      compressImageMaxWidth: 300,
      compressImageMaxHeight: 300,
      cropping: true,
      compressImageQuality: 0.7,
    }).then(async (image) => {
      console.log(image);
      this.setState({image: image.path});
      this.bs.current.snapTo(1);

      fetch('http://35b2e9f3d37c.ngrok.io/upload', {
        method: 'POST',
        body: this.createFormData(image),
      })
        .then((response) => response.json())
        .then((response) => {
          console.log('upload succes', response);
          alert('Upload success!');
          // this.setState({photo: null});
        })
        .catch((error) => {
          console.log('upload error', error);
          alert('Upload failed!');
        });
    });
  };
  createFormData = (photo) => {
    const data = new FormData();

    data.append('photo', {
      name: photo.fileName,
      type: photo.type,
      uri:
        Platform.OS === 'android'
          ? photo.uri
          : photo.uri.replace('file://', ''),
    });

    return data;
  };

  choosePhotoFromLibrary = () => {
    ImagePicker.openPicker({
      width: 300,
      height: 300,
      cropping: true,
      compressImageQuality: 0.7,
    }).then((image) => {
      console.log(image);
      this.setState({image: image.path});
      this.bs.current.snapTo(1);
      fetch('http://35b2e9f3d37c.ngrok.io/upload', {
        method: 'POST',
        body: this.createFormData(image),
      })
        .then((response) => response.json())
        .then((response) => {
          console.log('upload succes', response);
          alert('Upload success!');
          // this.setState({photo: null});
        })
        .catch((error) => {
          console.log('upload error', error);
          alert('Upload failed!');
        });
    });
  };

  componentDidMount() {
    this.fetchApi();
  }

  changeProfile = async () => {
    try {
      this.setState({isLoading: true});
      const {authData} = this.props;
      const data = new FormData();
      data.append('first_name', this.state.first_name);
      data.append('last_name', this.state.last_name);
      data.append('email', this.state.email);
      data.append('kota', this.state.kota);
      data.append('negara', this.state.negara);
      data.append('no_hp', this.state.no_hp);
      // data.append('img', this.state.image);

      const response = await Axios.put(`${BASE_URL}/user/${authData.id}`, data);
      if (response) {
        this.setState({isLoading: false});
      }
    } catch (error) {
      console.log(error);
    }
  };

  async fetchApi() {
    try {
      this.setState({isLoading: true});
      const {authData} = this.props;
      await Axios.get(`${BASE_URL}/api/user/${authData.id}`).then(
        (response) => {
          this.setState({
            data: response.data.user,
            first_name: response.data.user[0].first_name,
            last_name: response.data.user[0].last_name,
            email: response.data.user[0].email,
            image: response.data.user[0].img,
            kota: response.data.user[0].kota,
            negara: response.data.user[0].negara,
            no_hp: response.data.user[0].no_hp,
            isLoading: false,
          });
        },
      );
    } catch (err) {
      console.log(err);
    }
  }

  renderInner = () => (
    <View style={styles.panel}>
      <View style={{alignItems: 'center'}}>
        <Text style={styles.panelTitle}>Upload Photo</Text>
        <Text style={styles.panelSubtitle}>Choose Your Profile Picture</Text>
      </View>
      <TouchableOpacity
        style={styles.panelButton}
        onPress={this.takePhotoFromCamera}>
        <Text style={styles.panelButtonTitle}>Take Photo</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.panelButton}
        onPress={this.choosePhotoFromLibrary}>
        <Text style={styles.panelButtonTitle}>Choose From Library</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.panelButton}
        onPress={() => this.bs.current.snapTo(1)}>
        <Text style={styles.panelButtonTitle}>Cancel</Text>
      </TouchableOpacity>
    </View>
  );

  renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.panelHeader}>
        <View style={styles.panelHandle} />
      </View>
    </View>
  );

  bs = React.createRef();

  render() {
    console.log(this.state.isLoading);
    return (
      <View style={styles.container}>
        <BottomSheet
          ref={this.bs}
          snapPoints={[330, 0]}
          renderContent={this.renderInner}
          renderHeader={this.renderHeader}
          initialSnap={1}
          callbackNode={this.fall}
          enabledGestureInteraction={true}
        />
        {this.state.isLoading ? <Loader /> : null}
        <ImageBackground
          source={require('../images/bgprofile.png')}
          style={styles.image}>
          <View style={styles.formEdit}>
            <View style={{alignItems: 'center'}}>
              <TouchableOpacity onPress={() => this.bs.current.snapTo(0)}>
                <View
                  style={{
                    height: 80,
                    width: 80,
                    borderRadius: 50,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <ImageBackground
                    source={
                      this.state.image === null
                        ? {
                            uri:
                              'https://api.adorable.io/avatars/80/abott@adorable.png',
                          }
                        : {uri: this.state.image}
                    }
                    style={{height: 80, width: 80}}
                    imageStyle={{borderRadius: 50}}>
                    <View
                      style={{
                        flex: 1,
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}>
                      <Icon
                        name="camera"
                        size={25}
                        color="#fff"
                        style={{
                          opacity: 0.7,
                          alignItems: 'center',
                          justifyContent: 'center',
                          borderWidth: 1,
                          borderColor: '#fff',
                          borderRadius: 10,
                        }}
                      />
                    </View>
                  </ImageBackground>
                </View>
              </TouchableOpacity>
            </View>
            <View style={styles.action}>
              <FontAwesome name="user-o" color={'black'} size={20} />
              <TextInput
                value={this.state.first_name}
                placeholder="First Name"
                placeholderTextColor="#666666"
                autoCorrect={false}
                style={[
                  styles.textInput,
                  {
                    color: 'black',
                  },
                ]}
                onChangeText={(text) => this.setState({first_name: text})}
              />
            </View>
            <View style={styles.action}>
              <FontAwesome name="user-o" color={'black'} size={20} />
              <TextInput
                value={this.state.last_name}
                placeholder="Last Name"
                placeholderTextColor="#666666"
                autoCorrect={false}
                style={[
                  styles.textInput,
                  {
                    color: 'black',
                  },
                ]}
                onChangeText={(text) => this.setState({last_name: text})}
              />
            </View>
            <View style={styles.action}>
              <Feather name="phone" color={'black'} size={20} />
              <TextInput
                value={String(this.state.no_hp)}
                placeholder="Phone"
                placeholderTextColor="#666666"
                keyboardType="number-pad"
                autoCorrect={false}
                style={[
                  styles.textInput,
                  {
                    color: 'black',
                  },
                ]}
                onChangeText={(text) => this.setState({no_hp: text})}
              />
            </View>
            <View style={styles.action}>
              <FontAwesome name="envelope-o" color={'black'} size={20} />
              <TextInput
                value={this.state.email}
                placeholder="Email"
                placeholderTextColor="#666666"
                keyboardType="email-address"
                autoCorrect={false}
                onChangeText={(text) => this.setState({email: text})}
                style={[
                  styles.textInput,
                  {
                    color: 'black',
                  },
                ]}
              />
            </View>
            <View style={styles.action}>
              <FontAwesome name="globe" color={'black'} size={20} />
              <TextInput
                value={this.state.negara}
                placeholder="Country"
                placeholderTextColor="#666666"
                autoCorrect={false}
                style={[
                  styles.textInput,
                  {
                    color: 'black',
                  },
                ]}
                onChangeText={(text) => this.setState({negara: text})}
              />
            </View>
            <View style={styles.action}>
              <Icon name="map-marker-outline" color={'black'} size={20} />
              <TextInput
                value={this.state.kota}
                placeholder="City"
                placeholderTextColor="#666666"
                autoCorrect={false}
                style={[
                  styles.textInput,
                  {
                    color: 'black',
                  },
                ]}
                onChangeText={(text) => this.setState({kota: text})}
              />
            </View>

            <TouchableOpacity
              style={styles.commandButton}
              onPress={() => this.changeProfile()}>
              <Text style={styles.panelButtonTitle}>Submit</Text>
            </TouchableOpacity>
          </View>
        </ImageBackground>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  image: {
    flex: 1,
    resizeMode: 'cover',
  },
  formEdit: {
    flex: 1,
    height: 250,
    borderWidth: 1,
    borderRadius: 6,
    borderColor: '#BCBABA',
    width: 316,
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
    borderRadius: 16,
    margin: 30,
    alignItems: 'center',
    marginTop: 70,
    padding: 25,
  },
  textTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
  },
  textSub: {
    fontSize: 13,
    fontWeight: '300',
    color: 'black',
  },
  profilepicture: {
    alignItems: 'center',
    margin: 20,
  },
  container: {
    flex: 1,
  },
  commandButton: {
    padding: 12,
    borderRadius: 10,
    backgroundColor: '#48C6EF',
    alignItems: 'center',
  },
  panel: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    paddingTop: 20,
    // borderTopLeftRadius: 20,
    // borderTopRightRadius: 20,
    // shadowColor: '#000000',
    // shadowOffset: {width: 0, height: 0},
    // shadowRadius: 5,
    // shadowOpacity: 0.4,
  },
  header: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#333333',
    shadowOffset: {width: -1, height: -3},
    shadowRadius: 2,
    shadowOpacity: 0.4,
    // elevation: 5,
    paddingTop: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  panelHeader: {
    alignItems: 'center',
  },
  panelHandle: {
    width: 40,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#00000040',
    marginBottom: 10,
  },
  panelTitle: {
    fontSize: 27,
    height: 35,
  },
  panelSubtitle: {
    fontSize: 14,
    color: 'gray',
    height: 30,
    marginBottom: 10,
  },
  panelButton: {
    padding: 13,
    borderRadius: 10,
    backgroundColor: '#48C6EF',
    alignItems: 'center',
    marginVertical: 7,
  },
  panelButtonTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: 'white',
  },
  action: {
    flexDirection: 'row',
    marginTop: 7,
    marginBottom: 7,
    borderBottomWidth: 1,
    borderBottomColor: '#f2f2f2',
    paddingBottom: 5,
  },
  actionError: {
    flexDirection: 'row',
    marginTop: 7,
    borderBottomWidth: 1,
    borderBottomColor: '#FF0000',
    paddingBottom: 5,
  },
  textInput: {
    flex: 1,
    marginTop: Platform.OS === 'ios' ? 0 : -12,
    paddingLeft: 10,
    color: '#05375a',
  },
});

mapStateToProps = (state) => ({
  authData: state.authReducer.authData,
});

mapDispatchToProps = (dispatch) => ({
  dispatch,
});

export default connect(mapStateToProps, mapDispatchToProps)(EditProfile);
