import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  ImageBackground,
  TouchableOpacity,
} from 'react-native';
import InputTextField from './InputTextField';
import Loader from './Loader';
import {Field, reduxForm} from 'redux-form';
import {compose} from 'redux';
import {connect} from 'react-redux';
import {loginUser} from '../actions/auth-actions';
import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from '@react-native-community/google-signin';
import {createNewUser} from '../actions/auth-actions';
import firebase from 'firebase';

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      first_name: '',
      last_name: '',
      email: '',
      img: '',
      password: '',
    };
  }

  signUp() {
    this.props.navigation.navigate('Sign Up');
  }
  _signIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      console.log(userInfo.user);
      this.setState({
        first_name: userInfo.user.givenName,
        last_name: userInfo.user.familyName,
        email: userInfo.user.email,
        img: userInfo.user.photo,
        provider: 'GOOGLE',
      });

      var res = userInfo.user.email.replace(/\./g, 'at');

      firebase
        .database()
        .ref('users/' + res)
        .set({name: res});
      const response = await this.props.dispatch(createNewUser(this.state));

      const responseLogin = await this.props.dispatch(loginUser(this.state));
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        // user cancelled the login flow
      } else if (error.code === statusCodes.IN_PROGRESS) {
        // operation (e.g. sign in) is in progress already
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        // play services not available or outdated
      } else {
        // some other error happened
      }
    }
  };
  isSignedIn = async () => {
    const isSignedIn = await GoogleSignin.isSignedIn();
    // this.setState({ isLoginScreenPresented: !isSignedIn });
  };

  componentDidMount() {
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

  loginUser = async (values) => {
    try {
      const response = await this.props.dispatch(loginUser(values));

      if (!response.success) {
        throw response;
      }

      firebase
        .database()
        .ref('users/' + values.email)
        .set({name: values.email});
    } catch (error) {
      let errorText;
      if (error.message) {
        errorText = error.message;
      }
      errorText = error.responseBody;
    }
  };

  onSubmit = (values) => {
    this.loginUser(values);
  };

  renderTextInput = (field) => {
    const {
      meta: {touched, error},
      label,
      secureTextEntry,
      maxLength,
      keyboardType,
      placeholder,
      input: {onChange, ...restInput},
    } = field;
    return (
      <View>
        <InputTextField
          onChangeText={onChange}
          maxLength={maxLength}
          placeholder={placeholder}
          keyboardType={keyboardType}
          secureTextEntry={secureTextEntry}
          label={label}
          {...restInput}
        />
        {touched && error && <Text style={styles.errorText}>{error}</Text>}
      </View>
    );
  };

  render() {
    const {handleSubmit, loginUser} = this.props;

    return (
      <View style={styles.container}>
        {loginUser && loginUser.isLoading ? <Loader /> : null}
        <ImageBackground
          source={require('../images/bglogin.png')}
          style={styles.image}>
          <View style={{marginTop: 50}}>
            <Image source={require('../images/ic_inovindo2.png')} />
          </View>

          <View
            style={{
              marginTop: 15,
              flexDirection: 'row',
              justifyContent: 'center',
            }}>
            <TouchableOpacity>
              <View style={styles.buttonSosmed}>
                <Image
                  source={require('../images/ic_facebook.png')}
                  style={styles.logososmed}
                />
                <Text>Facebook</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => this._signIn()}>
              <View style={styles.buttonSosmed}>
                <Image
                  source={require('../images/ic_google.png')}
                  style={styles.logososmed}
                />
                <Text>Google</Text>
              </View>
            </TouchableOpacity>
          </View>

          <Text
            style={{
              color: '#A99B9B',
              textAlign: 'center',
              fontSize: 15,
              marginVertical: 15,
            }}>
            or
          </Text>

          <View style={{marginHorizontal: 20}}>
            <Field
              name="email"
              label="Email"
              component={this.renderTextInput}
            />
            <Field
              name="password"
              label="Password"
              secureTextEntry={true}
              component={this.renderTextInput}
            />
            {loginUser.isSuccess == false && <Text>{loginUser.errors}</Text>}
          </View>

          <View>
            <Text style={styles.textLink}>Forgot Password?</Text>
            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleSubmit(this.onSubmit)}>
              <Text
                style={{
                  color: '#fff',
                  fontSize: 15,
                  fontWeight: '500',
                  textAlign: 'center',
                }}>
                Login
              </Text>
            </TouchableOpacity>
            <Text
              style={{
                marginHorizontal: 12,
                textAlign: 'right',
                marginTop: 12,
              }}>
              Don't Have an Account?
            </Text>
            <TouchableOpacity onPress={() => this.signUp()}>
              <Text style={styles.textLink}>Register Now</Text>
            </TouchableOpacity>
          </View>
        </ImageBackground>
      </View>
    );
  }
}
const validate = (values) => {
  const errors = {};

  if (!values.email) {
    errors.email = 'Email is required';
  }
  if (!values.password) {
    errors.password = 'Password is required';
  }
  return errors;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
  },
  image: {
    flex: 1,
    resizeMode: 'cover',
  },
  buttonSosmed: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 12,
    paddingVertical: 12,
    paddingHorizontal: 22,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(171,180,189,0.65)',
    borderRadius: 4,
    backgroundColor: '#fff',
    shadowColor: 'rgba(171,180,189,0.35)',
    shadowOffset: {width: 0, height: 10},
    shadowOpacity: 1,
    shadowRadius: 20,
    elevation: 7,
  },
  logososmed: {
    width: 16,
    height: 16,
    marginRight: 5,
  },
  textLink: {
    color: '#FF0844',
    fontSize: 15,
    textAlign: 'right',
    marginHorizontal: 20,
  },
  submitButton: {
    backgroundColor: '#48C6EF',
    borderRadius: 8,
    marginHorizontal: 30,
    justifyContent: 'center',
    paddingVertical: 12,
    marginTop: 20,
  },
});

mapStateToProps = (state) => ({
  loginUser: state.authReducer.loginUser,
  createUser: state.authReducer.createUser,
  authData: state.authReducer.authData,
});

mapDispatchToProps = (dispatch) => ({
  dispatch,
});

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  reduxForm({
    form: 'login',
    validate,
  }),
)(Login);
