import React, {Component} from 'react';
import {Provider, connect} from 'react-redux';
import {PersistGate} from 'redux-persist/integration/react';
import {AsyncStorage} from 'react-native';
import Router from './routes';
import 'react-native-gesture-handler';
import PushNotification from 'react-native-push-notification';

class Main extends Component {
 

  render() {
    return <Router isLoggedIn={this.props.authData.isLoggedIn} />;
  }
}

mapStateToProps = (state) => ({
  authData: state.authReducer.authData,
});

export default connect(mapStateToProps, null)(Main);
