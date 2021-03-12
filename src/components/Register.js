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
} from 'react-native';
import {Field, reduxForm} from 'redux-form';
import InputTextField from './InputTextField';
import {connect} from 'react-redux';
import {compose} from 'redux';
import {createNewUser} from '../actions/auth-actions';
import Loader from './Loader';

class Register extends Component {
  constructor(props) {
    super(props);
  }

  signIn() {
    this.props.navigation.navigate('Log In');
  }

  createNewUser = async (values) => {
    try {
      const response = await this.props.dispatch(createNewUser(values));
      if (!response.success) {
        // throw response;
        this.signIn();
      }
    } catch (error) {
      const newError = new ErrorUtils(error, 'Signup Error');
      newError.showAlert();
    }
  };

  onSubmit = (values) => {
    this.createNewUser(values);
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
    const {handleSubmit, createUser} = this.props;

    return (
      <ScrollView>
        <View style={styles.container}>
          {createUser.isLoading && <Loader />}
          <ImageBackground
            source={require('../images/bgregister.png')}
            style={styles.image}>
            <View style={{marginTop: 50}}>
              <Image source={require('../images/ic_inovindo2.png')} />
            </View>

            <Text
              style={{
                color: 'black',
                textAlign: 'center',
                fontSize: 15,
                fontWeight: '700',
                marginVertical: 15,
              }}>
              Register
            </Text>
            <View style={{paddingHorizontal: 30}}>
              <Field
                name="first_name"
                label="First Name"
                component={this.renderTextInput}
              />
              <Field
                name="last_name"
                label="Last Name"
                component={this.renderTextInput}
              />
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
              <Field
                name="ConfirmPassword"
                label="Confirm Password"
                secureTextEntry={true}
                component={this.renderTextInput}
              />
            </View>
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
                Sign Up
              </Text>
            </TouchableOpacity>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                paddingHorizontal: 30,
                paddingVertical: 10,
              }}>
              <Text>Already Have an Account? </Text>
              <TouchableOpacity onPress={() => this.signIn()}>
                <Text style={styles.textLink}>Sign In</Text>
              </TouchableOpacity>
            </View>
          </ImageBackground>
        </View>
      </ScrollView>
    );
  }
}

const validate = (values) => {
  const errors = {};
  if (!values.first_name) {
    errors.first_name = 'FirstName is required';
  }
  if (!values.last_name) {
    errors.last_name = 'LastName is required';
  }
  if (!values.email) {
    errors.email = 'Email is required';
  }
  if (!values.password) {
    errors.password = 'Password is required';
  }
  if (!values.ConfirmPassword) {
    errors.ConfirmPassword = 'ConfirmPassword is required';
  }
  return errors;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
  },
  inputTitle: {
    color: '#ABB4BD',
    fontSize: 14,
  },
  image: {
    flex: 1,
    resizeMode: 'cover',
  },
  body: {
    backgroundColor: '#fff',
    flex: 1,
    flexDirection: 'column',
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
  errorText: {
    color: '#FF9800',
    fontSize: 14,
    paddingBottom: 8,
  },
});

mapStateToProps = (state) => ({
  createUser: state.authReducer.createUser,
});

mapDispatchToProps = (dispatch) => ({
  dispatch,
});

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  reduxForm({
    form: 'register',
    validate,
  }),
)(Register);
