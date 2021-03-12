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
  RefreshControl,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import {connect} from 'react-redux';
import Axios from 'axios';
import {logoutUser} from '../actions/auth-actions';
import {BASE_URL} from '../service/base_url';
import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from '@react-native-community/google-signin';
import firebase from 'firebase';

class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      image: 'https://api.adorable.io/avatars/80/abott@adorable.png',
      first_name: '',
      last_name: '',
      email: '',
      no_hp: '',
      refreshing: false,
    };
  }
  logoutUser = async () => {
    this.props.dispatch(logoutUser());
    await GoogleSignin.revokeAccess();
    await GoogleSignin.signOut();
  };

  componentDidMount() {
    this.fetchApi();
    this.forceUpdate();
    this.props.navigation.addListener('focus', () => {
      this._onRefresh;
    });

    GoogleSignin.configure({
      scopes: ['https://www.googleapis.com/auth/drive.readonly'], // what API you want to access on behalf of the user, default is email and profile
      webClientId:
        '54292009470-4iina7moal1gfeejsjfm6st9vspukrgi.apps.googleusercontent.com', // client ID of type WEB for your server (needed to verify user ID and offline access)
      offlineAccess: true, // if you want to access Google API on behalf of the user FROM YOUR SERVER
      //   hostedDomain: '', // specifies a hosted domain restriction
      // loginHint: '', // [iOS] The user's ID, or email address, to be prefilled in the authentication UI if possible. [See docs here](https://developers.google.com/identity/sign-in/ios/api/interface_g_i_d_sign_in.html#a0a68c7504c31ab0b728432565f6e33fd)
      forceCodeForRefreshToken: true, // [Android] related to `serverAuthCode`, read the docs link below *.
      // accountName: '', // [Android] specifies an account name on the device that should be used
      //iosClientId: '<FROM DEVELOPER CONSOLE>', // [iOS] optional, if you want to specify the client ID of type iOS (otherwise, it is taken from GoogleService-Info.plist)
    });
    var firebaseConfig = {
      apiKey: 'AIzaSyAWlLFCST3K_KIwOLj1v_fU-FPuuVAs8YI',
      authDomain: 'invindochat.firebaseapp.com',
      databaseURL: 'https://invindochat.firebaseio.com',
      projectId: 'invindochat',
      storageBucket: 'invindochat.appspot.com',
      messagingSenderId: '153747643312',
      appId: '1:153747643312:web:e9fe86df573b62c2305475',
      measurementId: 'G-43SPZ0KBRT',
    };
    // Initialize Firebase
    if (!firebase.apps.length) {
      firebase.initializeApp(firebaseConfig);
    }
  }

  async fetchApi() {
    try {
      const {authData} = this.props;
      this.setState({refreshing: true});
      await Axios.get(`${BASE_URL}/api/user/${authData.id}`)
        .then((response) => {
          this.setState({
            first_name: response.data.user[0].first_name,
            last_name: response.data.user[0].last_name,
            email: response.data.user[0].email,
            image: response.data.user[0].img,
            no_hp: response.data.user[0].no_hp,
            refreshing: false,
          });
        })
        .catch((error) => {
          Alert.alert(
            'Sorry, something when wrong. Please Try Again',
            error.message,
            [
              {
                text: 'Try Again',
                onPress: this.fetchApi,
              },
            ],
          );
        });
    } catch (err) {}
  }

  _onRefresh = async () => {
    this.setState({refreshing: true});
    const {authData} = this.props;
    await Axios.get(`${BASE_URL}/api/user/${authData.id}`).then((response) => {
      this.setState({
        first_name: response.data.user[0].first_name,
        last_name: response.data.user[0].last_name,
        email: response.data.user[0].email,
        image: response.data.user[0].img,
        no_hp: response.data.user[0].no_hp,
        refreshing: false,
      });
    });
  };

  render() {
    const {getUser} = this.props;
    const {first_name, last_name} = this.state;

    const {navigation} = this.props;
    return (
      <View style={styles.container}>
        <ImageBackground
          source={require('../images/bgprofile.png')}
          style={styles.image}>
          <ScrollView
            refreshControl={
              <RefreshControl
                refreshing={this.state.refreshing}
                onRefresh={this._onRefresh.bind(this)}
              />
            }>
            <View style={styles.profilepicture}>
              <Image
                source={
                  this.state.image === null
                    ? {
                        uri:
                          'https://api.adorable.io/avatars/80/abott@adorable.png',
                      }
                    : {uri: this.state.image}
                }
                style={{
                  width: 100,
                  height: 100,
                  borderRadius: 50,
                }}
              />
              <Text style={{fontSize: 18, fontWeight: '700', marginTop: 10}}>
                Hi, {first_name} {last_name}
              </Text>
            </View>
            <View>
              <Text></Text>
            </View>
            <View style={{padding: 23, marginTop: 5}}>
              <Text style={styles.textTitle}>Riwayat Pembelian</Text>
              <TouchableOpacity
                onPress={() =>
                  this.props.navigation.navigate('MenungguPembayaran')
                }>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    marginTop: 10,
                    marginBottom: 20,
                  }}>
                  <Text>Menunggu Pembayaran</Text>
                  <Icon name="chevron-circle-right" size={20} />
                </View>
              </TouchableOpacity>
              <Text style={styles.textTitle}>Pembayaran Berhasil</Text>
              <ScrollView
                horizontal={true}
                showsHorizontalScrollIndicator={false}>
                <View
                  style={{
                    flexDirection: 'row',
                    padding: 10,
                  }}>
                  <TouchableOpacity
                    onPress={() =>
                      this.props.navigation.navigate('Proses Pembuatan')
                    }>
                    <View style={{alignItems: 'center'}}>
                      <Image
                        source={require('../images/icons/automation.png')}
                        style={styles.iconpayment}
                      />
                      <View style={{width: 80, height: 40}}>
                        <Text style={styles.desciconpayment}>
                          Sedang Proses Pembuatan
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() =>
                      this.props.navigation.navigate('Pembayaran Selanjutnya')
                    }>
                    <View style={{alignItems: 'center'}}>
                      <Image
                        source={require('../images/icons/ecommerce.png')}
                        style={styles.iconpayment}
                      />
                      <View style={{width: 80, height: 40}}>
                        <Text style={styles.desciconpayment}>
                          Menunggu Pembayaran Selanjutnya
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity>
                    <View style={{alignItems: 'center'}}>
                      <Image
                        source={require('../images/icons/sales.png')}
                        style={styles.iconpayment}
                      />
                      <View style={{width: 80, height: 40}}>
                        <Text style={styles.desciconpayment}>
                          Konfirmasi Website
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity>
                    <View style={{alignItems: 'center'}}>
                      <Image
                        source={require('../images/icons/shopping-cart.png')}
                        style={styles.iconpayment}
                      />
                      <View style={{width: 80, height: 40}}>
                        <Text style={styles.desciconpayment}>
                          Website On Board
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                </View>
              </ScrollView>
              <TouchableOpacity
                onPress={() => navigation.navigate('EditProfile')}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  <Text style={styles.textTitle}>Data Diri</Text>
                  <Icon name="chevron-circle-right" size={20} />
                </View>
              </TouchableOpacity>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginTop: 10,
                  marginBottom: 10,
                }}>
                <Text>Email</Text>
                <Text style={styles.textSub}>{this.state.email}</Text>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginTop: 10,
                  marginBottom: 10,
                }}>
                <Text>No Handphone</Text>
                <Text style={styles.textSub}>{this.state.no_hp}</Text>
              </View>
              <Text style={styles.textTitle}>Bantuan</Text>
              <TouchableOpacity
                onPress={() => navigation.navigate('Pusat Bantuan')}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    marginTop: 10,
                    marginBottom: 5,
                  }}>
                  <View>
                    <Text>Pusat Bantuan</Text>
                    <Text style={{fontSize: 11, color: '#AEA9A9'}}>
                      Temukan semua jawaban dari pertanyaan kamu seputar
                      inovindo
                    </Text>
                  </View>
                  <Icon name="chevron-circle-right" size={20} />
                </View>
              </TouchableOpacity>
              <View style={{alignItems: 'center', margin: 30}}>
                <TouchableOpacity onPress={this.logoutUser}>
                  <Text style={{fontSize: 17, color: '#288EE9', margin: 10}}>
                    Logout
                  </Text>
                </TouchableOpacity>
                <Text>App Version : 1.0.0.v1</Text>
              </View>
            </View>
          </ScrollView>
        </ImageBackground>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },

  image: {
    flex: 1,
    resizeMode: 'cover',
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
    marginTop: 40,
  },
  iconpayment: {
    width: 40,
    height: 40,
  },
  desciconpayment: {
    fontSize: 11,
    color: '#AEA9A9',
    textAlign: 'center',
    marginTop: 10,
  },
});

mapStateToProps = (state) => ({
  authData: state.authReducer.authData,
  getUser: state.userReducer.getUser,
});

mapDispatchToProps = (dispatch) => ({
  dispatch,
});

export default connect(mapStateToProps, mapDispatchToProps)(Profile);
