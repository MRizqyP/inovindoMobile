import React, {Component} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/FontAwesome';
import Login from './components/Login';
import Register from './components/Register';
import Home from './components/Home';
import Produk from './components/Produk';
import Profile from './components/Profile';
import Chat from './components/Chat';
import {Provider} from 'react-redux';

import {store} from './redux';

const Tabs = createBottomTabNavigator();

const Logins = createStackNavigator();
const DetailArikels = createStackNavigator();

class Main extends Component {
  render() {
    const {auth} = this.props;
    return (
      <Provider store={store}>
        <NavigationContainer>
          <Tabs.Navigator
            tabBarOptions={{
              activeTintColor: 'black',
              style: {
                borderTopWidth: 0,
                paddingTop: 3,
                paddingBottom: 4,
                height: 60,
                shadowColor: '#000',
                shadowOpacity: 0.1,
                shadowRadius: 20,
                shadowOffset: {width: 0, height: 0},
                backgroundColor: '#B2DBFF',
              },
            }}>
            <Tabs.Screen
              name="Home"
              component={Home}
              options={{
                tabBarIcon: ({color, size}) => (
                  <Icon name="home" color={color} size={size} />
                ),
              }}
            />
            <Tabs.Screen
              name="Produk"
              component={Produk}
              options={{
                tabBarIcon: ({color, size}) => (
                  <Icon name="list" color={color} size={size} />
                ),
              }}
            />
            <Tabs.Screen
              name="Chat"
              component={Chat}
              options={{
                tabBarIcon: ({color, size}) => (
                  <Icon name="comment" color={color} size={size} />
                ),
              }}
            />
            <Tabs.Screen
              name="Profile"
              component={Profile}
              options={{
                tabBarIcon: ({color, size}) => (
                  <Icon name="user" color={color} size={size} />
                ),
              }}
            />
          </Tabs.Navigator>
        </NavigationContainer>
      </Provider>
    );
  }
}

export default Main;
