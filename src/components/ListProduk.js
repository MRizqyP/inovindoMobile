import React, {Component} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  FlatList,
  Image,
  ImageBackground,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import {connect} from 'react-redux';
import BottomSheet from 'reanimated-bottom-sheet';
import Axios from 'axios';
import {BASE_URL} from '../service/base_url';
import {logoutUser} from '../actions/auth-actions';
import ShimmerPlaceholder from 'react-native-shimmer-placeholder';

class ListProduk extends Component {
  static navigationOptions = {
    tabBarVisible: false,
  };
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      img: 'https://api.adorable.io/avatars/80/abott@adorable.png',
      harga: '',
      harga_perpanjangan: '',
      descs: [],
      promos: [],
      nama_category: '',
      loading: false,
      fakeData: [1, 2, 3, 4, 5],
    };
  }

  componentDidMount() {
    this.fetchApi();
  }

  async fetchApi() {
    this.setState({loading: true});
    const {id} = this.props.route.params;
    await Axios.get(`${BASE_URL}/category/${id}`).then((response) => {
      this.setState({
        data: response.data.category,
        nama_category: response.data.category[0].nama_category,
        img: response.data.category[0].img,
        harga: response.data.category[0].harga,
        harga_perpanjangan: response.data.category[0].harga_perpanjangan,
        descs: response.data.category[0].descs,
        promos: response.data.category[0].promos,
        loading: false,
      });
    });
  }
  renderInner = () => (
    <View style={styles.panel}>
      <View style={{alignItems: 'center'}}>
        <Text style={styles.panelTitle}>Cara Membeli Produk</Text>
        <Text style={styles.panelSubtitle}></Text>
      </View>
      <View style={{marginBottom: 30}}>
        <Text>
          1.Pelanggan dapat memilih paket website yang sudah tersedia di website
          inovindo
        </Text>
        <Text>
          2. Setelah memilih, pelanggan akan diarahkan langsung ke no wa
          inovindo dan hubungi nomor wa yang tertera.
        </Text>
        <Text>
          3. Menunggu balasan wa dari kami, kami akan segera memberikan
          penawaran website yang paling sesuai kebutuhan dan keinginan
          perusahaan pelanggan.
        </Text>
        <Text>
          4. Dalam tahap ini, pelanggan dan admin inovindo bertukar email atau
          pun bisa melalui media komunikasi lain seperti via telepon untuk
          menentukan website sesuai fitur yang diharapkan.
        </Text>
        <Text>
          5. Jika sudah setuju, pelanggan dapat mengisi formulir yang akan
          diberikan oleh admin inovindo.
        </Text>
        <Text>6. Pelanggan membayar sesuai tagihan yang disetujui.</Text>
        <Text>
          7. Setelah pembayaran diterima, kami akan segera memproses website
          tersebut dengan waktu yang telah ditentukan sebelumnya.
        </Text>
      </View>
    </View>
  );

  renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.panelHeader}>
        <View style={styles.panelHandle} />
      </View>
    </View>
  );

  bs = React.createRef();

  wholedata() {
    var screenWidth = Dimensions.get('window').width;

    return (
      <>
        <View>
          <ShimmerPlaceholder
            style={{
              width: screenWidth,
              height: 150,
              position: 'absolute',
            }}
            autoRun={true}
            visible={!this.state.loading}>
            <ImageBackground
              source={{uri: this.state.img}}
              style={{
                width: screenWidth,
                height: 150,
                position: 'absolute',
              }}
            />
          </ShimmerPlaceholder>
        </View>
        <View style={styles.listProduk}>
          <ShimmerPlaceholder
            style={styles.textTitle}
            autoRun={true}
            visible={!this.state.loading}>
            <Text style={styles.textTitle}>{this.state.nama_category}</Text>
          </ShimmerPlaceholder>
          <ShimmerPlaceholder
            style={styles.textSub}
            autoRun={true}
            visible={!this.state.loading}>
            <Text style={styles.textSub}>Rp. {this.state.harga},-</Text>
          </ShimmerPlaceholder>
          <ShimmerPlaceholder
            style={{fontWeight: '300', marginTop: 10}}
            autoRun={true}
            visible={!this.state.loading}>
            <Text style={{fontWeight: '300', marginTop: 10}}>
              PERPANJANGAN Rp. {this.state.harga_perpanjangan}
            </Text>
          </ShimmerPlaceholder>
          <FlatList
            data={this.state.loading ? this.state.fakeData : this.state.descs}
            renderItem={({item}) => (
              <View style={styles.textDesc}>
                <ShimmerPlaceholder
                  style={{
                    height: 25,
                    width: 25,
                    borderRadius: 50,
                    marginRight: 10,
                  }}
                  autoRun={true}
                  visible={!this.state.loading}>
                  <Icon
                    name="check-circle"
                    color={'black'}
                    size={15}
                    style={{marginRight: 10}}
                  />
                </ShimmerPlaceholder>
                <ShimmerPlaceholder
                  autoRun={true}
                  visible={!this.state.loading}>
                  <Text>{item.desc_category}</Text>
                </ShimmerPlaceholder>
              </View>
            )}
            keyExtractor={(item, index) => index.toString()}
          />
        </View>
      </>
    );
  }

  render() {
    const {id} = this.props.route.params;
    return (
      <ScrollView>
        <View style={styles.container}>
          <BottomSheet
            ref={this.bs}
            snapPoints={[450, 0]}
            renderContent={this.renderInner}
            renderHeader={this.renderHeader}
            initialSnap={1}
            callbackNode={this.fall}
            enabledGestureInteraction={true}
          />
          {this.wholedata()}
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              margin: 25,
            }}>
            <ShimmerPlaceholder
              style={{fontSize: 16, fontWeight: '500'}}
              autoRun={true}
              visible={!this.state.loading}>
              <Text style={{fontSize: 16, fontWeight: '500'}}>
                Cara Membeli {this.state.nama_category}
              </Text>
            </ShimmerPlaceholder>
            <TouchableOpacity onPress={() => this.bs.current.snapTo(0)}>
              <Text style={{fontSize: 16, fontWeight: '500', color: '#4FADFE'}}>
                Lihat
              </Text>
            </TouchableOpacity>
          </View>

          <View>
            <Text
              style={{
                fontSize: 16,
                color: '#585858',
                padding: 25,
                fontWeight: 'bold',
              }}>
              Promo
            </Text>
            <ScrollView
              horizontal={true}
              showsHorizontalScrollIndicator={false}>
              <View style={{marginLeft: 35}}>
                <FlatList
                  numColumns={5}
                  data={
                    this.state.loading ? this.state.fakeData : this.state.promos
                  }
                  renderItem={({item}) => (
                    <View style={{flexDirection: 'row'}}>
                      <View style={styles.containerpromo}>
                        {item ? (
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
                                  this.props.navigation.navigate(
                                    'DetailPromo',
                                    {
                                      id: item.id_promo,
                                    },
                                  );
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
                        ) : (
                          <Image
                            source={{
                              uri:
                                'https://api.adorable.io/avatars/80/abott@adorable.png',
                            }}
                            style={{
                              marginTop: 10,
                              width: 290,
                              height: 134,
                              margin: 10,
                            }}
                          />
                        )}
                      </View>
                    </View>
                  )}
                  keyExtractor={(item, index) => index.toString()}
                />
              </View>
            </ScrollView>
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              marginBottom: 10,
            }}>
            <ShimmerPlaceholder
              style={styles.ButtonOrder}
              autoRun={true}
              visible={!this.state.loading}>
              <TouchableOpacity
                style={styles.ButtonOrder}
                onPress={() => {
                  this.props.navigation.navigate('DetailOrder', {
                    id: id,
                  });
                }}>
                <Icon name="shopping-cart" color={'white'} size={25} />
                <Text
                  style={{
                    color: '#fff',
                    fontSize: 15,
                    fontWeight: '500',
                    textAlign: 'center',
                    paddingLeft: 15,
                  }}>
                  Order
                </Text>
              </TouchableOpacity>
            </ShimmerPlaceholder>
            <ShimmerPlaceholder
              style={styles.ButtonChat}
              autoRun={true}
              visible={!this.state.loading}>
              <TouchableOpacity style={styles.ButtonChat}>
                <Icon name="comment" color={'white'} size={25} />
                <Text
                  style={{
                    color: '#fff',
                    fontSize: 15,
                    fontWeight: '500',
                    textAlign: 'center',
                    paddingLeft: 15,
                  }}>
                  Chat
                </Text>
              </TouchableOpacity>
            </ShimmerPlaceholder>
          </View>
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  textTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'black',
  },
  textSub: {
    paddingTop: 10,
    fontSize: 18,
    fontWeight: '300',
    color: 'black',
  },
  profilepicture: {
    alignItems: 'center',
    margin: 20,
  },
  listProduk: {
    flex: 1,
    height: Dimensions.get('window').width,
    borderWidth: 1,
    borderRadius: 6,
    borderColor: '#BCBABA',
    width: Dimensions.get('window').width,
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
    borderRadius: 16,
    marginTop: 150,
    alignItems: 'center',
    padding: 25,
  },
  textDesc: {
    paddingTop: 15,
    alignItems: 'center',
    flexDirection: 'row',
  },
  ButtonOrder: {
    backgroundColor: '#48C6EF',
    borderRadius: 8,
    paddingHorizontal: 30,
    // justifyContent: 'center',
    paddingVertical: 12,
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  ButtonChat: {
    backgroundColor: '#48C6EF',
    borderRadius: 8,
    marginHorizontal: 10,
    paddingHorizontal: 15,
    paddingVertical: 12,
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  panel: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    paddingTop: 20,
    height: 450,
    // borderTopLeftRadius: 20,
    // borderTopRightRadius: 20,
    // shadowColor: '#000000',
    // shadowOffset: {width: 0, height: 0},
    // shadowRadius: 5,
    // shadowOpacity: 0.4,
  },
  header: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#333333',
    shadowOffset: {width: -1, height: -3},
    shadowRadius: 2,
    shadowOpacity: 0.4,
    // elevation: 5,
    paddingTop: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  panelHeader: {
    alignItems: 'center',
  },
  panelHandle: {
    width: 40,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#00000040',
    marginBottom: 10,
  },
  panelTitle: {
    fontSize: 27,
    height: 35,
  },
  panelSubtitle: {
    fontSize: 14,
    color: 'gray',
    height: 30,
    marginBottom: 10,
  },
  panelButton: {
    padding: 13,
    borderRadius: 10,
    backgroundColor: '#48C6EF',
    alignItems: 'center',
    marginVertical: 7,
  },
  panelButtonTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: 'white',
  },
  action: {
    flexDirection: 'row',
    marginTop: 7,
    marginBottom: 7,
    borderBottomWidth: 1,
    borderBottomColor: '#f2f2f2',
    paddingBottom: 5,
  },
  actionError: {
    flexDirection: 'row',
    marginTop: 7,
    borderBottomWidth: 1,
    borderBottomColor: '#FF0000',
    paddingBottom: 5,
  },
  textInput: {
    flex: 1,
    marginTop: Platform.OS === 'ios' ? 0 : -12,
    paddingLeft: 10,
    color: '#05375a',
  },
});

export default connect(null, null)(ListProduk);
