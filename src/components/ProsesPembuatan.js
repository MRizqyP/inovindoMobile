import React, {Component} from 'react';
import {Image, FlatList, View, StyleSheet, TextInput} from 'react-native';
import {
  Container,
  Content,
  List,
  ListItem,
  Thumbnail,
  Text,
  Left,
  Body,
  Right,
  Button,
  Icon,
} from 'native-base';
import Axios from 'axios';
import {BASE_URL} from '../service/base_url';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import ShimmerPlaceholder from 'react-native-shimmer-placeholder';
import {TouchableOpacity} from 'react-native-gesture-handler';
import base64 from 'react-native-base64';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {connect} from 'react-redux';

class ProsesPembuatan extends Component {
  constructor(props) {
    super(props);
    this.state = {
      category: [],
      fakeData: [1, 2, 3, 4, 5],
      nama_category: '',
      harga: '',
      img: ' ',
      status: '',
      nama_domain: '',
      referensi_web: '',
      theme_color: '',
      status_Order: '',
      loading: true,
    };
  }
  componentDidMount() {
    this.fetchApi();
  }

  async fetchApi() {
    this.setState({loading: true});
    const {getUser} = this.props;
    await Axios.get(
      `${BASE_URL}/order/user/proses/${getUser.userDetails.id}`,
    ).then((response) => {
      console.log(response.data.order);
      this.setState({
        category: response.data.order,
        loading: false,
      });
    });
  }

  _renderItem = ({item, index}) => {
    return (
      <View>
        {item.status_Order === 'Sedang Proses Pembuatan' ? (
          <ListItem thumbnail>
            <Left>
              <Thumbnail square source={{uri: item.category.img}} />
            </Left>
            <Body>
              <Text>{item.category.nama_category}</Text>
              <Text note numberOfLines={1}>
                Rp. {item.category.harga}
              </Text>
            </Body>
            <Right>
              <Button transparent>
                <TouchableOpacity
                  onPress={() =>
                    this.props.navigation.navigate('Detail Order Web', {
                      id: item.id_order,
                    })
                  }>
                  <Text>View</Text>
                </TouchableOpacity>
              </Button>
            </Right>
          </ListItem>
        ) : (
          <Text>Tidak ada Orderan</Text>
        )}
      </View>
    );
  };

  render() {
    const {getUser} = this.props;
    console.log(this.state.category);
    return (
      <Container>
        <Content>
          <FlatList
            data={this.state.category}
            renderItem={this._renderItem}
            keyExtractor={(item, index) => index.toString()}
          />
        </Content>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  textDesc: {
    paddingTop: 15,
    alignItems: 'center',
    flexDirection: 'row',
  },
  action: {
    flexDirection: 'row',
    marginTop: 7,
    marginBottom: 7,
    borderBottomWidth: 1,
    borderBottomColor: '#f2f2f2',
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
  getUser: state.userReducer.getUser,
});

mapDispatchToProps = (dispatch) => ({
  dispatch,
});

export default connect(mapStateToProps, mapDispatchToProps)(ProsesPembuatan);
