import React, {Component, useEffect, useState} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  FlatList,
  Text,
  StatusBar,
  Image,
  TouchableHighlight,
  ImageBackground,
  TouchableOpacity,
  Dimensions,
  RefreshControl,
} from 'react-native';
import {compose} from 'redux';
import {connect, useDispatch} from 'react-redux';
import Axios from 'axios';
import ShimmerPlaceHolder from 'react-native-shimmer-placeholder';
import {BASE_URL} from '../service/base_url';

const App = ({getProduk, navigation}) => {
  let dimensions = Dimensions.get('window');
  let imageHeight = Math.round((dimensions.width * 5) / 16);
  let imageWidth = dimensions.width;
  const dispatch = useDispatch();
  const mockData = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  const [isVisible, setIsVisible] = useState(false);
  const [data, setData] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    try {
      dispatch({
        type: 'FETCH_REQUEST',
      });
      const loadSpots = async () => {
        Axios.get(`${BASE_URL}/category`)
          .then((response) => {
            setIsVisible(true);
            setData(response.data.category);
            dispatch({
              type: 'FETCH_SUCCES',
              payload: response.data.category,
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
      loadSpots();
    } catch (err) {
      dispatch({
        type: 'FETCH_FAILED',
        payload: err,
      });
    }
  }, []);

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    Axios.get(`${BASE_URL}/category`).then((response) => {
      setIsVisible(true);
      setData(response.data.category);
      dispatch({
        type: 'FETCH_SUCCES',
        payload: response.data.category,
      });
      setRefreshing(false);
    });
  }, [refreshing]);

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('../images/bghome1.png')}
        style={styles.image}>
        <View style={{margin: 10, flexDirection: 'row', alignItems: 'center'}}>
          <Image
            source={require('../images/ic_inovindo_wt.png')}
            style={{marginRight: 10, width: 60, height: 54}}
          />
          <View style={{flexDirection: 'column', alignItems: 'center'}}>
            <Text style={{fontSize: 14}}>MELAYANI JASA PEMBUATAN WEBSITE</Text>
            <Text style={{fontSize: 14}}>DAN GOOGLE ADS</Text>
          </View>
        </View>
        <View
          style={{
            flex: 1,
            flexDirection: 'column',
            padding: 35,
          }}>
          <Text style={styles.textTitle}>LAYANAN</Text>

          <FlatList
            data={data.length === 0 ? mockData : data}
            refreshing={refreshing}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            renderItem={({item}) => (
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate('ListProduk', {
                    id: item.id_category,
                  });
                }}>
                <ShimmerPlaceHolder
                  autoRun
                  visible={isVisible}
                  style={{
                    marginTop: 10,
                    width: '100%',
                    height: imageHeight,
                    marginBottom: 8,
                  }}>
                  <Image
                    source={{uri: item.img}}
                    style={{
                      marginTop: 10,
                      width: '100%',
                      height: imageHeight,
                      marginBottom: 8,
                    }}
                  />
                </ShimmerPlaceHolder>
              </TouchableOpacity>
            )}
            keyExtractor={(item, index) => index.toString()}
          />
        </View>
      </ImageBackground>
    </View>
  );
};

// class Produk extends Component {
//   constructor(props) {
//     super(props);
//   }

//   componentDidMount() {
//     this.fetchApi();
//   }

//   async fetchApi() {
//     try {
//       this.props.dispatch({
//         type: 'FETCH_REQUEST',
//       });
//       Axios.get(`${BASE_URL}/category`).then((response) => {
//         this.props.dispatch({
//           type: 'FETCH_SUCCES',
//           payload: response.data.category,
//         });
//       });
//     } catch (err) {
//       this.props.dispatch({
//         type: 'FETCH_FAILED',
//         payload: err,
//       });
//
//     }
//   }

//   render() {
//     const {getProduk} = this.props;
//     return (
//       <View style={styles.container}>
//         <ImageBackground
//           source={require('../images/bghome1.png')}
//           style={styles.image}>
//           <View
//             style={{margin: 10, flexDirection: 'row', alignItems: 'center'}}>
//             <Image
//               source={require('../images/ic_inovindo_wt.png')}
//               style={{marginRight: 10, width: 60, height: 54}}
//             />
//             <View style={{flexDirection: 'column', alignItems: 'center'}}>
//               <Text style={{fontSize: 14}}>
//                 MELAYANI JASA PEMBUATAN WEBSITE
//               </Text>
//               <Text style={{fontSize: 14}}>DAN GOOGLE ADS</Text>
//             </View>
//           </View>
//           <View
//             style={{
//               flex: 1,
//               flexDirection: 'column',
//               padding: 35,
//             }}>
//             <Text style={styles.textTitle}>Website</Text>
//             <FlatList
//               data={getProduk.produk}
//               renderItem={({item}) => (
//                 <TouchableOpacity
//                   onPress={() => {
//                     this.props.navigation.navigate('ListProduk', {
//                       id: item.id_category,
//                     });
//                   }}>
//                   <Image
//                     source={{uri: item.img}}
//                     style={{
//                       marginTop: 10,
//                       width: '100%',
//                       height: imageHeight,
//                       marginBottom: 8,
//                     }}
//                   />
//                 </TouchableOpacity>
//               )}
//               keyExtractor={(item, index) => index.toString()}
//             />

//             <Text style={styles.textTitle}>Google Ads</Text>
//           </View>
//         </ImageBackground>
//       </View>
//     );
//   }
// }

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    flex: 1,
    resizeMode: 'cover',
  },
  textTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
  },
});

mapStateToProps = (state) => ({
  getProduk: state.produkReducer.getProduk,
});

mapDispatchToProps = (dispatch) => ({
  dispatch,
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
