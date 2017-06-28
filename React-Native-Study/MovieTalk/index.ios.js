/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, {Component} from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Image,
  ListView,
} from 'react-native';

class HeaderText extends Component {
  render() {
    return (
      <Text style={styles.itemText}>
        {this.props.children}
      </Text>
    )
  }
}

export default class MovieTalk extends Component {
  constructor(props) {
    super(props);

    let movies = [
      {title: '肖生克的救赎'},
      {title: '这个杀手不太冷'},
      {title: '阿甘正传'},
      {title: '霸王别姬'},
      {title: '美丽人生'},
    ];

    let ds = new ListView.DataSource({
      rowHasChanged: (row1, row2) => row1 !== row2
    });

    this.state = {
      // movies: ds.cloneWithRows(movies),
      movies: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2
      }),
      loaded: false
    }

    this.fetchData();
  }

  fetchData() {
    fetch("https://api.douban.com/v2/movie/top250")
      .then(response => response.json())
      .then(responseData => {
        this.setState({
          movies: this.state.movies.cloneWithRows(responseData.subjects),
          loaded: true
        })
      })
  }

  renderMovieList(movie) {
    return (
      <View style={styles.item}>
        <View style={styles.itemImage}>
          <Image source={{uri: movie.images.large}} style={styles.image}/>
        </View>
        <View style={styles.itemContent}>
          <Text style={styles.itemHeader}>{movie.title}</Text>
          <Text style={styles.itemMeta}>
            {movie.original_title}({movie.year})
          </Text>
          <Text style={styles.redText}>
            {movie.rating.average}
          </Text>
        </View>
      </View>
    )
  }

  render() {
    if (!this.state.loaded) {
      return (
        <View style={styles.container}>
          <View style={styles.loading}>
            <Text>Loading</Text>
          </View>
        </View>
      )
    }
    return (
      <View style={styles.container}>
        <ListView dataSource={this.state.movies} renderRow={this.renderMovieList}/>
      </View>
    )
    // return (
    {/*<View style={styles.container}>*/
    }
    {/*<ListView dataSource={this.state.movies} renderRow={*/
    }
    {/*movie => <Text style={styles.itemText}>{movie.title}</Text>*/
    }
    {/*} />*/
    }
    {/*/!*<Text style={styles.title}>Hello World</Text>*/
    }
    {/*<View style={[styles.item, styles.itemOne]}>*/
    }
    {/*<Text style={styles.itemText}>1</Text>*/
    }
    {/*</View>*/
    }
    {/*<View style={[styles.item, styles.itemTwo]}>*/
    }
    {/*<Text style={styles.itemText}>2</Text>*/
    }
    {/*</View>*/
    }
    {/*<View style={[styles.item, styles.itemThree]}>*/
    }
    {/*<Text style={styles.itemText}>3</Text>*/
    }
    {/*</View>*!/*/
    }
    {/*/!*<HeaderText>HelloWorld</HeaderText>*!/*/
    }
    {/*/!*<Image*!/*/
    }
    {/*/!*style={styles.image}*!/*/
    }
    {/*/!*source={{uri: "https://b.zol-img.com.cn/sjbizhi/images/7/320x510/1399368872668.jpg"}}>*!/*/
    }
    {/*/!*<View style={styles.overlay}>*!/*/
    }
    {/*/!*<Text style={styles.overlayHeader}>*!/*/
    }
    {/*/!*傻猫*!/*/
    }
    {/*/!*</Text>*!/*/
    }
    {/*/!*<Text style={styles.overlaySubHeader}>*!/*/
    }
    {/*/!*create by goze*!/*/
    }
    {/*/!*</Text>*!/*/
    }
    {/*/!*</View>*!/*/
    }
    {/*/!*</Image>*!/*/
    }
    {/*</View>*/
    }
    // );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#eae7ff',
    flex: 1,
    // margin: 30,
    // borderWidth: 1,
    // borderColor: '#6435c9',
    // borderRadius: 16,
    // shadowColor: '#6435c9',
    // shadowOpacity: 0.6,
    // shadowRadius: 2,
    // shadowOffset: {
    //   height:1,
    //   width: 0
    // },
    paddingTop: 23,
    // justifyContent: 'space-around',
    // alignItems: 'flex-end',
    flexDirection: 'row',
  },
  title: {
    fontSize: 26,
    color: '#6435c9',
    textAlign: 'center',
    fontStyle: 'italic',
    letterSpacing: 2,
    lineHeight: 33,
    fontFamily: 'Helvetica Neue',
    fontWeight: '300',
    textDecorationLine: 'underline',
    textDecorationStyle: 'dashed',
  },
  // item: {
  //   backgroundColor: '#fff',
  //   borderWidth: 1,
  //   borderColor: '#6435c9',
  //   margin: 6,
  //   flex: 1,
  // },
  itemOne: {
    // alignSelf: 'flex-start',
  },
  itemTwo: {
    // alignSelf: 'center',
    alignSelf: 'flex-end',
  },
  itemThree: {
    // alignSelf: 'flex-end',
    flex: 2,
  },
  itemText: {
    fontSize: 33,
    fontFamily: 'Helvetica Neue',
    fontWeight: '200',
    color: '#6435c9',
    padding: 30,
  },
  // image: {
  //   flex: 1,
  //   resizeMode: 'cover',
  // },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    alignItems: "center"
  },
  overlayHeader: {
    fontSize: 33,
    fontFamily: 'Helvetica Neue',
    fontWeight: '200',
    color: '#eae7ff',
    padding: 10,
  },
  overlaySubHeader: {
    fontSize: 16,
    fontFamily: 'Helvetica Neue',
    fontWeight: '200',
    color: '#eae7ff',
    padding: 10,
    paddingTop: 0,
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  item: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: 'rgba(100, 53, 201, 0.1)',
    paddingBottom: 6,
    marginBottom: 6,
    flex: 1,
  },
  itemContent: {
    flex: 1,
    marginLeft: 13,
    marginTop: 6,
  },
  itemHeader: {
    fontSize: 18,
    fontFamily: 'Helvetica Neue',
    fontWeight: '300',
    color: '#6435c9',
    marginBottom: 6,
  },
  itemMeta: {
    fontSize: 16,
    color: 'rgba(0, 0, 0, 0.6)',
    marginBottom: 6,
  },
  redText: {
    color: '#db2828',
    fontSize: 15,
  },
  itemImage: {
    // backgroundColor: 'red',
    height: 120,
    width: 80,
    marginLeft: 10,
  },
  image: {
    width: 80,
    height: 120,
  }

});

AppRegistry.registerComponent('MovieTalk', () => MovieTalk);
