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

export default class DetailPertanyaan extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fakeData: [1, 2, 3, 4, 5],
      pertanyaan: '',
      jawaban_pertanyaan: '',
      status: ' ',
      loading: true,
    };
  }
  componentDidMount() {
    this.fetchApi();
  }

  async fetchApi() {
    this.setState({loading: true});
    const {id} = this.props.route.params;
    await Axios.get(`${BASE_URL}/pertanyaan/${id}`).then((response) => {
      this.setState({
        pertanyaan: response.data.pertanyaan[0].pertanyaan,
        jawaban_pertanyaan: response.data.pertanyaan[0].jawaban_pertanyaan,
        status: response.data.pertanyaan[0].status,
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
            <ShimmerPlaceholder
              style={{
                textAlign: 'center',
                margin: 15,
                fontSize: 16,
              }}
              autoRun={true}
              visible={!this.state.loading}>
              <Text
                style={{
                  textAlign: 'center',
                  margin: 15,
                  fontSize: 16,
                  fontWeight: 'bold',
                }}>
                {this.state.pertanyaan}
              </Text>
            </ShimmerPlaceholder>
            <CardItem header>
              <ShimmerPlaceholder autoRun={true} visible={!this.state.loading}>
                <Text>{this.state.jawaban_pertanyaan}</Text>
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
});
