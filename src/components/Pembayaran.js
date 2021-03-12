import React, {Component} from 'react';
import {
  Image,
  Modal,
  NativeModules,
  View,
  StyleSheet,
  TextInput,
  PermissionsAndroid,
  Platform,
  TouchableHighlight,
} from 'react-native';
import {
  Container,
  Content,
  List,
  ListItem,
  Thumbnail,
  Text,
  Card,
  CardItem,
  Button,
  Left,
  Body,
  Right,
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
import {ScrollView, TouchableOpacity} from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/FontAwesome';
import {connect} from 'react-redux';
import RazorpayCheckout from 'react-native-razorpay';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import base64 from 'react-native-base64';

import NumberFormat from 'react-number-format';

var PSPDFKit = NativeModules.PSPDFKit;

class Pembayaran extends Component {
  constructor(props) {
    super(props);
    this.state = {
      category: [],
      fakeData: [1, 2, 3, 4, 5],
      nama_category: '',
      harga: '',
      hargaawal: '',
      img: ' ',
      status: '',
      nama_domain: '',
      referensi_web: '',
      theme_color: '',
      status_Order: '',
      order_razor: '',
      loading: true,
      filePath: '',
      position: 'bottom',
      modalVisible: false,
      methodbayar: '',
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
    await Axios.get(`${BASE_URL}/order/${id}`).then((response) => {
      this.setState({
        img: response.data.order[0].category.img,
        nama_domain: response.data.order[0].nama_domain,
        referensi_web: response.data.order[0].referensi_web,
        theme_color: response.data.order[0].theme_color,
        order_razor: response.data.order[0].order_razor,
        nama_category: response.data.order[0].category.nama_category,
        // harga: response.data.order[0].category.harga,
        hargaawal: response.data.order[0].category.harga,
        loading: false,
      });
    });
    const authHeader =
      'Basic ' +
      base64.encode(
        `${'rzp_test_q8vKYnHPGhMzH7'}:${'OQa56oAxp91HTYnWIMoSmY2q'}`,
      );
    const response = await Axios.get(
      `https://api.razorpay.com/v1/orders/${this.state.order_razor}`,
      {
        headers: {Authorization: authHeader},
      },
    );
    this.setState({harga: response.data.amount});
    const {getUser} = this.props;
    await Axios.get(`${BASE_URL}/api/user/${getUser.userDetails.id}`).then(
      (response) => {
        this.setState({
          loading: false,
        });
      },
    );
  }

  isPermitted = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          {
            title: 'External Storage Write Permission',
            message: 'App needs access to Storage data',
          },
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        alert('Write permission err', err);
        return false;
      }
    } else {
      return true;
    }
  };

  createPDF = async () => {
    const {getUser} = this.props;
    this.isPermitted();
    if (await this.isPermitted) {
      let options = {
        //Content to print
        html: `<div      style="        position: absolute;        left: 50%;        margin-left: -297px;        top: 0px;        width: 595px;        height: 842px;        border-style: outset;        overflow: hidden;      "    >      <div style="position: absolute; left: 0px; top: 0px;">        <img          src="background1.jpg"          width="595"          height="842"        />      </div>      <div        style="position: absolute; left: 334.9px; top: 5.4px;"        class="cls_002"      >        <span class="cls_002">PT. INOVINDO DIGITAL MEDIA</span>      </div>      <div        style="position: absolute; left: 299.5px; top: 33px;"        class="cls_004"      >        <span class="cls_004"          >Kantor. Paskal Hyper Square C-29, Kota Bandung</span        >      </div>      <div        style="position: absolute; left: 286.3px; top: 47.83px;"        class="cls_004"      >        <span class="cls_004">Telp. (022) 87790997 Website. </span        ><a href="http://www.inovindo.co.id/">www.inovindo.co.id</a>      </div>      <div        style="position: absolute; left: 269.27px; top: 90.62px;"        class="cls_012"      >        <span class="cls_012">INVOICE</span>      </div>      <div        style="position: absolute; left: 231.68px; top: 107.03px;"        class="cls_008"      >        <span class="cls_008"></span>      </div>      <div        style="position: absolute; left: 63.83px; top: 150.22px;"        class="cls_009"      >        <span class="cls_009">KepadaYth.</span>      </div>      <div        style="position: absolute; left: 326.1px; top: 150.22px;"        class="cls_009"      >        <span class="cls_009">Tanggal</span>      </div>      <div        style="position: absolute; left: 423.93px; top: 150.22px;"        class="cls_009"      >        <span class="cls_009">: 24/11/2020</span>      </div>      <div        style="position: absolute; left: 63.83px; top: 166.25px;"        class="cls_008"      >        <span class="cls_008">${getUser.userDetails.first_name} ${getUser.userDetails.last_name}</span>      </div>      <div        style="position: absolute; left: 326.1px; top: 166.25px;"        class="cls_009"      >        <span class="cls_009">Mata Uang</span>      </div>      <div        style="position: absolute; left: 423.93px; top: 166.25px;"        class="cls_009"      >        <span class="cls_009">: Rupiah</span>      </div>      <div        style="position: absolute; left: 326.1px; top: 197.85px;"        class="cls_009"      >        <span class="cls_009">Cara Pembayaran</span>      </div>      <div        style="position: absolute; left: 425.52px; top: 197.85px;"        class="cls_009"      >        <span class="cls_009">: Transfer Bank</span>      </div>      <div        style="position: absolute; left: 235.27px; top: 233.05px;"        class="cls_008"      >        <span class="cls_008">Deskripsi</span>      </div>      <div        style="position: absolute; left: 479.35px; top: 233.05px;"        class="cls_008"      >        <span class="cls_008">Biaya</span>      </div>      <div        style="position: absolute; left: 71.03px; top: 265.67px;"        class="cls_009"      >        <span class="cls_009">Pembayaran Pembuatan website </span        ><span class="cls_008">${this.state.nama_domain}</span>      </div>      <div        style="position: absolute; left: 484.95px; top: 264.47px;"        class="cls_010"      >        <span class="cls_010">${this.state.harga}</span>      </div>      <div        style="position: absolute; left: 406.32px; top: 298.67px;"        class="cls_008"      >        <span class="cls_008">TOTAL</span>      </div>      <div        style="position: absolute; left: 484.95px; top: 298.67px;"        class="cls_011"      >        <span class="cls_011">${this.state.harga}</span>      </div>      <div        style="position: absolute; left: 63.83px; top: 335.67px;"        class="cls_009"      >        <span class="cls_009"          >Pembayaran untuk invoice ini mohon ditransfer ke rekening :</span        >      </div>      <div        style="position: absolute; left: 63.83px; top: 351.48px;"        class="cls_008"      >        <span class="cls_008">BCA</span><span class="cls_009"> 7750855541</span>      </div>      <div        style="position: absolute; left: 63.83px; top: 367.27px;"        class="cls_009"      >        <span class="cls_009">An. Novi Setia Nurviat</span>      </div> <div style="position:absolute;left:63.83px;top:383.27px" ><span> atau melalui Aplikasi </span> </div>      <div        style="position: absolute; left: 422.73px; top: 399.1px;"        class="cls_009"      >        <span class="cls_009">Hormat kami,</span>      </div>      <div        style="position: absolute; left: 389.33px; top: 414.9px;"        class="cls_009"      >        <span class="cls_009">PT. Inovindo Digital Media</span>      </div>      <div        style="position: absolute; left: 435.72px; top: 510.12px;"        class="cls_009"      >        <span class="cls_009">Direktur</span>      </div>    </div> `,
        //File Name
        fileName: 'invoice',
        //File directory
        directory: 'inovindo',
      };
      let file = await RNHTMLtoPDF.convert(options);

      this.setState({filePath: file.filePath});
      const DOCUMENT = this.state.filePath;
      const CONFIGURATION = {
        scrollContinuously: false,
        showPageNumberOverlay: true,
        pageScrollDirection: 'vertical',
      };
      PSPDFKit.present(DOCUMENT, CONFIGURATION);
    }
  };

  render() {
    const {getUser} = this.props;
    const {modalVisible} = this.state;
    console.log();
    return (
      <Container>
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            Alert.alert('Modal has been closed.');
          }}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Item picker>
                <Picker
                  mode="dropdown"
                  iosIcon={<Icon name="arrow-down" />}
                  style={{width: undefined}}
                  placeholderStyle={{color: '#bfc6ea'}}
                  placeholderIconColor="#007aff"
                  selectedValue={this.state.methodbayar}
                  onValueChange={(value) =>
                    this.setState({
                      methodbayar: value,
                    })
                  }>
                  <Picker.Item label="DP 75%" value="DP 75%" />
                  <Picker.Item label="Lunas" value="Lunas" />
                </Picker>
              </Item>

              <TouchableHighlight
                style={{
                  ...styles.openButton,
                  backgroundColor: '#2196F3',
                  marginTop: 20,
                }}
                onPress={() => {
                  this.setModalVisible(!modalVisible);
                  if (this.state.methodbayar === 'DP 75%') {
                    this.setState({harga: this.state.harga * 0.75});
                  } else {
                    this.setState({harga: this.state.hargaawal});
                  }
                }}>
                <Text style={styles.textStyle}>Pilih</Text>
              </TouchableHighlight>
            </View>
          </View>
        </Modal>
        <ScrollView style={{flex: 1}}>
          <Content>
            <Card>
              <Text
                style={{
                  textAlign: 'center',
                  margin: 10,
                  fontSize: 18,
                  fontWeight: 'bold',
                }}>
                Detail Produk
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
                        style={[
                          styles.textInput,
                          {
                            color: 'black',
                          },
                        ]}
                      />
                    </View>
                    <View style={styles.action}>
                      <FontAwesome name="tint" color={'black'} size={20} />
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
                    </View>
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
                      />
                    </View>
                  </View>
                </ShimmerPlaceholder>
              </CardItem>
            </Card>
            <Card>
              <Text
                style={{
                  textAlign: 'center',
                  margin: 10,
                  fontSize: 18,
                  fontWeight: 'bold',
                }}>
                Detail Users
              </Text>
              <CardItem header>
                <Content>
                  <List>
                    <ListItem avatar>
                      <Body>
                        <Text>
                          {getUser.userDetails.first_name}{' '}
                          {getUser.userDetails.last_name}
                        </Text>
                        <Text note>{getUser.userDetails.email}</Text>
                      </Body>
                      <Right>
                        {getUser.userDetails.accessToken ? (
                          <FontAwesome
                            name="certificate"
                            color={'green'}
                            size={30}
                          />
                        ) : (
                          <FontAwesome
                            name="certificate"
                            color={'gray'}
                            size={30}
                          />
                        )}
                      </Right>
                    </ListItem>
                  </List>
                </Content>
              </CardItem>
            </Card>
            <View
              style={{
                margin: 10,
                justifyContent: 'space-around',
                flexDirection: 'row',
                flexWrap: 'wrap',
              }}>
              {/* 
                   </TouchableOpacity> */}

              <TouchableOpacity onPress={this.createPDF}>
                <Button info>
                  <Text>Download Invoice</Text>
                </Button>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  var options = {
                    description: this.state.nama_category,
                    image: this.state.img,
                    currency: 'IDR',
                    key: 'rzp_test_q8vKYnHPGhMzH7',
                    amount: 1500,
                    name: 'Inovindo',
                    order_id: this.state.order_razor, //Replace this with an order_id created using Orders API. Learn more at https://razorpay.com/docs/api/orders.
                    prefill: {
                      email: getUser.userDetails.email,
                      contact: '082218456868',
                      name: getUser.userDetails.first_name,
                    },
                    theme: {color: '#53a20e'},
                  };
                  RazorpayCheckout.open(options)
                    .then(async (data) => {
                      const {id} = this.props.route.params;
                      const response1 = await Axios.put(
                        `${BASE_URL}/order/${id}`,
                        {
                          status_Order: 'Sedang Proses Pembuatan',
                        },
                      );
                      console.log(response1);
                      alert(`Pembayaran Berhasil`);
                      this.props.navigation.navigate('Profile');
                    })
                    .catch((error) => {
                      // handle failure
                      alert(`Pembayaran Cancel`);
                    });
                }}>
                <Button success>
                  <Text>Bayar</Text>
                </Button>
              </TouchableOpacity>
            </View>
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
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
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

export default connect(mapStateToProps, mapDispatchToProps)(Pembayaran);
