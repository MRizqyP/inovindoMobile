import React, {Component} from 'react';
import {Image, FlatList, View, StyleSheet} from 'react-native';
import {Container, Content, Card, CardItem, Text} from 'native-base';
import Axios from 'axios';
import {BASE_URL} from '../service/base_url';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Icon from 'react-native-vector-icons/FontAwesome';
import ShimmerPlaceholder from 'react-native-shimmer-placeholder';

export default class DetailPromo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      category: [],
      fakeData: [1, 2, 3, 4, 5],
      nama_promo: '',
      harga_promo: '',
      img: ' ',
      desc_promos: [],
      status: '',
      loading: true,
    };
  }
  componentDidMount() {
    this.fetchApi();
  }

  async fetchApi() {
    this.setState({loading: true});
    const {id} = this.props.route.params;
    await Axios.get(`${BASE_URL}/promo/${id}`).then((response) => {
      this.setState({
        nama_promo: response.data.promo[0].nama_promo,
        img: response.data.promo[0].img,
        harga_promo: response.data.promo[0].harga_promo,
        desc_promos: response.data.promo[0].desc_promos,
        promos: response.data.promo[0].promos,
        status: response.data.promo[0].status,
        loading: false,
      });
    });
  }

  render() {
    const {id} = this.props.route.params;
    console.log(id);
    return (
      <Container>
        <Content style={{margin: 15, paddingTop: 30}}>
          <Card>
            <Text
              style={{
                textAlign: 'center',
                margin: 10,
                fontSize: 18,
                fontWeight: 'bold',
              }}>
              Detail Voucher
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
                <Image
                  style={{
                    resizeMode: 'cover',
                    width: wp('80%'),
                    height: hp('20%'),
                  }}
                  source={{uri: this.state.img}}
                />
              </ShimmerPlaceholder>
            </CardItem>
            <CardItem>
              <ShimmerPlaceholder autoRun={true} visible={!this.state.loading}>
                <View style={{flexDirection: 'column'}}>
                  <Text>{this.state.nama_promo}</Text>
                  <Text>Potongan Sebesar {this.state.harga_promo}%</Text>
                  {this.state.status === 'true' ? (
                    <Text>Status : Habis</Text>
                  ) : (
                    <Text>Status : Tersedia</Text>
                  )}
                </View>
              </ShimmerPlaceholder>
            </CardItem>
            <CardItem>
              <ShimmerPlaceholder autoRun={true} visible={!this.state.loading}>
                <Text>Syarat dan Kententuan</Text>
              </ShimmerPlaceholder>
            </CardItem>
            <CardItem>
              <FlatList
                data={
                  this.state.loading
                    ? this.state.fakeData
                    : this.state.desc_promos
                }
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
                      <Text>{item.desc_promo}</Text>
                    </ShimmerPlaceholder>
                  </View>
                )}
                keyExtractor={(item, index) => index.toString()}
              />
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
});
