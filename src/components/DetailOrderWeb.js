import React, {Component} from 'react';
import {
  Image,
  FlatList,
  View,
  StyleSheet,
  TextInput,
  Modal,
  TouchableHighlight,
  RefreshControl,
  NativeModules,
} from 'react-native';
import {
  Container,
  Content,
  Text,
  Card,
  CardItem,
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
import {ScrollView, TouchableOpacity} from 'react-native-gesture-handler';
import base64 from 'react-native-base64';
import {connect} from 'react-redux';
import moment from 'moment';
import Loader from './BackgroundModal';
import Icon from 'react-native-vector-icons/FontAwesome';
import NumberFormat from 'react-number-format';
import RazorpayCheckout from 'react-native-razorpay';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
var PSPDFKit = NativeModules.PSPDFKit;
class Pembayaran extends Component {
  constructor(props) {
    super(props);
    this.state = {
      category: [],
      fakeData: [1, 2, 3, 4, 5],
      description: '',
      amount: '',
      email: ' ',
      contact: '',
      createdAt: '',
      harga: '',
      referensi_web: '',
      nama_domain: '',
      status_Order: '',
      desc_maintenence: '',
      desc_maintenence1: '',
      loading: true,
      detailorder: [],
      modalVisible: false,
      maintenenceorder: [],
      status_maintenence: '',
      refreshing: false,
      filePath: '',
    };
  }
  componentDidMount() {
    this.fetchApi();
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
        // alert('Write permission err', err);
        return false;
      }
    } else {
      return true;
    }
  };

  setModalVisible = (visible) => {
    this.setState({modalVisible: visible});
  };

  async fetchApi() {
    this.setState({loading: true});
    const {id} = this.props.route.params;

    const {getUser} = this.props;
    await Axios.get(`${BASE_URL}/order/user/${getUser.userDetails.id}`).then(
      (response) => {
        // console.log(response);
        this.setState({
          nama_domain: response.data.order[0].nama_domain,
          status_Order: response.data.order[0].status_Order,
          createdAt: response.data.order[0].createdAt,
          harga: response.data.order[0].category.harga,
          loading: false,
        });
      },
    );
    const {id_razor} = this.props.route.params;
    const authHeader =
      'Basic ' +
      base64.encode(
        `${'rzp_test_q8vKYnHPGhMzH7'}:${'OQa56oAxp91HTYnWIMoSmY2q'}`,
      );
    await Axios.get(`https://api.razorpay.com/v1/orders/${id_razor}/payments`, {
      headers: {Authorization: authHeader},
    }).then((response) => {
      // console.log(response);
      this.setState({
        detailorder: response.data.items,
        description: response.data.items[0].description,
        amount: response.data.items[0].amount,
        email: response.data.items[0].email,
        contact: response.data.items[0].contact,
        loading: false,
      });
    });
    await Axios.get(`${BASE_URL}/maintenenceorder/${id}`).then((response) => {
      this.setState({
        maintenenceorder: response.data.maintenence,
        // status_maintenence: response.data.maintenence.status_maintenence,
        loading: false,
      });
    });
  }
  createPDF = async () => {
    const {getUser} = this.props;
    // const tanggal =
    this.isPermitted();
    if (await this.isPermitted) {
      let options = {
        //Content to print
        html: `<div style="position:absolute;left:50%;margin-left:-297px;top:0px;width:595px;height:842px;border-style:outset;overflow:hidden"><div style="position:absolute;left:0px;top:0px"><img src="801ff23a-3e44-11eb-8b25-0cc47a792c0a_id_801ff23a-3e44-11eb-8b25-0cc47a792c0a_files/background1.jpg" width=595 height=842></div><div style="position:absolute;left:334.99px;top:13.76px" class="cls_003"><span class="cls_003">PT. INOVINDO DIGITAL MEDIA</span></div><div style="position:absolute;left:299.59px;top:32.96px" class="cls_004"><span class="cls_004">Kantor. Paskal Hyper Square C-29, Kota Bandung</span></div><div style="position:absolute;left:286.39px;top:47.72px" class="cls_004"><span class="cls_004">Telp. (022) 87790997 Website. </span><A HREF="http://www.inovindo.co.id/">www.inovindo.co.id</A> </div><div style="position:absolute;left:269.33px;top:89.02px" class="cls_020"><span class="cls_020">INVOICE</span></div><div style="position:absolute;left:232.13px;top:105.46px" class="cls_009"><span class="cls_009">No. 192/IDM/INV/III/2020</span></div><div style="position:absolute;left:64.10px;top:148.54px" class="cls_008"><span class="cls_008">KepadaYth.</span></div><div style="position:absolute;left:326.47px;top:148.54px" class="cls_008"><span class="cls_008">Tanggal</span></div><div style="position:absolute;left:424.42px;top:148.54px" class="cls_008"><span class="cls_008">: 16/12/2020</span></div><div style="position:absolute;left:64.10px;top:164.62px" class="cls_009"><span class="cls_009">${
          getUser.userDetails.first_name
        } ${
          getUser.userDetails.last_name
        }</span></div><div style="position:absolute;left:326.47px;top:164.62px" class="cls_008"><span class="cls_008">Mata Uang</span></div><div style="position:absolute;left:424.42px;top:164.62px" class="cls_008"><span class="cls_008">: Rupiah</span></div><div style="position:absolute;left:235.97px;top:202.54px" class="cls_009"><span class="cls_009">Deskripsi</span></div><div style="position:absolute;left:480.22px;top:202.54px" class="cls_009"><span class="cls_009">Biaya</span></div><div style="position:absolute;left:71.78px;top:235.09px" class="cls_008"><span class="cls_008">Pembayaran Pembuatan website </span><span class="cls_009">${
          this.state.nama_domain
        }</span></div><div style="position:absolute;left:486.00px;top:234.85px" class="cls_012"><span class="cls_012">${
          this.state.harga
        }</span></div><div style="position:absolute;left:407.26px;top:267.97px" class="cls_009"><span class="cls_009">TOTAL</span></div><div style="position:absolute;left:486.00px;top:268.93px" class="cls_013"><span class="cls_013">${
          this.state.harga
        }</span></div><div style="position:absolute;left:63.86px;top:305.05px" class="cls_008"><span class="cls_008">Transaksi</span></div><div style="position:absolute;left:81.26px;top:335.89px" class="cls_009"><span class="cls_009">Tanggal Transaksi</span></div><div style="position:absolute;left:281.83px;top:335.89px" class="cls_009"><span class="cls_009">Gateway</span></div><div style="position:absolute;left:480.34px;top:335.89px" class="cls_009"><span class="cls_009">Biaya</span></div><div style="position:absolute;left:136.34px;top:368.41px" class="cls_008"><span class="cls_008">${moment(
          this.state.createdAt,
        )
          .locale('id')
          .format(
            'L',
          )}</span></div><div style="position:absolute;left:340.03px;top:368.17px" class="cls_012"><span class="cls_012">VISA</span></div><div style="position:absolute;left:471.22px;top:368.41px" class="cls_011"><span class="cls_011">${
          this.state.amount
        }</span></div><div style="position:absolute;left:410.98px;top:402.39px" class="cls_013"><span class="cls_013">TOTAL</span></div><div style="position:absolute;left:469.90px;top:402.39px" class="cls_013"><span class="cls_013">${
          this.state.amount
        }</span></div><div style="position:absolute;left:63.86px;top:477.15px" class="cls_015"><span class="cls_015">Paid</span></div><div style="position:absolute;left:422.86px;top:500.67px" class="cls_008"><span class="cls_008">Hormat kami,</span></div><div style="position:absolute;left:389.50px;top:516.51px" class="cls_008"><span class="cls_008">PT. Inovindo Digital Media</span></div><div style="position:absolute;left:391.42px;top:596.10px" class="cls_019"><span class="cls_019">NOVI SETIA NURVIAT</span></div><div style="position:absolute;left:436.06px;top:611.70px" class="cls_008"><span class="cls_008">Direktur</span></div></div>`,
        //File Name
        fileName: 'tandaterima',
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
  Lapor = async () => {
    try {
      if (this.state.status_maintenence === 'Gangguan') {
        alert('Anda Sudah Mengajukan Laporan');
      } else {
        this.setState({loading: true});
        const {id} = this.props.route.params;
        const data = new FormData();
        if (this.state.desc_maintenence === 'Lainnya') {
          data.append('desc_maintenence', this.state.desc_maintenence1);
        } else {
          data.append('desc_maintenence', this.state.desc_maintenence);
        }
        data.append('status_maintenence', 'Gangguan');
        data.append('id_order', id);
        // data.append('payment_capture', 1);

        const {getUser} = this.props;
        console.log(data);
        const response = await Axios.post(`${BASE_URL}/maintenence`, data);
        if (response) {
          this.setState({loading: false});
          this.setModalVisible(!this.state.modalVisible);
          alert(
            'Laporan Gangguan Berhasil Diajukan Cek email untuk info lebih lanjut',
          );
          this._onRefresh();
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  _onRefresh = async () => {
    this.setState({refreshing: true});
    const {id} = this.props.route.params;
    this.setState({loading: true});
    await Axios.get(`${BASE_URL}/maintenenceorder/${id}`)
      .then((response) => {
        this.setState({
          maintenenceorder: response.data.maintenence,
          status_maintenence: response.data.maintenence[0].status_maintenence,
          loading: false,
          refreshing: false,
        });
      })
      .catch((error) => {
        this.setState({
          maintenenceorder: '',
          status_maintenence: '',
          loading: false,
          refreshing: false,
        });
      });
  };

  _renderItem = ({item, index}) => {
    return (
      <View>
        <ShimmerPlaceholder
          style={styles.websiteAktif}
          autoRun={true}
          visible={!this.state.loading}>
          {item.status_Order === 'Lunas' ||
          item.status_Order === 'Sedang Proses Pembuatan' ||
          item.status_Order === 'Menunggu Pembayaran Selanjutnya' ? (
            <TouchableOpacity
              onPress={() => {
                this.props.navigation.navigate('Detail Order Web', {
                  id: item.id_order,
                });
              }}></TouchableOpacity>
          ) : (
            <View style={styles.websiteAktif}>
              <View style={{margin: 5}}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    marginBottom: 18,
                  }}>
                  <View>
                    <Text style={{fontSize: 12}}>-</Text>
                    <Text style={{fontSize: 10, color: '#A09C9C'}}>Status</Text>
                    <Text style={{fontSize: 12, color: '#05F90F'}}>
                      Belum Order Website
                    </Text>
                  </View>
                  <View style={{marginRight: 10}}>
                    <Text>-</Text>
                  </View>
                </View>
                <Text style={{fontSize: 11, color: '#A09C9C'}}>Masa Aktif</Text>
                <Text style={{fontSize: 11}}>-</Text>
              </View>
            </View>
          )}
        </ShimmerPlaceholder>
      </View>
    );
  };

  render() {
    const {modalVisible} = this.state;
    const {getUser} = this.props;
    // console.log(this.state.harga);
    const {id} = this.props.route.params;

    // console.log(id);
    return (
      <Container>
        <Modal
          animationType="fade"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            Alert.alert('Modal has been closed.');
          }}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={styles.modalText}>Laporan Gangguan</Text>
              <View style={{alignSelf: 'flex-start'}}>
                <Text>Detail Gangguan</Text>
              </View>
              <Item picker>
                <Picker
                  mode="dropdown"
                  iosIcon={<Icon name="arrow-down" />}
                  style={{width: undefined}}
                  placeholder="Select your SIM"
                  placeholderStyle={{color: '#bfc6ea'}}
                  placeholderIconColor="#007aff"
                  selectedValue={this.state.desc_maintenence}
                  onValueChange={(value) =>
                    this.setState({desc_maintenence: value})
                  }>
                  <Picker.Item
                    label="Website Tidak Aktif"
                    value="Website Tidak Aktif"
                  />
                  <Picker.Item label="Website Lambat" value="Website Lambat" />
                  <Picker.Item
                    label="Tampilan Website Berubah"
                    value="Tampilan Website Berubah"
                  />
                  <Picker.Item
                    label="Form Bermasalah"
                    value="Form Bermasalah"
                  />
                  <Picker.Item
                    label="Data Bermasalah"
                    value="Data Bermasalah"
                  />
                  <Picker.Item label="Lainnya" value="Lainnya" />
                </Picker>
              </Item>
              {this.state.desc_maintenence === 'Lainnya' ? (
                <View style={styles.action}>
                  <TextInput
                    value={this.state.desc_maintenence1}
                    placeholder="Deskripsi Gangguan"
                    placeholderTextColor="#666666"
                    autoCorrect={false}
                    style={[
                      styles.textInput,
                      {
                        color: 'black',
                      },
                    ]}
                    onChangeText={(text) =>
                      this.setState({desc_maintenence1: text})
                    }
                  />
                </View>
              ) : null}

              <View style={{flexDirection: 'row', marginTop: 15}}>
                <TouchableHighlight
                  style={{
                    ...styles.openButtonLaporn,
                    backgroundColor: '#2196F3',
                  }}
                  onPress={() => {
                    this.Lapor();
                  }}>
                  <Text style={styles.textStyle}>Lapor</Text>
                </TouchableHighlight>
                <TouchableHighlight
                  style={{...styles.openButton, backgroundColor: '#2196F3'}}
                  onPress={() => {
                    this.setModalVisible(!modalVisible);
                  }}>
                  <Text style={styles.textStyle}>Batal</Text>
                </TouchableHighlight>
              </View>
            </View>
          </View>
        </Modal>
        {modalVisible && <Loader />}
        {this.state.loading ? <Loader /> : null}
        <ScrollView
          style={{flex: 1}}
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this._onRefresh.bind(this)}
            />
          }>
          <Content style={{margin: 20}}>
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
                    <View style={styles.websiteAktif}>
                      <View style={{margin: 5}}>
                        <View
                          style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            marginBottom: 18,
                          }}>
                          <View>
                            <Text style={{fontSize: 12}}>
                              {this.state.nama_domain}
                            </Text>
                            <Text style={{fontSize: 10, color: '#A09C9C'}}>
                              Status
                            </Text>

                            {this.state.status_Order === 'Lunas' ? (
                              <Text style={{fontSize: 12, color: '#05F90F'}}>
                                Website Aktif
                              </Text>
                            ) : null}

                            {this.state.status_Order ===
                            'Sedang Proses Pembuatan' ? (
                              <Text style={{fontSize: 12, color: '#FF9800'}}>
                                Sedang Proses Pembuatan
                              </Text>
                            ) : null}
                            {this.state.status_Order ===
                            'Menunggu Pembayaran Selanjutnya' ? (
                              <Text style={{fontSize: 12, color: 'red'}}>
                                Menunggu Pembayaran Selanjutnya
                              </Text>
                            ) : null}
                          </View>
                        </View>
                        <Text style={{fontSize: 11, color: '#A09C9C'}}>
                          Masa Aktif
                        </Text>
                        <Text style={{fontSize: 11}}>
                          {this.state.status_Order === 'Lunas' ? (
                            <Text style={{fontSize: 12, color: '#05F90F'}}>
                              {moment(this.state.createdAt)
                                .locale('id')
                                .format('MMMM Do YYYY')}{' '}
                              -{' '}
                              {moment(this.state.createdAt)
                                .locale('id')
                                .format('MMMM Do ')}
                              2021
                            </Text>
                          ) : (
                            <Text style={{fontSize: 12, color: '#FF9800'}}>
                              -
                            </Text>
                          )}
                        </Text>
                      </View>
                    </View>

                    {this.state.status_Order === ' Lunas' ? (
                      <TouchableOpacity
                        onPress={() => {
                          this.setModalVisible(true);
                        }}>
                        <View
                          style={{
                            flexDirection: 'row',
                          }}>
                          {this.state.status_maintenence === 'Gangguan' ? (
                            <Icon
                              name="bell"
                              color={'red'}
                              size={20}
                              style={{marginRight: 15}}
                            />
                          ) : (
                            <Icon
                              name="bell"
                              color={'green'}
                              size={20}
                              style={{marginRight: 15}}
                            />
                          )}

                          <Text>Laporan Gangguan</Text>
                        </View>
                      </TouchableOpacity>
                    ) : null}
                  </View>
                </ShimmerPlaceholder>
              </CardItem>
            </Card>

            <Card>
              <CardItem>
                <ShimmerPlaceholder
                  autoRun={true}
                  visible={!this.state.loading}>
                  <View>
                    <Text style={{fontSize: 14, margin: 10}}>Nama Paket</Text>
                    <Text style={{fontSize: 16, marginLeft: 10}}>
                      {this.state.description}
                    </Text>
                    <Text style={{fontSize: 14, margin: 10}}>
                      Tanggal Order
                    </Text>
                    <Text style={{fontSize: 16, marginLeft: 10}}>
                      {moment(this.state.createdAt)
                        .locale('id')
                        .format('MMMM Do YYYY')}
                    </Text>
                  </View>
                </ShimmerPlaceholder>
              </CardItem>
            </Card>

            <Card>
              <CardItem>
                <ShimmerPlaceholder
                  autoRun={true}
                  visible={!this.state.loading}>
                  <View
                    style={{
                      borderRadius: 8,
                      borderColor: '#000',
                      width: 300,
                      height: 150,
                    }}>
                    <View style={{margin: 5}}>
                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                          marginBottom: 18,
                        }}>
                        <View>
                          <Text>Metode Pembayaran</Text>
                        </View>
                        <View style={{marginRight: 10}}>
                          <Text>VISA</Text>
                        </View>
                      </View>
                      <Text>Total Pembelian</Text>
                      <Text>
                        <NumberFormat
                          value={this.state.amount}
                          displayType={'text'}
                          thousandSeparator={true}
                          prefix={'Rp.'}
                          renderText={(value) => <Text>{value}</Text>}
                        />
                      </Text>
                      {this.state.status_Order === 'Lunas' ? (
                        <Text>
                          <NumberFormat
                            value={this.state.harga - this.state.amount}
                            displayType={'text'}
                            thousandSeparator={true}
                            prefix={'Rp.'}
                            renderText={(value) => <Text>{value}</Text>}
                          />
                        </Text>
                      ) : null}
                      <Text>-----------------------------</Text>
                      {this.state.status_Order === 'Lunas' ? (
                        <Text>
                          <NumberFormat
                            value={
                              this.state.amount +
                              (this.state.harga - this.state.amount)
                            }
                            displayType={'text'}
                            thousandSeparator={true}
                            prefix={'Rp.'}
                            renderText={(value) => <Text>{value}</Text>}
                          />
                        </Text>
                      ) : null}
                    </View>
                  </View>
                </ShimmerPlaceholder>
              </CardItem>
            </Card>
            <View
              style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              {this.state.status_Order === 'Menunggu Pembayaran Selanjutnya' ? (
                <TouchableOpacity
                  onPress={() => {
                    var options = {
                      description: this.state.nama_category,
                      image: this.state.img,
                      currency: 'IDR',
                      key: 'rzp_test_q8vKYnHPGhMzH7',
                      amount: this.state.harga - this.state.amount,
                      name: 'Inovindo',
                      // order_id: this.state.order_razor, //Replace this with an order_id created using Orders API. Learn more at https://razorpay.com/docs/api/orders.
                      prefill: {
                        email: getUser.userDetails.email,
                        contact: '082218456868',
                        name: getUser.userDetails.first_name,
                      },
                      theme: {color: '#53a20e'},
                    };
                    RazorpayCheckout.open(options)
                      .then(async (data) => {
                        const response1 = await Axios.put(
                          `${BASE_URL}/order/${id}`,
                          {
                            status_Order: 'Lunas',
                          },
                        );
                        // console.log(response1.data);
                        alert(`Pembayaran Berhasil`);
                        this._onRefresh;
                        this.props.navigation.navigate('Detail Order Web');
                      })
                      .catch((error) => {
                        // handle failure
                        alert(`Pembayaran Cancel`);
                      });
                  }}>
                  <Button warning>
                    <Text> Bayar </Text>
                  </Button>
                </TouchableOpacity>
              ) : null}
              <TouchableOpacity onPress={this.createPDF}>
                <Button primary>
                  <Text> Download PDF </Text>
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
  websiteAktif: {
    borderRadius: 8,
    borderColor: '#000',
    width: 300,
    height: 120,
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
    marginLeft: 15,
  },
  openButtonLaporn: {
    backgroundColor: '#DA1919',
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    marginLeft: 15,
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

export default connect(mapStateToProps, mapDispatchToProps)(Pembayaran);
