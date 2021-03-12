import React, {Component} from 'react';
import {
  Image,
  TouchableHighlight,
  View,
  StyleSheet,
  TextInput,
  Modal,
} from 'react-native';
import {
  Container,
  Content,
  Card,
  CardItem,
  Text,
  Button,
  Item,
  Picker,
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
import Loader from './Loader';
import NumberFormat from 'react-number-format';
import Icon from 'react-native-vector-icons/FontAwesome';
import {TriangleColorPicker} from 'react-native-color-picker';

class DetailOrder extends Component {
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
      domainError: '',
      availability: '',
      themeError: '',
      referensiError: '',
      background: '#fff',
      modalVisible: false,
      methodbayar: '',
      hargaawal: '',
    };
  }
  componentDidMount() {
    this.fetchApi();
  }

  setModalVisible = (visible) => {
    this.setState({modalVisible: visible});
  };
  async fetchApi() {
    this.setState({loading: true});
    const {id} = this.props.route.params;
    await Axios.get(`${BASE_URL}/category/${id}`).then((response) => {
      this.setState({
        nama_category: response.data.category[0].nama_category,
        img: response.data.category[0].img,
        harga: response.data.category[0].harga,
        status: response.data.category[0].status,
        hargaawal: response.data.category[0].harga,
        loading: false,
      });
    });
  }

  Order = async () => {
    if (this.state.theme_color == '') {
      this.setState({themeError: 'Warna Tema Harus Di isi'});
    } else if (this.state.referensi_web == '') {
      this.setState({referensiError: ' Referensi Web Harus Di isi'});
    } else if (
      this.state.theme_color &&
      this.state.referensi_web &&
      this.state.nama_domain
    ) {
      try {
        this.setState({loading: true});
        const data = new FormData();
        data.append('amount', this.state.harga);
        data.append('currency', 'IDR');
        data.append('receipt', 'Receipt no. 1');
        data.append('payment_capture', 1);

        const {id} = this.props.route.params;
        const {getUser} = this.props;

        const authHeader =
          'Basic ' +
          base64.encode(
            `${'rzp_test_q8vKYnHPGhMzH7'}:${'OQa56oAxp91HTYnWIMoSmY2q'}`,
          );
        const response = await Axios.post(
          `https://api.razorpay.com/v1/orders`,
          data,
          {
            headers: {Authorization: authHeader},
          },
        );

        const order = new FormData();
        order.append('id_user', getUser.userDetails.id);
        order.append('id_category', id);
        order.append('nama_domain', this.state.nama_domain);
        order.append('referensi_web', this.state.referensi_web);
        order.append('theme_color', this.state.theme_color);
        order.append('order_razor', response.data.id);
        order.append('status_Order', 'Belum Bayar');

        const response1 = await Axios.post(`${BASE_URL}/order`, order);

        if (response) {
          this.setState({loading: false});
          alert(
            'Order Behasil',
            'Cek Pembayaran Di Profile, Menunggu Pembayaran',
          );
          this.props.navigation.navigate('Produk');
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  handleChangeComplete = (color) => {
    this.setState({background: color.hex});
  };

  async Ubah() {
    if (this.state.methodbayar == 'Lunas') {
      this.setState({harga: this.state.harga * 0.75});
    } else {
      this.setState({harga: this.state.hargaawal});
    }
  }

  async domainValidator() {
    this.setState({loading: true});
    const isValidDomain = require('is-valid-domain');
    if (isValidDomain(this.state.nama_domain)) {
      this.setState({domainError: ' '});
      await Axios.get(
        `https://domain-availability.whoisxmlapi.com/api/v1?apiKey=at_lMQyxi7NeYqF7vZD2fTGVS9ACfj4E&domainName=${this.state.nama_domain}&credits=DA`,
      ).then((response) => {
        this.setState({
          availability: response.data.DomainInfo.domainAvailability,
          loading: false,
        });
      });
      if (this.state.availability === 'UNAVAILABLE') {
        this.setState({domainError: 'Nama Domain Sudah Digunakan'});
      } else {
        this.setState({domainError: ' '});
      }
    } else {
      this.setState({
        domainError: 'Salah nama domain (www.google.com)',
        loading: false,
      });
    }
  }

  render() {
    const {modalVisible} = this.state;
    const {id} = this.props.route.params;
    console.log(this.state.harga);

    console.log(this.state.methodbayar);
    return (
      <Container>
        {this.state.loading ? <Loader /> : null}
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            Alert.alert('Modal has been closed.');
          }}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <TriangleColorPicker
                onColorSelected={(color) => {
                  this.setState({theme_color: color}),
                    this.setModalVisible(!modalVisible);
                }}
                style={{width: 200, height: 200, marginBottom: 10}}
              />
            </View>
          </View>
        </Modal>
        <Content style={{margin: 15, paddingTop: 30}}>
          <Card>
            <Text
              style={{
                textAlign: 'center',
                margin: 10,
                fontSize: 18,
                fontWeight: 'bold',
              }}>
              Detail Order
            </Text>
            <CardItem header>
              <ShimmerPlaceholder
                style={{
                  resizeMode: 'cover',
                  width: wp('80%'),
                  height: hp('20%'),
                }}
                autoRun={true}
                visible={!this.state.loading}>
                <View>
                  <Image
                    style={{
                      resizeMode: 'cover',
                      width: wp('80%'),
                      height: hp('16%'),
                    }}
                    source={{uri: this.state.img}}
                  />
                  <View style={{margin: 15}}>
                    <Text>{this.state.nama_category}</Text>
                    <NumberFormat
                      value={this.state.harga}
                      displayType={'text'}
                      thousandSeparator={true}
                      prefix={'Rp.'}
                      renderText={(value) => <Text>{value}</Text>}
                    />
                  </View>
                  <View style={styles.action}>
                    <FontAwesome name="globe" color={'black'} size={20} />
                    <TextInput
                      value={this.state.nama_domain}
                      placeholder="Nama Domain"
                      placeholderTextColor="#666666"
                      autoCorrect={false}
                      onBlur={() => this.domainValidator()}
                      style={[
                        styles.textInput,
                        {
                          color: 'black',
                        },
                      ]}
                      onChangeText={(text) =>
                        this.setState({nama_domain: text})
                      }
                    />
                  </View>
                  {this.state.availability === 'AVAILABLE' ? (
                    <Text style={{fontSize: 12, color: 'green'}}>
                      Domain Dapat Digunakan
                    </Text>
                  ) : (
                    <Text style={{fontSize: 12, color: 'red'}}>
                      {this.state.domainError}
                    </Text>
                  )}
                  <View style={styles.action}>
                    <FontAwesome name="tint" color={'black'} size={20} />
                    {this.state.theme_color === '' ? (
                      <TouchableOpacity
                        style={{marginLeft: 10}}
                        onPress={() => {
                          this.setModalVisible(true);
                        }}>
                        <Text style={{color: '#666666', fontSize: 14}}>
                          Pilih Warna Tema
                        </Text>
                      </TouchableOpacity>
                    ) : (
                      // <View>
                      <>
                        <View
                          style={{
                            marginLeft: 20,
                            width: 100,
                            height: 30,
                            borderRadius: 8,
                            alignItems: 'center',
                            backgroundColor: this.state.theme_color,
                          }}
                        />
                        <TouchableOpacity
                          onPress={() => {
                            this.setState({theme_color: ''});
                          }}>
                          <Text style={{marginLeft: 30}}>Reset</Text>
                        </TouchableOpacity>
                      </>
                    )}
                  </View>
                  <Text style={{fontSize: 12, color: 'red'}}>
                    {this.state.themeError}
                  </Text>
                  <View style={styles.action}>
                    <FontAwesome
                      name="address-book"
                      color={'black'}
                      size={20}
                    />
                    <TextInput
                      value={this.state.referensi_web}
                      placeholder="Referensi Web"
                      placeholderTextColor="#666666"
                      autoCorrect={false}
                      style={[
                        styles.textInput,
                        {
                          color: 'black',
                        },
                      ]}
                      onChangeText={(text) =>
                        this.setState({referensi_web: text})
                      }
                    />
                  </View>
                  <Text style={{fontSize: 12, color: 'red'}}>
                    {this.state.referensiError}
                  </Text>
                  <Text>Metode Pembayaran</Text>
                  <Item picker>
                    <Picker
                      mode="dropdown"
                      iosIcon={<Icon name="arrow-down" />}
                      style={{width: undefined}}
                      placeholderStyle={{color: '#bfc6ea'}}
                      placeholderIconColor="#007aff"
                      selectedValue={this.state.methodbayar}
                      onValueChange={(value) => {
                        this.setState({
                          methodbayar: value,
                        });
                        this.Ubah();
                      }}>
                      <Picker.Item label="DP 75%" value="DP 75%" />
                      <Picker.Item label="Lunas" value="Lunas" />
                    </Picker>
                  </Item>
                  <TouchableOpacity onPress={() => this.Order()}>
                    <Button full>
                      <Text>Order Now</Text>
                    </Button>
                  </TouchableOpacity>
                </View>
              </ShimmerPlaceholder>
            </CardItem>
          </Card>
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
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    width: 300,
    height: 300,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  openButton: {
    backgroundColor: '#F194FF',
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
});

mapStateToProps = (state) => ({
  authData: state.authReducer.authData,
  getUser: state.userReducer.getUser,
});

mapDispatchToProps = (dispatch) => ({
  dispatch,
});

export default connect(mapStateToProps, mapDispatchToProps)(DetailOrder);
