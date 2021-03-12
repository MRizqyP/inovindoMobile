import React, {Component} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  Image,
  ImageBackground,
  TouchableOpacity,
  FlatList,
  Alert,
  RefreshControl,
} from 'react-native';
import Axios from 'axios';
import {BASE_URL} from '../service/base_url';
import ShimmerPlaceholder from 'react-native-shimmer-placeholder';
import Slideshow from 'react-native-image-slider-show';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {connect} from 'react-redux';
import moment from 'moment';
import 'react-native-gesture-handler';

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      layanan: [],
      testimoni: [],
      promo: [],
      loading: false,
      fakeData: [1, 2, 3, 4, 5],
      position: 1,
      interval: null,
      slider: [],
      category: [],
      refreshing: false,
      id_user: '',
    };
  }

  componentDidMount() {
    this.fetchApi();
    this.setState({
      interval: setInterval(() => {
        this.setState({
          position:
            this.state.position === this.state.slider.length
              ? 0
              : this.state.position + 1,
        });
      }, 3000),
    });
    clearInterval(this.state.interval);
  }

  _onRefresh = async () => {
    this.setState({refreshing: true});
    const {getUser} = this.props;
    this.setState({loading: true});
    await Axios.get(`${BASE_URL}/order/user/${getUser.userDetails.id}`).then(
      (response) => {
        this.setState({
          category: response.data.order,
          refreshing: false,
          loading: false,
        });
      },
    );
  };

  async fetchApi() {
    try {
      const {getUser} = this.props;
      this.setState({loading: true});

      await Axios.get(`${BASE_URL}/promo`)
        .then((response) => {
          this.setState({
            promo: response.data.promo,
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

      await Axios.get(`${BASE_URL}/layanan`).then((response) => {
        this.setState({
          layanan: response.data.layanan,
          loading: false,
        });
      });
      await Axios.get(`${BASE_URL}/testimoni`).then((response) => {
        this.setState({
          testimoni: response.data.testimoni,
          loading: false,
        });
      });
      await Axios.get(`${BASE_URL}/slider`).then((response) => {
        this.setState({
          slider: response.data.slider,
          loading: false,
        });
      });
      await Axios.get(`${BASE_URL}/order/user/${getUser.userDetails.id}`).then(
        (response) => {
          this.setState({
            category: response.data.order,
            loading: false,
          });
        },
      );
    } catch (error) {}
  }
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
                  id_razor: item.order_razor,
                });
              }}>
              <View style={styles.websiteAktif}>
                <View style={{margin: 5}}>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      marginBottom: 18,
                    }}>
                    <View>
                      <Text style={{fontSize: 12}}>{item.nama_domain}</Text>
                      <Text style={{fontSize: 10, color: '#A09C9C'}}>
                        Status
                      </Text>

                      {item.status_Order === 'Lunas' ? (
                        <Text style={{fontSize: 12, color: '#05F90F'}}>
                          Website Aktif
                        </Text>
                      ) : null}
                      {item.status_Order === 'Sedang Proses Pembuatan' ? (
                        <Text style={{fontSize: 12, color: '#FF9800'}}>
                          Sedang Proses Pembuatan
                        </Text>
                      ) : null}
                      {item.status_Order ===
                      'Menunggu Pembayaran Selanjutnya' ? (
                        <Text style={{fontSize: 12, color: '#f55a42'}}>
                          Menunggu Pembayaran Selanjutnya
                        </Text>
                      ) : null}
                    </View>
                    <View style={{marginRight: 10}}>
                      <Text>{item.category.nama_category}</Text>
                    </View>
                  </View>
                  <Text style={{fontSize: 11, color: '#A09C9C'}}>
                    Masa Aktif
                  </Text>
                  <Text style={{fontSize: 11}}>
                    {item.status_Order === 'Lunas' ? (
                      <Text style={{fontSize: 12, color: '#05F90F'}}>
                        {moment(item.createdAt)
                          .locale('id')
                          .format('MMMM Do YYYY')}{' '}
                        -{' '}
                        {moment(item.createdAt).locale('id').format('MMMM Do ')}
                        2021
                      </Text>
                    ) : (
                      <Text style={{fontSize: 12, color: '#FF9800'}}>-</Text>
                    )}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          ) : null}
        </ShimmerPlaceholder>
      </View>
    );
  };

  render() {
    return (
      <View style={styles.container}>
        <StatusBar backgroundColor="#1B92FA" />
        <ImageBackground
          source={require('../images/bghome.png')}
          style={styles.image}>
          <View
            style={{margin: 10, flexDirection: 'row', alignItems: 'center'}}>
            <Image
              source={require('../images/ic_inovindo_wt.png')}
              style={{marginRight: 10, width: 60, height: 54}}
            />
            <View style={{flexDirection: 'column', alignItems: 'center'}}>
              <Text style={{fontSize: 14}}>
                MELAYANI JASA PEMBUATAN WEBSITE
              </Text>
              <Text style={{fontSize: 14}}>DAN GOOGLE ADS</Text>
            </View>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={this.state.refreshing}
                onRefresh={this._onRefresh.bind(this)}
              />
            }>
            <View>
              <ScrollView
                horizontal={true}
                showsHorizontalScrollIndicator={false}>
                <FlatList
                  numColumns={5}
                  data={
                    this.state.loading
                      ? this.state.fakeData
                      : this.state.category
                  }
                  renderItem={this._renderItem}
                  keyExtractor={(item, index) => index.toString()}
                />
              </ScrollView>
              <ShimmerPlaceholder
                style={styles.sliderView}
                autoRun={true}
                visible={!this.state.loading}>
                <View style={styles.sliderView}>
                  <Slideshow
                    arrowSize={0}
                    dataSource={this.state.slider}
                    position={this.state.position}
                    onPositionChanged={(position) => this.setState({position})}
                  />
                </View>
              </ShimmerPlaceholder>
              <Text
                style={{
                  fontSize: 12,
                  color: '#585858',
                  marginLeft: 35,
                  marginTop: 20,
                  fontWeight: 'bold',
                }}>
                PROMO
              </Text>
              <ScrollView
                horizontal={true}
                showsHorizontalScrollIndicator={false}>
                <View style={{marginLeft: 35}}>
                  <FlatList
                    numColumns={5}
                    data={
                      this.state.loading
                        ? this.state.fakeData
                        : this.state.promo
                    }
                    renderItem={({item}) => (
                      <View style={{flexDirection: 'row'}}>
                        <ShimmerPlaceholder
                          style={{
                            marginTop: 10,
                            width: 290,
                            height: 134,
                            margin: 10,
                          }}
                          autoRun={true}
                          visible={!this.state.loading}>
                          <View style={styles.containerpromo}>
                            <TouchableOpacity
                              onPress={() => {
                                this.props.navigation.navigate('DetailPromo', {
                                  id: item.id_promo,
                                });
                              }}>
                              <Image
                                source={{uri: item.img}}
                                style={{
                                  marginTop: 10,
                                  width: 290,
                                  height: 134,
                                  margin: 10,
                                }}
                              />
                            </TouchableOpacity>
                          </View>
                        </ShimmerPlaceholder>
                      </View>
                    )}
                    keyExtractor={(item, index) => index.toString()}
                  />
                </View>
              </ScrollView>

              <Text
                style={{
                  fontSize: 12,
                  color: '#585858',
                  marginLeft: 35,
                  fontWeight: 'bold',
                }}>
                MENGAPA MEMILIH INOVINDO?
              </Text>
              <ScrollView
                horizontal={true}
                showsHorizontalScrollIndicator={false}>
                <View style={{marginLeft: 35}}>
                  <FlatList
                    numColumns={5}
                    data={
                      this.state.loading
                        ? this.state.fakeData
                        : this.state.layanan
                    }
                    renderItem={({item}) => {
                      return (
                        <View style={{flexDirection: 'row'}}>
                          <ShimmerPlaceholder
                            style={styles.containerlayanan}
                            autoRun={true}
                            visible={!this.state.loading}>
                            <View style={styles.containerlayanan}>
                              <ShimmerPlaceholder
                                style={{
                                  marginTop: 10,
                                  width: 60,
                                  height: 54,
                                  marginBottom: 8,
                                }}
                                autoRun={true}
                                visible={!this.state.loading}>
                                <Image
                                  source={{uri: item.img}}
                                  style={{
                                    marginTop: 10,
                                    width: 60,
                                    height: 54,
                                    marginBottom: 8,
                                  }}
                                />
                              </ShimmerPlaceholder>
                              <ShimmerPlaceholder
                                autoRun={true}
                                visible={!this.state.loading}>
                                <Text style={{fontSize: 11, color: '#585858'}}>
                                  {item.nama_layanan}
                                </Text>
                              </ShimmerPlaceholder>
                              <ShimmerPlaceholder
                                autoRun={true}
                                visible={!this.state.loading}>
                                <Text
                                  style={{
                                    fontSize: 12,
                                    color: '#585858',
                                    textAlign: 'center',
                                    marginTop: 8,
                                  }}>
                                  {item.desc_layanan}
                                </Text>
                              </ShimmerPlaceholder>
                            </View>
                          </ShimmerPlaceholder>
                        </View>
                      );
                    }}
                    keyExtractor={(item, index) => index.toString()}
                  />
                </View>
              </ScrollView>
              <Text
                style={{
                  fontSize: 12,
                  color: '#585858',
                  marginLeft: 35,
                  fontWeight: 'bold',
                }}>
                TESTIMONI
              </Text>
              <ScrollView
                horizontal={true}
                showsHorizontalScrollIndicator={false}>
                <View style={{marginLeft: 35}}>
                  <FlatList
                    numColumns={15}
                    data={
                      this.state.loading
                        ? this.state.fakeData
                        : this.state.testimoni
                    }
                    renderItem={({item}) => (
                      <View style={{flexDirection: 'row'}}>
                        <ShimmerPlaceholder
                          style={styles.containertestimoni}
                          autoRun={true}
                          visible={!this.state.loading}>
                          <View style={styles.containertestimoni}>
                            <Text
                              style={{
                                fontSize: 12,
                                color: '#585858',
                                textAlign: 'center',
                              }}>
                              {item.pekerjaan_testimoni}
                            </Text>
                            <View
                              style={{
                                flexDirection: 'row',
                                margin: 5,
                                alignItems: 'center',
                              }}>
                              <Image
                                source={{uri: item.img}}
                                style={{
                                  width: 60,
                                  height: 74,
                                  borderRadius: 50,
                                }}
                              />

                              <View style={{marginLeft: 10}}>
                                <Text
                                  style={{
                                    fontSize: 11,
                                    fontWeight: 'bold',
                                  }}>
                                  {item.nama_testimoni} ( {item.asal_testimoni}{' '}
                                  )
                                </Text>
                                <View style={{width: 150, height: 50}}>
                                  <Text
                                    style={{
                                      fontSize: 11,
                                      color: '#585858',
                                    }}>
                                    {item.desc_testimoni}
                                  </Text>
                                </View>
                              </View>
                            </View>
                          </View>
                        </ShimmerPlaceholder>
                      </View>
                    )}
                    keyExtractor={(item, index) => index.toString()}
                  />
                </View>
              </ScrollView>
            </View>
          </ScrollView>
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
  websiteAktif: {
    borderRadius: 8,
    borderColor: '#000',
    backgroundColor: '#fff',
    width: 300,
    height: 120,
    marginLeft: 25,
  },
  containerlayanan: {
    borderRadius: 35,
    borderColor: '#585858',
    backgroundColor: '#fff',
    width: 190,
    height: 162,
    margin: 10,
    alignItems: 'center',
  },
  containertestimoni: {
    borderRadius: 8,
    borderColor: '#585858',
    backgroundColor: '#fff',
    width: 240,
    height: 102,
    margin: 10,
    justifyContent: 'center',
  },
  sliderView: {
    width: wp('85%'),
    height: hp('20%'),
    marginLeft: 35,
    marginRight: 35,
    marginTop: 35,
    borderRadius: 8,
    overflow: 'hidden',
  },
});

mapStateToProps = (state) => ({
  authData: state.authReducer.authData,
  getUser: state.userReducer.getUser,
});

mapDispatchToProps = (dispatch) => ({
  dispatch,
});

export default connect(mapStateToProps, mapDispatchToProps)(Home);
