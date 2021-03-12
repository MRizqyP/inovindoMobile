import React, {Component} from 'react';
import {
  StyleSheet,
  ScrollView,
  View,
  ImageBackground,
  Text,
  TouchableOpacity,
} from 'react-native';
import Icons from 'react-native-vector-icons/FontAwesome';
import {Header, Item, Input, Icon, Button} from 'native-base';
import {Container, Content, List, ListItem} from 'native-base';
import {FlatList} from 'react-native-gesture-handler';
import Axios from 'axios';
import {BASE_URL} from '../service/base_url';
import _ from 'lodash';

class PusatBantuan extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      fulldata: [],
      categorypertanyaan: [],
      loading: false,
      fakeData: [1, 2, 3, 4, 5],
      query: '',
    };
  }
  componentDidMount() {
    this.fetchApi();
  }

  fetchApi = async () => {
    this.setState({loading: true});
    await Axios.get(`${BASE_URL}/pertanyaan`)
      .then((response) => {
        this.setState({
          data: response.data.pertanyaan,
          fulldata: response.data.pertanyaan,
          loading: false,
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
    await Axios.get(`${BASE_URL}/categorypertanyaan`)
      .then((response) => {
        this.setState({
          categorypertanyaan: response.data.category_pertanyaan,
          loading: false,
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
  };

  _renderItem = ({item, index}) => {
    return (
      <View>
        <ListItem>
          <TouchableOpacity
            onPress={() => {
              this.props.navigation.navigate('Detail Pertanyaan', {
                id: item.id_pertanyaan,
              });
            }}>
            <Text>{item.pertanyaan}</Text>
          </TouchableOpacity>
        </ListItem>
      </View>
    );
  };
  _renderItemCard = ({item, index}) => {
    return (
      <ListItem>
        <Text>{item.nama_category}</Text>
      </ListItem>
    );
  };

  handleSearch = (text) => {
    const formmatedQuery = text;
    const data = _.filter(this.state.fulldata, (pertanyaan) => {
      if (pertanyaan.pertanyaan.includes(formmatedQuery)) {
        return true;
      }
      return false;
    });
    this.setState({data, query: text});
  };

  render() {
    console.log(this.state.data);
    return (
      <View style={styles.container}>
        <ImageBackground
          source={require('../images/bgprofile.png')}
          style={styles.image}>
          <View style={styles.profilepicture}>
            <Text style={{fontSize: 25, fontWeight: 'bold'}}>
              Pusat Bantuan
            </Text>
          </View>
          <View style={{margin: 20}}>
            <Text style={{fontSize: 19, color: 'white', fontWeight: '500'}}>
              Hai, apa yang bisa kami bantu?
            </Text>
          </View>
          <Header searchBar rounded style={{backgroundColor: '#1B92FA'}}>
            <Item>
              <Icon name="ios-search" />
              <Input placeholder="Search" onChangeText={this.handleSearch} />
            </Item>
          </Header>
          <View style={{margin: 20, flex: 1}}>
            <Text style={styles.textTitle}>Pertanyaan Populer</Text>
            <List>
              <FlatList
                data={this.state.data}
                renderItem={this._renderItem}
                keyExtractor={(item, index) => index.toString()}
              />
            </List>

            <Text style={styles.textTitle}>Kategori Pertanyaan</Text>
            <List>
              <FlatList
                data={this.state.categorypertanyaan}
                renderItem={this._renderItemCard}
                keyExtractor={(item, index) => index.toString()}
              />
            </List>
          </View>
        </ImageBackground>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    flex: 1,
    resizeMode: 'cover',
  },
  textTitle: {
    fontSize: 18,
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
});

export default PusatBantuan;
