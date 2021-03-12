import React, {Component} from 'react';
import {Button, TouchableOpacity} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import 'react-native-gesture-handler';
import {createStackNavigator, HeaderBackButton} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/FontAwesome';
import Login from './components/Login';
import Register from './components/Register';
import Home from './components/Home';
import Produk from './components/Produk';
import Profile from './components/Profile';
import Chat from './components/Chat';
import ListProduk from './components/ListProduk';
import EditProfile from './components/EditProfile';
import NyobChat from './components/NyobChat';
import PusatBantuan from './components/PusatBantuan';
import DetailPromo from './components/DetailPromo';
import DetailPertanyaan from './components/DetailPertanyaan';
import DetailOrder from './components/DetailOrder';
import MenungguPembayaran from './components/MenungguPembayaran';
import Pembayaran from './components/Pembayaran';
import ProsesPembuatan from './components/ProsesPembuatan';
import DetailOrderWeb from './components/DetailOrderWeb';
import PembayaranSelanjutnya from './components/PembayaranSelanjutnya';
import {func} from 'prop-types';
import {Layanan} from './actions/auth-actions';
import Coba from './components/Coba';

const Tabs = createBottomTabNavigator();

const Logins = createStackNavigator();
const NavProduk = createStackNavigator();
const PusatBantuans = createStackNavigator();

function Profiles({navigation}) {
  return (
    <Logins.Navigator>
      <Logins.Screen
        name="Profile"
        component={Profile}
        options={{
          headerTransparent: true,
          headerRight: () => (
            <TouchableOpacity
              onPress={() => navigation.navigate('EditProfile')}>
              <Icon
                name="edit"
                color={'black'}
                size={25}
                style={{paddingRight: 15}}
              />
            </TouchableOpacity>
          ),
          headerTitle: '',
        }}
      />
      <Logins.Screen
        name="EditProfile"
        component={EditProfile}
        options={{
          headerTransparent: true,

          // headerTitle: 'Edit Profile',
        }}
      />
      <Logins.Screen
        name="Pusat Bantuan"
        component={PusatBantuann}
        options={{
          headerTransparent: true,
          headerTitle: '',
        }}
      />
      <Logins.Screen name="MenungguPembayaran" component={MenungguPembayaran} />
      <Logins.Screen name="Pembayaran" component={Pembayaran} />
      <Logins.Screen name="Proses Pembuatan" component={ProsesPembuatan} />
      <Logins.Screen
        name="Pembayaran Selanjutnya"
        component={PembayaranSelanjutnya}
      />
      <Logins.Screen
        name="Detail Order Web"
        component={DetailOrderWeb}
        options={{
          headerTransparent: true,
          headerTitle: '',
        }}
      />
    </Logins.Navigator>
  );
}

function PusatBantuann() {
  return (
    <PusatBantuans.Navigator screenOptions={{headerShown: false}}>
      <PusatBantuans.Screen name="Pusat Bantuan" component={PusatBantuan} />
      <PusatBantuans.Screen
        name="Detail Pertanyaan"
        component={DetailPertanyaan}
      />
    </PusatBantuans.Navigator>
  );
}

function Chats() {
  return (
    <Logins.Navigator screenOptions={{headerShown: false}}>
      {/* <Logins.Screen name="Chat" component={Chat} /> */}
      <Logins.Screen
        name="NyobChat"
        component={NyobChat}
        options={NyobChat.navigationOptions}
      />
    </Logins.Navigator>
  );
}

function Produks({navigation}) {
  return (
    <NavProduk.Navigator>
      <NavProduk.Screen
        name="Produk"
        component={Produk}
        options={{
          headerTransparent: true,
          headerTitle: '',
        }}
      />
      <NavProduk.Screen
        name="ListProduk"
        component={ListProduk}
        options={{
          headerTransparent: true,
          headerTitle: '',
        }}
      />
      <NavProduk.Screen
        name="DetailPromo"
        component={DetailPromo}
        options={{
          headerTransparent: true,
          headerTitle: '',
        }}
      />
      <NavProduk.Screen
        name="DetailOrder"
        component={DetailOrder}
        options={{
          headerTransparent: true,
          headerTitle: '',
        }}
      />
    </NavProduk.Navigator>
  );
}

function Homes({navigation}) {
  return (
    <NavProduk.Navigator>
      <NavProduk.Screen
        name="Home"
        component={Home}
        options={{
          headerTransparent: true,
          headerTitle: '',
        }}
      />
      <NavProduk.Screen
        name="DetailPromo"
        component={DetailPromo}
        options={{
          headerTransparent: true,
          headerTitle: '',
        }}
      />
      <NavProduk.Screen
        name="Detail Order Web"
        component={DetailOrderWeb}
        options={{
          headerTransparent: true,
          headerTitle: '',
        }}
      />
    </NavProduk.Navigator>
  );
}

export default class Routes extends Component {
  render() {
    return (
      <NavigationContainer>
        {this.props.isLoggedIn ? (
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
                backgroundColor: '#4FADFE',
                borderTopLeftRadius: 16,
                borderTopRightRadius: 16,
              },
              keyboardHidesTabBar: true,
            }}>
            <Tabs.Screen
              name="Home"
              component={Homes}
              options={{
                tabBarIcon: ({color, size}) => (
                  <Icon name="home" color={color} size={size} />
                ),
              }}
            />
            <Tabs.Screen
              name="Produk"
              component={Produks}
              options={{
                tabBarIcon: ({color, size}) => (
                  <Icon name="list" color={color} size={size} />
                ),
              }}
            />
            <Tabs.Screen
              name="Chat"
              component={Chats}
              options={{
                tabBarIcon: ({color, size}) => (
                  <Icon name="comment" color={color} size={size} />
                ),
              }}
            />
            <Tabs.Screen
              name="Profile"
              component={Profiles}
              options={{
                tabBarIcon: ({color, size}) => (
                  <Icon name="user" color={color} size={size} />
                ),
              }}
            />
          </Tabs.Navigator>
        ) : (
          <Logins.Navigator screenOptions={{headerShown: false}}>
            <Logins.Screen name="Log In" component={Login} />
            <Logins.Screen name="Sign Up" component={Register} />
          </Logins.Navigator>
        )}
      </NavigationContainer>
    );
  }
}
