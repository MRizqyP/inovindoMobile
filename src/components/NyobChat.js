import React, {Component} from 'react';
import {Provider, connect} from 'react-redux';
import {
  SafeAreaView,
  StyleSheet,
  View,
  FlatList,
  Text,
  Image,
  TouchableOpacity,
  Dimensions,
  RefreshControl,
  TextInput,
} from 'react-native';
import firebase from 'firebase';
export class NyobChat extends Component {
  static navigationOptions = ({navigation, route}) => {
    return {
      tabBarVisible: true,
    };
  };

  constructor(props) {
    super(props);
    this.state = {
      person: {
        name: 'admin',
      },
      textMessage: '',
      messageList: '',
    };
  }

  handleChange = (key) => (val) => {
    this.setState({[key]: val});
  };

  componentDidMount() {
    const {getUser} = this.props;

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
    var res = getUser.userDetails.email.replace(/\./g, 'at');
    firebase
      .database()
      .ref('messages')
      .child(res)
      .child(this.state.person.name)
      .on('child_added', (value) => {
        this.setState((prevState) => {
          return {
            messageList: [...prevState.messageList, value.val()],
          };
        });
      });
  }
  convertTime = (time) => {
    let d = new Date(time);
    let c = new Date();
    let result = (d.getHours() < 10 ? '0' : '') + d.getHours() + ':';
    result += (d.getMinutes() < 10 ? '0' : '') + d.getMinutes();
    if (c.getDay() != d.getDay()) {
      result = d.getDay() + ' ' + d.getMonth() + ' ' + result;
    }
    return result;
  };

  sendMessage = async () => {
    const {getUser} = this.props;
    if (this.state.textMessage.length > 0) {
      var res = getUser.userDetails.email.replace(/\./g, 'at');
      let msgId = firebase
        .database()
        .ref('messages')
        .child(res)
        .child(this.state.person.name)
        .push().key;
      let updates = {};
      let message = {
        message: this.state.textMessage,
        time: firebase.database.ServerValue.TIMESTAMP,
        from: res,
      };
      updates[
        'messages/' + res + '/' + this.state.person.name + '/' + msgId
      ] = message;
      updates[
        'messages/' + this.state.person.name + '/' + res + '/' + msgId
      ] = message;
      firebase.database().ref().update(updates);
      this.setState({textMessage: ''});
    }
  };

  renderRow = ({item}) => {
    return (
      <View
        style={{
          flexDirection: 'row',
          width: '60%',
          alignSelf:
            item.from === this.props.getUser.userDetails.email
              ? 'flex-end'
              : 'flex-start',
          backgroundColor:
            item.from === this.props.getUser.userDetails.email
              ? '#00897b'
              : '#7cb342',
          borderRadius: 5,
          marginBottom: 10,
        }}>
        <Text style={{color: '#fff', padding: 7, fontSize: 16}}>
          {item.message}
        </Text>
        <Text style={{color: '#eee', padding: 3, fontSize: 12}}>
          {this.convertTime(item.time)}
        </Text>
      </View>
    );
  };

  render() {
    let {height, width} = Dimensions.get('window');
    const {getUser} = this.props;

    return (
      <SafeAreaView>
        <FlatList
          style={{padding: 10, height: height * 0.84}}
          data={this.state.messageList}
          renderItem={this.renderRow}
          keyExtractor={(item, index) => index.toString()}
        />
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginHorizontal: 15,
          }}>
          <TextInput
            style={style.input}
            value={this.state.textMessage}
            placeholder="Type message..."
            onChangeText={this.handleChange('textMessage')}
          />
          <TouchableOpacity onPress={this.sendMessage}>
            <Text style={style.btnText}>Send</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }
}

const style = StyleSheet.create({
  input: {
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    width: '80%',
    marginBottom: 10,
    borderRadius: 15,
  },
  btnText: {
    color: 'darkblue',
    fontSize: 20,
    margin: 10,
    textAlign: 'center',
  },
});
mapStateToProps = (state) => ({
  authData: state.authReducer.authData,
  getUser: state.userReducer.getUser,
});

export default connect(mapStateToProps, null)(NyobChat);
