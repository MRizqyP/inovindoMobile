import React, {Component} from 'react';
import {
  Image,
  FlatList,
  View,
  StyleSheet,
  Alert,
  TextInput,
  RefreshControl,
} from 'react-native';
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
import ShimmerPlaceholder from 'react-native-shimmer-placeholder';
import {ScrollView, TouchableOpacity} from 'react-native-gesture-handler';
import base64 from 'react-native-base64';
import NumberFormat from 'react-number-format';
import {connect} from 'react-redux';

class MenungguPembayaran extends Component {
  constructor(props) {
    super(props);
    this.state = {
      category: [],
      fakeData: [1, 2, 3, 4, 5],
      nama_category: '',
      id_order: '',
      img: ' ',
      status: '',
      nama_domain: '',
      referensi_web: '',
      theme_color: '',
      status_Order: '',
      loading: true,
      refreshing: false,
    };
  }
  componentDidMount() {
    this.fetchApi();
  }

  async fetchApi() {
    this.setState({loading: true});
    const {getUser} = this.props;
    await Axios.get(`${BASE_URL}/order/user/${getUser.userDetails.id}`).then(
      (response) => {
        this.setState({
          category: response.data.order,
          id_order: response.data.order[0].id_order,
          loading: false,
        });
      },
    );
  }

  _onRefresh = async () => {
    this.setState({refreshing: true});
    const {getUser} = this.props;
    this.setState({loading: true});
    await Axios.get(`${BASE_URL}/order/user/${getUser.userDetails.id}`).then(
      (response) => {
        this.setState({
          category: response.data.order,
          id_order: response.data.order[0].id_order,
          loading: false,
          refreshing: false,
        });
      },
    );
  };

  deleteOrder() {
    Alert.alert('Cancel Order', 'Apakah Anda yakin?', [
      {text: 'NO', onPress: () => console.warn('NO Pressed'), style: 'cancel'},
      {
        text: 'YES',
        onPress: async () => {
          try {
            this.setState({isLoading: true});
            const response1 = await Axios.delete(
              `${BASE_URL}/order/${this.state.id_order}`,
            );

            if (response1) {
              this.setState({isLoading: false});
            }
          } catch (error) {
            console.log(error);
          }
        },
      },
    ]);
  }
  _renderItem = ({item, index}) => {
    return (
      <View>
        {item.status_Order === 'Belum Bayar' ? (
          <ListItem thumbnail>
            <Left>
              <ShimmerPlaceholder autoRun={true} visible={!this.state.loading}>
                <Thumbnail square source={{uri: item.category.img}} />
              </ShimmerPlaceholder>
            </Left>
            <Body>
              <Text>{item.category.nama_category}</Text>
            </Body>
            <Right>
              <Button transparent>
                <TouchableOpacity
                  onPress={() =>
                    this.props.navigation.navigate('Pembayaran', {
                      id: item.id_order,
                    })
                  }>
                  <Text>View</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => this.deleteOrder()}>
                  <Icon ios="trash" android="trash" style={{fontSize: 20}} />
                </TouchableOpacity>
              </Button>
            </Right>
          </ListItem>
        ) : null}
      </View>
    );
  };

  render() {
    const {getUser} = this.props;
    console.log(this.state.id_order);
    return (
      <Container>
        <ScrollView
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this._onRefresh.bind(this)}
            />
          }>
          <Content>
            <List>
              <FlatList
                data={this.state.category}
                renderItem={this._renderItem}
                keyExtractor={(item, index) => index.toString()}
              />
            </List>
          </Content>
        </ScrollView>
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

export default connect(mapStateToProps, mapDispatchToProps)(MenungguPembayaran);
